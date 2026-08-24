import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { QueenIdSchema, SeasonIdSchema } from "../../kb/schemas/common.ts";
import { getQueenTrackRecord } from "../../services/queens/index.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const OutcomeSchema = z.enum([
  "win",
  "high",
  "safe",
  "low",
  "eliminated",
  "lip_sync",
]);

const inputSchema = z.object({
  queenId: QueenIdSchema.describe("Queen id (kebab-case)"),
  seasonId: SeasonIdSchema.describe("Season to walk week by week"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    queenId: QueenIdSchema,
    seasonId: SeasonIdSchema,
    weeks: z.array(
      z.object({
        episodeId: z.string(),
        episodeNumber: z.number().int(),
        title: z.string(),
        outcome: OutcomeSchema,
      }),
    ),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_queen_track_record` tool (weekly outcomes on one season). */
export const registerGetQueenTrackRecord = (server: McpServer) => {
  server.registerTool(
    "get_queen_track_record",
    {
      description:
        "Walk one season's episodes for one queen and return weekly outcomes (win/high/safe/low/eliminated/lip_sync) from tops, bottoms, maxi winners, and lip-syncs. Requires queenId and seasonId. For career totals use get_queen_stats. Unknown queen or season returns ok=false.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ queenId, seasonId }) => {
      const weeks = getQueenTrackRecord(queenId, seasonId);
      if (!weeks) {
        const output: Output = {
          ok: false,
          error: `Queen or season not found: ${queenId} / ${seasonId}`,
        };
        return toolResult(output);
      }
      const output: Output = { ok: true, queenId, seasonId, weeks };
      return toolResult(output);
    },
  );
};
