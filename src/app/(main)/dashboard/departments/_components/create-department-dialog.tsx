"use client";

import * as React from "react";

import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import type { DepartmentItem } from "./data";

interface CreateDepartmentDialogProps {
  onAddDepartment: (dept: DepartmentItem) => void;
}

export function CreateDepartmentDialog({ onAddDepartment }: CreateDepartmentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [hodName, setHodName] = React.useState("");
  const [hodEmail, setHodEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", {
        description: "Department code and name are required.",
      });
      return;
    }

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || "Pedagogical department and degree track.",
      headOfDepartment: {
        id: `inst-${Date.now()}`,
        name: hodName.trim() || "Unassigned",
        email: hodEmail.trim() || "hod@onixe.institute",
        matricule: `FAC-2024-${Math.floor(100 + Math.random() * 900)}`,
      },
      programsCount: 0,
      facultyCount: 1,
      enrolledStudentsCount: 0,
      establishedYear: new Date().getFullYear(),
      status: "Active",
      programs: [],
    };

    onAddDepartment(newDept);
    toast.success("Department Created", {
      description: `${newDept.name} (${newDept.code}) has been established.`,
    });

    setCode("");
    setName("");
    setDescription("");
    setHodName("");
    setHodEmail("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Create Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Academic Department</DialogTitle>
            <DialogDescription>
              Define a new faculty domain, establish its degree tracks, and appoint a department lead.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="dept-code">Code *</Label>
                <Input
                  id="dept-code"
                  placeholder="e.g. SWE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="dept-name">Department Name *</Label>
                <Input
                  id="dept-name"
                  placeholder="e.g. Software Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dept-desc">Pedagogical Mission & Scope</Label>
              <Textarea
                id="dept-desc"
                placeholder="Brief description of the department's academic focus and curriculum aims..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="hod-name">Head of Department (HOD)</Label>
                <Input
                  id="hod-name"
                  placeholder="e.g. Dr. Alexandre Merceron"
                  value={hodName}
                  onChange={(e) => setHodName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hod-email">HOD Email</Label>
                <Input
                  id="hod-email"
                  type="email"
                  placeholder="hod@onixe.institute"
                  value={hodEmail}
                  onChange={(e) => setHodEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Establish Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
