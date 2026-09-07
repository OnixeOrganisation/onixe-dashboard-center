"use client";

import * as React from "react";

import { FileCheck } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type AttendanceSessionItem, SAMPLE_STUDENT_ATTENDANCE, type StudentAttendanceEntry } from "./data";

interface RecordAttendanceDialogProps {
  session: AttendanceSessionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSession: (sessionId: string, present: number, absent: number, justified: number) => void;
}

export function RecordAttendanceDialog({ session, open, onOpenChange, onUpdateSession }: RecordAttendanceDialogProps) {
  const [entries, setEntries] = React.useState<StudentAttendanceEntry[]>(SAMPLE_STUDENT_ATTENDANCE);

  React.useEffect(() => {
    setEntries(SAMPLE_STUDENT_ATTENDANCE);
  }, []);

  if (!session) return null;

  const handleStatusChange = (studentId: string, newStatus: StudentAttendanceEntry["status"]) => {
    setEntries((prev) => prev.map((e) => (e.studentId === studentId ? { ...e, status: newStatus } : e)));
  };

  const handleSave = () => {
    const present = entries.filter((e) => e.status === "Present" || e.status === "Late").length;
    const absent = entries.filter((e) => e.status === "Absent Unjustified").length;
    const justified = entries.filter((e) => e.status === "Absent Justified").length;

    onUpdateSession(session.id, present, absent, justified);
    toast.success("Attendance Sheet Sealed", {
      description: `Attendance recorded for ${session.cohort} on ${session.date}.`,
    });
    onOpenChange(false);
  };

  const getStatusBadge = (status: StudentAttendanceEntry["status"]) => {
    if (status === "Present") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Late") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    if (status === "Absent Justified") {
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
              {session.code}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {session.date} • {session.slot}
            </Badge>
          </div>
          <DialogTitle className="text-lg">{session.course}</DialogTitle>
          <DialogDescription>
            {session.cohort} • Instructor: {session.instructor} • {session.room}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Table */}
          <div className="max-h-[320px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Learner / Matricule</TableHead>
                  <TableHead className="w-[120px]">Check-in Time</TableHead>
                  <TableHead className="w-[160px]">Status & Justification</TableHead>
                  <TableHead className="w-[130px] text-right">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.studentId}>
                    <TableCell>
                      <div className="grid gap-0.5 text-xs">
                        <span className="font-medium text-foreground">{entry.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{entry.matricule}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs">{entry.checkInTime}</TableCell>

                    <TableCell>
                      <div className="grid gap-0.5">
                        <Badge variant="secondary" className={`w-fit text-[10px] ${getStatusBadge(entry.status)}`}>
                          {entry.status}
                        </Badge>
                        {entry.justificationNote && (
                          <span className="max-w-[140px] truncate text-[10px] text-muted-foreground italic">
                            {entry.justificationNote}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Select
                        value={entry.status}
                        onValueChange={(val) =>
                          handleStatusChange(entry.studentId, val as StudentAttendanceEntry["status"])
                        }
                      >
                        <SelectTrigger className="ml-auto h-7 w-[120px] text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Absent Justified">Justified</SelectItem>
                          <SelectItem value="Absent Unjustified">Unjustified</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            <FileCheck className="size-3.5" />
            Seal Attendance Sheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
