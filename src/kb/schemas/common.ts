/**
 * Shared Zod primitives used across entity schemas.
 */

import { z } from "zod";
import {
  ALL_SEASON_IDS,
  Currency,
  FranchiseCode,
  LoreTag,
  type SeasonId,
} from "../catalogs.ts";

export const currencyValues = Object.values(Currency) as [
  Currency,
  ...Currency[],
];
export const franchiseValues = Object.values(FranchiseCode) as [
  FranchiseCode,
  ...FranchiseCode[],
];
export const loreTagValues = Object.values(LoreTag) as [LoreTag, ...LoreTag[]];
export const seasonIdValues = ALL_SEASON_IDS as [SeasonId, ...SeasonId[]];

export const QueenIdSchema = z.string().min(1);
export const EpisodeIdSchema = z.string().min(1);
export const LoreIdSchema = z.string().min(1);
export const SeasonIdSchema = z.enum(seasonIdValues);
