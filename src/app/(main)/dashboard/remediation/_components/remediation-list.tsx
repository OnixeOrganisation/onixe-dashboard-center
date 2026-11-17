"use client";

import * as React from "react";

import { AlertCircle, Award, Calendar, CheckCircle2, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { EligibleStudentItem, RetakeSessionItem } from "./data";
import { fetchEligibleStudents, fetchRetakeSessions } from "./remediation.api";
import { ScheduleRetakeDialog } from "./schedule-retake-dialog";

export function RemediationList() {
  const [students, setStudents] = React.useState<EligibleStudentItem[]>([]);
  const [sessions, setSessions] = React.useState<RetakeSessionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [studentsData, sessionsData] = await Promise.all([fetchEligibleStudents(), fetchRetakeSessions()]);
      setStudents(studentsData || []);
      setSessions(sessionsData || []);
    } catch (err: any) {
      toast.error("Error loading remediation data", {
        description: err.message || "Failed to reach NestJS API gateway.",
      });
      setStudents([]);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRetake = (newSession: RetakeSessionItem) => {
    setSessions((prev) => [newSession, ...prev]);
    // Refresh students status
    fetchEligibleStudents().then((res) => {
      if (res) setStudents(res);
    });
  };

  const handleAssignToSession = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, retakeStatus: "Session Scheduled", scheduledDate: "2024-12-22" } : s,
      ),
    );
    toast.success("Student Assigned to Retake", {
      description: "Learner enrolled in the next upcoming remediation examination session.",
    });
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.matricule.toLowerCase().includes(q) ||
      s.failedCourse.toLowerCase().includes(q) ||
      s.cohort.toLowerCase().includes(q)
    );
  });

  const totalEligible = students.length;
  const totalEctsAtRisk = students.reduce((acc, s) => acc + (s.ectsAtRisk || 0), 0);
  const scheduledCount = students.filter((s) => s.retakeStatus === "Session Scheduled").length;

  const getStatusBadgeClass = (status: EligibleStudentItem["retakeStatus"]) => {
    if (status === "Session Scheduled") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    if (status === "Retake Passed") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Remediation & Retake Examinations</h1>
          <p className="text-muted-foreground text-sm">
            Live database detection of learners with grades below 10/20, ECTS recovery tracking, and retake jury
            sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <ScheduleRetakeDialog onAddRetake={handleAddRetake} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Connecting to live NestJS remediation database...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Eligible for Retake
                </span>
                <AlertCircle className="size-4 text-amber-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">{totalEligible} learners</div>
              <div className="mt-1 font-medium text-amber-600 text-xs">Grades below 10.0 / 20</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  ECTS Credits at Risk
                </span>
                <Award className="size-4 text-destructive" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">{totalEctsAtRisk} ECTS</div>
              <div className="mt-1 text-muted-foreground text-xs">Requires second chance jury</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Scheduled Sessions
                </span>
                <Calendar className="size-4 text-sky-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">{sessions.length} sessions</div>
              <div className="mt-1 text-muted-foreground text-xs">{scheduledCount} student(s) slotted</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Target Recovery Rate
                </span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">85%</div>
              <div className="mt-1 font-medium text-emerald-600 text-xs">Based on academic history</div>
            </Card>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search student, course, or cohort..."
              className="pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs for Candidates vs Scheduled Sessions */}
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList>
              <TabsTrigger value="students" className="text-xs">
                Eligible Learners ({students.length})
              </TabsTrigger>
              <TabsTrigger value="sessions" className="text-xs">
                Scheduled Retake Sessions ({sessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No students currently flagged for academic remediation.
                </div>
              ) : (
                filteredStudents.map((st) => (
                  <Card key={st.id} className="transition-colors hover:border-primary/40">
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{st.name}</span>
                          <span className="font-mono text-muted-foreground text-xs">({st.matricule})</span>
                          <Badge variant="outline" className={getStatusBadgeClass(st.retakeStatus)}>
                            {st.retakeStatus}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {st.cohort} • Failed: <span className="font-medium text-foreground">{st.failedCourse}</span>
                        </p>
                        <div className="flex items-center gap-3 font-medium text-xs">
                          <span className="text-destructive">Grade: {st.failedGrade} / 20</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400">ECTS at risk: {st.ectsAtRisk} ECTS</span>
                          {st.scheduledDate && (
                            <>
                              <span>•</span>
                              <span className="text-sky-600 dark:text-sky-400">Jury date: {st.scheduledDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {st.retakeStatus === "Eligible" ? (
                          <Button size="sm" variant="outline" onClick={() => handleAssignToSession(st.id)}>
                            Assign to Session
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-xs font-normal">
                            Session Confirmed
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-3">
              {sessions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No remediation sessions currently registered in database.
                </div>
              ) : (
                sessions.map((sess) => (
                  <Card key={sess.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {sess.code}
                          </Badge>
                          <CardTitle className="text-base font-semibold">{sess.title}</CardTitle>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            sess.status === "Scheduled"
                              ? "border-sky-600/30 bg-sky-500/10 text-sky-600"
                              : "border-emerald-600/30 bg-emerald-500/10 text-emerald-600"
                          }
                        >
                          {sess.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{sess.course}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 pt-1 text-xs">
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div>
                          Examiner: <strong className="text-foreground">{sess.examiner}</strong>
                        </div>
                        <div>
                          Date: <strong className="text-foreground">{sess.date}</strong> ({sess.time})
                        </div>
                        <div>
                          Room: <strong className="text-foreground">{sess.room}</strong>
                        </div>
                      </div>
                      <div className="font-medium text-foreground">
                        {sess.enrolledStudentsCount} candidate(s) enrolled
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
