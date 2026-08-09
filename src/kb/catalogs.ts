/**
 * Closed ID catalogs and labels for the knowledge base.
 * Entity record shapes live in schemas/ (Zod + z.infer).
 */

/** Stable queen identifier (kebab-case slug), e.g. "jinkx-monsoon". */
export type QueenId = string;

/** Stable episode identifier (`{SeasonId}-E{NN}`). */
export type EpisodeId = string;

/** Stable lore identifier (kebab-case slug). */
export type LoreId = string;

/** Franchise prefix codes embedded in every SeasonId. */
export const FranchiseCode = {
  US: "US",
  AS: "AS",
  UK: "UK",
  DE: "DE",
  FR: "FR",
  NL: "NL",
  BE: "BE",
  SE: "SE",
  ES: "ES",
  ESAS: "ESAS",
  GAS: "GAS",
  CA: "CA",
  CVTW: "CVTW",
  CAS: "CAS",
  DUVTW: "DUVTW",
  TH: "TH",
  PH: "PH",
  PHSR: "PHSR",
  IT: "IT",
  BR: "BR",
  MX: "MX",
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
  NL: "Drag Race Holland",
  BE: "Drag Race Belgique",
  SE: "Drag Race Sverige",
  ES: "Drag Race España",
  ESAS: "Drag Race España All Stars",
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
 * Every known season ID (as of 2026-08).
 * Format: `{FRANCHISE}-S{NN}`
 */
export const SeasonId = {
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

  UK_S01: "UK-S01",
  UK_S02: "UK-S02",
  UK_S03: "UK-S03",
  UK_S04: "UK-S04",
  UK_S05: "UK-S05",
  UK_S06: "UK-S06",
  UK_S07: "UK-S07",

  DE_S01: "DE-S01",

  FR_S01: "FR-S01",
  FR_S02: "FR-S02",
  FR_S03: "FR-S03",
  FR_S04: "FR-S04",

  NL_S01: "NL-S01",
  NL_S02: "NL-S02",

  BE_S01: "BE-S01",
  BE_S02: "BE-S02",

  SE_S01: "SE-S01",

  ES_S01: "ES-S01",
  ES_S02: "ES-S02",
  ES_S03: "ES-S03",
  ES_S04: "ES-S04",
  ES_S05: "ES-S05",

  ESAS_S01: "ESAS-S01",
  ESAS_S02: "ESAS-S02",

  GAS_S01: "GAS-S01",

  CA_S01: "CA-S01",
  CA_S02: "CA-S02",
  CA_S03: "CA-S03",
  CA_S04: "CA-S04",
  CA_S05: "CA-S05",
  CA_S06: "CA-S06",

  CVTW_S01: "CVTW-S01",
  CVTW_S02: "CVTW-S02",

  CAS_S01: "CAS-S01",

  DUVTW_S01: "DUVTW-S01",

  TH_S01: "TH-S01",
  TH_S02: "TH-S02",
  TH_S03: "TH-S03",

  PH_S01: "PH-S01",
  PH_S02: "PH-S02",
  PH_S03: "PH-S03",
  PH_S04: "PH-S04",

  PHSR_S01: "PHSR-S01",

  IT_S01: "IT-S01",
  IT_S02: "IT-S02",
  IT_S03: "IT-S03",

  BR_S01: "BR-S01",
  BR_S02: "BR-S02",

  MX_S01: "MX-S01",
  MX_S02: "MX-S02",
  MX_S03: "MX-S03",

  MXLR_S01: "MXLR-S01",
} as const;

export type SeasonId = (typeof SeasonId)[keyof typeof SeasonId];

export const ALL_SEASON_IDS = Object.values(SeasonId) as SeasonId[];

/** ISO 4217 currency codes used across Drag Race franchises. */
export const Currency = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  CAD: "CAD",
  AUD: "AUD",
  NZD: "NZD",
  THB: "THB",
  MXN: "MXN",
  BRL: "BRL",
  SEK: "SEK",
  PHP: "PHP",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

/** Soft tags for lore filtering and agent routing. */
export const LoreTag = {
  RIVALRY: "rivalry",
  DRAMA: "drama",
  COMEDY: "comedy",
  ICONIC: "iconic",
  CONTROVERSY: "controversy",
  UNDERDOG: "underdog",
  VILLAIN: "villain",
  SISTERHOOD: "sisterhood",
  HEARTBREAK: "heartbreak",

  READING: "reading",
  LIP_SYNC: "lip-sync",
  SNATCH_GAME: "snatch-game",
  BALL: "ball",
  MAKEOVER: "makeover",
  RUNWAY: "runway",
  QUOTE: "quote",
  UNTUCKED: "untucked",
  REUNION: "reunion",
  FINALE: "finale",

  CROWN: "crown",
  PORKCHOP: "porkchop",
  DOUBLE_SHANTAY: "double-shantay",
  DOUBLE_SASHAY: "double-sashay",
  FAN_FAVORITE: "fan-favorite",
  ROBBED: "robbed",
  RETURN: "return",
  QUIT: "quit",
  TWIST: "twist",

  DRAG_FAMILY: "drag-family",
  CROSSOVER: "crossover",
  ALL_STARS: "all-stars",
  VS_THE_WORLD: "vs-the-world",
  INTERNATIONAL: "international",
  PRODUCTION: "production",
  JUDGES: "judges",
} as const;

export type LoreTag = (typeof LoreTag)[keyof typeof LoreTag];
