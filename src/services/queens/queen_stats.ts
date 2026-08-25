/**
 * Career stats and ranking by win counts / appearances.
 */

import { getQueen } from "../accessors/index.ts";
import { getQueenEarnings } from "./get_queen_earnings.ts";
import {
  queensInScope,
  scopedSeasonIds,
  type QueenScope,
} from "./scope.ts";
import { originRegionsForCountries } from "../../kb/origin.ts";
import { clampSearchLimit } from "../shared/limits.ts";
import type { Queen } from "../../kb/schemas/index.ts";

export const QueenStatMetric = {
  CHALLENGE_WINS: "challengeWins",
  MINI_WINS: "miniWins",
  LIP_SYNC_WINS: "lipSyncWins",
  APPEARANCES: "appearances",
} as const;

export type QueenStatMetric =
  (typeof QueenStatMetric)[keyof typeof QueenStatMetric];

export type QueenStats = {
  queenId: string;
  name: string;
  origin: Queen["origin"];
  originRegions: string[];
  appearanceCount: number;
  challengeWins: number;
  miniWins: number;
  lipSyncWins: number;
  lipSyncLosses: number;
  placements: { seasonId: string; placement: number }[];
  cashTotal: { amount: number; currency: string }[];
};

const countsForQueen = (queen: Queen, seasonIds?: string[]) => {
  const allow = seasonIds ? new Set(seasonIds) : undefined;
  let challengeWins = 0;
  let miniWins = 0;
  let lipSyncWins = 0;
  let lipSyncLosses = 0;
  let appearanceCount = 0;
  const placements: { seasonId: string; placement: number }[] = [];
  for (const appearance of queen.appearances) {
    if (allow && !allow.has(appearance.seasonId)) continue;
    appearanceCount += 1;
    challengeWins += appearance.challengeWins.length;
    miniWins += appearance.miniChallengeWins.length;
    lipSyncWins += appearance.lipSyncWins.length;
    lipSyncLosses += appearance.lipSyncLosses.length;
    placements.push({
      seasonId: appearance.seasonId,
      placement: appearance.placement,
    });
  }
  return {
    appearanceCount,
    challengeWins,
    miniWins,
    lipSyncWins,
    lipSyncLosses,
    placements,
  };
};

export const getQueenStats = (queenId: string): QueenStats | undefined => {
  const queen = getQueen(queenId);
  if (!queen) return undefined;
  const counts = countsForQueen(queen);
  const earnings = getQueenEarnings(queenId);
  return {
    queenId: queen.id,
    name: queen.name,
    origin: queen.origin,
    originRegions: originRegionsForCountries(queen.origin.countries),
    ...counts,
    cashTotal: earnings?.cashTotal ?? [],
  };
};

export const compareQueens = (queenIds: string[]): QueenStats[] =>
  queenIds
    .map((id) => getQueenStats(id))
    .filter((stats): stats is QueenStats => stats !== undefined);

export type StatsRankRow = {
  rank: number;
  queenId: string;
  name: string;
  value: number;
};

const metricValue = (
  queen: Queen,
  metric: QueenStatMetric,
  seasonIds?: string[],
): number => {
  const counts = countsForQueen(queen, seasonIds);
  if (metric === "challengeWins") return counts.challengeWins;
  if (metric === "miniWins") return counts.miniWins;
  if (metric === "lipSyncWins") return counts.lipSyncWins;
  return counts.appearanceCount;
};

export const rankQueensByStats = (
  metric: QueenStatMetric,
  options?: QueenScope & { limit?: number },
): StatsRankRow[] => {
  const limit = clampSearchLimit(options?.limit ?? 10);
  const scope: QueenScope = {
    ...(options?.seasonId ? { seasonId: options.seasonId } : {}),
    ...(options?.franchise ? { franchise: options.franchise } : {}),
    ...(options?.region ? { region: options.region } : {}),
    ...(options?.originCountry ? { originCountry: options.originCountry } : {}),
    ...(options?.originRegion ? { originRegion: options.originRegion } : {}),
  };
  const needsSeasonSlice =
    options?.seasonId !== undefined ||
    options?.franchise !== undefined ||
    options?.region !== undefined;

  const rows = queensInScope(scope).map((queen) => {
    const seasonIds = needsSeasonSlice ? scopedSeasonIds(queen, scope) : undefined;
    return {
      queenId: queen.id,
      name: queen.name,
      value: metricValue(queen, metric, seasonIds),
    };
  });

  return rows
    .sort((left, right) => right.value - left.value || left.queenId.localeCompare(right.queenId))
    .slice(0, limit)
    .map((row, index) => ({ rank: index + 1, ...row }));
};
