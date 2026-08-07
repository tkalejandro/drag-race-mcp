import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

/**
 * Welcome user tool
 * Just a simple tool to welcome the user to the server
 * This explains the basics of how to create a tool for the server.
 */
const welcomeUserTool = (server: McpServer) => {
    server.registerTool(
        // Give the tool a name
        "welcome_user",
        {
            // Describe the tool
            description: "Welcome user",
            // Describe the input schema
            inputSchema: z.object({
                name: z
                    // rules for the name
                    .string()
                    .min(1)
                    .max(20)
                    // describe the output to LLM
                    .describe("The name of the user to welcome"),
            }),
        },
        async ({ name }) => {
            return {
                content: [
                    {
                        type: "text",
                        text: `Welcome to the Drag Race MCP Server, ${name}!`,
                    },
                ],
            };
        },
    );
}

export default welcomeUserTool;
