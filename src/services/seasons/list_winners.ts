/**
 * List crowned winners with season purse.
 */

import { getKb } from "../../kb/load.ts";
import { seasonMatchesScope, type QueenScope } from "../queens/scope.ts";
import type { Money } from "../../kb/schemas/money.ts";

export type WinnerRow = {
  seasonId: string;
  franchise: string;
  winnerIds: string[];
  cashPrice: Money;
};

export const listWinners = (
  scope?: Pick<QueenScope, "seasonId" | "franchise" | "region">,
): WinnerRow[] => {
  const rows: WinnerRow[] = [];
  for (const season of getKb().seasons.values()) {
    if (scope && !seasonMatchesScope(season, scope)) continue;
    if (!season.winnerIds || season.winnerIds.length === 0) continue;
    rows.push({
      seasonId: season.id,
      franchise: season.franchise,
      winnerIds: season.winnerIds,
      cashPrice: season.cashPrice,
    });
  }
  return rows.sort((left, right) => left.seasonId.localeCompare(right.seasonId));
};
