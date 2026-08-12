/**
 * Indexed Drag Race knowledge base — catalogs, schemas, load, integrity.
 * Getters and query helpers live in `src/services/`.
 */

export {
  FranchiseCode,
  FRANCHISE_LABEL,
  FranchiseRegion,
  FRANCHISE_REGION_CODES,
  SeasonId,
  ALL_SEASON_IDS,
  Currency,
  LoreTag,
  type QueenId,
  type EpisodeId,
  type LoreId,
} from "./catalogs.ts";

export {
  getKb,
  loadKnowledgeBase,
  resetKb,
  type KnowledgeBase,
} from "./load.ts";

export { assertKnowledgeBaseIntegrity } from "./integrity.ts";

export type {
  Queen,
  Season,
  Episode,
  Lore,
  Money,
  PersonRef,
  ChallengeWin,
  LipSyncResult,
  QueenAppearance,
  EpisodeChallenge,
  EpisodeLipSync,
} from "./schemas/index.ts";

export {
  QueenSchema,
  SeasonSchema,
  EpisodeSchema,
  LoreSchema,
  MoneySchema,
  PersonRefSchema,
  LipSyncKind,
} from "./schemas/index.ts";
