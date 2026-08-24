import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getSeason } from "../../services/accessors/index.ts";
import { SeasonIdSchema } from "../../kb/schemas/common.ts";
import { SeasonSchema } from "../../kb/schemas/season.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  seasonId: SeasonIdSchema.describe("Season id, e.g. US-S06, FR-S01, or UK-S01"),
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
        "Return one season record by id (castIds, episodeIds, winners, hosts/judges, cashPrice). Use after list_season_ids. Expand queens with get_queen and episodes with get_episode. Do not use this to rank earnings or filter by queen origin.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ seasonId }) => {
      const season = getSeason(seasonId);
      if (!season) {
        const output: Output = {
          ok: false,
          error: `Season not found: ${seasonId}`,
        };
        return toolResult(output);
      }
      const output: Output = { ok: true, season };
      return toolResult(output);
    },
  );
};
