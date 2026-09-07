"use client";

import * as React from "react";

import { Calendar } from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";

import type { InternshipItem } from "./data";

interface ScheduleDefenseDialogProps {
  internship: InternshipItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateDefense: (id: string, date: string, room: string) => void;
}

export function ScheduleDefenseDialog({ internship, open, onOpenChange, onUpdateDefense }: ScheduleDefenseDialogProps) {
  const [defenseDate, setDefenseDate] = React.useState("2025-06-25");
  const [defenseRoom, setDefenseRoom] = React.useState("Alan Turing Amphitheatre");

  React.useEffect(() => {
    if (internship?.defenseDate) {
      setDefenseDate(internship.defenseDate);
      setDefenseRoom(internship.defenseRoom ?? "Alan Turing Amphitheatre");
    }
  }, [internship]);

  if (!internship) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdateDefense(internship.id, defenseDate, defenseRoom);
    toast.success("Defense Jury Scheduled", {
      description: `PFE defense for ${internship.studentName} scheduled on ${defenseDate} in ${defenseRoom}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Schedule Capstone Defense Jury
            </DialogTitle>
            <DialogDescription>
              Program the final thesis defense for {internship.studentName} ({internship.companyName}).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="def-date">Defense Date *</Label>
              <Input
                id="def-date"
                type="date"
                value={defenseDate}
                onChange={(e) => setDefenseDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="def-room">Amphitheatre / Jury Room *</Label>
              <Input
                id="def-room"
                value={defenseRoom}
                onChange={(e) => setDefenseRoom(e.target.value)}
                placeholder="Alan Turing Amphitheatre"
                required
              />
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/20 p-3 text-xs">
              <div className="font-semibold text-foreground">Jury Composition</div>
              <div className="text-muted-foreground">Academic Supervisor: {internship.academicSupervisor}</div>
              <div className="text-muted-foreground">Enterprise Mentor: {internship.companyTutor}</div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Defense Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
