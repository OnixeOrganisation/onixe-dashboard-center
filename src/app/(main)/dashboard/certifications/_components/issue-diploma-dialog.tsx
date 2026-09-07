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

import type { DiplomaItem } from "./data";

interface IssueDiplomaDialogProps {
  onIssueDiploma: (diploma: DiplomaItem) => void;
}

const DEGREES = [
  "Master of Science in Distributed Software Engineering",
  "Master of Science in Cloud & Site Reliability Engineering",
  "Master of Science in Cybersecurity Operations & Defense",
  "Master of Science in Applied AI & Machine Learning",
  "Bachelor of Science in UX & Product Design",
];

const COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Cloud & DevOps 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Data & AI 2024-A",
  "Promo UX Product 2024-A",
];

export function IssueDiplomaDialog({ onIssueDiploma }: IssueDiplomaDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [degreeTitle, setDegreeTitle] = React.useState(DEGREES[0]);
  const [cohort, setCohort] = React.useState(COHORTS[0]);
  const [honors, setHonors] = React.useState<DiplomaItem["honors"]>("Magna Cum Laude (Très Bien)");
  const [graduationDate, setGraduationDate] = React.useState("2024-11-20");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Validation Error", { description: "Learner name is required." });
      return;
    }

    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const certNum = `ONIXE-DIP-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDiploma: DiplomaItem = {
      id: `dip-${Date.now()}`,
      certificateNumber: certNum,
      studentName: studentName.trim(),
      studentMatricule: studentMatricule.trim() || `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      degreeTitle,
      cohort,
      graduationDate,
      honors,
      cryptoHash: randomHash,
      verificationUrl: `https://verify.onixe.institute/cert/${randomHash}`,
      status: "Issued",
    };

    onIssueDiploma(newDiploma);
    toast.success("Diploma Officially Delivered", {
      description: `Official parchment ${newDiploma.certificateNumber} issued for ${newDiploma.studentName} with cryptographic seal.`,
    });

    setStudentName("");
    setStudentMatricule("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Issue Diploma / Degree
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Issue Verifiable Digital Diploma
            </DialogTitle>
            <DialogDescription>
              Deliver an authenticated state-recognized degree with cryptographic validation hash.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dip-name">Graduating Learner *</Label>
                <Input
                  id="dip-name"
                  placeholder="e.g. Lucas Moreau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dip-mat">Matricule</Label>
                <Input
                  id="dip-mat"
                  placeholder="STU-2024-001"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dip-degree">Degree & Title</Label>
              <Select value={degreeTitle} onValueChange={setDegreeTitle}>
                <SelectTrigger id="dip-degree">
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dip-cohort">Graduating Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="dip-cohort">
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
                <Label htmlFor="dip-honors">Academic Honors</Label>
                <Select value={honors} onValueChange={(v) => setHonors(v as DiplomaItem["honors"])}>
                  <SelectTrigger id="dip-honors">
                    <SelectValue placeholder="Honors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summa Cum Laude (Félicitations du Jury)">
                      Summa Cum Laude (Félicitations du Jury)
                    </SelectItem>
                    <SelectItem value="Magna Cum Laude (Très Bien)">Magna Cum Laude (Très Bien)</SelectItem>
                    <SelectItem value="Cum Laude (Bien)">Cum Laude (Bien)</SelectItem>
                    <SelectItem value="Passed">Standard Graduation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dip-date">Official Graduation Date</Label>
              <Input
                id="dip-date"
                type="date"
                value={graduationDate}
                onChange={(e) => setGraduationDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Deliver & Seal Diploma</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
