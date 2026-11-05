"use client";

import * as React from "react";

import { Download, Lock, Printer } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradebookApi, StudentsApi } from "@/lib/api/center-api";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateTranscriptHtml } from "@/lib/export-engine/templates/grade-transcript";

import { type ExamItem, SAMPLE_GRADEBOOK_RECORDS, type StudentGradeRecord } from "./data";

interface SubmitGradesDialogProps {
  exam: ExamItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidateExam: (examId: string) => void;
}

export function SubmitGradesDialog({ exam, open, onOpenChange, onValidateExam }: SubmitGradesDialogProps) {
  const [records, setRecords] = React.useState<StudentGradeRecord[]>(SAMPLE_GRADEBOOK_RECORDS);

  React.useEffect(() => {
    if (!open || !exam) return;
    StudentsApi.list(exam.cohortId)
      .then((students) => {
        if (students && students.length > 0) {
          const mapped: StudentGradeRecord[] = students.map((s, idx) => ({
            studentId: s.id,
            studentName: s.name,
            matricule: s.matricule || `STU-2026-00${idx + 1}`,
            assessment1: 15,
            assessment2: 16,
            examScore: 17,
            finalGrade: 16.5,
            status: "Passed",
            rank: idx + 1,
            attendancePercentage: s.attendanceRate || 98,
            remarks: "Très bon investissement académique",
          }));
          setRecords(mapped);
        } else {
          setRecords(SAMPLE_GRADEBOOK_RECORDS);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load students for gradebook submission:", err);
        setRecords(SAMPLE_GRADEBOOK_RECORDS);
      });
  }, [open, exam]);

  if (!exam) return null;

  const handleGradeChange = (studentId: string, field: "assessment1" | "assessment2" | "examScore", val: string) => {
    const num = Math.min(Math.max(Number.parseFloat(val) || 0, 0), 20);
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          const updated = { ...r, [field]: num };
          // calculate weighted final (25% CC1, 25% CC2, 50% Exam)
          const computed = Number.parseFloat(
            (updated.assessment1 * 0.25 + updated.assessment2 * 0.25 + updated.examScore * 0.5).toFixed(1),
          );
          let status: StudentGradeRecord["status"] = "Failed";
          if (computed >= 14) {
            status = "Honors";
          } else if (computed >= 10) {
            status = "Passed";
          }
          return { ...updated, finalGrade: computed, status };
        }
        return r;
      }),
    );
  };

  const handleExportCsv = () => {
    exportToCsv(`Gradebook_${exam.code}_${exam.cohort.replace(/\s+/g, "_")}`, records, [
      { key: "studentName", label: "Student Name" },
      { key: "studentId", label: "Student ID" },
      { key: "assessment1", label: "CC 1 (/20)" },
      { key: "assessment2", label: "CC 2 (/20)" },
      { key: "examScore", label: "Final Exam (/20)" },
      { key: "finalGrade", label: "Weighted Average (/20)" },
      { key: "status", label: "Deliberation Status" },
    ]);
    toast.success("Gradebook CSV Exported", {
      description: `Downloaded assessment matrix for ${exam.cohort}.`,
    });
  };

  const handlePrintDeliberation = () => {
    const sampleCourses = [
      {
        courseCode: exam.code,
        courseTitle: exam.course,
        ectsCredits: 6,
        coefficient: 3,
        grade: Number.parseFloat(classAverage),
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
      studentName: records[0]?.studentName ?? "Alexandre Mercier",
      studentId: records[0]?.studentId ?? "STU-2024-001",
      cohortName: exam.cohort,
      academicYear: "2024 - 2025",
      programTitle: "Master of Science in Software & Cloud Architecture",
      departmentName: "Software Engineering & Distributed Systems",
      courses: sampleCourses,
      juryVerdict: "ADMITTED - HONORS (Mention Très Bien)",
    });

    printHtmlDocument({
      title: `Official_Transcript_${exam.cohort}`,
      htmlContent: html,
      pageOrientation: "portrait",
    });

    toast.success("Official Deliberation Transcript Ready", {
      description: "Document ready to print or save as certified PDF.",
    });
  };

  const handleValidateJury = async () => {
    try {
      await GradebookApi.validateGrades(exam.id, "inst_hod");
      onValidateExam(exam.id);
      toast.success("Gradebook Officially Validated", {
        description: `Final marks for ${exam.cohort} in ${exam.course} have been sealed and validated by the academic jury.`,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to seal gradebook:", err);
      const message = err instanceof Error ? err.message : "Erreur inattendue lors de la validation";
      toast.error("Échec de la validation officielle", { description: message });
    }
  };

  const getStatusBadge = (status: StudentGradeRecord["status"]) => {
    if (status === "Honors") {
      return "border-purple-600/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
    if (status === "Passed") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  const classAverage = (records.reduce((acc, r) => acc + r.finalGrade, 0) / (records.length || 1)).toFixed(1);

  const passRate = Math.round((records.filter((r) => r.status !== "Failed").length / (records.length || 1)) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {exam.code}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {exam.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg">{exam.title}</DialogTitle>
          <DialogDescription>
            {exam.cohort} • Course: {exam.course} • Lead Examiner: {exam.examiner}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-lg border bg-muted/20 p-2.5">
              <div className="text-[11px] text-muted-foreground">Class Average</div>
              <div className="mt-0.5 font-bold text-lg">{classAverage} / 20</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-2.5">
              <div className="text-[11px] text-muted-foreground">Pass Rate</div>
              <div className="mt-0.5 font-bold text-emerald-600 text-lg">{passRate}%</div>
            </div>
            <div className="rounded-lg border bg-muted/20 p-2.5">
              <div className="text-[11px] text-muted-foreground">Candidate Roll</div>
              <div className="mt-0.5 font-bold text-lg">{records.length} students</div>
            </div>
          </div>

          {/* Grade Entry Table */}
          <div className="max-h-[300px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Student / Matricule</TableHead>
                  <TableHead className="w-[90px] text-center">CC1 (25%)</TableHead>
                  <TableHead className="w-[90px] text-center">CC2 (25%)</TableHead>
                  <TableHead className="w-[90px] text-center">Exam (50%)</TableHead>
                  <TableHead className="w-[90px] text-center">Final (/20)</TableHead>
                  <TableHead className="w-[90px] text-right">Deliberation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.studentId}>
                    <TableCell>
                      <div className="grid gap-0.5 text-xs">
                        <span className="font-medium text-foreground">{record.studentName}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{record.matricule}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        className="mx-auto h-7 w-16 text-center text-xs"
                        value={record.assessment1}
                        onChange={(e) => handleGradeChange(record.studentId, "assessment1", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        className="mx-auto h-7 w-16 text-center text-xs"
                        value={record.assessment2}
                        onChange={(e) => handleGradeChange(record.studentId, "assessment2", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        className="mx-auto h-7 w-16 text-center font-semibold text-xs"
                        value={record.examScore}
                        onChange={(e) => handleGradeChange(record.studentId, "examScore", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center font-bold text-sm">{record.finalGrade}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className={`text-[10px] ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportCsv}>
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrintDeliberation}>
              <Printer className="size-3.5" />
              Print Deliberation Transcript
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={handleValidateJury}
            >
              <Lock className="size-3.5" />
              Sign & Seal Jury Deliberation
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
