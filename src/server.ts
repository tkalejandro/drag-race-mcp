import { McpServer } from "@modelcontextprotocol/server";
import { registerGeneralTools } from "./tools/general/index.ts";

export const createServer = () => {

    const server = new McpServer({
        name: 'drag-race-mcp',
        version: '1.0.0',
        description: 'Drag Race MCP Server',
      });

      // All tools registered in the server should be added here
      registerGeneralTools(server);
        

      return server;
};