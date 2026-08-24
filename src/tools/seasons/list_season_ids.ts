import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  FranchiseCodeSchema,
  FranchiseRegionSchema,
} from "../../kb/schemas/common.ts";
import { listSeasonIds } from "../../services/seasons/index.ts";
import { franchiseField, regionField } from "../scope_fields.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const inputSchema = z.object({
  franchise: franchiseField,
  region: regionField,
});

const outputSchema = z.object({
  ok: z.literal(true),
  seasonIds: z.array(z.string()),
  franchise: FranchiseCodeSchema.optional(),
  region: FranchiseRegionSchema.optional(),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_season_ids` tool (optional franchise / region filter). */
export const registerListSeasonIds = (server: McpServer) => {
  server.registerTool(
    "list_season_ids",
    {
      description:
        "List season ids loaded in the knowledge base. Filter by franchise (FR = Drag Race France) and/or region (europe includes France AND Spain). Use list_catalogs to map names like \"france\" to FR. Do not use region=france — that is not a region code. For a full season record call get_season.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ franchise, region }) => {
      const seasonIds = listSeasonIds({
        ...(franchise !== undefined ? { franchise } : {}),
        ...(region !== undefined ? { region } : {}),
      });
      const output: Output = {
        ok: true,
        seasonIds,
        ...(franchise !== undefined ? { franchise } : {}),
        ...(region !== undefined ? { region } : {}),
      };
      return toolResult(output);
    },
  );
};
