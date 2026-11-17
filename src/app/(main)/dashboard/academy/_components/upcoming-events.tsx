"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowRight, Calendar, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ExamItem } from "../../gradebook/_components/data";
import { fetchExams } from "../../gradebook/_components/gradebook.api";

export function UpcomingEvents() {
  const [exams, setExams] = React.useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchExams()
      .then((data) => {
        if (isMounted) setExams(data || []);
      })
      .catch((err) => {
        console.error("Failed to load upcoming events:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Academic Calendar & Evaluations</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          <Link href="/dashboard/gradebook" className="flex items-center gap-1 hover:text-foreground">
            Gradebook <ArrowRight className="size-3.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : exams.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-xs">
            No upcoming academic exams scheduled in database.
          </div>
        ) : (
          exams.slice(0, 5).map((exam) => (
            <div key={exam.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-11 shrink-0 overflow-hidden rounded-sm border">
                  <div className="grid h-1/3 place-items-center border-b bg-muted font-medium text-[10px] uppercase leading-none">
                    Exam
                  </div>
                  <div className="grid h-2/3 place-items-center text-xs font-semibold leading-none">
                    {exam.type === "Continuous Assessment" ? "CC" : exam.type === "Midterm" ? "DS" : "Final"}
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <div className="truncate font-medium text-sm leading-none">{exam.title}</div>
                  <div className="text-muted-foreground text-xs leading-none">
                    {exam.cohort} • {exam.date}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-md px-2.5 py-1 font-medium text-[10px]">
                {exam.status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
