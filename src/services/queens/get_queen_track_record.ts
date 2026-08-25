/**
 * Weekly track record for one queen on one season.
 */

import { getKb } from "../../kb/load.ts";
import { getQueen } from "../accessors/index.ts";
import type { SeasonId } from "../../kb/catalogs.ts";

export type TrackOutcome =
  | "win"
  | "high"
  | "safe"
  | "low"
  | "eliminated"
  | "lip_sync";

export type TrackRecordRow = {
  episodeId: string;
  episodeNumber: number;
  title: string;
  outcome: TrackOutcome;
};

export const getQueenTrackRecord = (
  queenId: string,
  seasonId: SeasonId,
): TrackRecordRow[] | undefined => {
  const queen = getQueen(queenId);
  const season = getKb().seasons.get(seasonId);
  if (!queen || !season) return undefined;

  const appeared = queen.appearances.some(
    (appearance) => appearance.seasonId === seasonId,
  );
  const episodes = [...getKb().episodes.values()]
    .filter((episode) => episode.seasonId === seasonId)
    .sort((left, right) => left.episodeNumber - right.episodeNumber);

  const out = new Set<string>();
  const rows: TrackRecordRow[] = [];

  for (const episode of episodes) {
    const inCast = season.castIds.includes(queenId);
    const inLip = episode.lipSync?.queenIds.includes(queenId) ?? false;
    if (!inCast && !inLip && !appeared) continue;
    if (out.has(queenId) && !inLip) continue;

    const maxiWin = episode.maxiChallenge?.winnerIds.includes(queenId) ?? false;
    const high = episode.topIds?.includes(queenId) ?? false;
    const low = episode.bottomIds?.includes(queenId) ?? false;
    const eliminated = episode.lipSync?.eliminatedIds?.includes(queenId) ?? false;

    let outcome: TrackOutcome | undefined;
    if (eliminated) outcome = "eliminated";
    else if (maxiWin) outcome = "win";
    else if (high) outcome = "high";
    else if (low) outcome = "low";
    else if (inLip) outcome = "lip_sync";
    else if (inCast && !out.has(queenId)) outcome = "safe";

    if (outcome) {
      rows.push({
        episodeId: episode.id,
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        outcome,
      });
    }
    if (eliminated) out.add(queenId);
  }

  return rows;
};
