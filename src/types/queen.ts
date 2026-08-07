/**
 * Canonical queen records for tools, data, and agent navigation.
 *
 * ID convention: kebab-case drag-name slug, e.g. "jinkx-monsoon", "bianca-del-rio".
 * Always prefer {@link QueenId} over free-text names when linking seasons or stats.
 *
 * Wins and lip-sync losses link to {@link EpisodeId} — look up the Episode for challenge/lip-sync detail.
 */

import type { EpisodeId } from "./episode.ts";
import type { Money } from "./money.ts";
import type { SeasonId } from "./season.ts";

/** Stable queen identifier (kebab-case slug). */
export type QueenId = string;

/**
 * A single maxi or mini challenge win on a season.
 * `episodeId` points at the Episode; optional `name`/`earnings` are denormalized for quick answers.
 */
export interface ChallengeWin {
  /** Episode where the win occurred — resolve full challenge detail via Episode. */
  episodeId: EpisodeId;
  /** Challenge name (optional mirror of Episode challenge name). */
  name?: string;
  /** Cash awarded for this win, when applicable. */
  earnings?: Money;
}

/**
 * A single lip-sync result (win or loss) on a season.
 * `episodeId` points at the Episode; optional `song` mirrors Episode lip-sync detail.
 */
export interface LipSyncResult {
  /** Episode where the lip-sync occurred — resolve song/opponents via Episode. */
  episodeId: EpisodeId;
  /** Song title (optional mirror of Episode lip-sync song). */
  song?: string;
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
  /** Episode when eliminated — resolve via Episode catalog; omit if never eliminated mid-season. */
  eliminatedEpisodeId?: EpisodeId;
  /** Main-challenge (maxi) wins this season — one entry per win. */
  challengeWins: ChallengeWin[];
  /** Mini-challenge wins this season — one entry per win. */
  miniChallengeWins: ChallengeWin[];
  /** Lip-sync wins this season — one entry per win. */
  lipSyncWins: LipSyncResult[];
  /**
   * Lip-sync losses this season — queens in Episode.lipSync.queenIds who are not in winnerIds.
   * Includes eliminated LSFYL losses and finale / crown lip-sync losses.
   */
  lipSyncLosses: LipSyncResult[];
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
 *
 * Season stores only {@link QueenId}s (cast, winner, …); resolve the Queen for name/appearances.
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
