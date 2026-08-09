/**
 * Load and index JSON knowledge-base files into in-memory Maps.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import type { QueenId, SeasonId } from "./catalogs.ts";
import { assertKnowledgeBaseIntegrity } from "./integrity.ts";
import type { Episode, Lore, Queen, Season } from "./schemas/index.ts";
import {
  EpisodeSchema,
  LoreSchema,
  QueenSchema,
  SeasonSchema,
} from "./schemas/index.ts";

export type KnowledgeBase = {
  queens: Map<QueenId, Queen>;
  seasons: Map<SeasonId, Season>;
  episodes: Map<string, Episode>;
  lore: Map<string, Lore>;
};

const KB_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_ROOT = path.resolve(KB_DIR, "../data");

const formatZodIssues = (err: ZodError): string =>
  err.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `  - ${field}: ${issue.message}`;
    })
    .join("\n");

const readJsonFile = (filePath: string): unknown => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read JSON: ${filePath}\n${message}`);
  }
};

const parseOrThrow = <T>(
  schema: { parse: (data: unknown) => T },
  data: unknown,
  filePath: string,
): T => {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(`Invalid data: ${filePath}\n${formatZodIssues(err)}`);
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid data: ${filePath}\n${message}`);
  }
};

const setUnique = <T>(
  map: Map<string, T>,
  sources: Map<string, string>,
  id: string,
  value: T,
  filePath: string,
  kind: string,
): void => {
  if (map.has(id)) {
    const existing = sources.get(id) ?? "(unknown)";
    throw new Error(
      `Duplicate ${kind} id "${id}": already loaded from ${existing}, also in ${filePath}`,
    );
  }
  map.set(id, value);
  sources.set(id, filePath);
};

export const loadKnowledgeBase = (
  dataRoot: string = DEFAULT_DATA_ROOT,
): KnowledgeBase => {
  const queens = new Map<QueenId, Queen>();
  const seasons = new Map<SeasonId, Season>();
  const episodes = new Map<string, Episode>();
  const lore = new Map<string, Lore>();

  const queenSources = new Map<string, string>();
  const seasonSources = new Map<string, string>();
  const episodeSources = new Map<string, string>();
  const loreSources = new Map<string, string>();

  const queensDir = path.join(dataRoot, "queens");
  for (const file of readdirSync(queensDir)) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(queensDir, file);
    const queen = parseOrThrow(QueenSchema, readJsonFile(filePath), filePath);
    const basename = file.slice(0, -".json".length);
    if (basename !== queen.id) {
      throw new Error(
        `Queen file name must match id: expected "${queen.id}.json", got "${file}" (${filePath})`,
      );
    }
    setUnique(queens, queenSources, queen.id, queen, filePath, "queen");
  }

  const seasonsDir = path.join(dataRoot, "seasons");
  for (const entry of readdirSync(seasonsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const seasonDir = path.join(seasonsDir, entry.name);

    const seasonPath = path.join(seasonDir, "season.json");
    const season = parseOrThrow(
      SeasonSchema,
      readJsonFile(seasonPath),
      seasonPath,
    );
    if (entry.name !== season.id) {
      throw new Error(
        `Season folder name must match id: expected "${season.id}", got "${entry.name}" (${seasonDir})`,
      );
    }
    setUnique(seasons, seasonSources, season.id, season, seasonPath, "season");

    const episodesPath = path.join(seasonDir, "episodes.json");
    const episodeList = parseOrThrow(
      EpisodeSchema.array(),
      readJsonFile(episodesPath),
      episodesPath,
    );
    for (const episode of episodeList) {
      setUnique(
        episodes,
        episodeSources,
        episode.id,
        episode,
        episodesPath,
        "episode",
      );
    }

    const lorePath = path.join(seasonDir, "lore.json");
    if (existsSync(lorePath)) {
      const loreList = parseOrThrow(
        LoreSchema.array(),
        readJsonFile(lorePath),
        lorePath,
      );
      for (const loreEntry of loreList) {
        setUnique(lore, loreSources, loreEntry.id, loreEntry, lorePath, "lore");
      }
    }
  }

  const kb: KnowledgeBase = { queens, seasons, episodes, lore };
  assertKnowledgeBaseIntegrity(kb);
  return kb;
};

let cached: KnowledgeBase | undefined;

/** Singleton indexed knowledge base (loaded once, Zod-validated). */
export const getKb = (): KnowledgeBase => {
  if (!cached) {
    cached = loadKnowledgeBase();
  }
  return cached;
};

/** Test helper — clear the singleton so the next getKb() reloads. */
export const resetKb = (): void => {
  cached = undefined;
};
