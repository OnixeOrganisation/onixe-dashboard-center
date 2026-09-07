"use client";

import { Award, BookOpen, Clock, Mail, Phone, Star, Users } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import type { InstructorItem } from "./data";

interface InstructorDetailsDialogProps {
  instructor: InstructorItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus: (id: string, newStatus: InstructorItem["status"]) => void;
}

export function InstructorDetailsDialog({
  instructor,
  open,
  onOpenChange,
  onToggleStatus,
}: InstructorDetailsDialogProps) {
  if (!instructor) return null;

  const workloadPercentage = Math.min(Math.round((instructor.weeklyHours / instructor.maxWeeklyHours) * 100), 100);

  const getStatusBadgeClass = (status: InstructorItem["status"]) => {
    if (status === "Full-Time") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Adjunct") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    if (status === "On Leave") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  const handleStatusToggle = () => {
    const nextStatus: InstructorItem["status"] = instructor.status === "Inactive" ? "Full-Time" : "Inactive";
    onToggleStatus(instructor.id, nextStatus);
    toast.info("Status Changed", {
      description: `${instructor.name}'s status is now ${nextStatus}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {instructor.matricule}
            </Badge>
            <Badge variant="secondary" className={getStatusBadgeClass(instructor.status)}>
              {instructor.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{instructor.name}</DialogTitle>
          <DialogDescription>
            {instructor.specialization} • {instructor.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Contact and Overview Card */}
          <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
            <Avatar className="size-14">
              <AvatarFallback className="font-semibold text-base">
                {instructor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="size-3.5 text-muted-foreground" />
                {instructor.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" />
                {instructor.phone}
              </div>
              <div className="text-muted-foreground">Joined Institute: {instructor.joinedDate}</div>
            </div>
          </div>

          {/* Academic KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">Evaluation Score</div>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-foreground text-xl">
                <Star className="size-4 fill-amber-400 text-amber-500" />
                {instructor.rating.toFixed(1)} / 5.0
              </div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">Students Taught</div>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-foreground text-xl">
                <Users className="size-4 text-primary" />
                {instructor.totalStudentsTaught}
              </div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="text-muted-foreground text-xs">Weekly Workload</div>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-foreground text-xl">
                <Clock className="size-4 text-sky-500" />
                {instructor.weeklyHours}h / {instructor.maxWeeklyHours}h
              </div>
            </div>
          </div>

          {/* Workload Progress Bar */}
          <div className="space-y-1.5 rounded-lg border p-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Teaching Capacity Utilization</span>
              <span className="font-medium text-foreground">{workloadPercentage}% loaded</span>
            </div>
            <Progress value={workloadPercentage} className="h-2" />
          </div>

          {/* Assigned Courses */}
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
              <BookOpen className="size-3.5 text-primary" />
              Active Courses ({instructor.assignedCourses.length})
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {instructor.assignedCourses.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          {/* Assigned Cohorts */}
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
              <Award className="size-3.5 text-sky-500" />
              Assigned Promotions ({instructor.assignedCohorts.length})
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {instructor.assignedCohorts.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant={instructor.status === "Inactive" ? "default" : "destructive"}
            size="sm"
            onClick={handleStatusToggle}
          >
            {instructor.status === "Inactive" ? "Activate Instructor" : "Deactivate Profile"}
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
