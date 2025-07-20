"use client";

import { useState, useEffect } from "react";
import type { PigeonReport } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, User } from "lucide-react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { Badge } from "./ui/badge";

interface ReportTableProps {
  reports: PigeonReport[];
  dict: Dictionary["reportTable"];
}

export default function ReportTable({ reports, dict }: ReportTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const exportToCSV = () => {
    const headers = [
      "ID",
      "User ID",
      "Alias",
      "Timestamp",
      "Location",
      "Pigeon Count",
      "AI Description",
      "Photo URL",
    ];
    const rows = reports.map((report) =>
      [
        report.id,
        report.userId,
        report.alias,
        report.timestamp,
        `"${report.location.replace(/"/g, '""')}"`,
        report.pigeonCount,
        `"${report.aiDescription.replace(/"/g, '""')}"`,
        report.photoUrl,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pigeon_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCSV} disabled={reports.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {dict.exportButton}
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.headers.photo}</TableHead>
              <TableHead>{dict.headers.dateTime}</TableHead>
              <TableHead>{dict.headers.reporter}</TableHead>
              <TableHead>{dict.headers.location}</TableHead>
              <TableHead className="text-center">{dict.headers.count}</TableHead>
              <TableHead>{dict.headers.aiDescription}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {dict.noReports}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Image
                      src={report.photoUrl}
                      alt={dict.photoAlt}
                      data-ai-hint="pigeon city"
                      width={100}
                      height={75}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    {isClient ? new Date(report.timestamp).toLocaleString() : '...'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{report.alias || dict.anonymous}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell className="font-bold text-center text-lg">
                    {report.pigeonCount}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {report.aiDescription}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
