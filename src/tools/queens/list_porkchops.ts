import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listPorkchops } from "../../services/queens/index.ts";
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
      queenId: z.string(),
      seasonId: z.string(),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_porkchops` tool (first-outs from season.porkchopIds). */
export const registerListPorkchops = (server: McpServer) => {
  server.registerTool(
    "list_porkchops",
    {
      description:
        "List first-out (\"porkchop\") queens from season.porkchopIds. Optional franchise, region, or seasonId. AS-S01 has two team first-outs. This is the one-call answer to \"who are the porkchop queens?\". Follow up with get_queen for bios.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async (args) => {
      const output: Output = {
        ok: true,
        results: listPorkchops(toQueenScope(args)),
      };
      return toolResult(output);
    },
  );
};
