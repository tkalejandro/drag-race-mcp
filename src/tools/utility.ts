/**
 * Shared MCP tool utilities.
 */

/** Short human/LLM summary in `content`; full typed payload in `structuredContent`. */
export const toolResult = <T extends Record<string, unknown>>(
  summary: string,
  output: T,
) => ({
  content: [{ type: "text" as const, text: summary }],
  structuredContent: output,
});
