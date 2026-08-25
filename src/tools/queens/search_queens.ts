import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { searchQueens } from "../../services/queens/index.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
} from "../../services/shared/limits.ts";
import {
  franchiseField,
  originCountryField,
  originRegionField,
  regionField,
  seasonIdField,
  toQueenScope,
} from "../scope_fields.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z
  .object({
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Optional substring against queen name or aliases"),
    seasonId: seasonIdField,
    franchise: franchiseField,
    region: regionField,
    originCountry: originCountryField,
    originRegion: originRegionField,
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_SEARCH_LIMIT)
      .optional()
      .describe(
        `Max results (default ${DEFAULT_SEARCH_LIMIT}, max ${MAX_SEARCH_LIMIT})`,
      ),
  })
  .refine(
    (value) =>
      Boolean(value.query) ||
      Boolean(value.seasonId) ||
      Boolean(value.franchise) ||
      Boolean(value.region) ||
      Boolean(value.originCountry) ||
      Boolean(value.originRegion),
    {
      message:
        "Provide query and/or at least one filter: seasonId, franchise, region, originCountry, originRegion",
    },
  );

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      aliases: z.array(z.string()).optional(),
    }),
  ),
  limit: z.number().int(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `search_queens` tool (name/alias + origin/franchise filters). */
export const registerSearchQueens = (server: McpServer) => {
  server.registerTool(
    "search_queens",
    {
      description:
        "Find queen ids by name/alias substring and/or filters. France the show is franchise=FR (not region=france). Latin American origin is originRegion=latin_america — that excludes Spain (use iberia or originCountry=ES). query may be omitted when filters are set. Returns id/name hits only — then call get_queen. For earnings ranking use rank_queens_by_earnings.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ query, limit, ...scopeArgs }) => {
      const results = searchQueens({
        ...toQueenScope(scopeArgs),
        ...(query !== undefined ? { query } : {}),
        ...(limit !== undefined ? { limit } : {}),
      });
      const output: Output = {
        ok: true,
        results,
        limit: limit ?? DEFAULT_SEARCH_LIMIT,
      };
      return toolResult(output);
    },
  );
};
