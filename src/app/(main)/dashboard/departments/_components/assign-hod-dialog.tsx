"use client";

import * as React from "react";

import { UserCheck } from "lucide-react";
import { toast } from "sonner";

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

import type { DepartmentItem } from "./data";

interface AssignHodDialogProps {
  department: DepartmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateHod: (deptId: string, hod: DepartmentItem["headOfDepartment"]) => void;
}

export function AssignHodDialog({ department, open, onOpenChange, onUpdateHod }: AssignHodDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [matricule, setMatricule] = React.useState("");

  React.useEffect(() => {
    if (department?.headOfDepartment) {
      setName(department.headOfDepartment.name);
      setEmail(department.headOfDepartment.email);
      setMatricule(department.headOfDepartment.matricule);
    }
  }, [department]);

  if (!department) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Validation Error", { description: "Faculty name is required." });
      return;
    }

    onUpdateHod(department.id, {
      id: department.headOfDepartment.id || `inst-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@onixe.institute`,
      matricule: matricule.trim() || `FAC-2024-${Math.floor(100 + Math.random() * 900)}`,
    });

    toast.success("Head of Department Appointed", {
      description: `${name} is now Head of Department for ${department.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Appoint Head of Department (HOD)
            </DialogTitle>
            <DialogDescription>
              Assign academic and pedagogical leadership for {department.name} ({department.code}).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="hod-app-name">Faculty Member Name *</Label>
              <Input
                id="hod-app-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Alexandre Merceron"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hod-app-email">Institutional Email</Label>
              <Input
                id="hod-app-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@onixe.institute"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hod-app-mat">Faculty Matricule</Label>
              <Input
                id="hod-app-mat"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="FAC-2024-001"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
