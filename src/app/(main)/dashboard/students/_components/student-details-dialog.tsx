"use client";

import { Download, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";

import type { StudentItem } from "./data";

interface StudentDetailsDialogProps {
  student: StudentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, newStatus: StudentItem["status"]) => void;
}

export function StudentDetailsDialog({ student, open, onOpenChange, onStatusChange }: StudentDetailsDialogProps) {
  if (!student) return null;

  const handleDownloadTranscript = () => {
    toast.success("Transcript Downloaded", {
      description: `Official PDF transcript for ${student.name} (${student.matricule}) has been generated.`,
    });
  };

  const handleToggleStatus = () => {
    const nextStatus = student.status === "Active" ? "Suspended" : "Active";
    onStatusChange?.(student.id, nextStatus);
    toast.info("Student Status Updated", {
      description: `${student.name}'s status is now ${nextStatus}.`,
    });
    onOpenChange(false);
  };

  const getStatusBadgeClass = (status: StudentItem["status"]) => {
    if (status === "Active") {
      return "border-green-600/30 bg-green-500/10 text-green-600 dark:text-green-400";
    }
    if (status === "Graduated") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {student.matricule}
            </Badge>
            <Badge variant="secondary" className={getStatusBadgeClass(student.status)}>
              {student.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{student.name}</DialogTitle>
          <DialogDescription>
            Enrolled in {student.cohort} • {student.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Profile Card */}
          <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
            <Avatar className="size-14">
              <AvatarFallback className="font-semibold text-base">
                {student.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="size-3.5 text-muted-foreground" />
                {student.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                {student.phone}
              </div>
              <div className="text-muted-foreground">Enrolled on: {student.enrollmentDate}</div>
            </div>
          </div>

          {/* Academic Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">Grade Average</div>
              <div className="mt-1 font-bold text-foreground text-xl">
                {student.gradeAverage > 0 ? `${student.gradeAverage} / 20` : "N/A"}
              </div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">Attendance</div>
              <div className="mt-1 font-bold text-foreground text-xl">{student.attendanceRate}%</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">ECTS Credits</div>
              <div className="mt-1 font-bold text-foreground text-xl">{student.creditsEarned} pts</div>
            </div>
          </div>

          {/* Attendance progress bar */}
          <div className="space-y-1.5 rounded-lg border p-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Attendance Telemetry</span>
              <span className="font-medium text-foreground">{student.attendanceRate}% compliance</span>
            </div>
            <Progress value={student.attendanceRate} className="h-2" />
          </div>

          {/* Guardian Information */}
          {student.guardianName && (
            <div className="space-y-1 rounded-lg border p-3 text-xs">
              <div className="font-medium text-foreground">Parent / Legal Guardian</div>
              <div className="text-muted-foreground">
                {student.guardianName} • {student.guardianEmail}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="destructive" size="sm" onClick={handleToggleStatus}>
            {student.status === "Active" ? "Suspend Student" : "Reactivate Student"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadTranscript}>
            <Download className="size-3.5" />
            Download Transcript PDF
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
