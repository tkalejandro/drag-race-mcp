---
name: mcp-tools
description: >-
  How MCP tools are laid out and registered in drag-race-mcp under src/tools.
  Use when adding or editing MCP tools, registerTool handlers, tool schemas,
  domain tool folders, or when the user asks how tools should be structured.
---

# MCP tools — drag-race-mcp

Follow TypeScript conventions from the `typescript-style` skill (arrow consts, `.ts` imports).

## Layout

```text
src/tools/
  utility.ts                 # toolResult helper
  general|seasons|queens|episodes|lore/
    index.ts                 # register{Domain}Tools(server)
    snake_case_tool.ts       # one tool per file
src/server.ts                # calls each register{Domain}Tools
```

Registration chain: tool `registerX` → domain `index.ts` → `src/server.ts`.

## Per-tool file

Canonical smoke-test (annotated): `src/tools/general/welcome_user.ts`.  
Real data tool: `src/tools/queens/get_queen.ts`.

Structure every tool file like this:

```ts
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { toolResult } from "../utility.ts";
// + service/accessor + kb schemas as needed

const inputSchema = z.object({
  // fields with .describe("...") for the LLM
});

const outputSchema = z.object({
  // or z.discriminatedUnion("ok", [...])
});

type Output = z.infer<typeof outputSchema>;

/** Register the `snake_name` tool (...). */
export const registerThing = (server: McpServer) => {
  server.registerTool(
    "snake_name",
    {
      description: "What the tool does (LLM-facing).",
      inputSchema,
      outputSchema,
    },
    async (args) => {
      const output: Output = { /* ... */ };
      return toolResult(output);
    },
  );
};
```

Always return `toolResult(output)` from `src/tools/utility.ts` (JSON text in `content` + same object in `structuredContent`).

## Conventions

| Concern | Rule |
|---------|------|
| Tool name | `snake_case` (`get_queen`, `search_lore`) |
| Register export | `registerGetQueen`; domain barrel `registerQueenTools` |
| Logic | Thin tools — call `src/services/...` or accessors; do not load KB JSON in tools |
| Schemas | Reuse `src/kb/schemas/` (`QueenIdSchema`, `QueenSchema`, …) when they exist |
| Missable get | `z.discriminatedUnion("ok", [{ ok: true, ... }, { ok: false, error }])` |
| Search / always-ok | `{ ok: z.literal(true), results, limit }` |
| Search limits | `DEFAULT_SEARCH_LIMIT` / `MAX_SEARCH_LIMIT` from `src/services/shared/limits.ts` |

## Add a tool checklist

1. Pick or create a domain folder under `src/tools/`.
2. Add `snake_name.ts` using the template above.
3. Call `registerSnakeName(server)` from the domain `index.ts`.
4. If the domain is new, add `register{Domain}Tools(server)` in `src/server.ts`.
5. Put business logic in services; keep the tool file as schema + wire-up + `toolResult`.
