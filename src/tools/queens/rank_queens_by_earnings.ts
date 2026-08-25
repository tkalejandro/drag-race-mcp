import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { CurrencySchema } from "../../kb/schemas/common.ts";
import { rankQueensByEarnings } from "../../services/queens/index.ts";
import { MAX_SEARCH_LIMIT } from "../../services/shared/limits.ts";
import {
  franchiseField,
  originCountryField,
  originRegionField,
  regionField,
  seasonIdField,
  toQueenScope,
} from "../scope_fields.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  currency: CurrencySchema.optional().describe(
    "Rank within this currency only. Omit to get one leaderboard per currency. No FX conversion.",
  ),
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
    .describe("Max rows per currency (default 10)"),
});

const RankRowSchema = z.object({
  rank: z.number().int(),
  queenId: z.string(),
  name: z.string(),
  amount: z.number(),
  currency: CurrencySchema,
});

const outputSchema = z.object({
  ok: z.literal(true),
  leaderboards: z.array(
    z.object({
      currency: CurrencySchema,
      results: z.array(RankRowSchema),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `rank_queens_by_earnings` tool (in-process cash ranking). */
export const registerRankQueensByEarnings = (server: McpServer) => {
  server.registerTool(
    "rank_queens_by_earnings",
    {
      description:
        "Rank queens by documented personal cash inside the server (one call). No FX — ranks within a currency. Cash only (skips charity and $0 sponsor prizes). Optional season/franchise/region/origin filters. Do not N-call get_queen_earnings to rank. After a hit, use get_queen for the full record.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ currency, limit, ...scopeArgs }) => {
      const leaderboards = rankQueensByEarnings({
        ...toQueenScope(scopeArgs),
        ...(currency !== undefined ? { currency } : {}),
        ...(limit !== undefined ? { limit } : {}),
      });
      const output: Output = { ok: true, leaderboards };
      return toolResult(output);
    },
  );
};
