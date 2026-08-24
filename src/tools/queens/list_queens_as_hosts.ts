import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listQueensAsHosts } from "../../services/queens/index.ts";
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

/** Register the `list_queens_as_hosts` tool (alumni hosts with queenId). */
export const registerListQueensAsHosts = (server: McpServer) => {
  server.registerTool(
    "list_queens_as_hosts",
    {
      description:
        "List alumni who hosted a season (season.hosts with queenId), e.g. Nicky Doll on FR, Brooke Lynn Hytes on CA. Hosts without a queenId (RuPaul, celebrity-only names) are omitted. Distinct from list_queens_as_judges. Hosting is not a contestant appearance. Optional franchise/region/seasonId.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async (args) => {
      const output: Output = {
        ok: true,
        results: listQueensAsHosts(toQueenScope(args)),
      };
      return toolResult(output);
    },
  );
};
