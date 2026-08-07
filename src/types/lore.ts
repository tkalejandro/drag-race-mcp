/**
 * Narrative / correlational knowledge for agents.
 *
 * Hard facts live on Season, Queen, and Episode.
 * Lore holds stories, rivalries, iconic moments, and vibes — then points
 * at those catalogs via IDs so agents can dig into details.
 *
 * ID convention: kebab-case slug, e.g. "alyssa-coco-rivalry".
 */

import type { EpisodeId } from "./episode.ts";
import type { QueenId } from "./queen.ts";
import type { SeasonId } from "./season.ts";

/** Stable lore identifier (kebab-case slug). */
export type LoreId = string;

/**
 * Soft tags for filtering and agent routing.
 * Prefer these over free-text when possible; extend as the KB grows.
 */
export const LoreTag = {
  // Tone / vibe
  RIVALRY: "rivalry",
  DRAMA: "drama",
  COMEDY: "comedy",
  ICONIC: "iconic",
  CONTROVERSY: "controversy",
  UNDERDOG: "underdog",
  VILLAIN: "villain",
  SISTERHOOD: "sisterhood",
  HEARTBREAK: "heartbreak",

  // Moments / formats
  READING: "reading",
  LIP_SYNC: "lip-sync",
  SNATCH_GAME: "snatch-game",
  BALL: "ball",
  MAKEOVER: "makeover",
  RUNWAY: "runway",
  QUOTE: "quote",
  UNTUCKED: "untucked",
  REUNION: "reunion",
  FINALE: "finale",

  // Outcomes / tropes
  CROWN: "crown",
  PORKCHOP: "porkchop",
  DOUBLE_SHANTAY: "double-shantay",
  DOUBLE_SASHAY: "double-sashay",
  FAN_FAVORITE: "fan-favorite",
  ROBBED: "robbed",
  RETURN: "return",

  // Relationships / franchise
  DRAG_FAMILY: "drag-family",
  CROSSOVER: "crossover",
  ALL_STARS: "all-stars",
  VS_THE_WORLD: "vs-the-world",
  INTERNATIONAL: "international",
  PRODUCTION: "production",
} as const;

export type LoreTag = (typeof LoreTag)[keyof typeof LoreTag];

/**
 * A lore entry — story + links into the fact catalogs.
 */
export interface Lore {
  /** Canonical ID — use when citing or linking lore entries. */
  id: LoreId;
  /** Short title, e.g. "Alyssa vs Coco". */
  title: string;
  /** Agent-readable narrative. Keep factual tone; link out via IDs for stats. */
  summary: string;
  /** Filter / routing tags. */
  tags: LoreTag[];
  /** Related queens — resolve via Queen catalog. */
  queenIds?: QueenId[];
  /** Related seasons — resolve via Season catalog. */
  seasonIds?: SeasonId[];
  /** Related episodes — resolve via Episode catalog. */
  episodeIds?: EpisodeId[];
}
