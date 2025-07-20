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
