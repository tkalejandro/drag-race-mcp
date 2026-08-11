import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getEpisode } from "../../services/accessors/index.ts";
import { EpisodeIdSchema } from "../../kb/schemas/common.ts";
import { EpisodeSchema } from "../../kb/schemas/episode.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  episodeId: EpisodeIdSchema.describe(
    "Episode id, e.g. US-S06-E05 or CA-S01-E03",
  ),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    episode: EpisodeSchema,
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_episode` tool (full episode record by id). */
export const registerGetEpisode = (server: McpServer) => {
  server.registerTool(
    "get_episode",
    {
      description:
        "Get an episode by id (challenges, runway, lip sync, eliminations, guest judges).",
      inputSchema,
      outputSchema,
    },
    async ({ episodeId }) => {
      const episode = getEpisode(episodeId);
      if (!episode) {
        const output: Output = {
          ok: false,
          error: `Episode not found: ${episodeId}`,
        };
        return toolResult(`Episode not found: ${episodeId}`, output);
      }
      const output: Output = {
        ok: true,
        episode,
      };
      return toolResult(
        `Loaded episode ${episode.id} ("${episode.title}").`,
        output,
      );
    },
  );
};
