import { z } from "zod";

export type PigeonReport = {
  id: string;
  userId: string;
  userEmail: string;
  alias: string;
  timestamp: string;
  location: string;
  pigeonCount: number;
  aiDescription: string;
  photoUrl: string;
  photoHash: string;
  modelVersion: string;
};

export type LeaderboardEntry = {
  userId: string;
  alias: string;
  totalPigeons: number;
  reportCount: number;
  rank: number;
};

export const ReportIssueInputSchema = z.object({
  issueType: z.string().describe("The type of issue being reported (e.g., 'bug', 'suggestion', 'other')."),
  description: z.string().min(10, { message: "Please provide a more detailed description." }).describe('A detailed description of the issue.'),
  userEmail: z.string().email().optional().describe("The user's email, if they are logged in."),
  userId: z.string().optional().describe("The user's ID, if they are logged in."),
  page: z.string().optional().describe("The page the user was on when they reported the issue."),
});
export type ReportIssueInput = z.infer<typeof ReportIssueInputSchema>;
