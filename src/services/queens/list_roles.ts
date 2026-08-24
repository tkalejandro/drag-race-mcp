/**
 * ID-first list helpers: returning queens, porkchops, alumni hosts/judges.
 */

import { getKb } from "../../kb/load.ts";
import { seasonMatchesScope, type QueenScope } from "./scope.ts";

export type ReturningQueenRow = {
  queenId: string;
  name: string;
  seasonIds: string[];
};

export const listReturningQueens = (options?: {
  franchise?: QueenScope["franchise"];
}): ReturningQueenRow[] => {
  const rows: ReturningQueenRow[] = [];
  for (const queen of getKb().queens.values()) {
    if (queen.appearances.length < 2) continue;
    const seasonIds = queen.appearances.map((appearance) => appearance.seasonId);
    if (options?.franchise) {
      const matches = seasonIds.some((seasonId) => {
        const season = getKb().seasons.get(seasonId);
        return season?.franchise === options.franchise;
      });
      if (!matches) continue;
    }
    rows.push({ queenId: queen.id, name: queen.name, seasonIds });
  }
  return rows.sort((left, right) => left.queenId.localeCompare(right.queenId));
};

export type PorkchopRow = { queenId: string; seasonId: string };

export const listPorkchops = (
  scope?: Pick<QueenScope, "seasonId" | "franchise" | "region">,
): PorkchopRow[] => {
  const rows: PorkchopRow[] = [];
  for (const season of getKb().seasons.values()) {
    if (scope && !seasonMatchesScope(season, scope)) continue;
    for (const queenId of season.porkchopIds ?? []) {
      rows.push({ queenId, seasonId: season.id });
    }
  }
  return rows.sort((left, right) => left.seasonId.localeCompare(right.seasonId));
};

export type QueenJudgeRow = {
  queenId: string;
  seasonId: string;
  episodeId?: string;
  role: "panel" | "guest";
};

export const listQueensAsJudges = (
  scope?: Pick<QueenScope, "seasonId" | "franchise" | "region">,
): QueenJudgeRow[] => {
  const rows: QueenJudgeRow[] = [];
  for (const season of getKb().seasons.values()) {
    if (scope && !seasonMatchesScope(season, scope)) continue;
    for (const judge of season.judges) {
      if (!judge.queenId) continue;
      rows.push({
        queenId: judge.queenId,
        seasonId: season.id,
        role: "panel",
      });
    }
  }
  for (const episode of getKb().episodes.values()) {
    const season = getKb().seasons.get(episode.seasonId);
    if (!season) continue;
    if (scope && !seasonMatchesScope(season, scope)) continue;
    for (const judge of episode.guestJudges ?? []) {
      if (!judge.queenId) continue;
      rows.push({
        queenId: judge.queenId,
        seasonId: season.id,
        episodeId: episode.id,
        role: "guest",
      });
    }
  }
  return rows.sort(
    (left, right) =>
      left.seasonId.localeCompare(right.seasonId) ||
      left.queenId.localeCompare(right.queenId),
  );
};

export type QueenHostRow = { queenId: string; seasonId: string };

export const listQueensAsHosts = (
  scope?: Pick<QueenScope, "seasonId" | "franchise" | "region">,
): QueenHostRow[] => {
  const rows: QueenHostRow[] = [];
  for (const season of getKb().seasons.values()) {
    if (scope && !seasonMatchesScope(season, scope)) continue;
    for (const host of season.hosts) {
      if (!host.queenId) continue;
      rows.push({ queenId: host.queenId, seasonId: season.id });
    }
  }
  return rows.sort(
    (left, right) =>
      left.seasonId.localeCompare(right.seasonId) ||
      left.queenId.localeCompare(right.queenId),
  );
};
