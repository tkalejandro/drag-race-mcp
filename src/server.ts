import { McpServer } from "@modelcontextprotocol/server";
import { registerEpisodeTools } from "./tools/episodes/index.ts";
import { registerGeneralTools } from "./tools/general/index.ts";
import { registerLoreTools } from "./tools/lore/index.ts";
import { registerQueenTools } from "./tools/queens/index.ts";
import { registerSeasonTools } from "./tools/seasons/index.ts";

export const createServer = () => {
  const server = new McpServer({
    name: "drag-race-mcp",
    version: "1.0.0",
    description: "Drag Race MCP Server",
  });

  registerGeneralTools(server);
  registerSeasonTools(server);
  registerQueenTools(server);
  registerEpisodeTools(server);
  registerLoreTools(server);

  return server;
};
