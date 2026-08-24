import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

/** Sourced Wikipedia/Fandom nationality — birth country first. */
const PATCHES = {
  // US franchise
  "jiggly-caliente": ["PH", "US"],
  "yuhua-hamasaki": ["CN", "US"],
  "soju": ["KR", "US"],
  "serena-chacha": ["PA", "US"],
  "kenya-michaels": ["PR", "US"],
  "kandy-ho": ["PR", "US"],
  "cynthia-lee-fontaine": ["PR", "US"],
  "alyssa-hunter": ["PR", "US"],
  "lucky-starzzz": ["CU", "US"],
  "geneva-karr": ["MX", "US"],
  "aura-mayari": ["PH", "US"],
  "lady-camden": ["GB"],
  "rose": ["GB", "US"],
  "courtney-act": ["AU"],
  "jackie-cox": ["CA"],
  "gia-gunn": ["JP", "US"],
  "kim-chi": ["KR", "US"],
  "rock-m-sakura": ["PH", "VN", "US"],
  "charlie-hides": ["US", "GB", "IE"],
  "carmen-carrera": ["PR", "PE", "US"],
  "plastique-tiara": ["VN", "US"],
  "nina-flowers": ["PR"],
  "nymphia-wind": ["US", "TW"],
  "raja": ["ID", "NL", "US"],
  "bebe-zahara-benet": ["CM", "US"],
  "honey-mahogany": ["ET", "US"],
  "bianca-del-rio": ["HN", "CU", "US"],
  "kandy-muse": ["DO", "US"],
  "morphine-love-dion": ["NI", "US"],
  "morgan-mcmichaels": ["GB", "US"],
  "vivacious": ["JM", "US"],
  "mercedes-iman-diamond": ["KE", "US"],
  "naysha-lopez": ["PR", "US"],
  "jax": ["PR", "US"],
  "mistress-isabelle-brooks": ["MX", "US"],
  "jorgeous": ["MX", "US"],
  "jessica-wild": ["PR", "US"],
  "alexis-mateo": ["PR", "US"],
  "yara-sofia": ["PR", "US"],
  "lineysha-sparx": ["PR", "US"],
  "april-carrion": ["PR", "US"],
  "madame-laqueer": ["PR", "US"],

  // Down Under
  "hollywould-star": ["US", "AU"],
  "yuri-guaii": ["NZ"],
  "kween-kong": ["NZ"],
  "coco-jumbo": ["FJ", "AU"],

  // UK / Canada / France
  "zahirah-zapanta": ["PH", "GB"],
  "cara-melle": ["US", "GB"],
  "bombae": ["IN", "CA"],
  "minhi-wang": ["AU", "CA"],
  "kimmy-couture": ["PH", "CA"],
  "priyanka": ["GY", "CA"],
  "le-filip": ["HR", "FR"],
  "la-kahena": ["TN", "FR"],
  "keiona": ["FR", "CI"],

  // España
  "inti": ["BO", "ES"],
  "diamante-merybrown": ["DO", "ES"],
  "maria-edilia": ["VE", "ES"],
  "visa": ["MX", "ES"],

  // Remaining franchises
  "envy-peru": ["PE", "NL"],
  "vanda-miss-joaquim": ["SG"],
};

const queensDir = path.resolve("src/data/queens");
let updated = 0;
for (const [id, countries] of Object.entries(PATCHES)) {
  const filePath = path.join(queensDir, `${id}.json`);
  const queen = JSON.parse(readFileSync(filePath, "utf8"));
  const prev = queen.origin?.countries ?? [];
  if (JSON.stringify(prev) === JSON.stringify(countries)) continue;
  queen.origin = { ...queen.origin, countries };
  writeFileSync(filePath, `${JSON.stringify(queen, null, 2)}\n`);
  console.log(`${id}: ${prev.join("+")} -> ${countries.join("+")}`);
  updated += 1;
}
console.log(`updated ${updated}`);
