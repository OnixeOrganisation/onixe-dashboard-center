import { ArrowUp, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards() {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enrolled Learners</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">1,248</span>
              <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUp />
                4.2%
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs">across 14 active cohorts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Attendance Rate</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-foreground leading-none tracking-tight">96.4%</span>
              <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                <ArrowUp />
                1.8%
              </Badge>
            </div>
            <div className="text-right text-muted-foreground text-xs">vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Course Submissions</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">184</div>

            <div className="text-right text-muted-foreground text-xs">142 evaluated · 42 pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sessions Today</CardTitle>
            <CardAction>
              <Info className="size-3 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="text-3xl text-foreground leading-none tracking-tight">18</div>

            <div className="text-right text-muted-foreground text-xs">12 in progress · 6 scheduled</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
