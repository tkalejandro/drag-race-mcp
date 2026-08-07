import { z } from "zod";
import { currencyValues } from "./common.ts";

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.enum(currencyValues),
});

export type Money = z.infer<typeof MoneySchema>;
