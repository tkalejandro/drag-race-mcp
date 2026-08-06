/**
 * Canonical queen records for tools, data, and agent navigation.
 *
 * ID convention: kebab-case drag-name slug, e.g. "jinkx-monsoon", "bianca-del-rio".
 * Always prefer {@link QueenId} over free-text names when linking seasons or stats.
 */

import type { Money } from "./money.ts";
import type { SeasonId } from "./season.ts";

/** Stable queen identifier (kebab-case slug). */
export type QueenId = string;

/**
 * A single maxi or mini challenge win on a season.
 * Prefer listing wins over a bare count so agents can answer episode/prize questions.
 */
export interface ChallengeWin {
  /** Episode number where the win occurred. */
  episode: number;
  /** Challenge name, e.g. "Snatch Game", "The Ball", "Everybody Say Love". */
  name: string;
  /** Cash awarded for this win, when applicable. */
  earnings?: Money;
}

/** A single lip-sync win on a season. */
export interface LipSyncWin {
  /** Episode number where the lip-sync occurred. */
  episode: number;
  /** Song title, e.g. "Telephone", "And I Am Telling You I'm Not Going". */
  song: string;
}

/**
 * One queen's participation on a single season.
 * Keep season-specific stats here — not on the top-level Queen.
 */
export interface QueenAppearance {
  /** Season this appearance belongs to. */
  seasonId: SeasonId;
  /**
   * Final placement (1 = winner, 2 = runner-up, …).
   * Use the announced final ranking when available.
   */
  placement: number;
  /** Episode number when eliminated; omit for winner / finalists who were never eliminated mid-season. */
  eliminatedEpisode?: number;
  /** Main-challenge (maxi) wins this season — one entry per win. */
  challengeWins: ChallengeWin[];
  /** Mini-challenge wins this season — one entry per win. */
  miniChallengeWins: ChallengeWin[];
  /** Lip-sync wins this season — one entry per win. */
  lipSyncWins: LipSyncWin[];
  /** True when awarded Miss Congeniality on this season. */
  missCongeniality?: boolean;
  /** True when removed by disqualification on this season. */
  disqualified?: boolean;
  /** True when the queen quit / chose to leave (not eliminated by lip-sync). */
  quit?: boolean;
  /** True when the queen left and later re-entered the competition this season. */
  reentered?: boolean;
}

/**
 * Full queen record keyed by {@link QueenId}.
 * Prefer this shape in tool responses so agents can navigate without free-text guessing.
 */
export interface Queen {
  /** Canonical ID — always use this when linking from seasons or appearances. */
  id: QueenId;
  /** Primary drag name, e.g. "Jinkx Monsoon". */
  name: string;
  /** Alternate names / spellings agents might see (maiden drag names, abbreviations). */
  aliases?: string[];
  /** Every season appearance, oldest → newest when known. */
  appearances: QueenAppearance[];
}
