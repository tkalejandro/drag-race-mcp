import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { MoneySchema } from "../../kb/schemas/money.ts";
import { listWinners } from "../../services/seasons/index.ts";
import {
  franchiseField,
  regionField,
  seasonIdField,
  toQueenScope,
} from "../scope_fields.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  seasonId: seasonIdField,
  franchise: franchiseField,
  region: regionField,
});

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(
    z.object({
      seasonId: z.string(),
      franchise: z.string(),
      winnerIds: z.array(z.string()),
      cashPrice: MoneySchema,
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_winners` tool (crowned winners + purse). */
export const registerListWinners = (server: McpServer) => {
  server.registerTool(
    "list_winners",
    {
      description:
        "List crowned winner ids and season cashPrice for loaded seasons. Optional franchise, region, or seasonId scope. Does not return full queen records — follow up with get_queen. For first-outs use list_porkchops.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async (args) => {
      const output: Output = {
        ok: true,
        results: listWinners(toQueenScope(args)),
      };
      return toolResult(output);
    },
  );
};
