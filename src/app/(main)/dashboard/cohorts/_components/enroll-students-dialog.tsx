"use client";

import * as React from "react";

import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import type { CohortItem } from "./data";

const candidateStudents = [
  {
    id: "stu-101",
    name: "Lucas Vance",
    email: "l.vance@student.onixe.edu",
    matricule: "STU-2026-101",
    department: "Computer Science",
  },
  {
    id: "stu-102",
    name: "Amira Zahra",
    email: "a.zahra@student.onixe.edu",
    matricule: "STU-2026-102",
    department: "Computer Science",
  },
  {
    id: "stu-103",
    name: "Marc Dupont",
    email: "m.dupont@student.onixe.edu",
    matricule: "STU-2026-103",
    department: "Security & Networks",
  },
  {
    id: "stu-104",
    name: "Sofia Chen",
    email: "s.chen@student.onixe.edu",
    matricule: "STU-2026-104",
    department: "Artificial Intelligence",
  },
  {
    id: "stu-105",
    name: "Kofi Mensah",
    email: "k.mensah@student.onixe.edu",
    matricule: "STU-2026-105",
    department: "Software Systems",
  },
];

interface EnrollStudentsDialogProps {
  cohort: CohortItem;
  onEnrolled?: (count: number) => void;
}

export function EnrollStudentsDialog({ cohort, onEnrolled }: EnrollStudentsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");

  const filteredCandidates = candidateStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matricule.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleEnroll = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one student to enroll.");
      return;
    }

    toast.success("Learners enrolled successfully", {
      description: `${selectedIds.length} learner(s) have been assigned to ${cohort.name}.`,
    });
    onEnrolled?.(selectedIds.length);
    setSelectedIds([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <UserPlus className="size-3.5" />
          Enroll Learners
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enroll Learners into Cohort</DialogTitle>
          <DialogDescription>
            Assign registered students to <span className="font-semibold text-foreground">{cohort.name}</span> (
            {cohort.code}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Search by student name or matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
            {filteredCandidates.map((student) => {
              const isSelected = selectedIds.includes(student.id);

              return (
                <label
                  key={student.id}
                  htmlFor={`student-select-${student.id}`}
                  className="flex items-center justify-between gap-3 rounded-md p-2.5 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`student-select-${student.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleStudent(student.id)}
                    />
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm leading-tight text-foreground">{student.name}</span>
                      <span className="text-muted-foreground text-xs">{student.email}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {student.matricule}
                  </Badge>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Capacity: {cohort.enrolledStudents} / {cohort.capacity} learners
            </span>
            <span>{selectedIds.length} selected</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEnroll} disabled={selectedIds.length === 0}>
            Enroll Selected ({selectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
