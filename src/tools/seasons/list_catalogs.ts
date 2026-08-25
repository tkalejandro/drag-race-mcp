import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { listCatalogs } from "../../services/seasons/index.ts";
import { toolResult, readOnlyAnnotations } from "../utility.ts";

const CatalogKindSchema = z.enum([
  "franchises",
  "regions",
  "origin_regions",
  "currencies",
]);

const inputSchema = z.object({
  kind: CatalogKindSchema.describe(
    "Which catalog to list: franchises (FR, ES, …), regions (europe, us, …), origin_regions (latin_america, iberia, …), or currencies",
  ),
});

const outputSchema = z.object({
  ok: z.literal(true),
  kind: CatalogKindSchema,
  results: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      region: z.string().optional(),
      aliases: z.array(z.string()).optional(),
    }),
  ),
});

type Output = z.infer<typeof outputSchema>;

/** Register the `list_catalogs` tool (franchise / region / origin / currency codes). */
export const registerListCatalogs = (server: McpServer) => {
  server.registerTool(
    "list_catalogs",
    {
      description:
        "Return closed catalog codes so you can map natural language to filters. kind=franchises maps \"france\" → FR and \"spain\" → ES. kind=origin_regions maps \"latinas\" / \"latin america\" → latin_america (not ES). Show geography is franchise/region; queen nationality is origin_regions. Call this before search_queens or list_season_ids when the user names a country or franchise.",
      inputSchema,
      outputSchema,
      annotations: readOnlyAnnotations,
    },
    async ({ kind }) => {
      const output: Output = {
        ok: true,
        kind,
        results: listCatalogs(kind),
      };
      return toolResult(output);
    },
  );
};
