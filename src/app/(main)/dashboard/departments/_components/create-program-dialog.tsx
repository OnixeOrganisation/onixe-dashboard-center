"use client";

import * as React from "react";

import { Award } from "lucide-react";
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

interface CreateProgramDialogProps {
  department: DepartmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProgram: (deptId: string, program: ProgramItem) => void;
}

export function CreateProgramDialog({ department, open, onOpenChange, onAddProgram }: CreateProgramDialogProps) {
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [degreeLevel, setDegreeLevel] = React.useState<ProgramItem["degreeLevel"]>("Master");
  const [durationMonths, setDurationMonths] = React.useState("24");
  const [totalEcts, setTotalEcts] = React.useState("120");

  if (!department) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      toast.error("Validation Error", { description: "Program code and name are required." });
      return;
    }

    const newProgram: ProgramItem = {
      id: `prog-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      degreeLevel,
      durationMonths: Number.parseInt(durationMonths, 10) || 12,
      totalEcts: Number.parseInt(totalEcts, 10) || 60,
      activeCohortsCount: 0,
    };

    onAddProgram(department.id, newProgram);
    toast.success("Program Added", {
      description: `${newProgram.name} added to ${department.name}.`,
    });

    setCode("");
    setName("");
    onOpenChange(false);
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
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-level">Degree Level</Label>
                <Select value={degreeLevel} onValueChange={(v) => setDegreeLevel(v as ProgramItem["degreeLevel"])}>
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
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="prog-ects">ECTS Credits</Label>
                <Input id="prog-ects" type="number" value={totalEcts} onChange={(e) => setTotalEcts(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Establish Program</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
