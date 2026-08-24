import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetEpisode } from "./get_episode.ts";
import { registerSearchEpisodes } from "./search_episodes.ts";

/** Register episode-related MCP tools. */
export const registerEpisodeTools = (server: McpServer) => {
  registerGetEpisode(server);
  registerSearchEpisodes(server);
};
