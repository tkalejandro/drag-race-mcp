import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getSeason } from "../../services/accessors/index.ts";
import { SeasonIdSchema } from "../../kb/schemas/common.ts";
import { SeasonSchema } from "../../kb/schemas/season.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  seasonId: SeasonIdSchema.describe("Season id, e.g. US-S06 or UK-S01"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    season: SeasonSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_season` tool (full season record by id). */
export const registerGetSeason = (server: McpServer) => {
  server.registerTool(
    "get_season",
    {
      description:
        "Get a season record by id (castIds, episodeIds, winner, hosts/judges). Expand queens/episodes with get_queen / get_episode.",
      inputSchema,
      outputSchema,
    },
    async ({ seasonId }) => {
      const season = getSeason(seasonId);
      if (!season) {
        const output: Output = {
          ok: false,
          error: `Season not found: ${seasonId}`,
        };
        return toolResult(`Season not found: ${seasonId}`, output);
      }
      const output: Output = {
        ok: true,
        season,
      };
      return toolResult(`Loaded season ${season.id} (${season.name}).`, output);
    },
  );
};
