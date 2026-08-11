import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { searchQueens } from "../../services/queens/index.ts";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
} from "../../services/shared/limits.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe("Substring to match against queen name or aliases"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_SEARCH_LIMIT)
    .optional()
    .describe(`Max results (default ${DEFAULT_SEARCH_LIMIT}, max ${MAX_SEARCH_LIMIT})`),
});

const outputSchema = z.object({
  ok: z.literal(true),
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      aliases: z.array(z.string()).optional(),
    }),
  ),
  limit: z.number().int(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `search_queens` tool (name/alias substring search). */
export const registerSearchQueens = (server: McpServer) => {
  server.registerTool(
    "search_queens",
    {
      description:
        "Search queens by name or alias (case-insensitive substring). Returns id/name hits — then call get_queen.",
      inputSchema,
      outputSchema,
    },
    async ({ query, limit }) => {
      const results = searchQueens(
        query,
        limit === undefined ? undefined : { limit },
      );
      const output: Output = {
        ok: true,
        results,
        limit: limit ?? DEFAULT_SEARCH_LIMIT,
      };
      return toolResult(output);
    },
  );
};
