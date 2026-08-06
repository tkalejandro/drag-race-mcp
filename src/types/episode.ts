/**
 * Canonical episode records for tools, data, and agent navigation.
 *
 * ID format: `{SeasonId}-E{NN}` (zero-padded episode number)
 * @example "US-S17-E05" | "AS-S10-E01" | "UK-S06-E10"
 *
 * Seasons store {@link EpisodeId}s; resolve full detail from the Episode catalog.
 */

import type { Money } from "./money.ts";
import type { PersonRef } from "./person.ts";
import type { QueenId } from "./queen.ts";
import type { SeasonId } from "./season.ts";

/** Stable episode identifier (`{SeasonId}-E{NN}`). */
export type EpisodeId = string;

/** Mini or maxi challenge outcome on an episode. */
export interface EpisodeChallenge {
  /** Challenge name, e.g. "Snatch Game", "Reading is Fundamental". */
  name: string;
  /** Queen(s) who won this challenge. */
  winnerIds: QueenId[];
  /** Cash awarded to winner(s), when applicable. */
  earnings?: Money;
}

/** Lip-sync for your life (or All Stars equivalent) on an episode. */
export interface EpisodeLipSync {
  /** Song title. */
  song: string;
  /** Queens who lip-synced. */
  queenIds: QueenId[];
  /** Queen(s) declared the lip-sync winner. */
  winnerIds: QueenId[];
  /** Queen(s) eliminated after this lip-sync, when any. */
  eliminatedIds?: QueenId[];
}

/**
 * Full episode record keyed by {@link EpisodeId}.
 * Prefer this shape when agents need week-by-week detail.
 */
export interface Episode {
  /** Canonical ID — always use this when linking from seasons or queen wins. */
  id: EpisodeId;
  /** Parent season. */
  seasonId: SeasonId;
  /** 1-based episode number within the season. */
  episodeNumber: number;
  /** Episode title. */
  title: string;
  /** Mini-challenge, when the episode had one. */
  miniChallenge?: EpisodeChallenge;
  /** Maxi / main challenge, when the episode had one. */
  maxiChallenge?: EpisodeChallenge;
  /** Runway category / theme, when applicable. */
  runwayTheme?: string;
  /** Queens in the top (safe-high / winners group), when announced. */
  topIds?: QueenId[];
  /** Queens in the bottom, when announced. */
  bottomIds?: QueenId[];
  /** Lip-sync for the episode, when one occurred. */
  lipSync?: EpisodeLipSync;
  /** Guest judges for this episode. */
  guestJudges?: PersonRef[];
}
