/**
 * List loaded season ids, optionally filtered by FranchiseRegion.
 */

import {
  FRANCHISE_REGION_CODES,
  type FranchiseCode,
  type FranchiseRegion,
  type SeasonId,
} from "../../kb/catalogs.ts";
import { getKb } from "../../kb/load.ts";

/**
 * Return loaded season ids, optionally filtered by franchise and/or region.
 * Omit both to list every season present in the KB.
 */
export const listSeasonIds = (options?: {
  region?: FranchiseRegion;
  franchise?: FranchiseCode;
}): SeasonId[] => {
  const seasons = [...getKb().seasons.values()];
  const filtered = seasons.filter((season) => {
    if (options?.franchise && season.franchise !== options.franchise) {
      return false;
    }
    if (options?.region) {
      const codes = FRANCHISE_REGION_CODES[options.region] as readonly string[];
      if (!codes.includes(season.franchise)) return false;
    }
    return true;
  });
  return filtered.map((season) => season.id).sort();
};
