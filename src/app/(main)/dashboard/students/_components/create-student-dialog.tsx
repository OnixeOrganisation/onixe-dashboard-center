"use client";

import * as React from "react";

import { Loader2, UserPlus } from "lucide-react";
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
import type { CreateStudentPayload } from "./students.api";

interface CreateStudentDialogProps {
  onStudentCreated?: (payload: CreateStudentPayload) => Promise<boolean>;
}

export function CreateStudentDialog({ onStudentCreated }: CreateStudentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [matricule, setMatricule] = React.useState("");
  const [department, setDepartment] = React.useState("Computer Science");
  const [cohort, setCohort] = React.useState("Software Engineering 2026-A");
  const [guardianName, setGuardianName] = React.useState("");
  const [guardianEmail, setGuardianEmail] = React.useState("");

  React.useEffect(() => {
    if (open && !matricule) {
      setMatricule(`STU-2026-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [open, matricule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in the student full name and email.");
      return;
    }

    const payload: CreateStudentPayload = {
      matricule,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+33 6 00 00 00 00",
      department,
      cohort,
      cohortId: "coh-001",
      guardianName: guardianName.trim() || undefined,
      guardianEmail: guardianEmail.trim() || undefined,
      status: "Active",
    };

    setIsSaving(true);
    try {
      if (onStudentCreated) {
        const success = await onStudentCreated(payload);
        if (success) {
          setOpen(false);
          setName("");
          setEmail("");
          setPhone("");
          setMatricule("");
          setGuardianName("");
          setGuardianEmail("");
        }
      } else {
        setOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
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
                <Input
                  id="stu-matricule"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stu-name">Full Name *</Label>
                <Input
                  id="stu-name"
                  placeholder="e.g. Alexandre Moreau"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stu-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment} disabled={isSaving}>
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
                <Select value={cohort} onValueChange={setCohort} disabled={isSaving}>
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Complete Enrollment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
