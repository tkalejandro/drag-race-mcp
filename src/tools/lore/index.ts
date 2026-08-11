import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetLore } from "./get_lore.ts";
import { registerSearchLore } from "./search_lore.ts";

/** Register lore-related MCP tools. */
export const registerLoreTools = (server: McpServer) => {
  registerGetLore(server);
  registerSearchLore(server);
};
