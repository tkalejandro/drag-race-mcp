/**
 * Substring search over queen name and aliases.
 */

import type { Queen } from "../../kb/schemas/index.ts";
import { getKb } from "../../kb/load.ts";
import { clampSearchLimit } from "../shared/limits.ts";

export type QueenSearchHit = Pick<Queen, "id" | "name" | "aliases">;

/**
 * Find queens whose name or aliases contain `query` (case-insensitive).
 * Results are capped via `clampSearchLimit`.
 */
export const searchQueens = (
  query: string,
  options?: { limit?: number },
): QueenSearchHit[] => {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return [];

  const limit = clampSearchLimit(options?.limit);
  const hits: QueenSearchHit[] = [];

  for (const queen of getKb().queens.values()) {
    const nameMatch = queen.name.toLowerCase().includes(needle);
    const aliasMatch = queen.aliases?.some((alias) =>
      alias.toLowerCase().includes(needle),
    );
    if (!nameMatch && !aliasMatch) continue;

    hits.push({
      id: queen.id,
      name: queen.name,
      ...(queen.aliases ? { aliases: queen.aliases } : {}),
    });
    if (hits.length >= limit) break;
  }

  return hits;
};
