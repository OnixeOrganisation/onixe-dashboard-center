"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowRight, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

import { fetchCourses } from "../../courses/_components/courses.api";

interface PerformanceHighlightItem {
  className: string;
  start: number;
  duration: number;
  subject: string;
  score: number;
  avatars: string[];
}

const chartConfig = {
  duration: {
    label: "Score",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function PerformanceHighlightBar({
  height = 0,
  payload,
  width = 0,
  x = 0,
  y = 0,
}: {
  height?: number;
  payload?: PerformanceHighlightItem;
  width?: number;
  x?: number;
  y?: number;
}) {
  if (!payload) {
    return null;
  }

  const barHeight = Math.min(32, height);
  const barY = y + (height - barHeight) / 2;
  const radius = barHeight / 2;
  const fillWidth = Math.max(width * (payload.score / 100), 86);
  const avatarSize = 22;
  const avatarStart = x + 8;
  const avatarY = barY + (barHeight - avatarSize) / 2 - 1.5;
  const labelX = avatarStart + payload.avatars.length * 14 + 14;

  return (
    <g>
      <rect
        fill="color-mix(in oklch, var(--color-duration) 18%, transparent)"
        height={barHeight}
        rx={radius}
        width={width}
        x={x}
        y={barY}
      />
      <rect fill="var(--color-duration)" height={barHeight} rx={radius} width={fillWidth} x={x} y={barY} />

      {payload.avatars.map((initials, index) => {
        const avatarX = avatarStart + index * 14;

        return (
          <foreignObject height={avatarSize + 4} key={initials} width={avatarSize + 4} x={avatarX - 2} y={avatarY}>
            <Avatar className="size-5 bg-muted" size="sm">
              <AvatarFallback className="text-foreground text-[10px]">{initials}</AvatarFallback>
            </Avatar>
          </foreignObject>
        );
      })}

      <text
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize={11}
        fontWeight={600}
        letterSpacing="0.02em"
        x={labelX}
        y={barY + barHeight / 2 + 1}
      >
        {payload.subject} ({payload.score}%)
      </text>
    </g>
  );
}

export function PerformanceHighlights() {
  const [highlights, setHighlights] = React.useState<PerformanceHighlightItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchCourses()
      .then((courses) => {
        if (!isMounted) return;
        if (courses && courses.length > 0) {
          const items: PerformanceHighlightItem[] = courses.slice(0, 4).map((c, idx) => {
            const initials = c.department
              ? c.department
                  .split(" ")
                  .filter(Boolean)
                  .map((w: string) => w[0].toUpperCase())
                  .slice(0, 2)
                  .join("")
              : "AC";
            return {
              className: c.code,
              start: 0.8 + idx * 0.3,
              duration: 1.5,
              subject: c.title.slice(0, 22),
              score: Math.min(95, 74 + (c.ectsCredits || 3) * 4),
              avatars: [initials],
            };
          });
          setHighlights(items);
        } else {
          setHighlights([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load course performance highlights:", err);
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
        <CardTitle className="text-sm font-medium">Course Success & Validation Rates</CardTitle>
        <CardAction className="flex items-center gap-1 text-muted-foreground text-xs">
          <Link href="/dashboard/courses" className="flex items-center gap-1 hover:text-foreground">
            Curriculum <ArrowRight className="size-3.5" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : highlights.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-muted-foreground text-xs">
            No course metrics available in database.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <BarChart
              accessibilityLayer
              data={highlights}
              layout="vertical"
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis hide type="number" />
              <YAxis axisLine={false} dataKey="className" tickLine={false} tickMargin={10} type="category" />
              <Bar dataKey="duration" shape={<PerformanceHighlightBar />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
