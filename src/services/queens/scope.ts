/**
 * Shared queen/season scope filters for search, rank, and list tools.
 */

import {
  FRANCHISE_REGION_CODES,
  type FranchiseCode,
  type FranchiseRegion,
  type SeasonId,
} from "../../kb/catalogs.ts";
import { originRegionsForCountries, type Country, type OriginRegion } from "../../kb/origin.ts";
import type { Queen } from "../../kb/schemas/index.ts";
import { getKb } from "../../kb/load.ts";
import { getSeason } from "../accessors/index.ts";

export type QueenScope = {
  seasonId?: SeasonId;
  franchise?: FranchiseCode;
  region?: FranchiseRegion;
  originCountry?: Country;
  originRegion?: OriginRegion;
};

const seasonMatchesFranchiseScope = (
  seasonId: SeasonId,
  scope: QueenScope,
): boolean => {
  const season = getSeason(seasonId);
  if (!season) return false;
  if (scope.seasonId && season.id !== scope.seasonId) return false;
  if (scope.franchise && season.franchise !== scope.franchise) return false;
  if (scope.region) {
    const codes = FRANCHISE_REGION_CODES[scope.region] as readonly string[];
    if (!codes.includes(season.franchise)) return false;
  }
  return true;
};

/** Season ids on a queen that match franchise/region/season filters. */
export const scopedSeasonIds = (
  queen: Queen,
  scope: QueenScope,
): SeasonId[] => {
  const needsSeason =
    scope.seasonId !== undefined ||
    scope.franchise !== undefined ||
    scope.region !== undefined;
  if (!needsSeason) {
    return queen.appearances.map((appearance) => appearance.seasonId);
  }
  return queen.appearances
    .map((appearance) => appearance.seasonId)
    .filter((seasonId) => seasonMatchesFranchiseScope(seasonId, scope));
};

export const queenMatchesScope = (queen: Queen, scope: QueenScope): boolean => {
  if (
    scope.originCountry &&
    !queen.origin.countries.includes(scope.originCountry)
  ) {
    return false;
  }
  if (scope.originRegion) {
    const regions = originRegionsForCountries(queen.origin.countries);
    if (!regions.includes(scope.originRegion)) return false;
  }
  const needsSeason =
    scope.seasonId !== undefined ||
    scope.franchise !== undefined ||
    scope.region !== undefined;
  if (needsSeason && scopedSeasonIds(queen, scope).length === 0) return false;
  return true;
};

export const queensInScope = (scope: QueenScope): Queen[] =>
  [...getKb().queens.values()].filter((queen) => queenMatchesScope(queen, scope));

export const seasonMatchesScope = (
  season: { id: SeasonId; franchise: FranchiseCode },
  scope: Pick<QueenScope, "seasonId" | "franchise" | "region">,
): boolean => {
  if (scope.seasonId && season.id !== scope.seasonId) return false;
  if (scope.franchise && season.franchise !== scope.franchise) return false;
  if (scope.region) {
    const codes = FRANCHISE_REGION_CODES[scope.region] as readonly string[];
    if (!codes.includes(season.franchise)) return false;
  }
  return true;
};
