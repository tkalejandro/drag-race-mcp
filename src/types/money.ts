/**
 * Shared money primitives used by seasons, queens, and tools.
 * Prefer {@link Currency} codes over free-text so agents stay consistent.
 */

/** ISO 4217 currency codes used across Drag Race franchises. */
export const Currency = {
  /** United States dollar */
  USD: "USD",
  /** Euro */
  EUR: "EUR",
  /** Pound sterling (UK) */
  GBP: "GBP",
  /** Canadian dollar */
  CAD: "CAD",
  /** Australian dollar */
  AUD: "AUD",
  /** New Zealand dollar */
  NZD: "NZD",
  /** Thai baht */
  THB: "THB",
  /** Mexican peso */
  MXN: "MXN",
  /** Brazilian real */
  BRL: "BRL",
  /** Swedish krona */
  SEK: "SEK",
  /** Philippine peso */
  PHP: "PHP",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

/** Monetary amount with an explicit {@link Currency} code. */
export interface Money {
  /** Numeric amount in major units (e.g. 200000 for $200,000). */
  amount: number;
  /** ISO 4217 currency from {@link Currency}. */
  currency: Currency;
}
