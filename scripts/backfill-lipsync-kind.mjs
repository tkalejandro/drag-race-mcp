#!/usr/bin/env node
/**
 * Backfill optional lipSync.kind on existing packs.
 * - AS-S01: for-your-life (weeks), for-the-crown (finale)
 * - AS-S02: for-the-win (weeks), for-the-crown (finale)
 * - Other packed seasons: for-the-crown on crowning finales only
 *   (do not mass-tag weekly elims as for-your-life)
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const seasonsDir = path.join(root, "src/data/seasons");

/** Clear crowning-finale titles — not Final Three / Final Four. */
const FINALE_TITLE =
  /\b(grande?\s+finale|grand\s+finale|crowning(?:\s+glory)?|sing\s+for\s+the\s+crown|lip\s*sync\s+for\s+the\s+crown|final\s+battle|take\s+me\s+to\s+heaven|queen\s+of\s+the\s+north|true\s+north|pop\s+queens\s+of\s+the\s+north|down\s+under\s+grand\s+finale|heart-stopping\s+finale|\bfinale\b)\b/i;

const FINAL_FOUR_THREE = /\bfinal\s+(three|four)\b/i;

const writeEpisodes = (seasonId, episodes) => {
  const file = path.join(seasonsDir, seasonId, "episodes.json");
  fs.writeFileSync(file, `${JSON.stringify(episodes, null, 2)}\n`);
};

const hasKind = (ls) => ls?.kind != null;

let asTagged = 0;
let finaleTagged = 0;
let stripped = 0;

const allDirs = fs
  .readdirSync(seasonsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// ─── Strip prior regular-season crowning tags (re-run safe) ─────────────────
for (const seasonId of allDirs) {
  if (["AS-S01", "AS-S02", "GAS-S01"].includes(seasonId)) continue;
  const file = path.join(seasonsDir, seasonId, "episodes.json");
  if (!fs.existsSync(file)) continue;
  const episodes = JSON.parse(fs.readFileSync(file, "utf8"));
  let changed = false;
  for (const ep of episodes) {
    if (ep.lipSync?.kind === "for-the-crown") {
      delete ep.lipSync.kind;
      stripped++;
      changed = true;
    }
  }
  if (changed) writeEpisodes(seasonId, episodes);
}

// ─── AS-S01 ───────────────────────────────────────────────────────────────────
{
  const id = "AS-S01";
  const file = path.join(seasonsDir, id, "episodes.json");
  const episodes = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const ep of episodes) {
    if (!ep.lipSync) continue;
    const next = ep.episodeNumber === 6 ? "for-the-crown" : "for-your-life";
    if (ep.lipSync.kind !== next) {
      ep.lipSync.kind = next;
      asTagged++;
    }
  }
  writeEpisodes(id, episodes);
}

// ─── AS-S02 ───────────────────────────────────────────────────────────────────
{
  const id = "AS-S02";
  const file = path.join(seasonsDir, id, "episodes.json");
  const episodes = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const ep of episodes) {
    if (!ep.lipSync) continue;
    const next = ep.episodeNumber === 8 ? "for-the-crown" : "for-the-win";
    if (ep.lipSync.kind !== next) {
      ep.lipSync.kind = next;
      asTagged++;
    }
  }
  writeEpisodes(id, episodes);
}

/**
 * Crowning LS only:
 * 1) Title looks like a finale/crowning (not Final Three/Four), or
 * 2) Lip sync is on one of the last two episodes of the season, crowns
 *    season.winnerId, and has no eliminatedIds (live finales without a
 *    recorded crown LS are intentionally left untagged).
 */
function pickCrowning(episodes, winnerId) {
  const withLipSync = episodes.filter((e) => e.lipSync && !hasKind(e.lipSync));
  if (withLipSync.length === 0) return null;

  const byTitle = withLipSync.filter(
    (e) =>
      FINALE_TITLE.test(e.title || "") && !FINAL_FOUR_THREE.test(e.title || ""),
  );

  if (byTitle.length === 1) return byTitle[0];
  if (byTitle.length > 1) {
    if (winnerId) {
      const crowners = byTitle.filter((e) =>
        (e.lipSync.winnerIds || []).includes(winnerId),
      );
      if (crowners.length) return crowners[crowners.length - 1];
    }
    return byTitle[byTitle.length - 1];
  }

  // Positional fallback: only near the end of the season.
  if (!winnerId) return null;
  const maxEp = Math.max(...episodes.map((e) => e.episodeNumber));
  const nearEnd = withLipSync.filter(
    (e) =>
      e.episodeNumber >= maxEp - 1 &&
      (e.lipSync.winnerIds || []).includes(winnerId) &&
      !(e.lipSync.eliminatedIds || []).length &&
      (e.lipSync.queenIds || []).length >= 2,
  );
  return nearEnd.length ? nearEnd[nearEnd.length - 1] : null;
}

for (const seasonId of allDirs) {
  if (["AS-S01", "AS-S02", "GAS-S01"].includes(seasonId)) continue;

  const seasonPath = path.join(seasonsDir, seasonId, "season.json");
  const episodesPath = path.join(seasonsDir, seasonId, "episodes.json");
  if (!fs.existsSync(seasonPath) || !fs.existsSync(episodesPath)) continue;

  const season = JSON.parse(fs.readFileSync(seasonPath, "utf8"));
  const episodes = JSON.parse(fs.readFileSync(episodesPath, "utf8"));
  if (!episodes.length) continue;

  const crowning = pickCrowning(episodes, season.winnerId);
  if (!crowning) continue;

  crowning.lipSync.kind = "for-the-crown";
  finaleTagged++;
  writeEpisodes(seasonId, episodes);
}

console.log(
  `AS updates: ${asTagged}; stripped prior crowns: ${stripped}; crowning finales tagged: ${finaleTagged}.`,
);
