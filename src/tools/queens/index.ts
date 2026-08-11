import type { McpServer } from "@modelcontextprotocol/server";
import { registerGetQueen } from "./get_queen.ts";
import { registerListQueenIds } from "./list_queen_ids.ts";
import { registerSearchQueens } from "./search_queens.ts";

/** Register queen-related MCP tools. */
export const registerQueenTools = (server: McpServer) => {
  registerListQueenIds(server);
  registerSearchQueens(server);
  registerGetQueen(server);
};
