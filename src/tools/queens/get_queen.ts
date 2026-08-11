import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getQueen } from "../../services/accessors/index.ts";
import { QueenIdSchema } from "../../kb/schemas/common.ts";
import { QueenSchema } from "../../kb/schemas/queen.ts";
import { toolResult } from "../utility.ts";

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
        "Get a full queen record by id (appearances, placements, challenge/lip-sync wins).",
      inputSchema,
      outputSchema,
    },
    async ({ queenId }) => {
      const queen = getQueen(queenId);
      if (!queen) {
        const output: Output = {
          ok: false,
          error: `Queen not found: ${queenId}`,
        };
        return toolResult(`Queen not found: ${queenId}`, output);
      }
      const output: Output = {
        ok: true,
        queen,
      };
      return toolResult(`Loaded queen ${queen.name} (${queen.id}).`, output);
    },
  );
};
