import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetSeason } from "./get_season.ts";
import { registerListSeasonIds } from "./list_season_ids.ts";

/** Register season-related MCP tools. */
export const registerSeasonTools = (server: McpServer) => {
  registerListSeasonIds(server);
  registerGetSeason(server);
};
