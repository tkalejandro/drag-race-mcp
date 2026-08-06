import type { McpServer } from "@modelcontextprotocol/server";
import welcomeUserTool from "./welcome_user.ts";

export const registerGeneralTools = (server: McpServer) => {
    welcomeUserTool(server);
}