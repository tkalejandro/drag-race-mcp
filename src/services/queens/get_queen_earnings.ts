import type { Currency, QueenId, SeasonId } from "../../kb/catalogs.ts";
import type { Money } from "../../kb/schemas/money.ts";
import { getQueen, getSeason } from "../accessors/index.ts";

export type EarningsSourceKind =
  | "maxi"
  | "mini"
  | "lipSync"
  | "seasonPurse";

export type EarningsBreakdownItem = {
  kind: EarningsSourceKind;
  seasonId: SeasonId;
  episodeId?: string;
  earnings: Money;
};

export type CurrencyTotal = {
  amount: number;
  currency: Currency;
};

export type QueenEarnings = {
  queenId: QueenId;
  cashTotal: CurrencyTotal[];
  charityTotal: CurrencyTotal[];
  nonCashPrizes: EarningsBreakdownItem[];
  breakdown: EarningsBreakdownItem[];
};

const addToTotals = (
  totals: Map<Currency, number>,
  money: Money,
): void => {
  totals.set(money.currency, (totals.get(money.currency) ?? 0) + money.amount);
};

const mapToCurrencyTotals = (
  totals: Map<Currency, number>,
): CurrencyTotal[] =>
  [...totals.entries()]
    .map(([currency, amount]) => ({ amount, currency }))
    .sort((a, b) => a.currency.localeCompare(b.currency));

const pushMoney = (
  breakdown: EarningsBreakdownItem[],
  cash: Map<Currency, number>,
  charity: Map<Currency, number>,
  nonCash: EarningsBreakdownItem[],
  item: EarningsBreakdownItem,
): void => {
  breakdown.push(item);
  const { earnings } = item;
  if (earnings.isCharity) {
    if (earnings.amount > 0) addToTotals(charity, earnings);
    return;
  }
  if (earnings.amount === 0) {
    nonCash.push(item);
    return;
  }
  addToTotals(cash, earnings);
};

/** Sum a queen's documented prizes across all appearances. */
export const getQueenEarnings = (
  queenId: QueenId,
): QueenEarnings | undefined => {
  const queen = getQueen(queenId);
  if (!queen) return undefined;

  const breakdown: EarningsBreakdownItem[] = [];
  const cash = new Map<Currency, number>();
  const charity = new Map<Currency, number>();
  const nonCash: EarningsBreakdownItem[] = [];

  for (const appearance of queen.appearances) {
    const { seasonId } = appearance;

    for (const win of appearance.challengeWins) {
      if (!win.earnings) continue;
      pushMoney(breakdown, cash, charity, nonCash, {
        kind: "maxi",
        seasonId,
        episodeId: win.episodeId,
        earnings: win.earnings,
      });
    }

    for (const win of appearance.miniChallengeWins) {
      if (!win.earnings) continue;
      pushMoney(breakdown, cash, charity, nonCash, {
        kind: "mini",
        seasonId,
        episodeId: win.episodeId,
        earnings: win.earnings,
      });
    }

    for (const win of appearance.lipSyncWins) {
      if (!win.earnings) continue;
      pushMoney(breakdown, cash, charity, nonCash, {
        kind: "lipSync",
        seasonId,
        episodeId: win.episodeId,
        earnings: win.earnings,
      });
    }

    const season = getSeason(seasonId);
    if (season?.winnerIds?.includes(queenId) && season.cashPrice) {
      pushMoney(breakdown, cash, charity, nonCash, {
        kind: "seasonPurse",
        seasonId,
        earnings: season.cashPrice,
      });
    }
  }

  return {
    queenId,
    cashTotal: mapToCurrencyTotals(cash),
    charityTotal: mapToCurrencyTotals(charity),
    nonCashPrizes: nonCash,
    breakdown,
  };
};
