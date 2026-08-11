/**
 * Zod schemas are the source of truth for entity shapes.
 * Types are inferred via z.infer — do not duplicate interfaces.
 */

export { MoneySchema, type Money } from "./money.ts";
export { PersonRefSchema, type PersonRef } from "./person.ts";
export {
  ChallengeWinSchema,
  LipSyncResultSchema,
  QueenAppearanceSchema,
  QueenSchema,
  type ChallengeWin,
  type LipSyncResult,
  type QueenAppearance,
  type Queen,
} from "./queen.ts";
export {
  EpisodeChallengeSchema,
  EpisodeLipSyncSchema,
  EpisodeSchema,
  LipSyncKind,
  type EpisodeChallenge,
  type EpisodeLipSync,
  type Episode,
} from "./episode.ts";
export { SeasonSchema, type Season } from "./season.ts";
export { LoreSchema, type Lore } from "./lore.ts";
