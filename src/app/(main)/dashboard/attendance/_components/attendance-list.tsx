"use client";

import * as React from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

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

import { fetchAttendanceSessions, updateAttendanceCountsApi } from "./attendance.api";
import type { AttendanceSessionItem } from "./data";
import { ExportReportDialog } from "./export-report-dialog";
import { RecordAttendanceDialog } from "./record-attendance-dialog";

export function AttendanceList() {
  const [sessions, setSessions] = React.useState<AttendanceSessionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [cohortFilter, setCohortFilter] = React.useState<string>("all");

  const [selectedSession, setSelectedSession] = React.useState<AttendanceSessionItem | null>(null);
  const [sheetDialogOpen, setSheetDialogOpen] = React.useState(false);

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      const data = await fetchAttendanceSessions();
      setSessions(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Feuilles d'émargement synchronisées", {
          description: "Données de présence chargées en direct depuis NestJS.",
        });
      }
    } catch (err) {
      toast.error("Impossible de charger les feuilles de présence", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(false);
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
  };

  const handleUpdateSession = async (sessionId: string, present: number, absent: number, justified: number) => {
    try {
      const updated = await updateAttendanceCountsApi(sessionId, { present, absent, justified });
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
      toast.success("Feuille d'émargement enregistrée", {
        description: `Présences validées : ${present} présent(s), ${absent} absent(s).`,
      });
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'émargement", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
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
  const avgAttendance = Math.round(sessions.reduce((acc, s) => acc + (s.rate || 0), 0) / (sessions.length || 1));
  const totalTrackedHours = sessions.length * 3.5;
  const totalUnjustifiedAbsences = sessions.reduce((acc, s) => acc + (s.absentCount || 0), 0);
  const totalJustified = sessions.reduce((acc, s) => acc + (s.justifiedCount || 0), 0);

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
          <h1 className="font-bold text-2xl tracking-tight">Attendance & Digital Émargement</h1>
          <p className="text-muted-foreground text-sm">
            Legally compliant digital signature sheets, hourly tracking, justification audit, and absence warnings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-2"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <ExportReportDialog />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Avg Center Attendance
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{avgAttendance}%</div>
          <div className="mt-2">
            <Progress value={avgAttendance} className="h-1.5" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Tracked Hours</span>
            <Clock className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalTrackedHours}h</div>
          <div className="mt-1 text-muted-foreground text-xs">Total face-to-face and lab hours</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Unjustified Absences
            </span>
            <AlertTriangle className="size-4 text-destructive" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalUnjustifiedAbsences}</div>
          <div className="mt-1 text-muted-foreground text-xs">Awaiting student doctor notes</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Justified Leaves</span>
            <FileCheck className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalJustified}</div>
          <div className="mt-1 text-muted-foreground text-xs">Certified administrative exemptions</div>
        </Card>
      </div>

      {/* Sessions Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Class Sessions Ledger (Feuilles d&apos;Émargement)</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search course, cohort, instructor..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={cohortFilter} onValueChange={setCohortFilter}>
                <SelectTrigger className="h-9 w-[180px] text-xs">
                  <SelectValue placeholder="Cohort Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  <SelectItem value="Promo Dev Master 2024-A">Promo Dev Master 2024-A</SelectItem>
                  <SelectItem value="Promo Cloud & DevOps 2024-A">Promo Cloud & DevOps 2024-A</SelectItem>
                  <SelectItem value="Promo Cyber 2024-A">Promo Cyber 2024-A</SelectItem>
                  <SelectItem value="Promo Data & AI 2024-A">Promo Data & AI 2024-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground text-xs">
                Chargement des feuilles d&apos;émargement depuis NestJS...
              </p>
            </div>
          ) : (
            <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Course & Cohort</TableHead>
                    <TableHead>Date & Slot</TableHead>
                    <TableHead>Instructor & Room</TableHead>
                    <TableHead className="w-[120px] text-center">Presences</TableHead>
                    <TableHead className="w-[120px] text-center">Attendance %</TableHead>
                    <TableHead className="w-[120px]">Legal Status</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No class sessions found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-bold font-mono text-[11px]">
                                {session.code}
                              </Badge>
                              <span className="font-semibold text-foreground text-sm leading-tight">
                                {session.course}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">{session.cohort}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-medium text-foreground">{session.date}</span>
                            <span className="text-muted-foreground">{session.slot}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-medium text-foreground">{session.instructor}</span>
                            <span className="text-muted-foreground">{session.room}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="font-semibold text-xs">
                            {session.presentCount} / {session.totalEnrolled}
                          </span>
                          <div className="text-[11px] text-muted-foreground">
                            {session.absentCount > 0 && (
                              <span className="text-destructive">{session.absentCount} abs. </span>
                            )}
                            {session.justifiedCount > 0 && (
                              <span className="text-amber-500">({session.justifiedCount} just.)</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={`font-bold text-xs ${
                              session.rate >= 90
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {session.rate}%
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusBadgeClass(session.status)}`}>
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
                                Edit Émargement Sheet
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
          )}
        </CardContent>
      </Card>

      {/* Record Attendance Dialog */}
      <RecordAttendanceDialog
        session={selectedSession}
        open={sheetDialogOpen}
        onOpenChange={setSheetDialogOpen}
        onUpdateSession={handleUpdateSession}
      />
    </div>
  );
}
