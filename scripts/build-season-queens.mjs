#!/usr/bin/env node
/**
 * Builds/updates queen JSON from a season pack.
 * Usage: node scripts/build-season-queens.mjs <seasonId>
 * Requires: src/data/seasons/<id>/{season,episodes,queensMeta}.json
 * Deletes queensMeta.json after a successful run (build artifact only).
 */
import fs from "fs";
import path from "path";

const seasonId = process.argv[2];
if (!seasonId) {
  console.error("Usage: node scripts/build-season-queens.mjs <seasonId>");
  process.exit(1);
}

const seasonDir = path.resolve("src/data/seasons", seasonId);
const queensDir = path.resolve("src/data/queens");
const season = JSON.parse(fs.readFileSync(path.join(seasonDir, "season.json"), "utf8"));
const episodes = JSON.parse(fs.readFileSync(path.join(seasonDir, "episodes.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(seasonDir, "queensMeta.json"), "utf8"));

const byQueen = {};
for (const id of season.castIds) {
  if (!meta[id]) throw new Error(`Missing queensMeta for ${id}`);
  byQueen[id] = {
    challengeWins: [],
    miniChallengeWins: [],
    lipSyncWins: [],
    lipSyncLosses: [],
    eliminatedEpisodeId: undefined,
  };
}

for (const ep of episodes) {
  for (const id of ep.maxiChallenge?.winnerIds || []) {
    byQueen[id].challengeWins.push({ episodeId: ep.id, name: ep.maxiChallenge.name });
  }
  for (const id of ep.miniChallenge?.winnerIds || []) {
    byQueen[id].miniChallengeWins.push({ episodeId: ep.id, name: ep.miniChallenge.name });
  }
  const ls = ep.lipSync;
  if (!ls) continue;
  const winners = new Set(ls.winnerIds || []);
  // Deferred crowning / no announced lip-sync outcome: skip win-loss mirroring
  if (winners.size === 0 && !(ls.eliminatedIds || []).length) continue;
  // Double sashay (or any elim with empty winners): record losses for eliminated only
  if (winners.size === 0) {
    for (const id of ls.eliminatedIds || []) {
      byQueen[id].lipSyncLosses.push({ episodeId: ep.id, song: ls.song });
      byQueen[id].eliminatedEpisodeId = ep.id;
    }
    continue;
  }
  for (const id of ls.queenIds) {
    const entry = { episodeId: ep.id, song: ls.song };
    if (winners.has(id)) byQueen[id].lipSyncWins.push(entry);
    else byQueen[id].lipSyncLosses.push(entry);
  }
  for (const id of ls.eliminatedIds || []) {
    byQueen[id].eliminatedEpisodeId = ep.id;
  }
}

for (const id of season.castIds) {
  const m = meta[id];
  const stats = byQueen[id];
  const appearance = {
    seasonId,
    placement: m.placement,
    challengeWins: stats.challengeWins,
    miniChallengeWins: stats.miniChallengeWins,
    lipSyncWins: stats.lipSyncWins,
    lipSyncLosses: stats.lipSyncLosses,
  };

  const elim = m.eliminatedEpisodeId || stats.eliminatedEpisodeId;
  if (elim && m.placement > 2) appearance.eliminatedEpisodeId = elim;
  if (m.missCongeniality) appearance.missCongeniality = true;
  if (m.quit) appearance.quit = true;
  if (m.disqualified) appearance.disqualified = true;
  if (m.reentered) appearance.reentered = true;

  const file = path.join(queensDir, `${id}.json`);
  let queen;
  if (fs.existsSync(file)) {
    queen = JSON.parse(fs.readFileSync(file, "utf8"));
    queen.appearances = queen.appearances.filter((a) => a.seasonId !== seasonId);
    queen.appearances.push(appearance);
    if (m.aliases?.length) {
      queen.aliases = [...new Set([...(queen.aliases || []), ...m.aliases])];
    }
  } else {
    queen = {
      id,
      name: m.name,
      ...(m.aliases?.length ? { aliases: m.aliases } : {}),
      appearances: [appearance],
    };
  }
  fs.writeFileSync(file, JSON.stringify(queen, null, 2) + "\n");
}

fs.unlinkSync(path.join(seasonDir, "queensMeta.json"));
console.log(`Wrote ${season.castIds.length} queens for ${seasonId}; removed queensMeta.json`);
