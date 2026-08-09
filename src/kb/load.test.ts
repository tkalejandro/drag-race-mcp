import { strict as assert } from "node:assert";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { loadKnowledgeBase, resetKb } from "./load.ts";

const tempRoots: string[] = [];

const makeDataRoot = (): string => {
  const root = mkdtempSync(path.join(tmpdir(), "drag-race-kb-"));
  tempRoots.push(root);
  mkdirSync(path.join(root, "queens"));
  mkdirSync(path.join(root, "seasons"));
  return root;
};

afterEach(() => {
  resetKb();
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

const minimalQueen = (id: string, seasonId = "US-S01") => ({
  id,
  name: id,
  appearances: [
    {
      seasonId,
      placement: 1,
      challengeWins: [],
      miniChallengeWins: [],
      lipSyncWins: [],
      lipSyncLosses: [],
    },
  ],
});

const minimalSeason = (id: string, castIds: string[], episodeIds: string[]) => ({
  id,
  franchise: "US",
  name: `Test ${id}`,
  seasonNumber: 1,
  year: 2009,
  episodeCount: episodeIds.length,
  episodeIds,
  castIds,
  runnerUpIds: [],
  hosts: [{ name: "RuPaul" }],
  judges: [{ name: "RuPaul" }],
  isCharity: false,
  cashPrice: { amount: 0, currency: "USD" },
});

const minimalEpisode = (id: string, seasonId: string, episodeNumber: number) => ({
  id,
  seasonId,
  episodeNumber,
  title: `Episode ${episodeNumber}`,
});

const writeQueen = (root: string, queen: ReturnType<typeof minimalQueen>) => {
  writeFileSync(
    path.join(root, "queens", `${queen.id}.json`),
    JSON.stringify(queen, null, 2),
  );
};

const writeSeasonPack = (
  root: string,
  season: ReturnType<typeof minimalSeason>,
  episodes: ReturnType<typeof minimalEpisode>[],
  lore: { id: string; title: string; summary: string; tags: string[] }[] = [],
) => {
  const dir = path.join(root, "seasons", season.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "season.json"), JSON.stringify(season, null, 2));
  writeFileSync(
    path.join(dir, "episodes.json"),
    JSON.stringify(episodes, null, 2),
  );
  if (lore.length > 0) {
    writeFileSync(path.join(dir, "lore.json"), JSON.stringify(lore, null, 2));
  }
};

const writeValidMinimalKb = (root: string) => {
  const queen = minimalQueen("test-queen");
  writeQueen(root, queen);
  writeSeasonPack(
    root,
    minimalSeason("US-S01", ["test-queen"], ["US-S01-E01"]),
    [minimalEpisode("US-S01-E01", "US-S01", 1)],
    [
      {
        id: "test-lore",
        title: "Test lore",
        summary: "A test lore entry.",
        tags: ["iconic"],
      },
    ],
  );
};

describe("loadKnowledgeBase", () => {
  it("loads and validates the real knowledge base", () => {
    const kb = loadKnowledgeBase();

    assert.ok(kb.queens.size > 0, "expected at least one queen");
    assert.ok(kb.seasons.size > 0, "expected at least one season");
    assert.ok(kb.episodes.size > 0, "expected at least one episode");
    assert.ok(kb.lore.size > 0, "expected at least one lore entry");
  });

  it("loads a minimal valid fixture tree", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    const kb = loadKnowledgeBase(root);
    assert.equal(kb.queens.size, 1);
    assert.equal(kb.seasons.size, 1);
    assert.equal(kb.episodes.size, 1);
    assert.equal(kb.lore.size, 1);
  });

  it("rejects invalid Zod fields with file and field path", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    const badQueen = {
      ...minimalQueen("bad-queen"),
      appearances: [
        {
          seasonId: "US-S01",
          placement: "first",
          challengeWins: [],
          miniChallengeWins: [],
          lipSyncWins: [],
          lipSyncLosses: [],
        },
      ],
    };
    writeFileSync(
      path.join(root, "queens", "bad-queen.json"),
      JSON.stringify(badQueen, null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.match(err.message, /Invalid data:.*bad-queen\.json/);
        assert.match(err.message, /appearances\.0\.placement/);
        return true;
      },
    );
  });

  it("rejects queen file name that does not match id", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    writeFileSync(
      path.join(root, "queens", "wrong-name.json"),
      JSON.stringify(minimalQueen("actual-id"), null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /Queen file name must match id: expected "actual-id\.json", got "wrong-name\.json"/,
    );
  });

  it("rejects season folder name that does not match id", () => {
    const root = makeDataRoot();
    const queen = minimalQueen("test-queen");
    writeQueen(root, queen);

    const dir = path.join(root, "seasons", "WRONG-FOLDER");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, "season.json"),
      JSON.stringify(
        minimalSeason("US-S01", ["test-queen"], ["US-S01-E01"]),
        null,
        2,
      ),
    );
    writeFileSync(
      path.join(dir, "episodes.json"),
      JSON.stringify([minimalEpisode("US-S01-E01", "US-S01", 1)], null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /Season folder name must match id: expected "US-S01", got "WRONG-FOLDER"/,
    );
  });

  it("rejects duplicate episode ids", () => {
    const root = makeDataRoot();
    const queen = minimalQueen("test-queen");
    writeQueen(root, queen);
    writeSeasonPack(
      root,
      minimalSeason("US-S01", ["test-queen"], ["US-S01-E01", "US-S01-E01"]),
      [
        minimalEpisode("US-S01-E01", "US-S01", 1),
        minimalEpisode("US-S01-E01", "US-S01", 2),
      ],
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /Duplicate episode id "US-S01-E01"/,
    );
  });

  it("rejects duplicate lore ids across season packs", () => {
    const root = makeDataRoot();
    writeQueen(root, minimalQueen("queen-a", "US-S01"));
    writeQueen(root, minimalQueen("queen-b", "US-S02"));

    const lore = {
      id: "shared-lore",
      title: "Shared",
      summary: "Same id in two packs.",
      tags: ["iconic"],
    };

    writeSeasonPack(
      root,
      minimalSeason("US-S01", ["queen-a"], ["US-S01-E01"]),
      [minimalEpisode("US-S01-E01", "US-S01", 1)],
      [lore],
    );
    writeSeasonPack(
      root,
      minimalSeason("US-S02", ["queen-b"], ["US-S02-E01"]),
      [minimalEpisode("US-S02-E01", "US-S02", 1)],
      [lore],
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /Duplicate lore id "shared-lore"/,
    );
  });

  it("rejects PersonRef queenId that does not exist", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    const season = {
      ...minimalSeason("US-S01", ["test-queen"], ["US-S01-E01"]),
      hosts: [{ name: "Missing Host", queenId: "missing-host" }],
    };
    writeFileSync(
      path.join(root, "seasons", "US-S01", "season.json"),
      JSON.stringify(season, null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /season US-S01 hosts: queenId "missing-host" does not exist/,
    );
  });

  it("rejects duplicate appearances for the same season", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    const queen = {
      id: "test-queen",
      name: "test-queen",
      appearances: [
        ...minimalQueen("test-queen").appearances,
        ...minimalQueen("test-queen").appearances,
      ],
    };
    writeQueen(root, queen);

    assert.throws(
      () => loadKnowledgeBase(root),
      /queen "test-queen" has duplicate appearance for season "US-S01"/,
    );
  });

  it("rejects queens with no appearances", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    writeFileSync(
      path.join(root, "queens", "empty-queen.json"),
      JSON.stringify(
        { id: "empty-queen", name: "Empty Queen", appearances: [] },
        null,
        2,
      ),
    );
    const season = minimalSeason(
      "US-S01",
      ["test-queen", "empty-queen"],
      ["US-S01-E01"],
    );
    writeFileSync(
      path.join(root, "seasons", "US-S01", "season.json"),
      JSON.stringify(season, null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /queen "empty-queen" has no appearances/,
    );
  });

  it("rejects appearance that references a missing season pack", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);

    writeQueen(root, {
      ...minimalQueen("ghost-queen", "AS-S01"),
      id: "ghost-queen",
      name: "Ghost Queen",
    });
    const season = minimalSeason(
      "US-S01",
      ["test-queen", "ghost-queen"],
      ["US-S01-E01"],
    );
    writeFileSync(
      path.join(root, "seasons", "US-S01", "season.json"),
      JSON.stringify(season, null, 2),
    );

    assert.throws(
      () => loadKnowledgeBase(root),
      /queen "ghost-queen" appearance references missing season "AS-S01"/,
    );
  });

  it("rejects queens not referenced by castIds or PersonRef queenId", () => {
    const root = makeDataRoot();
    writeValidMinimalKb(root);
    writeQueen(root, minimalQueen("orphan-queen"));

    assert.throws(
      () => loadKnowledgeBase(root),
      /queen "orphan-queen" is not referenced by any castIds or PersonRef queenId/,
    );
  });
});
