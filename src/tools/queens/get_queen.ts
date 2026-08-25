import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getQueen } from "../../services/accessors/index.ts";
import { QueenIdSchema } from "../../kb/schemas/common.ts";
import { QueenSchema } from "../../kb/schemas/queen.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  queenId: QueenIdSchema.describe("Queen id (kebab-case), e.g. jinkx-monsoon"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    queen: QueenSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_queen` tool (full queen record by id). */
export const registerGetQueen = (server: McpServer) => {
  server.registerTool(
    "get_queen",
    {
      description:
        "Return the full queen record by id (origin, appearances, placements, challenge/lip-sync wins). Use after search_queens or a rank/list hit. For cash totals use get_queen_earnings; for weekly outcomes use get_queen_track_record; for side-by-side use compare_queens.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ queenId }) => {
      const queen = getQueen(queenId);
      if (!queen) {
        const output: Output = {
          ok: false,
          error: `Queen not found: ${queenId}`,
        };
        return toolResult(output);
      }
      const output: Output = { ok: true, queen };
      return toolResult(output);
    },
  );
};
