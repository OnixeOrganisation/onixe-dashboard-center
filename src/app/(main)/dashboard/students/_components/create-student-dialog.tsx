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

import type { StudentItem } from "./data";

interface CreateStudentDialogProps {
  onStudentCreated?: (student: StudentItem) => void;
}

export function CreateStudentDialog({ onStudentCreated }: CreateStudentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [matricule, setMatricule] = React.useState(`STU-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [department, setDepartment] = React.useState("Computer Science");
  const [cohort, setCohort] = React.useState("Software Engineering 2026-A");
  const [guardianName, setGuardianName] = React.useState("");
  const [guardianEmail, setGuardianEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in the student full name and email.");
      return;
    }

    const newStudent: StudentItem = {
      id: `stu-${Date.now()}`,
      matricule,
      name,
      email,
      phone: phone || "+33 6 00 00 00 00",
      department,
      cohort,
      cohortId: "coh-001",
      enrollmentDate: new Date().toISOString().split("T")[0],
      attendanceRate: 100,
      gradeAverage: 0,
      creditsEarned: 0,
      guardianName: guardianName || undefined,
      guardianEmail: guardianEmail || undefined,
      status: "Active",
    };

    onStudentCreated?.(newStudent);
    toast.success("Student enrolled successfully", {
      description: `${name} has been assigned student ID ${matricule} and linked to ${cohort}.`,
    });
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setGuardianName("");
    setGuardianEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="size-4" />
          Enroll New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enroll New Student</DialogTitle>
            <DialogDescription>
              Register an academic learner profile, assign matricule ID and link to a cohort.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stu-matricule">Matricule / Student ID *</Label>
                <Input id="stu-matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stu-name">Full Name *</Label>
                <Input
                  id="stu-name"
                  placeholder="e.g. Alexandre Moreau"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stu-email">Institutional Email *</Label>
                <Input
                  id="stu-email"
                  type="email"
                  placeholder="student@onixe.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stu-phone">Phone Number</Label>
                <Input
                  id="stu-phone"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stu-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="stu-dept">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Security & Networks">Security & Networks</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="Software Systems">Software Systems</SelectItem>
                    <SelectItem value="Cloud Architecture">Cloud Architecture</SelectItem>
                    <SelectItem value="Design & UX">Design & UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stu-cohort">Assigned Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="stu-cohort">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineering 2026-A">Software Engineering 2026-A</SelectItem>
                    <SelectItem value="Cybersecurity & Cloud Defense">Cybersecurity & Cloud Defense</SelectItem>
                    <SelectItem value="Data Science & Applied AI">Data Science & Applied AI</SelectItem>
                    <SelectItem value="Fullstack Web & Mobile Systems">Fullstack Web & Mobile Systems</SelectItem>
                    <SelectItem value="DevOps & Infrastructure Automation">
                      DevOps & Infrastructure Automation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Parent / Legal Guardian (Optional)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="guardian-name">Guardian Name</Label>
                  <Input
                    id="guardian-name"
                    placeholder="e.g. Jean Moreau"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guardian-email">Guardian Email</Label>
                  <Input
                    id="guardian-email"
                    type="email"
                    placeholder="parent@family.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Complete Enrollment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
