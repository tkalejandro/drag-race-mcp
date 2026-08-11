import type { McpServer } from "@modelcontextprotocol/server";
import { registerWelcomeUser } from "./welcome_user.ts";

/** Register general/smoke-test MCP tools. */
export const registerGeneralTools = (server: McpServer) => {
  registerWelcomeUser(server);
};
