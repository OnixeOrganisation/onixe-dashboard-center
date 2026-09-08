"use client";

import * as React from "react";

import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateAttendanceSheetHtml } from "@/lib/export-engine/templates/attendance-sheet";

import { SAMPLE_STUDENT_ATTENDANCE } from "./data";

export function ExportReportDialog() {
  const [open, setOpen] = React.useState(false);
  const [cohort, setCohort] = React.useState("Promo Dev Master 2024-A");
  const [period, setPeriod] = React.useState("November 2024");
  const [format, setFormat] = React.useState("OPCO Standard PDF Certificate");

  const formattedRecords = SAMPLE_STUDENT_ATTENDANCE.map((s) => ({
    studentName: s.name,
    studentId: s.matricule,
    courseName: "Distributed Microservices Architecture with NestJS",
    date: "2024-11-18",
    timeSlot: "09:00 - 12:30",
    status: (s.status === "Present"
      ? "Present"
      : s.status === "Late"
        ? "Late"
        : s.status === "Absent Justified"
          ? "Justified"
          : "Absent") as "Present" | "Justified" | "Late" | "Absent",
    method: "Digital Signature (PIN)",
    justificationNote: s.justificationNote || "—",
  }));

  const handleExport = () => {
    if (format === "Excel Detailed Telemetry Matrix") {
      exportToCsv(
        `Attendance_Telemetry_${cohort.replace(/\s+/g, "_")}_${period.replace(/\s+/g, "_")}`,
        formattedRecords,
        [
          { key: "studentName", label: "Student Name" },
          { key: "studentId", label: "Student ID" },
          { key: "courseName", label: "Course / Module" },
          { key: "date", label: "Date" },
          { key: "timeSlot", label: "Time Slot" },
          { key: "status", label: "Status" },
          { key: "method", label: "Check-in Method" },
          { key: "justificationNote", label: "Notes" },
        ],
      );
      toast.success("Excel Telemetry Matrix Exported", {
        description: `Downloaded attendance data for ${cohort} (${period}).`,
      });
    } else {
      const html = generateAttendanceSheetHtml({
        cohortName: cohort,
        period,
        courseName: "Distributed Microservices Architecture with NestJS",
        instructorName: "Dr. Alexandre Merceron",
        records: formattedRecords,
      });

      printHtmlDocument({
        title: `Attendance_Report_${cohort}_${period}`,
        htmlContent: html,
        pageOrientation: "portrait",
      });

      toast.success("OPCO Compliance Sheet Generated", {
        description: `Ready to print or save as certified PDF for ${cohort}.`,
      });
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          Export OPCO Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Generate Compliance Certificate
          </DialogTitle>
          <DialogDescription>
            Export certified monthly or quarterly attendance certificates for apprenticeship funding bodies and
            corporate sponsors.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="rep-cohort">Target Cohort</Label>
            <Select value={cohort} onValueChange={setCohort}>
              <SelectTrigger id="rep-cohort">
                <SelectValue placeholder="Select Cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Promo Dev Master 2024-A">Promo Dev Master 2024-A</SelectItem>
                <SelectItem value="Promo Dev Master 2024-B">Promo Dev Master 2024-B</SelectItem>
                <SelectItem value="Promo Cloud & DevOps 2024-A">Promo Cloud & DevOps 2024-A</SelectItem>
                <SelectItem value="Promo Cyber Ops 2024-A">Promo Cyber Ops 2024-A</SelectItem>
                <SelectItem value="Promo Data & AI 2024-A">Promo Data & AI 2024-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-period">Reporting Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="rep-period">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="November 2024">November 2024 (Current)</SelectItem>
                <SelectItem value="October 2024">October 2024</SelectItem>
                <SelectItem value="September 2024">September 2024</SelectItem>
                <SelectItem value="Q4 2024 (Full Quarter)">Q4 2024 (Full Quarter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-fmt">Certificate Template</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="rep-fmt">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPCO Standard PDF Certificate">
                  OPCO / CFA Certified PDF with Digital Stamp
                </SelectItem>
                <SelectItem value="Excel Detailed Telemetry Matrix">
                  Excel Detailed Hourly Telemetry Matrix (.xlsx)
                </SelectItem>
                <SelectItem value="Employer Sponsor Monthly Summary">Employer Sponsor Monthly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-1.5">
            <Download className="size-3.5" />
            Download Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
