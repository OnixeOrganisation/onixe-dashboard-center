"use client";

import * as React from "react";

import { AlertTriangle, CheckCircle2, Clock, FileCheck, MoreHorizontal, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type AttendanceSessionItem, INITIAL_ATTENDANCE_SESSIONS } from "./data";
import { ExportReportDialog } from "./export-report-dialog";
import { RecordAttendanceDialog } from "./record-attendance-dialog";

export function AttendanceList() {
  const [sessions, setSessions] = React.useState<AttendanceSessionItem[]>(INITIAL_ATTENDANCE_SESSIONS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cohortFilter, setCohortFilter] = React.useState<string>("all");

  const [selectedSession, setSelectedSession] = React.useState<AttendanceSessionItem | null>(null);
  const [sheetDialogOpen, setSheetDialogOpen] = React.useState(false);

  const handleUpdateSession = (sessionId: string, present: number, absent: number, justified: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const rate = Math.round((present / (s.totalEnrolled || 1)) * 100);
          return {
            ...s,
            presentCount: present,
            absentCount: absent,
            justifiedCount: justified,
            rate,
            status: "Recorded",
          };
        }
        return s;
      }),
    );
  };

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.course.toLowerCase().includes(q) ||
      s.cohort.toLowerCase().includes(q) ||
      s.instructor.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q);

    const matchesCohort = cohortFilter === "all" || s.cohort === cohortFilter;

    return matchesSearch && matchesCohort;
  });

  // KPI Calculations
  const avgAttendance = Math.round(sessions.reduce((acc, s) => acc + s.rate, 0) / (sessions.length || 1));
  const totalTrackedHours = sessions.length * 3.5;
  const totalUnjustifiedAbsences = sessions.reduce((acc, s) => acc + s.absentCount, 0);
  const totalJustified = sessions.reduce((acc, s) => acc + s.justifiedCount, 0);

  const getStatusBadgeClass = (status: AttendanceSessionItem["status"]) => {
    if (status === "Recorded") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Pending Signatures") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Attendance & Telemetry (Émargement)</h1>
          <p className="text-muted-foreground text-sm">
            Digital check-in telemetry, absence certificates, and OPCO compliance reporting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportReportDialog />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Global Attendance Rate
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{avgAttendance}%</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">Compliant with OPCO thresholds (&gt; 90%)</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Tracked Hours</span>
            <Clock className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalTrackedHours}h</div>
          <div className="mt-1 text-muted-foreground text-xs">Validated pedagogical time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Unjustified Absences
            </span>
            <AlertTriangle className="size-4 text-destructive" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalUnjustifiedAbsences}</div>
          <div className="mt-1 font-medium text-destructive text-xs">Requires administrative follow-up</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Medical / Justified
            </span>
            <FileCheck className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalJustified}</div>
          <div className="mt-1 text-muted-foreground text-xs">Verified medical certificates</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Daily Attendance Sheets</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search session, course, instructor..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={cohortFilter} onValueChange={setCohortFilter}>
                <SelectTrigger className="h-9 w-[190px] text-xs">
                  <SelectValue placeholder="Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  <SelectItem value="Promo Dev Master 2024-A">Promo Dev Master 2024-A</SelectItem>
                  <SelectItem value="Promo Cloud & DevOps 2024-A">Promo Cloud & DevOps 2024-A</SelectItem>
                  <SelectItem value="Promo Data & AI 2024-A">Promo Data & AI 2024-A</SelectItem>
                  <SelectItem value="Promo Cyber Ops 2024-A">Promo Cyber Ops 2024-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Session & Subject</TableHead>
                  <TableHead>Target Cohort</TableHead>
                  <TableHead>Date & Time Slot</TableHead>
                  <TableHead>Instructor & Room</TableHead>
                  <TableHead className="w-[140px]">Attendance Rate</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No attendance sheets found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="grid gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="font-bold font-mono text-[10px]">
                              {session.code}
                            </Badge>
                            <span className="max-w-[200px] truncate font-semibold text-foreground text-sm leading-tight">
                              {session.course}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {session.presentCount} / {session.totalEnrolled} learners checked in
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-foreground text-xs">{session.cohort}</span>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium">{session.date}</span>
                          <span className="text-[11px] text-muted-foreground">{session.slot}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium">{session.instructor}</span>
                          <span className="text-[11px] text-muted-foreground">{session.room}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">{session.presentCount} present</span>
                            <span className="font-semibold">{session.rate}%</span>
                          </div>
                          <Progress value={session.rate} className="h-1.5" />
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadgeClass(session.status)}>
                          {session.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSession(session);
                                setSheetDialogOpen(true);
                              }}
                            >
                              Open Check-in Sheet
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Sheet Modal */}
      <RecordAttendanceDialog
        session={selectedSession}
        open={sheetDialogOpen}
        onOpenChange={setSheetDialogOpen}
        onUpdateSession={handleUpdateSession}
      />
    </div>
  );
}
