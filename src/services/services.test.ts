/**
 * Unit tests for service-layer utilities.
 */

import { strict as assert } from "node:assert";
import { afterEach, describe, it } from "node:test";
import { getKb, resetKb } from "../kb/load.ts";
import { originRegionsForCountries } from "../kb/origin.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  compareQueens,
  getQueenEarnings,
  getQueenStats,
  listCatalogs,
  listQueensAsHosts,
  listQueensAsJudges,
  listSeasonIds,
  listWinners,
  rankQueensByEarnings,
  searchEpisodes,
  searchLore,
  searchQueens,
} from "./index.ts";

afterEach(() => {
  resetKb();
});

describe("listSeasonIds", () => {
  it("returns all loaded seasons when region is omitted", () => {
    const ids = listSeasonIds();
    assert.ok(ids.includes("US-S01"));
    assert.ok(ids.includes("UK-S01"));
    assert.ok(ids.includes("CA-S01"));
  });

  it("filters by region", () => {
    const uk = listSeasonIds({ region: "uk" });
    assert.ok(uk.every((id) => id.startsWith("UK-") || id.startsWith("UKVTW-")));
    assert.ok(uk.includes("UK-S01"));
    assert.ok(uk.includes("UK-S07"));
    assert.ok(uk.includes("UKVTW-S01"));

    const us = listSeasonIds({ region: "us" });
    assert.ok(us.includes("US-S01"));
    assert.ok(us.includes("AS-S01"));
    assert.ok(!us.some((id) => id.startsWith("UK-") || id.startsWith("UKVTW-")));
  });

  it("filters by franchise independently of region", () => {
    const france = listSeasonIds({ franchise: "FR" });
    assert.ok(france.length > 0);
    assert.ok(france.every((id) => id.startsWith("FR-")));
    assert.ok(!france.some((id) => id.startsWith("ES-")));

    const europe = listSeasonIds({ region: "europe" });
    assert.ok(europe.some((id) => id.startsWith("FR-")));
    assert.ok(europe.some((id) => id.startsWith("ES-")));
    assert.notDeepEqual(france, europe);
  });
});

describe("listCatalogs", () => {
  it("maps france alias to franchise FR, not a region", () => {
    const franchises = listCatalogs("franchises");
    const france = franchises.find((row) => row.code === "FR");
    assert.ok(france);
    assert.ok(france.aliases?.some((alias) => alias.includes("france")));
    assert.equal(france.region, "europe");
  });

  it("maps latin america aliases to origin_regions, not Spain", () => {
    const origins = listCatalogs("origin_regions");
    const latam = origins.find((row) => row.code === "latin_america");
    assert.ok(latam);
    assert.ok(latam.aliases?.includes("latinas"));
    const iberia = origins.find((row) => row.code === "iberia");
    assert.ok(iberia);
  });
});

describe("searchQueens", () => {
  it("finds queens by name substring", () => {
    const hits = searchQueens({ query: "jinkx" });
    assert.ok(hits.some((hit) => hit.id === "jinkx-monsoon"));
  });

  it("respects limit", () => {
    const hits = searchQueens({ query: "a", limit: 3 });
    assert.ok(hits.length <= 3);
  });

  it("defaults to DEFAULT_SEARCH_LIMIT", () => {
    const hits = searchQueens({ query: "e" });
    assert.ok(hits.length <= DEFAULT_SEARCH_LIMIT);
  });

  it("originRegion latin_america excludes Spain and includes Mexican origin", () => {
    const hits = searchQueens({
      originRegion: "latin_america",
      limit: 50,
    });
    assert.ok(hits.some((hit) => hit.id === "lolita-banana"));
    assert.ok(!hits.some((hit) => hit.id === "carmen-farala"));
    assert.deepEqual(originRegionsForCountries(["ES"]), ["europe", "iberia"]);
  });

  it("filters by franchise and originRegion together", () => {
    const hits = searchQueens({
      franchise: "FR",
      originRegion: "latin_america",
      limit: 50,
    });
    assert.ok(hits.some((hit) => hit.id === "lolita-banana"));
    assert.ok(!hits.some((hit) => hit.id === "carmen-farala"));
    assert.ok(!hits.some((hit) => hit.id === "nicky-doll"));
  });
});

describe("searchLore", () => {
  it("finds lore by query substring", () => {
    const hits = searchLore({ query: "porkchop" });
    assert.ok(hits.length > 0);
    assert.ok(
      hits.some(
        (lore) =>
          lore.title.toLowerCase().includes("porkchop") ||
          lore.summary.toLowerCase().includes("porkchop"),
      ),
    );
  });

  it("filters by seasonId", () => {
    const hits = searchLore({ seasonId: "US-S01", limit: 50 });
    assert.ok(hits.length > 0);
    assert.ok(hits.every((lore) => lore.seasonIds?.includes("US-S01")));
  });
});

