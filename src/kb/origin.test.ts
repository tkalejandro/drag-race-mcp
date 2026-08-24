/**
 * Unit tests for origin-region derivation (Spain ≠ Latin America).
 */

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { originRegionsForCountries } from "./origin.ts";

describe("originRegionsForCountries", () => {
  it("maps Spain to europe and iberia, not latin_america", () => {
    const regions = originRegionsForCountries(["ES"]);
    assert.ok(regions.includes("europe"));
    assert.ok(regions.includes("iberia"));
    assert.ok(!regions.includes("latin_america"));
  });

  it("maps Mexico to latin_america and north_america", () => {
    const regions = originRegionsForCountries(["MX"]);
    assert.ok(regions.includes("latin_america"));
    assert.ok(regions.includes("north_america"));
    assert.ok(!regions.includes("iberia"));
  });

  it("maps Puerto Rico to latin_america and caribbean", () => {
    const regions = originRegionsForCountries(["PR"]);
    assert.ok(regions.includes("latin_america"));
    assert.ok(regions.includes("caribbean"));
  });

  it("maps Martinique to caribbean only", () => {
    const regions = originRegionsForCountries(["MQ"]);
    assert.deepEqual(regions, ["caribbean"]);
  });
});
