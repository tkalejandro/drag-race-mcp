/**
 * Rank queens by documented cash earnings (no FX conversion).
 */

import type { Currency } from "../../kb/catalogs.ts";
import { getQueenEarnings } from "./get_queen_earnings.ts";
import { queensInScope, scopedSeasonIds, type QueenScope } from "./scope.ts";
import { clampSearchLimit } from "../shared/limits.ts";

export type EarningsRankRow = {
  rank: number;
  queenId: string;
  name: string;
  amount: number;
  currency: Currency;
};

export type EarningsLeaderboard = {
  currency: Currency;
  results: EarningsRankRow[];
};

const cashByCurrency = (
  queenId: string,
  seasonIds: string[] | undefined,
): Map<Currency, number> => {
  const earnings = getQueenEarnings(queenId);
  const totals = new Map<Currency, number>();
  if (!earnings) return totals;
  const allow = seasonIds ? new Set(seasonIds) : undefined;
  for (const item of earnings.breakdown) {
    if (allow && !allow.has(item.seasonId)) continue;
    const money = item.earnings;
    if (money.isCharity) continue;
    if (money.amount === 0) continue;
    totals.set(money.currency, (totals.get(money.currency) ?? 0) + money.amount);
  }
  return totals;
};

export const rankQueensByEarnings = (
  options?: QueenScope & { currency?: Currency; limit?: number },
): EarningsLeaderboard[] => {
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

  const byCurrency = new Map<Currency, { queenId: string; name: string; amount: number }[]>();

  for (const queen of queensInScope(scope)) {
    const seasonIds = needsSeasonSlice ? scopedSeasonIds(queen, scope) : undefined;
    const totals = cashByCurrency(queen.id, seasonIds);
    for (const [currency, amount] of totals) {
      if (options?.currency && currency !== options.currency) continue;
      const rows = byCurrency.get(currency) ?? [];
      rows.push({ queenId: queen.id, name: queen.name, amount });
      byCurrency.set(currency, rows);
    }
  }

  return [...byCurrency.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, rows]) => {
      const sorted = rows.sort((left, right) => right.amount - left.amount).slice(0, limit);
      return {
        currency,
        results: sorted.map((row, index) => ({
          rank: index + 1,
          queenId: row.queenId,
          name: row.name,
          amount: row.amount,
          currency,
        })),
      };
    });
};
