"use client";

import * as React from "react";

import { Award, Calendar, Download, Lock, MoreHorizontal, Printer, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateTranscriptHtml } from "@/lib/export-engine/templates/grade-transcript";

import { CreateExamDialog } from "./create-exam-dialog";
import { type ExamItem, INITIAL_EXAMS } from "./data";
import { SubmitGradesDialog } from "./submit-grades-dialog";

export function GradebookList() {
  const [exams, setExams] = React.useState<ExamItem[]>(INITIAL_EXAMS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [selectedExam, setSelectedExam] = React.useState<ExamItem | null>(null);
  const [gradesDialogOpen, setGradesDialogOpen] = React.useState(false);

  const handleAddExam = (newExam: ExamItem) => {
    setExams([newExam, ...exams]);
  };

  const handleValidateExam = (examId: string) => {
    setExams((prev) => prev.map((e) => (e.id === examId ? { ...e, status: "Validated" } : e)));
  };

  const filteredExams = exams.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      e.title.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.course.toLowerCase().includes(q) ||
      e.cohort.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalExams = exams.length;
  const validatedExams = exams.filter((e) => e.status === "Validated").length;
  const pendingGrading = exams.filter((e) => e.status === "Grading").length;
  const totalCandidates = exams.reduce((acc, e) => acc + e.totalCandidates, 0);

  const getStatusBadgeClass = (status: ExamItem["status"]) => {
    if (status === "Validated") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Grading") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  };

  const handleExportAllExams = () => {
    exportToCsv("Academic_Examinations_Schedule", exams, [
      { key: "code", label: "Exam Code" },
      { key: "title", label: "Assessment Title" },
      { key: "course", label: "Course / Module" },
      { key: "cohort", label: "Target Cohort" },
      { key: "date", label: "Session Date" },
      { key: "time", label: "Time Slot" },
      { key: "room", label: "Room / Amphitheatre" },
      { key: "examiner", label: "Lead Examiner" },
      { key: "totalCandidates", label: "Registered Candidates" },
      { key: "status", label: "Deliberation Status" },
    ]);
    toast.success("Examination Matrix Exported", {
      description: "Downloaded complete assessment schedule as CSV/Excel.",
    });
  };

  const handlePrintExamTranscript = (exam: ExamItem) => {
    const sampleCourses = [
      {
        courseCode: exam.code,
        courseTitle: exam.course,
        ectsCredits: 6,
        coefficient: 3,
        grade: 15.5,
        status: "Validated" as const,
        evaluator: exam.examiner,
      },
      {
        courseCode: "DEV-502",
        courseTitle: "Cloud Infrastructure & Kubernetes",
        ectsCredits: 5,
        coefficient: 2,
        grade: 14.8,
        status: "Validated" as const,
        evaluator: "Dr. Elena Rostova",
      },
      {
        courseCode: "DEV-503",
        courseTitle: "Full-Stack TypeScript & Next.js Architecture",
        ectsCredits: 5,
        coefficient: 2,
        grade: 16.2,
        status: "Validated" as const,
        evaluator: "Prof. Arthur Pendelton",
      },
    ];

    const html = generateTranscriptHtml({
      studentName: "Cohort Representative Sample",
      studentId: `JURY-${exam.code}`,
      cohortName: exam.cohort,
      academicYear: "2024 - 2025",
      programTitle: "Master of Science in Software & Cloud Architecture",
      departmentName: "Software Engineering & Distributed Systems",
      courses: sampleCourses,
      juryVerdict: "ADMITTED - HONORS (Mention Très Bien)",
    });

    printHtmlDocument({
      title: `Deliberation_Transcript_${exam.code}_${exam.cohort}`,
      htmlContent: html,
      pageOrientation: "portrait",
    });

    toast.success("Deliberation Transcript Ready", {
      description: "Generated certified academic transcript PDF.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Gradebook & Examination Deliberations</h1>
          <p className="text-muted-foreground text-sm">
            Plan examinations, input continuous assessments, and validate academic jury deliberations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportAllExams}>
            <Download className="size-4" />
            Export Exams Matrix
          </Button>
          <CreateExamDialog onAddExam={handleAddExam} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Exam Sessions</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalExams}</div>
          <div className="mt-1 text-muted-foreground text-xs">Total scheduled sessions</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Validated by Jury
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{validatedExams}</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">Officially signed gradebooks</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Grading in Progress
            </span>
            <Award className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{pendingGrading}</div>
          <div className="mt-1 text-muted-foreground text-xs">Awaiting jury sign-off</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Evaluated Candidates
            </span>
            <Users className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalCandidates}</div>
          <div className="mt-1 text-muted-foreground text-xs">Across active cohorts</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Examination Sessions</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search exam, subject, cohort..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Grading">Grading in Progress</SelectItem>
                  <SelectItem value="Validated">Jury Validated</SelectItem>
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
                  <TableHead className="w-[280px]">Exam Session & Course</TableHead>
                  <TableHead>Target Cohort</TableHead>
                  <TableHead>Date & Slot</TableHead>
                  <TableHead>Room & Examiner</TableHead>
                  <TableHead className="w-[100px] text-center">Candidates</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No examinations found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="grid gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="font-bold font-mono text-[10px]">
                              {exam.code}
                            </Badge>
                            <span className="font-semibold text-foreground text-sm leading-tight">{exam.title}</span>
                          </div>
                          <span className="max-w-[260px] truncate text-muted-foreground text-xs">{exam.course}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-foreground text-xs">{exam.cohort}</span>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium">{exam.date}</span>
                          <span className="text-[11px] text-muted-foreground">{exam.time}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium">{exam.room}</span>
                          <span className="text-[11px] text-muted-foreground">{exam.examiner}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-bold text-xs">{exam.totalCandidates}</TableCell>

                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadgeClass(exam.status)}>
                          {exam.status}
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
                                setSelectedExam(exam);
                                setGradesDialogOpen(true);
                              }}
                            >
                              Enter Grades & Deliberate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintExamTranscript(exam)}>
                              <Printer className="mr-2 size-3.5" />
                              Print Deliberation Transcript (PDF)
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

      {/* Grade Entry & Jury Deliberation Modal */}
      <SubmitGradesDialog
        exam={selectedExam}
        open={gradesDialogOpen}
        onOpenChange={setGradesDialogOpen}
        onValidateExam={handleValidateExam}
      />
    </div>
  );
}
