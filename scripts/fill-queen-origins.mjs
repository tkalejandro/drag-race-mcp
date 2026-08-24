import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("src/data");
const queensDir = path.join(root, "queens");
const seasonsDir = path.join(root, "seasons");

const FRANCHISE_COUNTRY = {
  US: "US",
  AS: "US",
  UK: "GB",
  UKVTW: "GB",
  CA: "CA",
  CVTW: "CA",
  CAS: "CA",
  DU: "AU",
  DUVTW: "AU",
  TH: "TH",
  PH: "PH",
  PHSR: "PH",
  ES: "ES",
  ESAS: "ES",
  MX: "MX",
  MXLR: "MX",
  BR: "BR",
  IT: "IT",
  FR: "FR",
  DE: "DE",
  NL: "NL",
  BE: "BE",
  SE: "SE",
};

/** Wikipedia/Fandom nationality overrides (not franchise-as-proxy). */
const EXCEPTIONS = {
  "nicky-doll": ["FR"],
  "pangina-heals": ["TH"],
  "bebe-zahara-benet": ["CM"],
  "yara-sofia": ["PR"],
  "alexis-mateo": ["PR"],
  "nina-flowers": ["MX"],
  "jessica-wild": ["PR"],
  "lineysha-sparx": ["PR"],
  "april-carrion": ["PR"],
  "madame-laqueer": ["PR"],
  "vanessa-vanjie-mateo": ["PR", "US"],
  "plastique-tiara": ["TH", "US"],
  "nymphia-wind": ["TW"],
  "ongina": ["PH", "US"],
  "manila-luzon": ["PH", "US"],
  "jujubee": ["US", "LA"],
  "raja": ["ID", "US"],
  "valentina": ["MX", "US"],
  "crystal-methyd": ["MX", "US"],
  "choriza-may": ["ES"],
  "kita-mean": ["NZ"],
  "anita-wiglit": ["NZ"],
  "spankie-jackzon": ["NZ"],
  "elektra-shock": ["NZ"],
  "jojo-zane": ["NZ"],
  "hannah-conda": ["AU"],
  "soa-de-muse": ["MQ", "FR"],
  "lolita-banana": ["MX", "FR"],
  "kam-hugh": ["FR"],
  "leona-winter": ["FR"],
  "ruby-on-the-nail": ["BE"],
  "the-countess": ["NL"],
  "enya-the-dutch-destroyer": ["NL"],
  "vanity-milan": ["JM", "GB"],
  "tayce": ["GB"],
  "blu-hydrangea": ["GB", "IE"],
  "divina-de-campo": ["GB"],
  "the-vivienne": ["GB"],
  "bimini-bon-boulash": ["GB"],
  "lawrence-chaney": ["GB"],
  "priyanka": ["CA"],
  "brooke-lynn-hytes": ["CA"],
  "rita-baga": ["CA"],
  "anastarzia-anaquway": ["JM", "CA"],
  "icesis-couture": ["CA"],
  "kimmy-couture": ["CA", "VN"],
  "suki-doll": ["CA", "CN"],
  "ilona-verley": ["CA"],
  "gala-varo": ["MX"],
  "carmen-farala": ["ES"],
  "killer-queen": ["ES"],
  "sagittaria": ["ES"],
  "marcia-marcia-marcia": ["AU"],
  "kween-kong": ["AU"],
  "isis-avis-loren": ["AU"],
  "marina-summers": ["PH"],
  "minnie-cooper": ["NZ"],
  "hugo-gato": ["UY", "ES"],
  "supremme-de-luxe": ["ES"],
  "pupi-poisson": ["AR", "ES"],
  "sharonne": ["ES"],
  "venedita-von-doe": ["VE", "ES"],
  "juriji-der-klee": ["DE", "ES"],
  "ariah-paris-vanhea": ["BE"],
  "peach": ["BE"],
  "susan": ["BE"],
  "mademoiselle-boop": ["BE"],
  "drag-couenne": ["BE"],
  "athena-sorgelikis": ["BE"],
  "edina-cloud": ["SE"],
  "fontana": ["BR", "SE"],
  "admira-thunderpussy": ["SE"],
  "antonina-nutshell": ["PL", "SE"],
  "elecktra": ["IT"],
  "diva": ["IT"],
  "la-diamond": ["IT"],
  "nehellenia": ["IT"],
  "luquisha-lubamba": ["IT"],
  "ava-hangar": ["IT"],
  "organzza": ["BR"],
  "hellena-malditta": ["BR"],
  "shannon-skarllet": ["MX"],
  "cristian-peralta": ["MX"],
  "regina-voce": ["MX"],
  "lady-kero": ["MX"],
  "matraaka": ["MX"],
  "matraka": ["MX"],
  "turing": ["MX"],
  "unique": ["MX"],
  "giammetta": ["MX"],
  "fifa-the-drag-queen": ["DE"],
  "pandora-nox": ["AT", "DE"],
  "kelly-heelton": ["DE"],
  "victoria-shakespears": ["DE"],
  "the-only-naomie": ["CM", "DE"],
  "tessa-testicle": ["CH", "DE"],
  "yudit-vega": ["CL", "ES"],
  "ariana-matrix": ["US"],
  "plane-jane": ["US", "LV"],
  "sapphira-cristal": ["US"],
  "sasha-colby": ["US"],
  "anetra": ["US"],
  "luxx-noir-london": ["US"],
  "mistress-isabelle-brooks": ["US"],
  "spice": ["US"],
  "sugar": ["US"],
  "jax": ["US"],
  "aura-mayari": ["PR", "US"],
  "salina-escondida": ["US"],
  "malaysia-babydoll-foxx": ["US"],
  "mirage": ["US"],
  "plasma": ["US"],
  "q": ["US"],
  "morphine-love-dion": ["US"],
  "dawn": ["US"],
  "mhiya-iman-lepaige": ["US"],
  "xunami-muse": ["US"],
  "amethyst": ["US"],
  "lucky-starzzz": ["US"],
  "suzie-toot": ["US"],
  "jewels-sparkles": ["US"],
  "lexia-love": ["US"],
  "sam-star": ["US"],
  "onyx-nurve": ["US"],
  "kori-king": ["US"],
  "acacia-forgot": ["US"],
  "arrietty": ["US"],
  "lydia-b-kollins": ["US"],
  "hormona-lisa": ["US"],
  "joella": ["US"],
};

