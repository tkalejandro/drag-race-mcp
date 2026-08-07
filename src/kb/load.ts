/**
 * Load and index JSON knowledge-base files into in-memory Maps.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { QueenId, SeasonId } from "./catalogs.ts";
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
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid data: ${filePath}\n${message}`);
  }
};

export const loadKnowledgeBase = (
  dataRoot: string = DEFAULT_DATA_ROOT,
): KnowledgeBase => {
  const queens = new Map<QueenId, Queen>();
  const seasons = new Map<SeasonId, Season>();
  const episodes = new Map<string, Episode>();
  const lore = new Map<string, Lore>();

  const queensDir = path.join(dataRoot, "queens");
  for (const file of readdirSync(queensDir)) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(queensDir, file);
    const queen = parseOrThrow(QueenSchema, readJsonFile(filePath), filePath);
    queens.set(queen.id, queen);
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
    seasons.set(season.id, season);

    const episodesPath = path.join(seasonDir, "episodes.json");
    const episodeList = parseOrThrow(
      EpisodeSchema.array(),
      readJsonFile(episodesPath),
      episodesPath,
    );
    for (const episode of episodeList) {
      episodes.set(episode.id, episode);
    }

    const lorePath = path.join(seasonDir, "lore.json");
    if (existsSync(lorePath)) {
      const loreList = parseOrThrow(
        LoreSchema.array(),
        readJsonFile(lorePath),
        lorePath,
      );
      for (const loreEntry of loreList) {
        lore.set(loreEntry.id, loreEntry);
      }
    }
  }

  return { queens, seasons, episodes, lore };
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
