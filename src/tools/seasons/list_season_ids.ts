import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { FranchiseRegionSchema } from "../../kb/schemas/common.ts";
import { listSeasonIds } from "../../services/seasons/index.ts";
import { toolResult } from "../utility.ts";

const inputSchema = z.object({
  region: FranchiseRegionSchema.optional().describe(
    "Optional region filter: us, uk, canada, europe, latam_br, asia_pacific, specials. Omit to list all loaded seasons.",
  ),
});

const outputSchema = z.object({
  ok: z.literal(true),
  seasonIds: z.array(z.string()),
  region: FranchiseRegionSchema.optional(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_season_ids` tool (optional region filter). */
export const registerListSeasonIds = (server: McpServer) => {
  server.registerTool(
    "list_season_ids",
    {
      description:
        "List SeasonIds present in the knowledge base. Optionally filter by region (us includes All Stars; canada includes CVTW/CAS; specials is GAS).",
      inputSchema,
      outputSchema,
    },
    async ({ region }) => {
      const seasonIds = listSeasonIds(region ? { region } : undefined);
      const scope = region ? `region ${region}` : "all regions";
      const output: Output = {
        ok: true,
        seasonIds,
        ...(region ? { region } : {}),
      };
      return toolResult(
        `Listed ${seasonIds.length} season id(s) for ${scope}.`,
        output,
      );
    },
  );
};
