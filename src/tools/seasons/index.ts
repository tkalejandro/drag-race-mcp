import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetSeason } from "./get_season.ts";
import { registerListCatalogs } from "./list_catalogs.ts";
import { registerListSeasonIds } from "./list_season_ids.ts";
import { registerListWinners } from "./list_winners.ts";

/** Register season-related MCP tools. */
export const registerSeasonTools = (server: McpServer) => {
  registerListCatalogs(server);
  registerListSeasonIds(server);
  registerGetSeason(server);
  registerListWinners(server);
};
