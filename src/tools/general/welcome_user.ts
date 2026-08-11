import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { toolResult } from "../utility.ts";

/**
 * Welcome user tool
 * Just a simple tool to welcome the user to the server
 * This explains the basics of how to create a tool for the server.
 */
const inputSchema = z.object({
  name: z
    // rules for the name
    .string()
    .min(1)
    .max(20)
    // describe the field to the LLM
    .describe("The name of the user to welcome"),
});

const outputSchema = z.object({
  message: z.string().describe("Welcome message from the Drag Race MCP server"),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `welcome_user` smoke-test tool. */
export const registerWelcomeUser = (server: McpServer) => {
  server.registerTool(
    // Give the tool a name
    "welcome_user",
    {
      // Describe the tool
      description: "Welcome a user to the Drag Race MCP server (smoke test).",
      // Describe the input schema
      inputSchema,
      // Describe the output schema
      outputSchema,
    },
    async ({ name }) => {
      const output: Output = {
        message: `Welcome to the Drag Race MCP Server, ${name}!`,
      };
      return toolResult(output);
    },
  );
};
