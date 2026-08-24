import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  QueenStatMetric,
  rankQueensByStats,
} from "../../services/queens/index.ts";
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

const MetricSchema = z.enum([
  QueenStatMetric.CHALLENGE_WINS,
  QueenStatMetric.MINI_WINS,
  QueenStatMetric.LIP_SYNC_WINS,
  QueenStatMetric.APPEARANCES,
]);

const inputSchema = z.object({
  metric: MetricSchema.describe(
    "challengeWins = maxi wins, miniWins = mini challenge wins, lipSyncWins, appearances = contestant season count",
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
    .describe("Max rows (default 10)"),
});

const outputSchema = z.object({
  ok: z.literal(true),
  metric: MetricSchema,
  results: z.array(
    z.object({
      rank: z.number().int(),
      queenId: z.string(),
      name: z.string(),
      value: z.number(),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `rank_queens_by_stats` tool (wins / appearances ranking). */
export const registerRankQueensByStats = (server: McpServer) => {
  server.registerTool(
    "rank_queens_by_stats",
    {
      description:
        "Rank queens by a contestant stat (challengeWins, miniWins, lipSyncWins, appearances). Ranking runs in-process. Optional season/franchise/region/origin scope. For cash use rank_queens_by_earnings. For one queen's full stats use get_queen_stats.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ metric, limit, ...scopeArgs }) => {
      const results = rankQueensByStats(metric, {
        ...toQueenScope(scopeArgs),
        ...(limit !== undefined ? { limit } : {}),
      });
      const output: Output = { ok: true, metric, results };
      return toolResult(output);
    },
  );
};
