/**
 * List loaded season ids, optionally filtered by FranchiseRegion.
 */

import {
  FRANCHISE_REGION_CODES,
  type FranchiseRegion,
  type SeasonId,
} from "../../kb/catalogs.ts";
import { getKb } from "../../kb/load.ts";

/**
 * Return loaded season ids, optionally filtered by franchise region.
 * Omit `region` to list every season present in the KB.
 */
export const listSeasonIds = (options?: {
  region?: FranchiseRegion;
}): SeasonId[] => {
  const seasons = [...getKb().seasons.values()];
  const filtered = options?.region
    ? seasons.filter((season) =>
        (FRANCHISE_REGION_CODES[options.region!] as readonly string[]).includes(
          season.franchise,
        ),
      )
    : seasons;
  return filtered.map((season) => season.id).sort();
};
