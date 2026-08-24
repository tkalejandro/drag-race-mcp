import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { QueenIdSchema } from "../../kb/schemas/common.ts";
import { QueenOriginSchema } from "../../kb/schemas/queen.ts";
import { getQueenStats } from "../../services/queens/index.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const PlacementSchema = z.object({
  seasonId: z.string(),
  placement: z.number().int(),
});

const CashTotalSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

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
  placements: z.array(PlacementSchema),
  cashTotal: z.array(CashTotalSchema),
});

const inputSchema = z.object({
  queenId: QueenIdSchema.describe("Queen id (kebab-case), e.g. jinkx-monsoon"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    stats: QueenStatsSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_queen_stats` tool (career totals for one queen). */
export const registerGetQueenStats = (server: McpServer) => {
  server.registerTool(
    "get_queen_stats",
    {
      description:
        "Return one queen's contestant stats: appearance count, maxi/mini/lip-sync W-L, placements, origin, and cash totals by currency. Use compare_queens for 2–4 queens side by side. Use rank_queens_by_stats to find leaders. Unknown queenId returns ok=false.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ queenId }) => {
      const stats = getQueenStats(queenId);
      if (!stats) {
        const output: Output = {
          ok: false,
          error: `Queen not found: ${queenId}`,
        };
        return toolResult(output);
      }
      const output: Output = { ok: true, stats };
      return toolResult(output);
    },
  );
};
