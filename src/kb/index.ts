/**
 * Indexed Drag Race knowledge base — catalogs, schemas, load, and accessors.
 */

export {
  FranchiseCode,
  FRANCHISE_LABEL,
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

export {
  getQueen,
  getSeason,
  getEpisode,
  getLore,
  listQueenIds,
  listSeasonIds,
  listEpisodeIds,
  listLoreIds,
} from "./accessors.ts";

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
} from "./schemas/index.ts";
