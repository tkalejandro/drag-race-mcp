import { z } from "zod";
import {
  EpisodeIdSchema,
  QueenIdSchema,
  SeasonIdSchema,
} from "./common.ts";
import { MoneySchema } from "./money.ts";

export const ChallengeWinSchema = z.object({
  episodeId: EpisodeIdSchema,
  name: z.string().optional(),
  earnings: MoneySchema.optional(),
});

export const LipSyncResultSchema = z.object({
  episodeId: EpisodeIdSchema,
  song: z.string().optional(),
  earnings: MoneySchema.optional(),
});

export const QueenAppearanceSchema = z.object({
  seasonId: SeasonIdSchema,
  placement: z.number().int().positive(),
  eliminatedEpisodeId: EpisodeIdSchema.optional(),
  challengeWins: z.array(ChallengeWinSchema),
  miniChallengeWins: z.array(ChallengeWinSchema),
  lipSyncWins: z.array(LipSyncResultSchema),
  lipSyncLosses: z.array(LipSyncResultSchema),
  missCongeniality: z.boolean().optional(),
  disqualified: z.boolean().optional(),
  quit: z.boolean().optional(),
  reentered: z.boolean().optional(),
});

export const QueenSchema = z.object({
  id: QueenIdSchema,
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  appearances: z.array(QueenAppearanceSchema),
});

export type ChallengeWin = z.infer<typeof ChallengeWinSchema>;
export type LipSyncResult = z.infer<typeof LipSyncResultSchema>;
export type QueenAppearance = z.infer<typeof QueenAppearanceSchema>;
export type Queen = z.infer<typeof QueenSchema>;