const SKIP_FRANCHISE = new Set(["GAS", "AS", "UKVTW", "CVTW", "DUVTW", "ESAS", "MXLR", "PHSR", "CAS"]);

const seasonFranchise = new Map();
for (const folder of readdirSync(seasonsDir)) {
  const seasonPath = path.join(seasonsDir, folder, "season.json");
  try {
    const season = JSON.parse(readFileSync(seasonPath, "utf8"));
    seasonFranchise.set(season.id, season.franchise);
  } catch {
    // skip missing packs
  }
}

const defaultCountry = (appearances) => {
  const franchises = [];
  for (const appearance of appearances ?? []) {
    const franchise = seasonFranchise.get(appearance.seasonId);
    if (franchise) franchises.push(franchise);
  }
  const preferred = franchises.find((f) => !SKIP_FRANCHISE.has(f)) ?? franchises[0];
  return preferred ? FRANCHISE_COUNTRY[preferred] : undefined;
};

let filled = 0;
const missing = [];
for (const file of readdirSync(queensDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(queensDir, file);
  const queen = JSON.parse(readFileSync(filePath, "utf8"));
  const countries = EXCEPTIONS[queen.id] ?? (defaultCountry(queen.appearances)
    ? [defaultCountry(queen.appearances)]
    : undefined);
  if (!countries) {
    missing.push(queen.id);
    continue;
  }
  const { appearances, origin: _old, ...rest } = queen;
  const next = {
    ...rest,
    origin: { countries },
    appearances,
  };
  writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
  filled += 1;
}

console.log(`filled ${filled}`);
if (missing.length) {
  console.error(`missing ${missing.length}: ${missing.join(", ")}`);
  process.exit(1);
}
