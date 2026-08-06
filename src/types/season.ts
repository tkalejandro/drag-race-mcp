/**
 * Canonical season identifiers for tools, data, and agent navigation.
 *
 * Format: `{FRANCHISE}-S{NN}`
 * - FRANCHISE — short uppercase code (US, AS, UK, …)
 * - NN — zero-padded season number (01–99)
 *
 * Always prefer these IDs over free-text season names when linking
 * queens, episodes, challenges, or stats.
 *
 * @example "US-S17" | "AS-S10" | "UK-S06" | "CVTW-S02"
 */

/** Franchise prefix codes embedded in every SeasonId. */
export const FranchiseCode = {
  /** RuPaul's Drag Race (US main series) */
  US: "US",
  /** RuPaul's Drag Race All Stars */
  AS: "AS",
  /** RuPaul's Drag Race UK */
  UK: "UK",
  /** Drag Race Germany */
  DE: "DE",
  /** Drag Race France */
  FR: "FR",
  /** RuPaul's Drag Race Global All Stars */
  GAS: "GAS",
  /** Canada's Drag Race */
  CA: "CA",
  /** Canada's Drag Race vs The World */
  CVTW: "CVTW",
  /** Canada's Drag Race All Stars */
  CAS: "CAS",
  /** Drag Race Down Under vs The World */
  DUVTW: "DUVTW",
  /** Drag Race Thailand */
  TH: "TH",
  /** Drag Race Philippines */
  PH: "PH",
  /** Drag Race Philippines: Slaysian Royale */
  PHSR: "PHSR",
  /** Drag Race Italia */
  IT: "IT",
  /** Drag Race Brasil */
  BR: "BR",
  /** Drag Race México */
  MX: "MX",
  /** Drag Race México: Latina Royale */
  MXLR: "MXLR",
} as const;

export type FranchiseCode =
  (typeof FranchiseCode)[keyof typeof FranchiseCode];

/** Human-readable franchise names — use when explaining IDs to users. */
export const FRANCHISE_LABEL = {
  US: "RuPaul's Drag Race (US)",
  AS: "RuPaul's Drag Race All Stars",
  UK: "RuPaul's Drag Race UK",
  DE: "Drag Race Germany",
  FR: "Drag Race France",
  GAS: "RuPaul's Drag Race Global All Stars",
  CA: "Canada's Drag Race",
  CVTW: "Canada's Drag Race vs The World",
  CAS: "Canada's Drag Race All Stars",
  DUVTW: "Drag Race Down Under vs The World",
  TH: "Drag Race Thailand",
  PH: "Drag Race Philippines",
  PHSR: "Drag Race Philippines: Slaysian Royale",
  IT: "Drag Race Italia",
  BR: "Drag Race Brasil",
  MX: "Drag Race México",
  MXLR: "Drag Race México: Latina Royale",
} as const satisfies Record<FranchiseCode, string>;

/**
 * Every known season ID for the franchises above (as of 2026-08).
 * Values are the wire format agents and tools should emit/consume.
 */
export const SeasonId = {
  // --- RuPaul's Drag Race (US) ---
  US_S01: "US-S01",
  US_S02: "US-S02",
  US_S03: "US-S03",
  US_S04: "US-S04",
  US_S05: "US-S05",
  US_S06: "US-S06",
  US_S07: "US-S07",
  US_S08: "US-S08",
  US_S09: "US-S09",
  US_S10: "US-S10",
  US_S11: "US-S11",
  US_S12: "US-S12",
  US_S13: "US-S13",
  US_S14: "US-S14",
  US_S15: "US-S15",
  US_S16: "US-S16",
  US_S17: "US-S17",
  US_S18: "US-S18",

  // --- RuPaul's Drag Race All Stars ---
  AS_S01: "AS-S01",
  AS_S02: "AS-S02",
  AS_S03: "AS-S03",
  AS_S04: "AS-S04",
  AS_S05: "AS-S05",
  AS_S06: "AS-S06",
  AS_S07: "AS-S07",
  AS_S08: "AS-S08",
  AS_S09: "AS-S09",
  AS_S10: "AS-S10",
  AS_S11: "AS-S11",

  // --- RuPaul's Drag Race UK ---
  UK_S01: "UK-S01",
  UK_S02: "UK-S02",
  UK_S03: "UK-S03",
  UK_S04: "UK-S04",
  UK_S05: "UK-S05",
  UK_S06: "UK-S06",

  // --- Drag Race Germany ---
  DE_S01: "DE-S01",

  // --- Drag Race France ---
  FR_S01: "FR-S01",
  FR_S02: "FR-S02",
  FR_S03: "FR-S03",
  FR_S04: "FR-S04",

  // --- RuPaul's Drag Race Global All Stars ---
  GAS_S01: "GAS-S01",

  // --- Canada's Drag Race ---
  CA_S01: "CA-S01",
  CA_S02: "CA-S02",
  CA_S03: "CA-S03",
  CA_S04: "CA-S04",
  CA_S05: "CA-S05",
  CA_S06: "CA-S06",

  // --- Canada's Drag Race vs The World ---
  CVTW_S01: "CVTW-S01",
  CVTW_S02: "CVTW-S02",

  // --- Canada's Drag Race All Stars ---
  CAS_S01: "CAS-S01",

  // --- Drag Race Down Under vs The World ---
  DUVTW_S01: "DUVTW-S01",

  // --- Drag Race Thailand ---
  TH_S01: "TH-S01",
  TH_S02: "TH-S02",
  TH_S03: "TH-S03",

  // --- Drag Race Philippines ---
  PH_S01: "PH-S01",
  PH_S02: "PH-S02",
  PH_S03: "PH-S03",
  PH_S04: "PH-S04",

  // --- Drag Race Philippines: Slaysian Royale ---
  PHSR_S01: "PHSR-S01",

  // --- Drag Race Italia ---
  IT_S01: "IT-S01",
  IT_S02: "IT-S02",
  IT_S03: "IT-S03",
  IT_S04: "IT-S04",

  // --- Drag Race Brasil ---
  BR_S01: "BR-S01",
  BR_S02: "BR-S02",

  // --- Drag Race México ---
  MX_S01: "MX-S01",
  MX_S02: "MX-S02",
  MX_S03: "MX-S03",

  // --- Drag Race México: Latina Royale ---
  MXLR_S01: "MXLR-S01",
} as const;

export type SeasonId = (typeof SeasonId)[keyof typeof SeasonId];

/** All SeasonId values — useful for Zod enums and exhaustive agent tooling. */
export const ALL_SEASON_IDS = Object.values(SeasonId) as SeasonId[];
