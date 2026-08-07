import { z } from "zod";
import { QueenIdSchema } from "./common.ts";

export const PersonRefSchema = z.object({
  name: z.string().min(1),
  queenId: QueenIdSchema.optional(),
});

export type PersonRef = z.infer<typeof PersonRefSchema>;
