/**
 * Shared MCP tool utilities.
 */

/**
 * Tool result: JSON text in `content` (hosts/LLMs that only read text),
 * same object in `structuredContent` (typed clients / outputSchema).
 *
 * MCP has no dedicated JSON content block type — only text/image/audio/resource.
 */
export const toolResult = <T extends Record<string, unknown>>(output: T) => ({
  content: [
    {
      type: "text" as const,
      text: JSON.stringify(output, null, 2),
    },
  ],
  structuredContent: output,
});
