import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(20)
    .describe("Display name to include in the greeting"),
});

const outputSchema = z.object({
  message: z.string().describe("Greeting that names this MCP server"),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `welcome_user` connectivity smoke-test tool. */
export const registerWelcomeUser = (server: McpServer) => {
  server.registerTool(
    "welcome_user",
    {
      description:
        "Return a short greeting that names this server so a host can verify stdio MCP is connected. Use only as a connectivity smoke test (first session or after config change). Do not use for Drag Race facts — use search_queens, get_queen, or list_season_ids. Read-only, no I/O, no network; the same name always yields the same message.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ name }) => {
      const output: Output = {
        message: `Welcome to the Drag Race MCP Server, ${name}!`,
      };
      return toolResult(output);
    },
  );
};
