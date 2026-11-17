"use client";

import * as React from "react";

import { Award, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { DepartmentItem, ProgramItem } from "./data";
import type { CreateProgramPayload } from "./departments.api";

interface CreateProgramDialogProps {
  department: DepartmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProgram: (deptId: string, program: CreateProgramPayload) => Promise<boolean>;
}

export function CreateProgramDialog({ department, open, onOpenChange, onAddProgram }: CreateProgramDialogProps) {
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [degreeLevel, setDegreeLevel] = React.useState<ProgramItem["degreeLevel"]>("Master");
  const [durationMonths, setDurationMonths] = React.useState("24");
  const [totalEcts, setTotalEcts] = React.useState("120");
  const [isSaving, setIsSaving] = React.useState(false);

  if (!department) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", { description: "Program code and name are required." });
      return;
    }

    const payload: CreateProgramPayload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      degreeLevel,
      durationMonths: Number.parseInt(durationMonths, 10) || 12,
      totalEcts: Number.parseInt(totalEcts, 10) || 60,
    };

    setIsSaving(true);
    try {
      const success = await onAddProgram(department.id, payload);
      if (success) {
        setCode("");
        setName("");
        onOpenChange(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Add Study Program / Degree Track
            </DialogTitle>
            <DialogDescription>
              Create a pedagogical curriculum for {department.name} ({department.code}).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-code">Code *</Label>
                <Input
                  id="prog-code"
                  placeholder="M-SWE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="prog-name">Program Title *</Label>
                <Input
                  id="prog-name"
                  placeholder="Master in Distributed Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-level">Degree Level</Label>
                <Select
                  value={degreeLevel}
                  onValueChange={(v) => setDegreeLevel(v as ProgramItem["degreeLevel"])}
                  disabled={isSaving}
                >
                  <SelectTrigger id="prog-level">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Executive Certificate">Certificate</SelectItem>
                    <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-dur">Duration (mo)</Label>
                <Input
                  id="prog-dur"
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-ects">ECTS Credits</Label>
                <Input
                  id="prog-ects"
                  type="number"
                  value={totalEcts}
                  onChange={(e) => setTotalEcts(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Establish Program
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