describe("getQueenEarnings", () => {
  it("sums documented cash tips for a queen with earnings", () => {
    const earnings = getQueenEarnings("sami-landri");
    assert.ok(earnings);
    assert.ok(
      earnings.cashTotal.some((t) => t.currency === "CAD" && t.amount >= 7500),
    );
    assert.ok(earnings.breakdown.length >= 2);
  });

  it("includes season purse for a crowned winner", () => {
    const earnings = getQueenEarnings("jaida-essence-hall");
    assert.ok(earnings);
    assert.ok(earnings.breakdown.some((b) => b.kind === "seasonPurse"));
    assert.ok(
      earnings.cashTotal.some((t) => t.currency === "USD" && t.amount >= 100000),
    );
  });

  it("returns undefined for unknown queen", () => {
    assert.equal(getQueenEarnings("not-a-real-queen"), undefined);
  });
});

describe("rankQueensByEarnings", () => {
  it("ranks USD cash in-process without N client calls", () => {
    const boards = rankQueensByEarnings({ currency: "USD", limit: 50 });
    assert.equal(boards.length, 1);
    const usd = boards[0];
    assert.ok(usd);
    assert.equal(usd.currency, "USD");
    assert.ok(usd.results.length > 0);
    assert.ok(usd.results.length <= 50);
    const top = usd.results[0];
    assert.ok(top);
    assert.equal(top.rank, 1);
    assert.ok(top.amount > 0);
    for (let index = 1; index < usd.results.length; index += 1) {
      const previousAmount: number = usd.results[index - 1]?.amount ?? 0;
      const currentAmount: number = usd.results[index]?.amount ?? 0;
      assert.ok(previousAmount >= currentAmount);
    }
    assert.ok(
      usd.results.some(
        (row) => row.queenId === "jaida-essence-hall" && row.amount >= 100000,
      ),
    );
  });
});

describe("queen stats and compare", () => {
  it("getQueenStats includes origin regions for Nicky Doll as France, not Spain", () => {
    const stats = getQueenStats("nicky-doll");
    assert.ok(stats);
    assert.ok(stats.origin.countries.includes("FR"));
    assert.ok(stats.originRegions.includes("europe"));
    assert.ok(!stats.originRegions.includes("latin_america"));
    assert.ok(!stats.originRegions.includes("iberia"));
  });

  it("compareQueens returns side-by-side rows", () => {
    const rows = compareQueens(["jinkx-monsoon", "jaida-essence-hall"]);
    assert.equal(rows.length, 2);
    assert.ok(rows.some((row) => row.queenId === "jinkx-monsoon"));
  });
});

describe("alumni hosts and judges", () => {
  it("lists Nicky Doll as France host", () => {
    const hosts = listQueensAsHosts({ franchise: "FR" });
    assert.ok(
      hosts.some(
        (row) => row.queenId === "nicky-doll" && row.seasonId === "FR-S01",
      ),
    );
    assert.ok(hosts.some((row) => row.seasonId === "FR-S02"));
    assert.ok(hosts.some((row) => row.seasonId === "FR-S03"));
  });

  it("lists Nicky Doll as panel judge on France and guest on Thailand", () => {
    const judges = listQueensAsJudges({ franchise: "FR" });
    assert.ok(
      judges.some(
        (row) =>
          row.queenId === "nicky-doll" &&
          row.role === "panel" &&
          row.seasonId === "FR-S01",
      ),
    );
    const thaiGuest = listQueensAsJudges({ franchise: "TH" });
    assert.ok(
      thaiGuest.some(
        (row) =>
          row.queenId === "nicky-doll" &&
          row.role === "guest" &&
          row.episodeId === "TH-S03-E08",
      ),
    );
  });
});

describe("listWinners and searchEpisodes", () => {
  it("lists US-S12 winner", () => {
    const winners = listWinners({ seasonId: "US-S12" });
    assert.equal(winners.length, 1);
    assert.ok(winners[0]?.winnerIds.includes("jaida-essence-hall"));
  });

  it("searches episode titles", () => {
    const hits = searchEpisodes({ query: "grand finale", limit: 10 });
    assert.ok(hits.length > 0);
    assert.ok(hits.every((hit) => hit.title && hit.episodeId && hit.seasonId));
  });
});

describe("origin integrity", () => {
  it("every loaded queen has at least one origin country", () => {
    for (const queen of getKb().queens.values()) {
      assert.ok(
        queen.origin.countries.length >= 1,
        `${queen.id} missing origin.countries`,
      );
    }
  });
});
