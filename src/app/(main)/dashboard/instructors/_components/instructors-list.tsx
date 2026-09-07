"use client";

import * as React from "react";

import { CheckCircle2, Clock, GraduationCap, MoreHorizontal, Search, Star } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { AssignCourseDialog } from "./assign-course-dialog";
import { CreateInstructorDialog } from "./create-instructor-dialog";
import { DEPARTMENTS, INITIAL_INSTRUCTORS, type InstructorItem } from "./data";
import { InstructorDetailsDialog } from "./instructor-details-dialog";

export function InstructorsList() {
  const [instructors, setInstructors] = React.useState<InstructorItem[]>(INITIAL_INSTRUCTORS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [selectedInstructor, setSelectedInstructor] = React.useState<InstructorItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const [assigningInstructor, setAssigningInstructor] = React.useState<InstructorItem | null>(null);
  const [assignOpen, setAssignOpen] = React.useState(false);

  const handleAddInstructor = (newInstructor: InstructorItem) => {
    setInstructors([newInstructor, ...instructors]);
  };

  const handleUpdateCourses = (id: string, courses: string[], cohorts: string[], weeklyHours: number) => {
    setInstructors((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, assignedCourses: courses, assignedCohorts: cohorts, weeklyHours } : inst,
      ),
    );
  };

  const handleToggleStatus = (id: string, newStatus: InstructorItem["status"]) => {
    setInstructors((prev) => prev.map((inst) => (inst.id === id ? { ...inst, status: newStatus } : inst)));
  };

  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.assignedCourses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = departmentFilter === "all" || inst.department === departmentFilter;

    const matchesStatus = statusFilter === "all" || inst.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // KPI Calculations
  const totalFaculty = instructors.length;
  const fullTimeFaculty = instructors.filter((i) => i.status === "Full-Time").length;
  const avgRating = (instructors.reduce((acc, curr) => acc + curr.rating, 0) / (totalFaculty || 1)).toFixed(1);
  const totalTeachingHours = instructors.reduce((acc, curr) => acc + curr.weeklyHours, 0);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Faculty & Instructors</h1>
          <p className="text-muted-foreground text-sm">
            Manage teaching faculty, course assignments, weekly workloads, and pedagogical telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateInstructorDialog onAddInstructor={handleAddInstructor} />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Total Faculty</span>
            <GraduationCap className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalFaculty}</div>
          <div className="mt-1 text-muted-foreground text-xs">{fullTimeFaculty} permanent / full-time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Average Evaluation
            </span>
            <Star className="size-4 fill-amber-400 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{avgRating} / 5.0</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">Based on student post-course telemetry</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Weekly Teaching Load
            </span>
            <Clock className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalTeachingHours} hrs/wk</div>
          <div className="mt-1 text-muted-foreground text-xs">Across active modules & workshops</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Departments Active
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{DEPARTMENTS.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">100% curriculum coverage</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Faculty Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty, matricule, course..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="h-9 w-[170px] text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[130px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Adjunct">Adjunct</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Instructor / Faculty</TableHead>
                  <TableHead>Department & Specialization</TableHead>
                  <TableHead>Assigned Courses</TableHead>
                  <TableHead className="w-[150px]">Workload</TableHead>
                  <TableHead className="w-[100px] text-center">Rating</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No instructors found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstructors.map((inst) => {
                    const workloadPercent = Math.min(Math.round((inst.weeklyHours / inst.maxWeeklyHours) * 100), 100);
                    return (
                      <TableRow key={inst.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="font-semibold text-xs">
                                {inst.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5">
                              <span className="font-semibold text-sm leading-none">{inst.name}</span>
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <span className="font-mono text-[11px]">{inst.matricule}</span>
                                <span>•</span>
                                <span className="max-w-[140px] truncate">{inst.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-medium text-foreground">{inst.department}</span>
                            <span className="max-w-[200px] truncate text-muted-foreground">{inst.specialization}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex max-w-[240px] flex-wrap gap-1">
                            {inst.assignedCourses.slice(0, 2).map((c) => (
                              <Badge
                                key={c}
                                variant="secondary"
                                className="max-w-[180px] truncate px-2 py-0 text-[11px]"
                              >
                                {c}
                              </Badge>
                            ))}
                            {inst.assignedCourses.length > 2 && (
                              <Badge variant="outline" className="px-1.5 py-0 text-[11px] text-muted-foreground">
                                +{inst.assignedCourses.length - 2}
                              </Badge>
                            )}
                            {inst.assignedCourses.length === 0 && (
                              <span className="text-muted-foreground text-xs italic">None</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                {inst.weeklyHours}h / {inst.maxWeeklyHours}h
                              </span>
                              <span className="font-medium">{workloadPercent}%</span>
                            </div>
                            <Progress value={workloadPercent} className="h-1.5" />
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1 font-semibold text-foreground text-xs">
                            <Star className="size-3.5 fill-amber-400 text-amber-500" />
                            {inst.rating.toFixed(1)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeClass(inst.status)}>
                            {inst.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInstructor(inst);
                                  setDetailsOpen(true);
                                }}
                              >
                                View Profile & Telemetry
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAssigningInstructor(inst);
                                  setAssignOpen(true);
                                }}
                              >
                                Assign Courses & Classes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const nextStatus = inst.status === "Inactive" ? "Full-Time" : "Inactive";
                                  handleToggleStatus(inst.id, nextStatus);
                                  toast.info("Status Updated", {
                                    description: `${inst.name} is now ${nextStatus}.`,
                                  });
                                }}
                                className={inst.status === "Inactive" ? "text-emerald-600" : "text-destructive"}
                              >
                                {inst.status === "Inactive" ? "Reactivate Instructor" : "Deactivate Profile"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <InstructorDetailsDialog
        instructor={selectedInstructor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onToggleStatus={handleToggleStatus}
      />

      <AssignCourseDialog
        instructor={assigningInstructor}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onUpdateCourses={handleUpdateCourses}
      />
    </div>
  );
}
