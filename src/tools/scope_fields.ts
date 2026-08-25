/**
 * Shared optional filter fields for discovery / rank / list tools.
 */

import {
  CountrySchema,
  FranchiseCodeSchema,
  FranchiseRegionSchema,
  OriginRegionSchema,
  SeasonIdSchema,
} from "../kb/schemas/common.ts";
import type { QueenScope } from "../services/queens/scope.ts";

export const seasonIdField = SeasonIdSchema.optional().describe(
  "Limit to one season id (e.g. FR-S01, US-S12).",
);

export const franchiseField = FranchiseCodeSchema.optional().describe(
  "Show franchise code (FR = Drag Race France, ES = España). This is the show, not queen nationality. Call list_catalogs with kind=franchises to map names like \"france\".",
);

export const regionField = FranchiseRegionSchema.optional().describe(
  "Show geography: us, uk, canada, europe, latam_br, asia_pacific, specials. europe includes France AND Spain. Use franchise=FR for France the show.",
);

export const originCountryField = CountrySchema.optional().describe(
  "Queen origin ISO 3166-1 alpha-2 country (MX, ES, FR, US, …). Not the franchise of the show they competed on.",
);

export const originRegionField = OriginRegionSchema.optional().describe(
  "Queen origin region derived from countries. latin_america excludes Spain; Spain is iberia or originCountry=ES. Call list_catalogs with kind=origin_regions.",
);

export const toQueenScope = (args: {
  seasonId?: QueenScope["seasonId"];
  franchise?: QueenScope["franchise"];
  region?: QueenScope["region"];
  originCountry?: QueenScope["originCountry"];
  originRegion?: QueenScope["originRegion"];
}): QueenScope => ({
  ...(args.seasonId !== undefined ? { seasonId: args.seasonId } : {}),
  ...(args.franchise !== undefined ? { franchise: args.franchise } : {}),
  ...(args.region !== undefined ? { region: args.region } : {}),
  ...(args.originCountry !== undefined
    ? { originCountry: args.originCountry }
    : {}),
  ...(args.originRegion !== undefined
    ? { originRegion: args.originRegion }
    : {}),
});
