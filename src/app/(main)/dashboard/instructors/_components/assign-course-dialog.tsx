"use client";

import * as React from "react";

import { BookOpen, Plus, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";

import type { InstructorItem } from "./data";

interface AssignCourseDialogProps {
  instructor: InstructorItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCourses: (id: string, courses: string[], cohorts: string[], weeklyHours: number) => void;
}

const AVAILABLE_COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Dev Master 2024-B",
  "Promo Data & AI 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Cloud & DevOps 2024-A",
  "Promo UX Product 2024-A",
];

export function AssignCourseDialog({ instructor, open, onOpenChange, onUpdateCourses }: AssignCourseDialogProps) {
  const [courses, setCourses] = React.useState<string[]>([]);
  const [cohorts, setCohorts] = React.useState<string[]>([]);
  const [newCourse, setNewCourse] = React.useState("");

  React.useEffect(() => {
    if (instructor) {
      setCourses(instructor.assignedCourses || []);
      setCohorts(instructor.assignedCohorts || []);
    }
  }, [instructor]);

  if (!instructor) return null;

  const handleAddCourse = () => {
    if (!newCourse.trim()) return;
    if (courses.includes(newCourse.trim())) {
      toast.error("Course already assigned", {
        description: "This course is already assigned to this faculty member.",
      });
      return;
    }
    setCourses([...courses, newCourse.trim()]);
    setNewCourse("");
  };

  const handleRemoveCourse = (course: string) => {
    setCourses(courses.filter((c) => c !== course));
  };

  const handleToggleCohort = (cohort: string) => {
    if (cohorts.includes(cohort)) {
      setCohorts(cohorts.filter((c) => c !== cohort));
    } else {
      setCohorts([...cohorts, cohort]);
    }
  };

  const handleSave = () => {
    // calculate estimated hours (e.g. 4h per course)
    const computedHours = Math.min(courses.length * 4, instructor.maxWeeklyHours);
    onUpdateCourses(instructor.id, courses, cohorts, computedHours);
    toast.success("Assignments Updated", {
      description: `Course and cohort assignments updated for ${instructor.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Assign Courses & Classes
          </DialogTitle>
          <DialogDescription>
            Configure teaching modules and target student promotions for {instructor.name} ({instructor.matricule}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Courses List */}
          <div className="space-y-2">
            <Label className="font-semibold text-xs">Assigned Courses</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Distributed Systems Architecture"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCourse();
                  }
                }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddCourse}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {courses.length === 0 ? (
                <div className="text-muted-foreground text-xs italic">No courses currently assigned.</div>
              ) : (
                courses.map((course) => (
                  <Badge key={course} variant="secondary" className="gap-1 px-2.5 py-1 text-xs">
                    {course}
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Cohorts Selection */}
          <div className="space-y-2 border-t pt-2">
            <Label className="font-semibold text-xs">Target Student Cohorts</Label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COHORTS.map((c) => {
                const isSelected = cohorts.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleToggleCohort(c)}
                    className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5 font-medium text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span>{c}</span>
                    {isSelected && <span className="size-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Assignments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
