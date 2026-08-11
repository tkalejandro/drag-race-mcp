/**
 * Cast queen ids for a single season.
 */

import type { QueenId, SeasonId } from "../../kb/catalogs.ts";
import { getSeason } from "../accessors/accessors.ts";

/**
 * Return the cast (`castIds`) for one season, or `undefined` if the season
 * is not in the KB.
 */
export const listQueenIdsForSeason = (
  seasonId: SeasonId,
): QueenId[] | undefined => {
  const season = getSeason(seasonId);
  if (!season) return undefined;
  return [...season.castIds];
};
