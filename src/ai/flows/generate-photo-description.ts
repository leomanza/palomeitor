
'use server';

/**
 * @fileOverview An AI agent that generates a descriptive summary of a pigeon photo.
 *
 * - generatePhotoDescription - A function that handles the generation of the photo description.
 * - GeneratePhotoDescriptionInput - The input type for the generatePhotoDescription function.
 * - GeneratePhotoDescriptionOutput - The return type for the generatePhotoDescription function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GeneratePhotoDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of pigeons, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePhotoDescriptionInput = z.infer<typeof GeneratePhotoDescriptionInputSchema>;

const GeneratePhotoDescriptionOutputSchema = z.object({
  pigeonCount: z.number().int().describe('The exact number of pigeons visible in the photo. Output 0 if there are none.'),
  photoDescription: z.string().describe('A descriptive summary of the pigeon photo, focusing on their location and any interesting details. The description must be in Spanish.'),
  modelVersion: z.string().describe('The name of the AI model used for the analysis.'),
});
export type GeneratePhotoDescriptionOutput = z.infer<typeof GeneratePhotoDescriptionOutputSchema>;

export async function generatePhotoDescription(input: GeneratePhotoDescriptionInput): Promise<GeneratePhotoDescriptionOutput> {
  return generatePhotoDescriptionFlow(input);
}

const MODEL_NAME = 'googleai/gemini-2.0-flash';

const prompt = ai.definePrompt({
  name: 'generatePhotoDescriptionPrompt',
  input: {schema: GeneratePhotoDescriptionInputSchema},
  output: {schema: GeneratePhotoDescriptionOutputSchema.omit({ modelVersion: true })}, // Model doesn't need to return its own name
  prompt: `You are an expert in describing photos of pigeons.

  Your task is to analyze the provided photo and return two pieces of information:
  1.  A precise count of the number of pigeons visible in the photo.
  2.  A descriptive summary of the photo.

  Focus on the number of pigeons, their location, and any interesting details for the description.
  The description must be written in Spanish.

  Photo: {{media url=photoDataUri}}`,
  model: MODEL_NAME,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const generatePhotoDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePhotoDescriptionFlow',
    inputSchema: GeneratePhotoDescriptionInputSchema,
    outputSchema: GeneratePhotoDescriptionOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error("Prompt returned null or undefined output.");
      }
      return {
        ...output,
        modelVersion: MODEL_NAME, // Add the model name to the final output
      };
    } catch (error) {
      console.error('generate-photo-description.ts: Error within flow:', error);
      // Re-throw the error to be caught by the calling action
      throw error;
    }
  }
);
