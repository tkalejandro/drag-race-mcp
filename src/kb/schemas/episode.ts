import { z } from "zod";
import {
  EpisodeIdSchema,
  QueenIdSchema,
  SeasonIdSchema,
} from "./common.ts";
import { MoneySchema } from "./money.ts";
import { PersonRefSchema } from "./person.ts";

export const EpisodeChallengeSchema = z.object({
  name: z.string().min(1),
  winnerIds: z.array(QueenIdSchema),
  earnings: MoneySchema.optional(),
});

export const LipSyncKind = {
  FOR_THE_WIN: "for-the-win",
  FOR_YOUR_LIFE: "for-your-life",
  FOR_THE_CROWN: "for-the-crown",
  SMACKDOWN: "smackdown",
} as const;

export type LipSyncKind = (typeof LipSyncKind)[keyof typeof LipSyncKind];

export const EpisodeLipSyncSchema = z.object({
  song: z.string().min(1),
  queenIds: z.array(QueenIdSchema),
  winnerIds: z.array(QueenIdSchema),
  eliminatedIds: z.array(QueenIdSchema).optional(),
  kind: z
    .enum([
      LipSyncKind.FOR_THE_WIN,
      LipSyncKind.FOR_YOUR_LIFE,
      LipSyncKind.FOR_THE_CROWN,
      LipSyncKind.SMACKDOWN,
    ])
    .optional(),
  earnings: MoneySchema.optional(),
});

export const EpisodeSchema = z.object({
  id: EpisodeIdSchema,
  seasonId: SeasonIdSchema,
  episodeNumber: z.number().int().positive(),
  title: z.string().min(1),
  miniChallenge: EpisodeChallengeSchema.optional(),
  maxiChallenge: EpisodeChallengeSchema.optional(),
  runwayTheme: z.string().optional(),
  topIds: z.array(QueenIdSchema).optional(),
  bottomIds: z.array(QueenIdSchema).optional(),
  lipSync: EpisodeLipSyncSchema.optional(),
  guestJudges: z.array(PersonRefSchema).optional(),
});

export type EpisodeChallenge = z.infer<typeof EpisodeChallengeSchema>;
export type EpisodeLipSync = z.infer<typeof EpisodeLipSyncSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
