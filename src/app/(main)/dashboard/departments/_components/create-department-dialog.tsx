"use client";

import * as React from "react";

import { Loader2, Plus } from "lucide-react";
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

import type { CreateDepartmentPayload } from "./departments.api";

interface CreateDepartmentDialogProps {
  onAddDepartment: (payload: CreateDepartmentPayload) => Promise<boolean>;
}

export function CreateDepartmentDialog({ onAddDepartment }: CreateDepartmentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [hodName, setHodName] = React.useState("");
  const [hodEmail, setHodEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", {
        description: "Department code and name are required.",
      });
      return;
    }

    const payload: CreateDepartmentPayload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || "Pedagogical department and degree track.",
      headOfDepartmentName: hodName.trim() || "Unassigned",
      headOfDepartmentEmail: hodEmail.trim() || "hod@onixe.institute",
      establishedYear: new Date().getFullYear(),
      status: "Active",
    };

    setIsSaving(true);
    try {
      const success = await onAddDepartment(payload);
      if (success) {
        setCode("");
        setName("");
        setDescription("");
        setHodName("");
        setHodEmail("");
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Establish Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
