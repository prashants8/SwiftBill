'use server';
/**
 * @fileOverview This file contains the Genkit flow for converting a numeric amount
 * to words in Indian Rupees for freight bill documentation.
 *
 * - convertAmountToWords - A function that converts a numeric amount to words.
 * - AmountToWordsInput - The input type for the convertAmountToWords function.
 * - AmountToWordsOutput - The return type for the convertAmountToWords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AmountToWordsInputSchema = z.object({
  amount: z.number().describe('The numeric amount to convert to words.'),
});
export type AmountToWordsInput = z.infer<typeof AmountToWordsInputSchema>;

const AmountToWordsOutputSchema = z.object({
  amountInWords: z
    .string()
    .describe('The amount converted to words in Indian Rupees.'),
});
export type AmountToWordsOutput = z.infer<typeof AmountToWordsOutputSchema>;

export async function convertAmountToWords(
  input: AmountToWordsInput
): Promise<AmountToWordsOutput> {
  return amountToWordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'amountToWordsPrompt',
  input: {schema: AmountToWordsInputSchema},
  output: {schema: AmountToWordsOutputSchema},
  prompt: `Convert the following numeric amount into words, specifically in Indian Rupees format.

Example:
Input: 117271
Output: Rupees One Lakh Seventeen Thousand Two Hundred Seventy One Only

Input: {{{amount}}}
Output: `,
});

const amountToWordsFlow = ai.defineFlow(
  {
    name: 'amountToWordsFlow',
    inputSchema: AmountToWordsInputSchema,
    outputSchema: AmountToWordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
