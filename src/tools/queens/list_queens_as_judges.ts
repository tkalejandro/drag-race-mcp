import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listQueensAsJudges } from "../../services/queens/index.ts";
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
      episodeId: z.string().optional(),
      role: z.enum(["panel", "guest"]),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_queens_as_judges` tool (alumni panel + guest judges). */
export const registerListQueensAsJudges = (server: McpServer) => {
  server.registerTool(
    "list_queens_as_judges",
    {
      description:
        "List alumni who judged: season.judges with queenId (panel, e.g. Brooke Lynn Hytes) and episode.guestJudges with queenId (guest, e.g. Sasha Velour). People without a queenId (Michelle, Ross) are omitted. Hosts are not included unless they also sit on judges — use list_queens_as_hosts for hosting. Optional franchise/region/seasonId.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async (args) => {
      const output: Output = {
        ok: true,
        results: listQueensAsJudges(toQueenScope(args)),
      };
      return toolResult(output);
    },
  );
};
