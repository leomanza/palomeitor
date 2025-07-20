
'use client';

import type { PigeonReport, LeaderboardEntry } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Bird, FileText } from 'lucide-react';
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Dictionary } from "@/lib/i18n";

interface LeaderboardProps {
  reports: PigeonReport[];
  dict: Dictionary["leaderboard"];
}

const calculateLeaderboard = (reports: PigeonReport[]): LeaderboardEntry[] => {
  if (!reports || reports.length === 0) {
    return [];
  }

  const userStats: { [userId: string]: { totalPigeons: number; reportCount: number; alias: string } } = {};

  reports.forEach(report => {
    if (!userStats[report.userId]) {
      userStats[report.userId] = {
        totalPigeons: 0,
        reportCount: 0,
        alias: report.alias || 'Anónimo',
      };
    }
    userStats[report.userId].totalPigeons += report.pigeonCount;
    userStats[report.userId].reportCount += 1;
  });

  const leaderboard = Object.entries(userStats)
    .map(([userId, stats]) => ({
      userId,
      ...stats,
    }))
    .sort((a, b) => b.totalPigeons - a.totalPigeons)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return leaderboard;
};

export default function Leaderboard({ reports, dict }: LeaderboardProps) {
  const leaderboardData = useMemo(() => calculateLeaderboard(reports), [reports]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-400 text-yellow-900";
      case 2: return "bg-gray-300 text-gray-800";
      case 3: return "bg-yellow-600 text-yellow-100";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary"/>
            {dict.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">{dict.headers.rank}</TableHead>
                <TableHead>{dict.headers.spotter}</TableHead>
                <TableHead className="text-center">{dict.headers.totalPigeons}</TableHead>
                <TableHead className="text-center">{dict.headers.reports}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {dict.noData}
                  </TableCell>
                </TableRow>
              ) : (
                leaderboardData.map((entry) => (
                  <TableRow key={entry.userId}>
                    <TableCell className="font-bold text-center">
                        <Badge className={`w-10 h-10 flex items-center justify-center text-lg rounded-full ${getRankColor(entry.rank)}`}>
                            {entry.rank <= 3 ? <Trophy className="h-5 w-5"/> : entry.rank}
                        </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.alias}</TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Bird className="h-4 w-4 text-primary"/>
                            <span className="font-bold text-lg">{entry.totalPigeons}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                         <div className="flex items-center justify-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                            <span>{entry.reportCount}</span>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
