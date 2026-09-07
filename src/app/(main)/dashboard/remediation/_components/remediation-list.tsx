"use client";

import * as React from "react";

import { AlertCircle, Award, Calendar, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  type EligibleStudentItem,
  INITIAL_ELIGIBLE_STUDENTS,
  INITIAL_RETAKE_SESSIONS,
  type RetakeSessionItem,
} from "./data";
import { ScheduleRetakeDialog } from "./schedule-retake-dialog";

export function RemediationList() {
  const [students, setStudents] = React.useState<EligibleStudentItem[]>(INITIAL_ELIGIBLE_STUDENTS);
  const [sessions, setSessions] = React.useState<RetakeSessionItem[]>(INITIAL_RETAKE_SESSIONS);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleAddRetake = (newSession: RetakeSessionItem) => {
    setSessions([newSession, ...sessions]);
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
  const totalEctsAtRisk = students.reduce((acc, s) => acc + s.ectsAtRisk, 0);
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
            Automated detection of learners with grades below 10/20, ECTS recovery tracking, and retake session
            scheduling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ScheduleRetakeDialog onAddRetake={handleAddRetake} />
        </div>
      </div>

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
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalEctsAtRisk} pts</div>
          <div className="mt-1 text-muted-foreground text-xs">Subject to remediation recovery</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Sessions Scheduled
            </span>
            <Calendar className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{sessions.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">{scheduledCount} enrolled candidates</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Recovery Potential
            </span>
            <RefreshCw className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">100%</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">All students assigned to juries</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="students" className="text-xs">
              Learners Requiring Retakes ({students.length})
            </TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs">
              Scheduled Retake Juries ({sessions.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative min-w-[240px]">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search learner, subject, cohort..."
              className="h-9 pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Eligible Students List */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Students Below Passing Threshold (&lt; 10/20)</CardTitle>
              <CardDescription className="text-xs">
                Candidates identified by pedagogical algorithms eligible for examination recovery.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col gap-3 p-4 text-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg border bg-amber-500/10 font-bold text-amber-600 text-sm">
                        {student.failedGrade}
                      </div>
                      <div className="grid gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{student.name}</span>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {student.matricule}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {student.cohort} • Subject:{" "}
                          <strong className="text-foreground">{student.failedCourse}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <Badge variant="secondary" className="font-semibold text-[11px]">
                        {student.ectsAtRisk} ECTS at risk
                      </Badge>

                      <Badge variant="secondary" className={getStatusBadgeClass(student.retakeStatus)}>
                        {student.retakeStatus}
                      </Badge>

                      {student.retakeStatus === "Eligible" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleAssignToSession(student.id)}
                        >
                          Enroll in Retake
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Scheduled: {student.scheduledDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retake Sessions List */}
        <TabsContent value="sessions">
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {session.code}
                    </Badge>
                    <CardTitle className="pt-1 text-base">{session.title}</CardTitle>
                    <CardDescription className="text-xs">{session.course}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border-sky-600/30 bg-sky-500/10 text-sky-600 text-xs dark:text-sky-400"
                  >
                    {session.status}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Date & Time</span>
                    <div className="font-medium text-foreground">
                      {session.date} • {session.time}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Room & Examiner</span>
                    <div className="font-medium text-foreground">
                      {session.room} ({session.examiner})
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
