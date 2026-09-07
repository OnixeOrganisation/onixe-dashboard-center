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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { CohortItem } from "./data";

interface CreateCohortDialogProps {
  onCohortCreated?: (cohort: Partial<CohortItem>) => void;
}

export function CreateCohortDialog({ onCohortCreated }: CreateCohortDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [department, setDepartment] = React.useState("Computer Science");
  const [capacity, setCapacity] = React.useState("35");
  const [room, setRoom] = React.useState("Amphi Turing");
  const [startDate, setStartDate] = React.useState("2026-09-01");
  const [endDate, setEndDate] = React.useState("2027-06-30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newCohort: Partial<CohortItem> = {
      id: `coh-${Date.now()}`,
      name,
      code,
      department,
      capacity: Number(capacity) || 30,
      enrolledStudents: 0,
      primaryRoom: room,
      startDate,
      endDate,
      attendanceRate: 100,
      status: "Starting Soon",
      scheduleSummary: "Schedule not yet published",
    };

    onCohortCreated?.(newCohort);
    toast.success("Cohort created successfully", {
      description: `Cohort ${name} (${code}) has been registered in the academic catalog.`,
    });
    setOpen(false);
    setName("");
    setCode("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Create Cohort
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Academic Cohort</DialogTitle>
            <DialogDescription>
              Create a new student cohort, assign its pedagogical department and define capacity.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cohort-code">Cohort Code *</Label>
                <Input
                  id="cohort-code"
                  placeholder="e.g. SE-2026B"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cohort-capacity">Max Capacity *</Label>
                <Input
                  id="cohort-capacity"
                  type="number"
                  placeholder="e.g. 35"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cohort-name">Cohort Title *</Label>
              <Input
                id="cohort-name"
                placeholder="e.g. Cybersecurity & Cloud Architecture 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cohort-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="cohort-dept">
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
                <Label htmlFor="cohort-room">Primary Classroom / Lab</Label>
                <Input
                  id="cohort-room"
                  placeholder="e.g. Lab Cyber 01"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cohort-start">Start Date</Label>
                <Input id="cohort-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cohort-end">End Date</Label>
                <Input id="cohort-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Cohort</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
