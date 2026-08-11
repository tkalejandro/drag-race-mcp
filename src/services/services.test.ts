/**
 * Unit tests for service-layer utilities.
 */

import { strict as assert } from "node:assert";
import { afterEach, describe, it } from "node:test";
import { resetKb } from "../kb/load.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  listSeasonIds,
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
});

describe("searchQueens", () => {
  it("finds queens by name substring", () => {
    const hits = searchQueens("jinkx");
    assert.ok(hits.some((hit) => hit.id === "jinkx-monsoon"));
  });

  it("respects limit", () => {
    const hits = searchQueens("a", { limit: 3 });
    assert.ok(hits.length <= 3);
  });

  it("defaults to DEFAULT_SEARCH_LIMIT", () => {
    const hits = searchQueens("e");
    assert.ok(hits.length <= DEFAULT_SEARCH_LIMIT);
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
