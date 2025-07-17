// src/ai/flows/generate-study-tips.ts
'use server';

/**
 * @fileOverview Provides personalized memorization tips based on the user's historical progress.
 *
 * - generateStudyTips - A function that generates study tips based on historical progress.
 * - GenerateStudyTipsInput - The input type for the generateStudyTips function.
 * - GenerateStudyTipsOutput - The return type for the generateStudyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyTipsInputSchema = z.object({
  memorizationHistory: z
    .string()
    .describe(
      'A string containing the user memorization history. Should include which verses/sections have been memorized, and any challenges encountered.'
    ),
});
export type GenerateStudyTipsInput = z.infer<typeof GenerateStudyTipsInputSchema>;

const GenerateStudyTipsOutputSchema = z.object({
  studyTips: z
    .string()
    .describe('Personalized study tips based on the memorization history.'),
});
export type GenerateStudyTipsOutput = z.infer<typeof GenerateStudyTipsOutputSchema>;

export async function generateStudyTips(input: GenerateStudyTipsInput): Promise<GenerateStudyTipsOutput> {
  return generateStudyTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyTipsPrompt',
  input: {schema: GenerateStudyTipsInputSchema},
  output: {schema: GenerateStudyTipsOutputSchema},
  prompt: `You are an AI Quran memorization expert. You will provide personalized study tips to the user based on their memorization history.

Memorization History: {{{memorizationHistory}}}

Study Tips:`,
});

const generateStudyTipsFlow = ai.defineFlow(
  {
    name: 'generateStudyTipsFlow',
    inputSchema: GenerateStudyTipsInputSchema,
    outputSchema: GenerateStudyTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
