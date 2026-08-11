/**
 * Search lore by query, tags, queenId, and/or seasonId.
 */

import type { LoreTag, QueenId, SeasonId } from "../../kb/catalogs.ts";
import type { Lore } from "../../kb/schemas/index.ts";
import { getKb } from "../../kb/load.ts";
import { clampSearchLimit } from "../shared/limits.ts";

export type LoreSearchOptions = {
  query?: string;
  tags?: LoreTag[];
  queenId?: QueenId;
  seasonId?: SeasonId;
  limit?: number;
};

/**
 * Filter lore entries by optional text, tags, queen, and/or season.
 * Results are capped via `clampSearchLimit`.
 */
export const searchLore = (options: LoreSearchOptions = {}): Lore[] => {
  const limit = clampSearchLimit(options.limit);
  const needle = options.query?.trim().toLowerCase();
  const tags = options.tags;
  const results: Lore[] = [];

  for (const lore of getKb().lore.values()) {
    if (needle) {
      const inTitle = lore.title.toLowerCase().includes(needle);
      const inSummary = lore.summary.toLowerCase().includes(needle);
      if (!inTitle && !inSummary) continue;
    }
    if (tags && tags.length > 0) {
      if (!tags.some((tag) => lore.tags.includes(tag))) continue;
    }
    if (options.queenId) {
      if (!lore.queenIds?.includes(options.queenId)) continue;
    }
    if (options.seasonId) {
      if (!lore.seasonIds?.includes(options.seasonId)) continue;
    }

    results.push(lore);
    if (results.length >= limit) break;
  }

  return results;
};
