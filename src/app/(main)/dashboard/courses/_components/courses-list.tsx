"use client";

import * as React from "react";

import { Award, BookOpen, Clock, Layers, MoreHorizontal, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { CourseModulesDialog } from "./course-modules-dialog";
import { CreateCourseDialog } from "./create-course-dialog";
import { COURSE_DEPARTMENTS, type CourseItem, type CourseModuleItem, INITIAL_COURSES } from "./data";

export function CoursesList() {
  const [courses, setCourses] = React.useState<CourseItem[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState<string>("all");
  const [semesterFilter, setSemesterFilter] = React.useState<string>("all");

  const [selectedCourse, setSelectedCourse] = React.useState<CourseItem | null>(null);
  const [modulesDialogOpen, setModulesDialogOpen] = React.useState(false);

  const handleAddCourse = (newCourse: CourseItem) => {
    setCourses([newCourse, ...courses]);
  };

  const handleUpdateModules = (courseId: string, modules: CourseModuleItem[]) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules,
              modulesCount: modules.length,
            }
          : c,
      ),
    );
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === "all" || c.department === deptFilter;
    const matchesSemester = semesterFilter === "all" || c.semester === semesterFilter;

    return matchesSearch && matchesDept && matchesSemester;
  });

  const totalCourses = courses.length;
  const totalEcts = courses.reduce((acc, c) => acc + c.ectsCredits, 0);
  const totalHours = courses.reduce((acc, c) => acc + c.totalHours, 0);
  const totalModules = courses.reduce((acc, c) => acc + c.modulesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Curriculum & Course Catalog</h1>
          <p className="text-muted-foreground text-sm">
            Manage institutional courses, ECTS credits, syllabus modules, teaching hours, and cohorts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateCourseDialog onAddCourse={handleAddCourse} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Total Courses</span>
            <BookOpen className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalCourses}</div>
          <div className="mt-1 text-muted-foreground text-xs">Catalog curriculum units</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Total ECTS Credits
            </span>
            <Award className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalEcts} pts</div>
          <div className="mt-1 text-muted-foreground text-xs">European Credit Transfer System</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Teaching Volume</span>
            <Clock className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalHours} hrs</div>
          <div className="mt-1 text-muted-foreground text-xs">Total instructional syllabus hours</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Syllabus Modules</span>
            <Layers className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalModules}</div>
          <div className="mt-1 text-muted-foreground text-xs">Structured pedagogical units</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Course Inventory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, codes..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-9 w-[180px] text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {COURSE_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="h-9 w-[140px] text-xs">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Semester 1">Semester 1</SelectItem>
                  <SelectItem value="Semester 2">Semester 2</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
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
                  <TableHead className="w-[300px]">Course Title & Code</TableHead>
                  <TableHead>Academic Department</TableHead>
                  <TableHead className="w-[100px] text-center">ECTS</TableHead>
                  <TableHead className="w-[100px] text-center">Coef</TableHead>
                  <TableHead className="w-[120px]">Hours & Modules</TableHead>
                  <TableHead className="w-[120px]">Semester</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No courses found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-bold font-mono text-[11px]">
                              {course.code}
                            </Badge>
                            <span className="font-semibold text-foreground text-sm leading-tight">{course.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <span>{course.enrolledCohorts.length} cohorts enrolled</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-muted-foreground text-xs">{course.department}</span>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-bold text-xs">
                          {course.ectsCredits} ECTS
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center font-medium text-xs">×{course.coefficient}</TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium">{course.totalHours} hours</span>
                          <span className="text-[11px] text-muted-foreground">{course.modulesCount} modules</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {course.semester}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCourse(course);
                                setModulesDialogOpen(true);
                              }}
                            >
                              Manage Syllabus & Modules
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Syllabus Modal */}
      <CourseModulesDialog
        course={selectedCourse}
        open={modulesDialogOpen}
        onOpenChange={setModulesDialogOpen}
        onUpdateModules={handleUpdateModules}
      />
    </div>
  );
}
