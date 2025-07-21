
'use server';

/**
 * @fileOverview A flow for users to report issues with the application.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ReportIssueInputSchema, type ReportIssueInput } from '@/lib/types';

export async function reportIssue(input: ReportIssueInput): Promise<{success: boolean}> {
  return reportIssueFlow(input);
}

const reportIssueFlow = ai.defineFlow(
  {
    name: 'reportIssueFlow',
    inputSchema: ReportIssueInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    try {
      await addDoc(collection(db, "issues"), {
        ...input,
        createdAt: new Date().toISOString(),
        status: 'new', // Default status for new issues
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to save issue to Firestore:", error);
      throw new Error("Could not submit issue report.");
    }
  }
);
