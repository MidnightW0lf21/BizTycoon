// Stock Investment Strategy
'use server';

/**
 * @fileOverview A stock investment strategy AI agent.
 *
 * - generateStockInvestmentTips - A function that handles the stock investment strategy process.
 * - StockInvestmentTipsInput - The input type for the generateStockInvestmentTips function.
 * - StockInvestmentTipsOutput - The return type for the generateStockInvestmentTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockInvestmentTipsInputSchema = z.object({
  currentBalance: z.number().describe('The player\'s current in-game currency balance.'),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe('The player\'s risk tolerance level.'),
  marketTrends: z.string().describe('A description of the current in-game market trends.'),
});

export type StockInvestmentTipsInput = z.infer<typeof StockInvestmentTipsInputSchema>;

const StockInvestmentTipsOutputSchema = z.object({
  stockPicks: z.array(
    z.object({
      ticker: z.string().describe('The stock ticker symbol.'),
      companyName: z.string().describe('The name of the company.'),
      recommendation: z.string().describe('The investment recommendation (e.g., buy, sell, hold).'),
      rationale: z.string().describe('The rationale behind the recommendation.'),
    })
  ).describe('A list of stock investment recommendations.'),
  overallStrategy: z.string().describe('An overall investment strategy based on the inputs.'),
});

export type StockInvestmentTipsOutput = z.infer<typeof StockInvestmentTipsOutputSchema>;

export async function generateStockInvestmentTips(input: StockInvestmentTipsInput): Promise<StockInvestmentTipsOutput> {
  return stockInvestmentTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockInvestmentTipsPrompt',
  input: {schema: StockInvestmentTipsInputSchema},
  output: {schema: StockInvestmentTipsOutputSchema},
  prompt: `You are a financial advisor providing stock investment tips for an idle game called BizTycoon Idle.

  Consider the player's current balance, risk tolerance, and current market trends to generate investment recommendations.

  Current Balance: {{{currentBalance}}}
  Risk Tolerance: {{{riskTolerance}}}
  Market Trends: {{{marketTrends}}}

  Provide specific stock picks with ticker symbols, company names, recommendations (buy, sell, hold), and a rationale for each recommendation.
  Also, provide an overall investment strategy based on the player's situation.
  Ensure that the stockPicks and overallStrategy are tailored to the inputs provided.
  `,
});

const stockInvestmentTipsFlow = ai.defineFlow(
  {
    name: 'stockInvestmentTipsFlow',
    inputSchema: StockInvestmentTipsInputSchema,
    outputSchema: StockInvestmentTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
