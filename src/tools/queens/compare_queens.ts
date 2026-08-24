import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { QueenIdSchema } from "../../kb/schemas/common.ts";
import { QueenOriginSchema } from "../../kb/schemas/queen.ts";
import { compareQueens } from "../../services/queens/index.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const QueenStatsSchema = z.object({
  queenId: z.string(),
  name: z.string(),
  origin: QueenOriginSchema,
  originRegions: z.array(z.string()),
  appearanceCount: z.number().int(),
  challengeWins: z.number().int(),
  miniWins: z.number().int(),
  lipSyncWins: z.number().int(),
  lipSyncLosses: z.number().int(),
  placements: z.array(
    z.object({
      seasonId: z.string(),
      placement: z.number().int(),
    }),
  ),
  cashTotal: z.array(
    z.object({
      amount: z.number(),
      currency: z.string(),
    }),
  ),
});

const inputSchema = z.object({
  queenIds: z
    .array(QueenIdSchema)
    .min(2)
    .max(4)
    .describe("2–4 queen ids to compare side by side"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    results: z.array(QueenStatsSchema),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `compare_queens` tool (side-by-side stats for 2–4 queens). */
export const registerCompareQueens = (server: McpServer) => {
  server.registerTool(
    "compare_queens",
    {
      description:
        "Compare 2–4 queens side by side: origin, appearances, wins, placements, and cash totals. Resolve names with search_queens first. If any id is missing, ok=false. For a leaderboard use rank_queens_by_stats or rank_queens_by_earnings instead.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ queenIds }) => {
      const results = compareQueens(queenIds);
      if (results.length !== queenIds.length) {
        const found = new Set(results.map((row) => row.queenId));
        const missing = queenIds.filter((id) => !found.has(id));
        const output: Output = {
          ok: false,
          error: `Queen not found: ${missing.join(", ")}`,
        };
        return toolResult(output);
      }
      const output: Output = { ok: true, results };
      return toolResult(output);
    },
  );
};
