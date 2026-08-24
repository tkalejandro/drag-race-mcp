import type { McpServer } from "@modelcontextprotocol/server";
import { registerCompareQueens } from "./compare_queens.ts";
import { registerGetQueen } from "./get_queen.ts";
import { registerGetQueenEarnings } from "./get_queen_earnings.ts";
import { registerGetQueenStats } from "./get_queen_stats.ts";
import { registerGetQueenTrackRecord } from "./get_queen_track_record.ts";
import { registerListPorkchops } from "./list_porkchops.ts";
import { registerListQueenIds } from "./list_queen_ids.ts";
import { registerListQueensAsHosts } from "./list_queens_as_hosts.ts";
import { registerListQueensAsJudges } from "./list_queens_as_judges.ts";
import { registerListReturningQueens } from "./list_returning_queens.ts";
import { registerRankQueensByEarnings } from "./rank_queens_by_earnings.ts";
import { registerRankQueensByStats } from "./rank_queens_by_stats.ts";
import { registerSearchQueens } from "./search_queens.ts";

/** Register queen-related MCP tools. */
export const registerQueenTools = (server: McpServer) => {
  registerListQueenIds(server);
  registerSearchQueens(server);
  registerGetQueen(server);
  registerGetQueenEarnings(server);
  registerGetQueenStats(server);
  registerCompareQueens(server);
  registerRankQueensByEarnings(server);
  registerRankQueensByStats(server);
  registerListReturningQueens(server);
  registerListPorkchops(server);
  registerListQueensAsJudges(server);
  registerListQueensAsHosts(server);
  registerGetQueenTrackRecord(server);
};
