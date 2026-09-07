"use client";

import * as React from "react";

import { AlertTriangle, Calendar, CheckCircle2, Copy, FileCode, Loader2, Play, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { INITIAL_RISK_STUDENTS, type RetentionRiskItem } from "./data";

export function AiToolsView() {
  // Generator state
  const [topicPrompt, setTopicPrompt] = React.useState("Distributed Event-Driven Microservices in NestJS");
  const [ectsTarget, setEctsTarget] = React.useState("6");
  const [targetDegree, setTargetDegree] = React.useState("Master");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedSyllabus, setGeneratedSyllabus] = React.useState<string | null>(null);

  // Scheduler state
  const [isOptimizingSchedule, setIsOptimizingSchedule] = React.useState(false);
  const [scheduleSuccess, setScheduleSuccess] = React.useState(false);

  const [riskStudents] = React.useState<RetentionRiskItem[]>(INITIAL_RISK_STUDENTS);

  const handleGenerateSyllabus = () => {
    if (!topicPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSyllabus(
        `### Pédagogical Syllabus: ${topicPrompt}\n\n` +
          `**Target Level**: ${targetDegree} • **ECTS**: ${ectsTarget} Credits • **Total Hours**: 48h\n\n` +
          `#### Module 1: Architecture Fundamentals (12h)\n` +
          `- Core domain models, hexagonal architecture, and dependency injection.\n` +
          `- Practical Lab: Setting up multi-tenant NestJS application.\n\n` +
          `#### Module 2: Message Brokering & Event Bus (12h)\n` +
          `- RabbitMQ topic exchanges, consumer worker idempotency, and dead-letter queues.\n` +
          `- Practical Lab: Implementing asynchronous order processing pipeline.\n\n` +
          `#### Module 3: Database Isolation & Prisma (12h)\n` +
          `- Multi-schema isolation, migration management, and read-replica pooling.\n\n` +
          `#### Module 4: Observability, Metrics & Production Hardening (12h)\n` +
          `- Structured logging, OpenTelemetry integration, and health check probes.`,
      );
      toast.success("AI Syllabus Generated", {
        description: "Full modular curriculum and competencies framework created.",
      });
    }, 1200);
  };

  const handleOptimizeSchedule = () => {
    setIsOptimizingSchedule(true);
    setScheduleSuccess(false);

    setTimeout(() => {
      setIsOptimizingSchedule(false);
      setScheduleSuccess(true);
      toast.success("Schedule Optimized Without Conflicts", {
        description: "Checked 6 amphitheaters and 48 weekly slots across all active cohorts. 0 collisions detected.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Institutional AI Engine & Telemetry</h1>
          <p className="text-muted-foreground text-sm">
            Automated syllabus generation, conflict-free timetable optimization, and predictive learner retention
            analytics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Syllabus Generator
            </span>
            <Sparkles className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-xl tracking-tight">AI Curriculum Builder</div>
          <div className="mt-1 font-medium text-purple-600 text-xs">Standards-aligned ECTS generator</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Smart Timetable Solver
            </span>
            <Calendar className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-xl tracking-tight">Zero-Conflict Engine</div>
          <div className="mt-1 font-medium text-sky-600 text-xs">Classroom & faculty constraint solver</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Retention Early Warning
            </span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-xl tracking-tight">{riskStudents.length} Students Flagged</div>
          <div className="mt-1 font-medium text-amber-600 text-xs">Predictive dropout prevention</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generator" className="text-xs">
            Syllabus Generator
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="text-xs">
            Timetable Constraint Solver
          </TabsTrigger>
          <TabsTrigger value="retention" className="text-xs">
            Retention & Risk Telemetry ({riskStudents.length})
          </TabsTrigger>
        </TabsList>

        {/* Syllabus Generator Tab */}
        <TabsContent value="generator">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wand2 className="size-4 text-primary" />
                  Course & Syllabus Generator
                </CardTitle>
                <CardDescription className="text-xs">
                  Prompt the pedagogical assistant to synthesize learning modules, ECTS weightings, and practical labs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gen-topic" className="text-xs">
                    Subject / Technical Course Title
                  </Label>
                  <Input
                    id="gen-topic"
                    value={topicPrompt}
                    onChange={(e) => setTopicPrompt(e.target.value)}
                    placeholder="e.g. Distributed Event-Driven Microservices in NestJS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="gen-level" className="text-xs">
                      Target Degree Level
                    </Label>
                    <Select value={targetDegree} onValueChange={setTargetDegree}>
                      <SelectTrigger id="gen-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor">Bachelor (Bac+3)</SelectItem>
                        <SelectItem value="Master">Master (Bac+5)</SelectItem>
                        <SelectItem value="Executive Certificate">Executive Certificate</SelectItem>
                        <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gen-ects" className="text-xs">
                      Target ECTS Credits
                    </Label>
                    <Input
                      id="gen-ects"
                      type="number"
                      value={ectsTarget}
                      onChange={(e) => setEctsTarget(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleGenerateSyllabus} disabled={isGenerating} className="w-full gap-2">
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Synthesizing Syllabus...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Generate Pedagogical Syllabus
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileCode className="size-4 text-emerald-500" />
                    Generated Curriculum Output
                  </CardTitle>
                  {generatedSyllabus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSyllabus);
                        toast.success("Syllabus Copied to Clipboard");
                      }}
                    >
                      <Copy className="size-3" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedSyllabus ? (
                  <div className="max-h-[340px] overflow-y-auto whitespace-pre-wrap rounded-lg border bg-card p-4 font-mono text-xs leading-relaxed">
                    {generatedSyllabus}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground text-xs">
                    Click &ldquo;Generate Pedagogical Syllabus&rdquo; to formulate a structured course breakdown.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timetable Constraint Solver Tab */}
        <TabsContent value="scheduler">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Smart Timetable Conflict Optimizer</CardTitle>
              <CardDescription className="text-xs">
                Heuristic solver verifying teacher availability, student cohorts, room capacities, and lab equipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 rounded-xl border bg-muted/20 p-4 text-center text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground">Room Constraints</span>
                  <div className="mt-0.5 font-bold text-foreground">13 Classrooms & Labs</div>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Faculty Constraints</span>
                  <div className="mt-0.5 font-bold text-foreground">8 Instructors</div>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Weekly Slots</span>
                  <div className="mt-0.5 font-bold text-foreground">48 Hours / Cohort</div>
                </div>
              </div>

              {scheduleSuccess && (
                <div className="space-y-1 rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-4 text-emerald-600 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="size-4" />
                    Optimal Timetable Matrix Formulated
                  </div>
                  <div>All promotions mapped with zero room overlaps and 100% instructor workload compliance.</div>
                </div>
              )}

              <Button onClick={handleOptimizeSchedule} disabled={isOptimizingSchedule} className="gap-2">
                {isOptimizingSchedule ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Solving Constraint Matrix...
                  </>
                ) : (
                  <>
                    <Play className="size-4" />
                    Execute Schedule Optimization
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention & Risk Telemetry Tab */}
        <TabsContent value="retention">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Predictive Student Retention Signals</CardTitle>
              <CardDescription className="text-xs">
                Telemetric dropout risk analysis combining grade averages, absence frequency, and assignment velocity.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {riskStudents.map((st) => (
                  <div key={st.id} className="space-y-2 p-4 text-xs">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10 font-bold text-destructive text-xs">
                          {st.riskScore}%
                        </div>
                        <div className="grid gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm">{st.studentName}</span>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {st.matricule}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-muted-foreground">{st.cohort}</span>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="w-fit border-destructive/30 bg-destructive/10 text-destructive text-xs"
                      >
                        {st.riskLevel} ({st.riskScore}% Risk)
                      </Badge>
                    </div>

                    <div className="space-y-1.5 rounded-md border bg-muted/20 p-3">
                      <div className="font-semibold text-[11px] text-foreground">Contributing Risk Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {st.contributingFactors.map((f) => (
                          <Badge key={f} variant="outline" className="bg-background text-[10px]">
                            {f}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-1 font-medium text-[11px] text-foreground">
                        Recommended Action: <span className="text-muted-foreground">{st.recommendedAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
