"use client";

import * as React from "react";

import { Calendar, Loader2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { RetakeSessionItem } from "./data";
import { scheduleRetakeApi } from "./remediation.api";

interface ScheduleRetakeDialogProps {
  onAddRetake: (session: RetakeSessionItem) => void;
}

const COURSES = [
  "Distributed Microservices Architecture with NestJS",
  "Kubernetes Cluster Administration & GitOps",
  "Offensive Security & Red Teaming Operations",
  "Applied Machine Learning & Deep Learning with PyTorch",
];

export function ScheduleRetakeDialog({ onAddRetake }: ScheduleRetakeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState(COURSES[0]);
  const [examiner, setExaminer] = React.useState("Dr. Alexandre Merceron");
  const [date, setDate] = React.useState("2024-12-22");
  const [time, setTime] = React.useState("10:00 - 12:00");
  const [room, setRoom] = React.useState("Classroom Euler");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Validation Error", { description: "Retake title is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await scheduleRetakeApi({
        title: title.trim(),
        course,
        examiner,
        date,
        time,
        room,
      });

      onAddRetake(created);
      toast.success("Remediation Session Scheduled", {
        description: `${created.title} scheduled for ${created.date}.`,
      });

      setTitle("");
      setOpen(false);
    } catch (err: any) {
      toast.error("Failed to schedule retake", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Schedule Retake Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Schedule Official Retake Examination
            </DialogTitle>
            <DialogDescription>
              Set up a second-chance jury session for students needing course remediation to validate required ECTS.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="ret-title">Session Title *</Label>
              <Input
                id="ret-title"
                placeholder="e.g. Distributed Microservices Retake Examination"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ret-course">Remediation Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger id="ret-course">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ret-exam">Supervising Examiner</Label>
                <Input
                  id="ret-exam"
                  placeholder="Prof. Name"
                  value={examiner}
                  onChange={(e) => setExaminer(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ret-room">Examination Room</Label>
                <Input id="ret-room" placeholder="Lab / Room" value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ret-date">Date *</Label>
                <Input id="ret-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ret-time">Time Slot *</Label>
                <Input
                  id="ret-time"
                  placeholder="10:00 - 12:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule & Notify Candidates"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
