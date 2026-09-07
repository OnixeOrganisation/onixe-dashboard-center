"use client";

import * as React from "react";

import { Calendar, Plus } from "lucide-react";
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
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState(COURSES[0]);
  const [examiner, setExaminer] = React.useState("Dr. Alexandre Merceron");
  const [date, setDate] = React.useState("2024-12-22");
  const [time, setTime] = React.useState("10:00 - 12:00");
  const [room, setRoom] = React.useState("Classroom Euler");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Validation Error", { description: "Retake title is required." });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newSession: RetakeSessionItem = {
      id: `ret-${Date.now()}`,
      code: `RETAKE-${randomNum}`,
      title: title.trim(),
      course,
      examiner,
      date,
      time,
      room,
      enrolledStudentsCount: 1,
      status: "Scheduled",
    };

    onAddRetake(newSession);
    toast.success("Remediation Session Scheduled", {
      description: `${newSession.title} scheduled for ${newSession.date}.`,
    });

    setTitle("");
    setOpen(false);
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
              Schedule Remediation / Retake Exam
            </DialogTitle>
            <DialogDescription>
              Program a retake exam session for students with failing grades below 10/20.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="ret-title">Retake Exam Title *</Label>
              <Input
                id="ret-title"
                placeholder="e.g. Kubernetes SRE Retake Session"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ret-course">Subject</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger id="ret-course">
                  <SelectValue placeholder="Select Course" />
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
                <Label htmlFor="ret-date">Date</Label>
                <Input id="ret-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ret-time">Time Slot</Label>
                <Input
                  id="ret-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10:00 - 12:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ret-room">Room</Label>
                <Input
                  id="ret-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Classroom Euler"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ret-exam">Examiner</Label>
                <Input
                  id="ret-exam"
                  value={examiner}
                  onChange={(e) => setExaminer(e.target.value)}
                  placeholder="Dr. Alexandre Merceron"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Retake</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
