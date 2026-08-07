import { z } from "zod";
import {
  EpisodeIdSchema,
  LoreIdSchema,
  QueenIdSchema,
  SeasonIdSchema,
  loreTagValues,
} from "./common.ts";

export const LoreSchema = z.object({
  id: LoreIdSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.enum(loreTagValues)),
  queenIds: z.array(QueenIdSchema).optional(),
  seasonIds: z.array(SeasonIdSchema).optional(),
  episodeIds: z.array(EpisodeIdSchema).optional(),
});

export type Lore = z.infer<typeof LoreSchema>;
