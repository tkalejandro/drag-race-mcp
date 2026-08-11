import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  loreTagValues,
  QueenIdSchema,
  SeasonIdSchema,
} from "../../kb/schemas/common.ts";
import { LoreSchema } from "../../kb/schemas/lore.ts";
import { searchLore } from "../../services/lore/index.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
} from "../../services/shared/limits.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z
  .object({
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Substring match on lore title or summary"),
    tags: z
      .array(z.enum(loreTagValues))
      .optional()
      .describe("Match lore that has any of these tags"),
    queenId: QueenIdSchema.optional().describe("Filter lore linked to this queen"),
    seasonId: SeasonIdSchema.optional().describe(
      "Filter lore linked to this season",
    ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(MAX_SEARCH_LIMIT)
      .optional()
      .describe(`Max results (default ${DEFAULT_SEARCH_LIMIT}, max ${MAX_SEARCH_LIMIT})`),
  })
  .refine(
    (value) =>
      Boolean(value.query) ||
      (value.tags && value.tags.length > 0) ||
      Boolean(value.queenId) ||
      Boolean(value.seasonId),
    {
      message: "Provide at least one of: query, tags, queenId, seasonId",
    },
  );

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(LoreSchema),
  limit: z.number().int(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `search_lore` tool (query / tags / queen / season filters). */
export const registerSearchLore = (server: McpServer) => {
  server.registerTool(
    "search_lore",
    {
      description:
        "Search lore by query, tags, queenId, and/or seasonId. Returns matching lore entries (capped).",
      inputSchema,
      outputSchema,
    },
    async ({ query, tags, queenId, seasonId, limit }) => {
      const results = searchLore({
        ...(query !== undefined ? { query } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(queenId !== undefined ? { queenId } : {}),
        ...(seasonId !== undefined ? { seasonId } : {}),
        ...(limit !== undefined ? { limit } : {}),
      });
      const output: Output = {
        ok: true,
        results,
        limit: limit ?? DEFAULT_SEARCH_LIMIT,
      };
      return toolResult(`Found ${results.length} lore result(s).`, output);
    },
  );
};
