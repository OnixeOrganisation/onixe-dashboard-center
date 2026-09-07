"use client";

import * as React from "react";

import { Award, Building, GraduationCap, MoreHorizontal, Plus, Search, UserCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { AssignHodDialog } from "./assign-hod-dialog";
import { CreateDepartmentDialog } from "./create-department-dialog";
import { CreateProgramDialog } from "./create-program-dialog";
import { type DepartmentItem, INITIAL_DEPARTMENTS, type ProgramItem } from "./data";

export function DepartmentsList() {
  const [departments, setDepartments] = React.useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<DepartmentItem | null>(null);
  const [hodDialogOpen, setHodDialogOpen] = React.useState(false);
  const [programDialogOpen, setProgramDialogOpen] = React.useState(false);

  const handleAddDepartment = (newDept: DepartmentItem) => {
    setDepartments([newDept, ...departments]);
  };

  const handleUpdateHod = (deptId: string, hod: DepartmentItem["headOfDepartment"]) => {
    setDepartments((prev) => prev.map((d) => (d.id === deptId ? { ...d, headOfDepartment: hod } : d)));
  };

  const handleAddProgram = (deptId: string, newProgram: ProgramItem) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === deptId
          ? {
              ...d,
              programs: [...d.programs, newProgram],
              programsCount: d.programs.length + 1,
            }
          : d,
      ),
    );
  };

  const filteredDepts = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.headOfDepartment.name.toLowerCase().includes(q)
    );
  });

  const totalPrograms = departments.reduce((acc, d) => acc + d.programsCount, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalStudents = departments.reduce((acc, d) => acc + d.enrolledStudentsCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Academic Departments & Degree Tracks</h1>
          <p className="text-muted-foreground text-sm">
            Structure academic faculties, assign department heads (HOD), configure study programs and degree curricula.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateDepartmentDialog onAddDepartment={handleAddDepartment} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Departments Established
            </span>
            <Building className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{departments.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">Active faculty divisions</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Degree Programs</span>
            <Award className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalPrograms}</div>
          <div className="mt-1 text-muted-foreground text-xs">Bachelors, Masters & Certificates</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Department Faculty
            </span>
            <UserCheck className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalFaculty}</div>
          <div className="mt-1 text-muted-foreground text-xs">Appointed educators & researchers</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Enrolled Learners
            </span>
            <GraduationCap className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalStudents}</div>
          <div className="mt-1 text-muted-foreground text-xs">Across all academic tracks</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search departments, codes, HOD..."
            className="h-9 pl-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredDepts.map((dept) => (
          <Card key={dept.id} className="flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold font-mono text-xs">
                      {dept.code}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border-emerald-600/30 bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400"
                    >
                      {dept.status}
                    </Badge>
                  </div>
                  <CardTitle className="pt-1 text-lg">{dept.name}</CardTitle>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Department Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDept(dept);
                        setHodDialogOpen(true);
                      }}
                    >
                      Appoint / Change HOD
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDept(dept);
                        setProgramDialogOpen(true);
                      }}
                    >
                      Add Study Program
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="line-clamp-2 pt-1 text-xs">{dept.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              {/* Head of Department Card */}
              <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="font-bold text-xs">
                      {dept.headOfDepartment.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5 text-xs">
                    <span className="font-semibold text-foreground">{dept.headOfDepartment.name}</span>
                    <span className="text-[11px] text-muted-foreground">Head of Department (HOD)</span>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  {dept.headOfDepartment.matricule}
                </Badge>
              </div>

              {/* Department Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md border bg-background p-2">
                  <div className="text-[11px] text-muted-foreground">Programs</div>
                  <div className="mt-0.5 font-bold text-base">{dept.programsCount}</div>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <div className="text-[11px] text-muted-foreground">Faculty</div>
                  <div className="mt-0.5 font-bold text-base">{dept.facultyCount}</div>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <div className="text-[11px] text-muted-foreground">Learners</div>
                  <div className="mt-0.5 font-bold text-base">{dept.enrolledStudentsCount}</div>
                </div>
              </div>

              {/* Programs List */}
              <div className="space-y-2 border-t pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Curricula & Programs</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-[11px]"
                    onClick={() => {
                      setSelectedDept(dept);
                      setProgramDialogOpen(true);
                    }}
                  >
                    <Plus className="size-3" />
                    Add Program
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {dept.programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="flex items-center justify-between rounded-md border p-2 text-xs transition-colors hover:bg-muted/30"
                    >
                      <div className="grid gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-[11px] text-primary">{prog.code}</span>
                          <span className="font-medium">{prog.name}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {prog.degreeLevel} • {prog.durationMonths} months • {prog.totalEcts} ECTS Credits
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {prog.activeCohortsCount} cohorts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <AssignHodDialog
        department={selectedDept}
        open={hodDialogOpen}
        onOpenChange={setHodDialogOpen}
        onUpdateHod={handleUpdateHod}
      />

      <CreateProgramDialog
        department={selectedDept}
        open={programDialogOpen}
        onOpenChange={setProgramDialogOpen}
        onAddProgram={handleAddProgram}
      />
    </div>
  );
}
