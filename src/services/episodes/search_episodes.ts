/**
 * Substring search over episode title, runway theme, and challenge names.
 */

import { getKb } from "../../kb/load.ts";
import type { SeasonId } from "../../kb/catalogs.ts";
import { clampSearchLimit } from "../shared/limits.ts";

export type EpisodeSearchHit = {
  episodeId: string;
  seasonId: string;
  title: string;
};

export const searchEpisodes = (options: {
  query: string;
  seasonId?: SeasonId;
  limit?: number;
}): EpisodeSearchHit[] => {
  const needle = options.query.trim().toLowerCase();
  if (needle.length === 0) return [];
  const limit = clampSearchLimit(options.limit);
  const hits: EpisodeSearchHit[] = [];

  for (const episode of getKb().episodes.values()) {
    if (options.seasonId && episode.seasonId !== options.seasonId) continue;
    const haystack = [
      episode.title,
      episode.runwayTheme ?? "",
      episode.miniChallenge?.name ?? "",
      episode.maxiChallenge?.name ?? "",
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) continue;
    hits.push({
      episodeId: episode.id,
      seasonId: episode.seasonId,
      title: episode.title,
    });
    if (hits.length >= limit) break;
  }

  return hits;
};
