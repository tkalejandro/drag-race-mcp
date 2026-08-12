#!/usr/bin/env node
/** Cross-check a season pack vs queen files. Usage: node scripts/cross-check-season.mjs <seasonId> */
import fs from "fs";
import path from "path";

const seasonId = process.argv[2];
const seasonDir = path.resolve("src/data/seasons", seasonId);
const queensDir = path.resolve("src/data/queens");
const season = JSON.parse(fs.readFileSync(path.join(seasonDir, "season.json"), "utf8"));
const episodes = JSON.parse(fs.readFileSync(path.join(seasonDir, "episodes.json"), "utf8"));
const lore = JSON.parse(fs.readFileSync(path.join(seasonDir, "lore.json"), "utf8"));
const errors = [];

const queens = {};
for (const id of season.castIds) {
  const file = path.join(queensDir, `${id}.json`);
  if (!fs.existsSync(file)) {
    errors.push(`missing queen file ${id}`);
    continue;
  }
  queens[id] = JSON.parse(fs.readFileSync(file, "utf8"));
}

if (JSON.stringify(episodes.map((e) => e.id)) !== JSON.stringify(season.episodeIds)) {
  errors.push("episodeIds mismatch");
}
if (season.episodeCount !== episodes.length) errors.push("episodeCount mismatch");

for (const id of season.castIds) {
  const q = queens[id];
  if (!q) continue;
  const a = q.appearances.find((x) => x.seasonId === seasonId);
  if (!a) errors.push(`${id} missing appearance`);
  else if (!Array.isArray(a.lipSyncLosses)) errors.push(`${id} missing lipSyncLosses`);
}

for (const ep of episodes) {
  for (const id of ep.maxiChallenge?.winnerIds || []) {
    const a = queens[id]?.appearances.find((x) => x.seasonId === seasonId);
    if (!a?.challengeWins.some((w) => w.episodeId === ep.id)) {
      errors.push(`${id} missing challengeWin ${ep.id}`);
    }
  }
  for (const id of ep.miniChallenge?.winnerIds || []) {
    const a = queens[id]?.appearances.find((x) => x.seasonId === seasonId);
    if (!a?.miniChallengeWins.some((w) => w.episodeId === ep.id)) {
      errors.push(`${id} missing miniWin ${ep.id}`);
    }
  }
  const ls = ep.lipSync;
  if (!ls) continue;
  const winners = new Set(ls.winnerIds || []);
  if (winners.size === 0 && !(ls.eliminatedIds || []).length) continue;
  if (winners.size === 0) {
    for (const id of ls.eliminatedIds || []) {
      const a = queens[id]?.appearances.find((x) => x.seasonId === seasonId);
      if (!a?.lipSyncLosses.some((w) => w.episodeId === ep.id)) {
        errors.push(`${id} should lose lipsync ${ep.id} (double sashay)`);
      }
    }
    continue;
  }
  for (const id of ls.queenIds) {
    // Guest Lip Sync Assassins (etc.) appear in queenIds but not castIds —
    // require a queen file, skip appearance win/loss mirroring.
    if (!season.castIds.includes(id)) {
      if (!fs.existsSync(path.join(queensDir, `${id}.json`))) {
        errors.push(`${id} guest lipsync participant missing queen file (${ep.id})`);
      }
      continue;
    }
    const a = queens[id]?.appearances.find((x) => x.seasonId === seasonId);
    const hasWin = a?.lipSyncWins.some((w) => w.episodeId === ep.id);
    const hasLoss = a?.lipSyncLosses.some((w) => w.episodeId === ep.id);
    if (winners.has(id)) {
      if (!hasWin) errors.push(`${id} should win lipsync ${ep.id}`);
      if (hasLoss) errors.push(`${id} should not lose ${ep.id}`);
    } else {
      if (!hasLoss) errors.push(`${id} should lose lipsync ${ep.id}`);
      if (hasWin) errors.push(`${id} should not win ${ep.id}`);
    }
  }
}

for (const entry of lore) {
  for (const id of entry.queenIds || []) {
    if (!queens[id] && !fs.existsSync(path.join(queensDir, `${id}.json`))) {
      errors.push(`lore ${entry.id} bad queen ${id}`);
    }
  }
  for (const id of entry.episodeIds || []) {
    if (!season.episodeIds.includes(id)) errors.push(`lore ${entry.id} bad episode ${id}`);
  }
}

if (errors.length) {
  console.error("FAIL", seasonId);
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}
console.log("OK", seasonId);
