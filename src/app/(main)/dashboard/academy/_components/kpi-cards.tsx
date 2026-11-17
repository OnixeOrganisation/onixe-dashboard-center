"use client";

import * as React from "react";

import { ArrowUp, BookOpen, Building2, Clock, GraduationCap, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type AcademyOverview, fetchAcademyOverview } from "./academy.api";

export function KpiCards() {
  const [overview, setOverview] = React.useState<AcademyOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchAcademyOverview()
      .then((data) => {
        if (isMounted) setOverview(data);
      })
      .catch((err) => {
        console.error("Failed to load academy overview:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex h-28 items-center justify-center p-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Enrolled Learners</CardTitle>
            <CardAction>
              <GraduationCap className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">
                {overview.totalActiveStudents}
              </span>
              <Badge className="rounded-sm border-emerald-600/50 bg-emerald-500/10 px-1 font-normal text-emerald-700 text-xs dark:border-emerald-800/50 dark:bg-emerald-500/15 dark:text-emerald-300">
                <ArrowUp className="size-3" />
                Active
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs mt-1">
              across {overview.totalActiveCohorts} active cohorts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
            <CardAction>
              <Clock className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">
                {overview.overallAttendanceRate}%
              </span>
              <Badge className="rounded-sm border-emerald-600/50 bg-emerald-500/10 px-1 font-normal text-emerald-700 text-xs dark:border-emerald-800/50 dark:bg-emerald-500/15 dark:text-emerald-300">
                <ArrowUp className="size-3" />
                {overview.retentionRatePercent}% retention
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs mt-1">
              {overview.atRiskStudentsCount} learner(s) needing support
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Curriculum & Exams</CardTitle>
            <CardAction>
              <BookOpen className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">{overview.totalCourses}</div>
            <div className="text-right text-muted-foreground text-xs mt-1">
              {overview.totalExams} exams & deliberations scheduled
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Campuses & Tracks</CardTitle>
            <CardAction>
              <Building2 className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">{overview.totalCampuses}</div>
            <div className="text-right text-muted-foreground text-xs mt-1">
              {overview.totalDepartments} pedagogical departments
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
