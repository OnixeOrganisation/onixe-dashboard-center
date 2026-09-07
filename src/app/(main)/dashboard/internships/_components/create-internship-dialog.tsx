"use client";

import * as React from "react";

import { Briefcase, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import type { InternshipItem } from "./data";

interface CreateInternshipDialogProps {
  onAddInternship: (internship: InternshipItem) => void;
}

const COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Cloud & DevOps 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Data & AI 2024-A",
  "Promo UX Product 2024-A",
];

export function CreateInternshipDialog({ onAddInternship }: CreateInternshipDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [cohort, setCohort] = React.useState(COHORTS[0]);
  const [type, setType] = React.useState<InternshipItem["type"]>("Apprenticeship (Alternance)");
  const [companyName, setCompanyName] = React.useState("");
  const [companyTutor, setCompanyTutor] = React.useState("");
  const [academicSupervisor, _setAcademicSupervisor] = React.useState("Dr. Alexandre Merceron");
  const [pfeTopic, setPfeTopic] = React.useState("");
  const [startDate, setStartDate] = React.useState("2024-10-01");
  const [endDate, setEndDate] = React.useState("2025-09-30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !companyName.trim()) {
      toast.error("Validation Error", { description: "Student name and enterprise name are required." });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newInternship: InternshipItem = {
      id: `intern-${Date.now()}`,
      code: `PFE-2024-${randomNum}`,
      studentName: studentName.trim(),
      studentMatricule: studentMatricule.trim() || `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      cohort,
      type,
      companyName: companyName.trim(),
      companyAddress: "Paris Region, France",
      companyTutor: companyTutor.trim() || "Enterprise Mentor",
      academicSupervisor,
      pfeTopic: pfeTopic.trim() || "Pedagogical Internship Project & Industry Integration",
      startDate,
      endDate,
      status: "In Progress",
    };

    onAddInternship(newInternship);
    toast.success("Internship / Apprenticeship Registered", {
      description: `Contract ${newInternship.code} recorded for ${newInternship.studentName} with ${newInternship.companyName}.`,
    });

    setStudentName("");
    setCompanyName("");
    setPfeTopic("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Internship / Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Register Internship / Apprenticeship (PFE)
            </DialogTitle>
            <DialogDescription>
              Record an industry contract, assign tutors, and set pedagogical capstone topics.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="int-name">Learner Name *</Label>
                <Input
                  id="int-name"
                  placeholder="e.g. Lucas Moreau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="int-mat">Learner Matricule</Label>
                <Input
                  id="int-mat"
                  placeholder="STU-2024-001"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="int-cohort">Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="int-cohort">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {COHORTS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="int-type">Contract Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as InternshipItem["type"])}>
                  <SelectTrigger id="int-type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apprenticeship (Alternance)">Apprenticeship (Alternance)</SelectItem>
                    <SelectItem value="End-of-Studies Internship (PFE)">End-of-Studies Internship (PFE)</SelectItem>
                    <SelectItem value="Professional Immersion">Professional Immersion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="int-comp">Hosting Company *</Label>
                <Input
                  id="int-comp"
                  placeholder="e.g. Capgemini Engineering"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="int-tutor">Company Mentor / Tutor</Label>
                <Input
                  id="int-tutor"
                  placeholder="Laurent Dupont (Lead Architect)"
                  value={companyTutor}
                  onChange={(e) => setCompanyTutor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="int-topic">PFE / Thesis Research Topic</Label>
              <Textarea
                id="int-topic"
                placeholder="Key technical scope and capstone project description..."
                value={pfeTopic}
                onChange={(e) => setPfeTopic(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="int-start">Contract Start Date</Label>
                <Input id="int-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="int-end">Contract End Date</Label>
                <Input id="int-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Establish Contract</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
