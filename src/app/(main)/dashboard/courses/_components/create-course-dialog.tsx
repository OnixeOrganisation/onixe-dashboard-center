"use client";

import * as React from "react";

import { BookOpen, Plus } from "lucide-react";
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

import { COURSE_DEPARTMENTS, type CourseItem } from "./data";

interface CreateCourseDialogProps {
  onAddCourse: (course: CourseItem) => void;
}

export function CreateCourseDialog({ onAddCourse }: CreateCourseDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState<string>(COURSE_DEPARTMENTS[0]);
  const [ectsCredits, setEctsCredits] = React.useState("6");
  const [coefficient, setCoefficient] = React.useState("3");
  const [totalHours, setTotalHours] = React.useState("40");
  const [semester, setSemester] = React.useState<CourseItem["semester"]>("Semester 1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !title.trim()) {
      toast.error("Validation Error", { description: "Course code and title are required." });
      return;
    }

    const newCourse: CourseItem = {
      id: `crs-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      department,
      ectsCredits: Number.parseInt(ectsCredits, 10) || 6,
      coefficient: Number.parseFloat(coefficient) || 1,
      totalHours: Number.parseInt(totalHours, 10) || 30,
      semester,
      status: "Published",
      modulesCount: 0,
      assignedInstructorsCount: 0,
      enrolledCohorts: [],
      modules: [],
    };

    onAddCourse(newCourse);
    toast.success("Course Created", {
      description: `${newCourse.title} (${newCourse.code}) has been added to catalog.`,
    });

    setCode("");
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Create Curriculum Course
            </DialogTitle>
            <DialogDescription>Add a new pedagogical course to the institutional academic catalog.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="crs-code">Course Code *</Label>
                <Input
                  id="crs-code"
                  placeholder="SWE-402"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="crs-title">Course Title *</Label>
                <Input
                  id="crs-title"
                  placeholder="Advanced Cloud Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="crs-dept">Academic Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="crs-dept">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="crs-ects">ECTS Credits</Label>
                <Input
                  id="crs-ects"
                  type="number"
                  min="1"
                  max="30"
                  value={ectsCredits}
                  onChange={(e) => setEctsCredits(e.target.value)}
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="crs-coef">Coefficient</Label>
                <Input
                  id="crs-coef"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={coefficient}
                  onChange={(e) => setCoefficient(e.target.value)}
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="crs-hours">Total Hours</Label>
                <Input
                  id="crs-hours"
                  type="number"
                  min="5"
                  max="200"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="crs-sem">Teaching Period / Semester</Label>
              <Select value={semester} onValueChange={(v) => setSemester(v as CourseItem["semester"])}>
                <SelectTrigger id="crs-sem">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semester 1">Semester 1 (Autumn / Winter)</SelectItem>
                  <SelectItem value="Semester 2">Semester 2 (Spring / Summer)</SelectItem>
                  <SelectItem value="Annual">Annual / Full Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
