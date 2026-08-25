import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { SeasonIdSchema } from "../../kb/schemas/common.ts";
import { searchEpisodes } from "../../services/episodes/index.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
} from "../../services/shared/limits.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe(
      "Substring to match against episode title, runwayTheme, or challenge names",
    ),
  seasonId: SeasonIdSchema.optional().describe(
    "Limit search to one season (e.g. US-S06)",
  ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_SEARCH_LIMIT)
    .optional()
    .describe(
      `Max results (default ${DEFAULT_SEARCH_LIMIT}, max ${MAX_SEARCH_LIMIT})`,
    ),
});

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(
    z.object({
      episodeId: z.string(),
      seasonId: z.string(),
      title: z.string(),
    }),
  ),
  limit: z.number().int(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `search_episodes` tool (title / runway / challenge substring). */
export const registerSearchEpisodes = (server: McpServer) => {
  server.registerTool(
    "search_episodes",
    {
      description:
        "Search episodes by substring on title, runwayTheme, and mini/maxi challenge names. Optional seasonId. Returns episodeId/seasonId/title hits — then call get_episode. Not for queen name search (use search_queens) or lore (use search_lore).",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ query, seasonId, limit }) => {
      const results = searchEpisodes({
        query,
        ...(seasonId !== undefined ? { seasonId } : {}),
        ...(limit !== undefined ? { limit } : {}),
      });
      const output: Output = {
        ok: true,
        results,
        limit: limit ?? DEFAULT_SEARCH_LIMIT,
      };
      return toolResult(output);
    },
  );
};
