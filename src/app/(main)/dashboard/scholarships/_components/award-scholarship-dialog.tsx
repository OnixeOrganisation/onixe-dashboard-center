"use client";

import * as React from "react";

import { Award, Plus } from "lucide-react";
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

import { SCHOLARSHIP_TYPES, type ScholarshipItem } from "./data";

interface AwardScholarshipDialogProps {
  onAddScholarship: (scholarship: ScholarshipItem) => void;
}

const COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Cloud & DevOps 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Data & AI 2024-A",
  "Promo UX Product 2024-A",
];

export function AwardScholarshipDialog({ onAddScholarship }: AwardScholarshipDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [cohort, setCohort] = React.useState(COHORTS[0]);
  const [type, setType] = React.useState<ScholarshipItem["type"]>("Merit Excellence");
  const [amount, setAmount] = React.useState("3000");
  const [justification, setJustification] = React.useState("");
  const [approvedBy, setApprovedBy] = React.useState("Catherine Delorme (Campus Director)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Validation Error", { description: "Student name is required." });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newScholarship: ScholarshipItem = {
      id: `sch-${Date.now()}`,
      code: `SCH-2024-${randomNum}`,
      studentName: studentName.trim(),
      studentMatricule: studentMatricule.trim() || `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      cohort,
      type,
      amount: Number.parseFloat(amount) || 2000,
      awardDate: new Date().toISOString().split("T")[0],
      justification: justification.trim() || "Academic merit and institutional scholarship grant.",
      approvedBy,
      status: "Active",
    };

    onAddScholarship(newScholarship);
    toast.success("Scholarship Awarded", {
      description: `${newScholarship.type} scholarship (${newScholarship.amount} EUR) granted to ${newScholarship.studentName}.`,
    });

    setStudentName("");
    setStudentMatricule("");
    setJustification("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Award Scholarship
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Award Scholarship & Financial Waiver
            </DialogTitle>
            <DialogDescription>Grant merit excellence, equity, or partner-backed tuition subsidies.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sch-name">Learner Full Name *</Label>
                <Input
                  id="sch-name"
                  placeholder="e.g. Amina Diallo"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sch-mat">Learner Matricule</Label>
                <Input
                  id="sch-mat"
                  placeholder="STU-2024-002"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sch-cohort">Target Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="sch-cohort">
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
                <Label htmlFor="sch-type">Scholarship Category</Label>
                <Select value={type} onValueChange={(v) => setType(v as ScholarshipItem["type"])}>
                  <SelectTrigger id="sch-type">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOLARSHIP_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sch-amt">Grant Amount (EUR) *</Label>
                <Input id="sch-amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sch-approv">Approving Academic Officer</Label>
                <Input id="sch-approv" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sch-just">Decision Justification & Notes</Label>
              <Textarea
                id="sch-just"
                placeholder="Reasoning, entrance ranking, or committee recommendation..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Grant Scholarship</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
