import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listReturningQueens } from "../../services/queens/index.ts";
import { franchiseField } from "../scope_fields.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  franchise: franchiseField,
});

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(
    z.object({
      queenId: z.string(),
      name: z.string(),
      seasonIds: z.array(z.string()),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_returning_queens` tool (queens with 2+ contestant seasons). */
export const registerListReturningQueens = (server: McpServer) => {
  server.registerTool(
    "list_returning_queens",
    {
      description:
        "List queens with more than one contestant appearance (All Stars, vs the World, multi-franchise). Optional franchise filter keeps queens who competed on that show. Host/judge-only jobs are not appearances. For first-outs use list_porkchops.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ franchise }) => {
      const output: Output = {
        ok: true,
        results: listReturningQueens(
          franchise !== undefined ? { franchise } : undefined,
        ),
      };
      return toolResult(output);
    },
  );
};
