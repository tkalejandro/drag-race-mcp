import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { SeasonIdSchema } from "../../kb/schemas/common.ts";
import { listQueenIdsForSeason } from "../../services/queens/index.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  seasonId: SeasonIdSchema.describe(
    "Season whose cast to list (required — no full-queen dump)",
  ),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    seasonId: SeasonIdSchema,
    queenIds: z.array(z.string()),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `list_queen_ids` tool (cast ids for one season). */
export const registerListQueenIds = (server: McpServer) => {
  server.registerTool(
    "list_queen_ids",
    {
      description:
        "List queen ids for one season's cast. Requires seasonId. For name lookup use search_queens.",
      inputSchema,
      outputSchema,
    },
    async ({ seasonId }) => {
      const queenIds = listQueenIdsForSeason(seasonId);
      if (!queenIds) {
        const output: Output = {
          ok: false,
          error: `Season not found: ${seasonId}`,
        };
        return toolResult(output);
      }
      const output: Output = {
        ok: true,
        seasonId,
        queenIds,
      };
      return toolResult(output);
    },
  );
};
