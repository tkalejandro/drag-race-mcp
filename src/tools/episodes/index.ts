import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetEpisode } from "./get_episode.ts";

/** Register episode-related MCP tools. */
export const registerEpisodeTools = (server: McpServer) => {
  registerGetEpisode(server);
};
