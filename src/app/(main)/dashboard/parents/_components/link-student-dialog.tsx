"use client";

import * as React from "react";

import { Plus, Users } from "lucide-react";
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

import type { ParentItem } from "./data";

interface LinkStudentDialogProps {
  onAddParent: (parent: ParentItem) => void;
}

export function LinkStudentDialog({ onAddParent }: LinkStudentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [relationshipType, setRelationshipType] =
    React.useState<ParentItem["relationshipType"]>("Parent / Legal Guardian");
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !studentName.trim()) {
      toast.error("Validation Error", { description: "Guardian name, email, and learner name are required." });
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newParent: ParentItem = {
      id: `par-${Date.now()}`,
      code: `PAR-2024-${randomNum}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+33 6 00 00 00 00",
      relationshipType,
      linkedStudents: [
        {
          studentId: `std-${Date.now()}`,
          matricule: studentMatricule.trim() || `STU-2024-${randomNum}`,
          name: studentName.trim(),
          cohort: "Promo Dev Master 2024-A",
          gradeAverage: 15.0,
          attendanceRate: 95,
        },
      ],
      status: "Active",
      lastAccess: "Invited / Pending login",
    };

    onAddParent(newParent);
    toast.success("Guardian / Mentor Linked", {
      description: `${newParent.name} has been linked to ${studentName}. Access invitation dispatched.`,
    });

    setName("");
    setEmail("");
    setStudentName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Link Guardian / Enterprise Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Link Guardian / Corporate Mentor
            </DialogTitle>
            <DialogDescription>
              Grant telemetry dashboard access to legal parents, tutors, and apprenticeship masters.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="par-name">Contact Full Name *</Label>
                <Input
                  id="par-name"
                  placeholder="e.g. Laurent Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="par-email">Email Address *</Label>
                <Input
                  id="par-email"
                  type="email"
                  placeholder="mentor@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="par-phone">Phone</Label>
                <Input
                  id="par-phone"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="par-type">Relationship</Label>
                <Select
                  value={relationshipType}
                  onValueChange={(v) => setRelationshipType(v as ParentItem["relationshipType"])}
                >
                  <SelectTrigger id="par-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parent / Legal Guardian">Parent / Legal Guardian</SelectItem>
                    <SelectItem value="Corporate Apprenticeship Master">Apprenticeship Master (CFA)</SelectItem>
                    <SelectItem value="Sponsor Representative">Corporate Sponsor Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="par-std-name">Target Learner *</Label>
                <Input
                  id="par-std-name"
                  placeholder="e.g. Lucas Moreau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="par-std-mat">Learner Matricule</Label>
                <Input
                  id="par-std-mat"
                  placeholder="STU-2024-001"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Link & Send Access Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
