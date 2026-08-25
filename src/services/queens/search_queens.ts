/**
 * Search queens by name/alias and optional season, franchise, region, origin filters.
 */

import type { Queen } from "../../kb/schemas/index.ts";
import { getKb } from "../../kb/load.ts";
import { clampSearchLimit } from "../shared/limits.ts";
import { queenMatchesScope, type QueenScope } from "./scope.ts";

export type QueenSearchHit = Pick<Queen, "id" | "name" | "aliases">;

export type QueenSearchOptions = QueenScope & {
  query?: string;
  limit?: number;
};

/**
 * Find queens matching an optional name/alias substring plus scope filters.
 * Results are capped via `clampSearchLimit`.
 */
export const searchQueens = (options: QueenSearchOptions): QueenSearchHit[] => {
  const needle = options.query?.trim().toLowerCase() ?? "";
  const limit = clampSearchLimit(options.limit);
  const hits: QueenSearchHit[] = [];

  for (const queen of getKb().queens.values()) {
    if (!queenMatchesScope(queen, options)) continue;
    if (needle.length > 0) {
      const nameMatch = queen.name.toLowerCase().includes(needle);
      const aliasMatch = queen.aliases?.some((alias) =>
        alias.toLowerCase().includes(needle),
      );
      if (!nameMatch && !aliasMatch) continue;
    }

    hits.push({
      id: queen.id,
      name: queen.name,
      ...(queen.aliases ? { aliases: queen.aliases } : {}),
    });
    if (hits.length >= limit) break;
  }

  return hits;
};
