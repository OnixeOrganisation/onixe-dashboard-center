"use client";

import * as React from "react";

import {
  Award,
  Calendar,
  Download,
  Loader2,
  Lock,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  Users,
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
import type { ExamItem } from "./data";
import { fetchExams, type ScheduleExamPayload, scheduleExamApi, validateGradebookApi } from "./gradebook.api";
import { SubmitGradesDialog } from "./submit-grades-dialog";

export function GradebookList() {
  const [exams, setExams] = React.useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [selectedExam, setSelectedExam] = React.useState<ExamItem | null>(null);
  const [gradesDialogOpen, setGradesDialogOpen] = React.useState(false);

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      const data = await fetchExams();
      setExams(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Sessions d'examen synchronisées", {
          description: "Calendrier des examens et délibérations chargé depuis NestJS.",
        });
      }
    } catch (err) {
      toast.error("Impossible de charger les examens", {
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

  const handleAddExam = async (payload: ScheduleExamPayload): Promise<boolean> => {
    try {
      const created = await scheduleExamApi(payload);
      setExams((prev) => [created, ...prev]);
      toast.success("Session d'examen programmée avec succès", {
        description: `${created.title} (${created.code}) enregistrée en base de données.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de la programmation de l'examen", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleValidateExam = async (examId: string) => {
    try {
      await validateGradebookApi(examId);
      setExams((prev) => prev.map((e) => (e.id === examId ? { ...e, status: "Validated" } : e)));
      toast.success("Délibération validée et publiée", {
        description: "Les notes ont été certifiées par la direction des études.",
      });
    } catch (err) {
      toast.error("Erreur lors de la validation des notes", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
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
  const totalCandidates = exams.reduce((acc, e) => acc + (e.totalCandidates || 0), 0);

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
    toast.success("Matrice des examens exportée", {
      description: "Fichier CSV téléchargé avec succès.",
    });
  };

  const handlePrintExamTranscript = (exam: ExamItem) => {
    const html = generateTranscriptHtml({
      studentName: "Cohort Deliberation Sheet (Summary)",
      studentId: exam.code,
      cohortName: exam.cohort,
      academicYear: "2024 - 2025",
      programTitle: exam.course,
      departmentName: "Academic Direction",
      juryVerdict: "Admitted by Jury",
      deliberationDate: exam.date,
      courses: [
        {
          courseCode: exam.code,
          courseTitle: exam.title,
          ectsCredits: 6,
          coefficient: 2,
          grade: 16.8,
          status: "Validated",
          evaluator: exam.examiner,
        },
      ],
    });

    printHtmlDocument({ title: `Deliberation_${exam.code}`, htmlContent: html });
    toast.success("Feuille de délibération imprimée");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Gradebook & Academic Deliberations</h1>
          <p className="text-muted-foreground text-sm">
            Centralized exam scheduling, grade submission workflow, jury deliberations, and transcript certification.
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
          <Button variant="outline" size="sm" onClick={handleExportAllExams} className="gap-2">
            <Download className="size-4" />
            Export Matrix
          </Button>
          <CreateExamDialog onAddExam={handleAddExam} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Scheduled Exams</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalExams}</div>
          <div className="mt-1 text-muted-foreground text-xs">Total sessions in registry</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Jury Validated & Locked
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{validatedExams}</div>
          <div className="mt-1 text-muted-foreground text-xs">Official final transcripts published</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Pending Grading</span>
            <Award className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{pendingGrading}</div>
          <div className="mt-1 text-muted-foreground text-xs">Awaiting instructor grade input</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Total Candidates</span>
            <Users className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalCandidates}</div>
          <div className="mt-1 text-muted-foreground text-xs">Learners sitting examinations</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Examination Registry & Deliberation Ledger</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams, courses, cohorts..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[160px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Grading">Grading in Progress</SelectItem>
                  <SelectItem value="Validated">Validated & Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground text-xs">Chargement des examens depuis le serveur NestJS...</p>
            </div>
          ) : (
            <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Exam Session</TableHead>
                    <TableHead>Target Cohort</TableHead>
                    <TableHead>Date & Slot</TableHead>
                    <TableHead>Location & Examiner</TableHead>
                    <TableHead className="w-[90px] text-center">Candidates</TableHead>
                    <TableHead className="w-[120px]">Deliberation</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No examination sessions found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-bold font-mono text-[11px]">
                                {exam.code}
                              </Badge>
                              <span className="font-semibold text-foreground text-sm leading-tight">{exam.title}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">{exam.course}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className="font-normal text-xs">
                            {exam.cohort}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-medium text-foreground">{exam.date}</span>
                            <span className="text-muted-foreground">{exam.time}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-medium text-foreground">{exam.room}</span>
                            <span className="text-muted-foreground">{exam.examiner}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center font-bold text-xs">{exam.totalCandidates}</TableCell>

                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusBadgeClass(exam.status)}`}>
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
                                Submit Grades & Deliberate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintExamTranscript(exam)}>
                                <Printer className="mr-2 size-4" />
                                Print Deliberation Report
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {exam.status !== "Validated" && (
                                <DropdownMenuItem onClick={() => handleValidateExam(exam.id)}>
                                  <Lock className="mr-2 size-4 text-emerald-600" />
                                  Validate & Publish
                                </DropdownMenuItem>
                              )}
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

      {/* Grade Submission & Deliberation Modal */}
      {selectedExam && (
        <SubmitGradesDialog
          open={gradesDialogOpen}
          onOpenChange={setGradesDialogOpen}
          exam={selectedExam}
          onValidateExam={handleValidateExam}
        />
      )}
    </div>
  );
}
