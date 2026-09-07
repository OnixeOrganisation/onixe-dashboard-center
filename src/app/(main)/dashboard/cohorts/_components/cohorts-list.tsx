"use client";

import * as React from "react";

import { Clock, GraduationCap, Layers, MapPin, MoreHorizontal, Search, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CreateCohortDialog } from "./create-cohort-dialog";
import { type CohortItem, mockCohorts } from "./data";
import { EnrollStudentsDialog } from "./enroll-students-dialog";

function getStatusBadgeClass(status: CohortItem["status"]) {
  if (status === "In Progress") {
    return "border-green-600/30 bg-green-500/10 text-green-600 dark:text-green-400";
  }
  if (status === "Starting Soon") {
    return "border-yellow-600/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  }
  return "border-muted-foreground/30 bg-muted text-muted-foreground";
}

export function CohortsList() {
  const [cohorts, setCohorts] = React.useState<CohortItem[]>(mockCohorts);
  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const handleAddCohort = (newCohort: Partial<CohortItem>) => {
    setCohorts((prev) => [newCohort as CohortItem, ...prev]);
  };

  const handleStudentsEnrolled = (cohortId: string, count: number) => {
    setCohorts((prev) =>
      prev.map((c) =>
        c.id === cohortId ? { ...c, enrolledStudents: Math.min(c.capacity, c.enrolledStudents + count) } : c,
      ),
    );
  };

  const filteredCohorts = cohorts.filter((cohort) => {
    const matchesSearch =
      cohort.name.toLowerCase().includes(search.toLowerCase()) ||
      cohort.code.toLowerCase().includes(search.toLowerCase()) ||
      cohort.department.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "all" || cohort.department === selectedDept;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cohort.status === "In Progress") ||
      (statusFilter === "upcoming" && cohort.status === "Starting Soon") ||
      (statusFilter === "graduated" && cohort.status === "Graduated");

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalLearners = cohorts.reduce((acc, c) => acc + c.enrolledStudents, 0);
  const totalCapacity = cohorts.reduce((acc, c) => acc + c.capacity, 0);
  const avgAttendance = (cohorts.reduce((acc, c) => acc + c.attendanceRate, 0) / cohorts.length).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight md:text-3xl">Cohorts & Promotions</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic promotions, class sizes, room assignments and cohort schedules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateCohortDialog onCohortCreated={handleAddCohort} />
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Active Cohorts</CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{cohorts.length}</div>
            <p className="text-muted-foreground text-xs">
              {cohorts.filter((c) => c.status === "In Progress").length} in session · 1 starting soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Enrolled Learners</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalLearners}</div>
            <p className="text-muted-foreground text-xs">
              {Math.round((totalLearners / totalCapacity) * 100)}% total capacity filled ({totalCapacity} max)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Average Class Attendance</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{avgAttendance}%</div>
            <p className="text-muted-foreground text-xs">+2.4% above institutional target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Active Facilities</CardTitle>
            <MapPin className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">6 Classrooms</div>
            <p className="text-muted-foreground text-xs">100% compliant with safety standards</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Cohorts ({cohorts.length})</TabsTrigger>
            <TabsTrigger value="active">
              In Session ({cohorts.filter((c) => c.status === "In Progress").length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="graduated">Graduated</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search cohort, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Security & Networks">Security & Networks</SelectItem>
              <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
              <SelectItem value="Software Systems">Software Systems</SelectItem>
              <SelectItem value="Cloud Architecture">Cloud Architecture</SelectItem>
              <SelectItem value="Design & UX">Design & UX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cohorts Grid / Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCohorts.map((cohort) => {
          const fillPercentage = Math.round((cohort.enrolledStudents / cohort.capacity) * 100);

          return (
            <Card key={cohort.id} className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="mb-2 font-mono text-[11px] uppercase tracking-wider">
                      {cohort.code}
                    </Badge>
                    <CardTitle className="text-lg leading-snug">{cohort.name}</CardTitle>
                    <CardDescription className="text-xs">{cohort.department}</CardDescription>
                  </div>
                  <Badge variant="secondary" className={getStatusBadgeClass(cohort.status)}>
                    {cohort.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pb-4">
                {/* Lead Instructor */}
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-2.5">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">
                      {cohort.leadInstructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs leading-tight">
                      {cohort.leadInstructor.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Lead Instructor</span>
                  </div>
                </div>

                {/* Capacity & Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Enrollment Capacity</span>
                    <span className="font-semibold text-foreground">
                      {cohort.enrolledStudents} / {cohort.capacity} ({fillPercentage}%)
                    </span>
                  </div>
                  <Progress value={fillPercentage} className="h-2" />
                </div>

                {/* Location & Timetable */}
                <div className="grid grid-cols-2 gap-2 border-t pt-3 text-muted-foreground text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-foreground" />
                    <span className="truncate">{cohort.primaryRoom}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 font-semibold text-foreground">
                    <span>{cohort.attendanceRate}% Attendance</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Clock className="size-3.5 shrink-0" />
                  <span className="truncate">{cohort.scheduleSummary}</span>
                </div>
              </CardContent>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t bg-muted/10 p-4 pt-3">
                <EnrollStudentsDialog
                  cohort={cohort}
                  onEnrolled={(count) => handleStudentsEnrolled(cohort.id, count)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Cohort Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Student Roster</DropdownMenuItem>
                    <DropdownMenuItem>Generate Weekly Timetable</DropdownMenuItem>
                    <DropdownMenuItem>Export Attendance Sheet</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Archive Cohort</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
