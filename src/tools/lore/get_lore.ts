import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getLore } from "../../services/accessors/index.ts";
import { LoreIdSchema } from "../../kb/schemas/common.ts";
import { LoreSchema } from "../../kb/schemas/lore.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  loreId: LoreIdSchema.describe("Lore id (kebab-case slug)"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    lore: LoreSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_lore` tool (lore entry by id). */
export const registerGetLore = (server: McpServer) => {
  server.registerTool(
    "get_lore",
    {
      description: "Get a lore entry by id (title, summary, tags, linked ids).",
      inputSchema,
      outputSchema,
    },
    async ({ loreId }) => {
      const lore = getLore(loreId);
      if (!lore) {
        const output: Output = {
          ok: false,
          error: `Lore not found: ${loreId}`,
        };
        return toolResult(output);
      }
      const output: Output = {
        ok: true,
        lore,
      };
      return toolResult(output);
    },
  );
};
