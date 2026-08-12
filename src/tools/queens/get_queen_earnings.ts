import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { QueenIdSchema } from "../../kb/schemas/common.ts";
import { MoneySchema } from "../../kb/schemas/money.ts";
import { getQueenEarnings } from "../../services/queens/get_queen_earnings.ts";
import { toolResult } from "../utility.ts";

const CurrencyTotalSchema = z.object({
  amount: z.number(),
  currency: MoneySchema.shape.currency,
});

const BreakdownItemSchema = z.object({
  kind: z.enum(["maxi", "mini", "lipSync", "seasonPurse"]),
  seasonId: z.string().min(1),
  episodeId: z.string().min(1).optional(),
  earnings: MoneySchema,
});

const inputSchema = z.object({
  queenId: QueenIdSchema.describe("Queen id (kebab-case), e.g. jinkx-monsoon"),
});

const outputSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    queenId: QueenIdSchema,
    cashTotal: z.array(CurrencyTotalSchema),
    charityTotal: z.array(CurrencyTotalSchema),
    nonCashPrizes: z.array(BreakdownItemSchema),
    breakdown: z.array(BreakdownItemSchema),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

type Output = z.infer<typeof outputSchema>;

/** Register the `get_queen_earnings` tool (career cash / prize breakdown). */
export const registerGetQueenEarnings = (server: McpServer) => {
  server.registerTool(
    "get_queen_earnings",
    {
      description:
        "Sum a queen's documented prizes across appearances (challenge tips, lip-sync tips, season purse). Returns personal cash totals, charity totals, non-cash prizes, and a full breakdown.",
      inputSchema,
      outputSchema,
    },
    async ({ queenId }) => {
      const earnings = getQueenEarnings(queenId);
      if (!earnings) {
        const output: Output = {
          ok: false,
          error: `Queen not found: ${queenId}`,
        };
        return toolResult(output);
      }
      const output: Output = {
        ok: true,
        ...earnings,
      };
      return toolResult(output);
    },
  );
};
