import { z } from "zod";
import {
  EpisodeIdSchema,
  QueenIdSchema,
  SeasonIdSchema,
  franchiseValues,
} from "./common.ts";
import { MoneySchema } from "./money.ts";
import { PersonRefSchema } from "./person.ts";

export const SeasonSchema = z.object({
  id: SeasonIdSchema,
  franchise: z.enum(franchiseValues),
  name: z.string().min(1),
  seasonNumber: z.number().int().positive(),
  year: z.number().int(),
  episodeCount: z.number().int().nonnegative(),
  episodeIds: z.array(EpisodeIdSchema),
  castIds: z.array(QueenIdSchema),
  winnerId: QueenIdSchema.optional(),
  runnerUpIds: z.array(QueenIdSchema),
  missCongenialityId: QueenIdSchema.optional(),
  porkchopId: QueenIdSchema.optional(),
  disqualifiedIds: z.array(QueenIdSchema).optional(),
  hosts: z.array(PersonRefSchema),
  judges: z.array(PersonRefSchema),
  isCharity: z.boolean(),
  cashPrice: MoneySchema,
});

export type Season = z.infer<typeof SeasonSchema>;
