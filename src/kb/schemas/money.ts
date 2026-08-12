import { z } from "zod";
import { currencyValues } from "./common.ts";

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.enum(currencyValues),
  context: z.string().min(1),
  isSponsor: z.boolean().optional(),
  isCharity: z.boolean().optional(),
});

export type Money = z.infer<typeof MoneySchema>;
