"use client";

import * as React from "react";

import { UserPlus } from "lucide-react";
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

import { DEPARTMENTS, INSTRUCTOR_STATUSES, type InstructorItem } from "./data";

interface CreateInstructorDialogProps {
  onAddInstructor: (instructor: InstructorItem) => void;
}

export function CreateInstructorDialog({ onAddInstructor }: CreateInstructorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState<string>(DEPARTMENTS[0]);
  const [specialization, setSpecialization] = React.useState("");
  const [status, setStatus] = React.useState<InstructorItem["status"]>("Full-Time");
  const [maxWeeklyHours, setMaxWeeklyHours] = React.useState("20");
  const [initialCourse, setInitialCourse] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Validation Error", {
        description: "Please provide instructor full name and official email address.",
      });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newInstructor: InstructorItem = {
      id: `inst-${Date.now()}`,
      matricule: `FAC-2024-${randomNum}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+33 6 00 00 00 00",
      department,
      specialization: specialization.trim() || "Computer Science",
      status,
      weeklyHours: initialCourse ? 4 : 0,
      maxWeeklyHours: Number.parseInt(maxWeeklyHours, 10) || 20,
      assignedCourses: initialCourse ? [initialCourse.trim()] : [],
      assignedCohorts: [],
      rating: 5.0,
      totalStudentsTaught: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    onAddInstructor(newInstructor);
    toast.success("Instructor Added", {
      description: `${newInstructor.name} has been appointed to ${newInstructor.department}.`,
    });

    setName("");
    setEmail("");
    setPhone("");
    setSpecialization("");
    setInitialCourse("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="size-4" />
          Add Instructor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Faculty / Instructor</DialogTitle>
            <DialogDescription>
              Register a teaching staff member, assign their academic department, and configure weekly workload limit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inst-name">Full Name *</Label>
                <Input
                  id="inst-name"
                  placeholder="e.g. Dr. Alexandre Merceron"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inst-email">Institutional Email *</Label>
                <Input
                  id="inst-email"
                  type="email"
                  placeholder="name@onixe.institute"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inst-phone">Phone</Label>
                <Input
                  id="inst-phone"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inst-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="inst-dept">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-spec">Specialization / Expertise</Label>
              <Input
                id="inst-spec"
                placeholder="e.g. Distributed Systems & Cloud Architecture"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inst-status">Employment Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as InstructorItem["status"])}>
                  <SelectTrigger id="inst-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTRUCTOR_STATUSES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inst-max-hours">Max Weekly Hours</Label>
                <Input
                  id="inst-max-hours"
                  type="number"
                  min="1"
                  max="40"
                  value={maxWeeklyHours}
                  onChange={(e) => setMaxWeeklyHours(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-course">Initial Course Assignment</Label>
              <Input
                id="inst-course"
                placeholder="e.g. NestJS Microservices Architecture"
                value={initialCourse}
                onChange={(e) => setInitialCourse(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Instructor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
