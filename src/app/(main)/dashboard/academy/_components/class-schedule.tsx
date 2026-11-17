"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowRight, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { AttendanceSessionItem } from "../../attendance/_components/data";
import { fetchSessions } from "./academy.api";

export function ClassSchedule() {
  const [sessions, setSessions] = React.useState<AttendanceSessionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchSessions()
      .then((data) => {
        if (isMounted) setSessions(data || []);
      })
      .catch((err) => {
        console.error("Failed to load class schedule:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getBadgeClass = (status: AttendanceSessionItem["status"]) => {
    if (status === "Recorded") {
      return "border-emerald-600/50 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-500/10 dark:text-emerald-400";
    }
    if (status === "Pending Signatures") {
      return "border-sky-600/50 bg-sky-50 text-sky-700 dark:border-sky-800/50 dark:bg-sky-500/10 dark:text-sky-300";
    }
    return "border-amber-600/50 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-500/10 dark:text-amber-300";
  };

  const getIndicatorColor = (status: AttendanceSessionItem["status"]) => {
    if (status === "Recorded") return "bg-emerald-600 dark:bg-emerald-400";
    if (status === "Pending Signatures") return "bg-sky-500 dark:bg-sky-400";
    return "bg-amber-500 dark:bg-amber-400";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Live Training & Class Schedule</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          <Link href="/dashboard/attendance" className="flex items-center gap-1 hover:text-foreground">
            View All ({sessions.length}) <ArrowRight className="size-3.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-xs">
            No training sessions currently scheduled in database.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-1 gap-3 bg-card py-3 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_1fr_auto] sm:items-center"
              >
                <div className="flex gap-2">
                  <div className={`w-1 shrink-0 rounded-md ${getIndicatorColor(session.status)}`} />
                  <div className="text-nowrap text-xs">
                    <div className="font-medium text-foreground">{session.slot}</div>
                    <div className="text-muted-foreground text-[11px]">{session.date}</div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <div className="truncate font-medium text-foreground text-sm leading-none">{session.course}</div>
                  <div className="truncate text-muted-foreground text-xs leading-none">
                    {session.cohort} • {session.room}
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className={`shrink-0 rounded-md px-2.5 py-1 font-medium text-[10px] ${getBadgeClass(session.status)}`}
                >
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
