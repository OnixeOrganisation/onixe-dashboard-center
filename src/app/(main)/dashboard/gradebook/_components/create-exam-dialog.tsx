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

import type { ExamItem } from "./data";

interface CreateExamDialogProps {
  onAddExam: (exam: ExamItem) => void;
}

const AVAILABLE_COURSES = [
  "Distributed Microservices Architecture with NestJS",
  "Kubernetes Cluster Administration & GitOps",
  "Offensive Security & Red Teaming Operations",
  "Applied Machine Learning & Deep Learning with PyTorch",
  "Advanced Design Systems & Interactive Prototyping",
];

const AVAILABLE_COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Dev Master 2024-B",
  "Promo Cloud & DevOps 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Data & AI 2024-A",
  "Promo UX Product 2024-A",
];

export function CreateExamDialog({ onAddExam }: CreateExamDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState(AVAILABLE_COURSES[0]);
  const [cohort, setCohort] = React.useState(AVAILABLE_COHORTS[0]);
  const [date, setDate] = React.useState("2024-12-15");
  const [time, setTime] = React.useState("09:00 - 12:00");
  const [room, setRoom] = React.useState("Alan Turing Amphitheatre");
  const [examiner, setExaminer] = React.useState("Dr. Alexandre Merceron");
  const [type, setType] = React.useState<ExamItem["type"]>("Final Exam");
  const [candidates, _setCandidates] = React.useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Validation Error", { description: "Exam title is required." });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newExam: ExamItem = {
      id: `exam-${Date.now()}`,
      code: `EXAM-${randomNum}`,
      title: title.trim(),
      course,
      cohort,
      date,
      time,
      durationMinutes: 180,
      room,
      examiner,
      type,
      totalCandidates: Number.parseInt(candidates, 10) || 25,
      status: "Scheduled",
    };

    onAddExam(newExam);
    toast.success("Examination Scheduled", {
      description: `${newExam.title} scheduled for ${newExam.cohort} on ${newExam.date}.`,
    });

    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Schedule Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Schedule Examination Session
            </DialogTitle>
            <DialogDescription>
              Organize final jury, midterm, or continuous assessment for a student cohort.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="exam-title">Exam Title *</Label>
              <Input
                id="exam-title"
                placeholder="e.g. Distributed Architectures Final Examination"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="exam-course">Course Subject</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger id="exam-course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_COURSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exam-cohort">Target Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="exam-cohort">
                    <SelectValue placeholder="Select cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_COHORTS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="exam-type">Session Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ExamItem["type"])}>
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Final Exam">Final Exam</SelectItem>
                    <SelectItem value="Continuous Assessment">Continuous Assessment</SelectItem>
                    <SelectItem value="Project Defense">Project Defense</SelectItem>
                    <SelectItem value="Midterm">Midterm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="exam-date">Date</Label>
                <Input id="exam-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="exam-time">Time Slot</Label>
                <Input
                  id="exam-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="09:00 - 12:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="exam-room">Assigned Room / Lab</Label>
                <Input
                  id="exam-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Alan Turing Amphitheatre"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam-examiner">Lead Examiner</Label>
                <Input
                  id="exam-examiner"
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
            <Button type="submit">Confirm Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
