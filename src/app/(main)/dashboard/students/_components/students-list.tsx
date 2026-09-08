"use client";

import * as React from "react";

import { Download, Eye, GraduationCap, MoreHorizontal, Printer, Search, UserCheck, Users, UserX } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateSchoolCertificateHtml } from "@/lib/export-engine/templates/school-certificate";

import { CreateStudentDialog } from "./create-student-dialog";
import { mockStudents, type StudentItem } from "./data";
import { StudentDetailsDialog } from "./student-details-dialog";

function getStudentBadgeClass(status: StudentItem["status"]) {
  if (status === "Active") {
    return "border-green-600/30 bg-green-500/10 text-green-600 dark:text-green-400";
  }
  if (status === "Graduated") {
    return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  }
  if (status === "Pending Registration") {
    return "border-yellow-600/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  }
  return "border-destructive/30 bg-destructive/10 text-destructive";
}

export function StudentsList() {
  const [students, setStudents] = React.useState<StudentItem[]>(mockStudents);
  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedStudent, setSelectedStudent] = React.useState<StudentItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handleStudentCreated = (newStudent: StudentItem) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleStatusChange = (id: string, newStatus: StudentItem["status"]) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const handleViewDetails = (student: StudentItem) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  const handleExportRoster = () => {
    exportToCsv("Registered_Students_Roster", students, [
      { key: "matricule", label: "Student ID (Matricule)" },
      { key: "name", label: "Full Name" },
      { key: "email", label: "Institutional Email" },
      { key: "phone", label: "Phone" },
      { key: "department", label: "Department" },
      { key: "cohort", label: "Cohort" },
      { key: "attendanceRate", label: "Attendance Rate (%)" },
      { key: "gradeAverage", label: "Grade Average (/20)" },
      { key: "creditsEarned", label: "ECTS Earned" },
      { key: "status", label: "Enrollment Status" },
    ]);
    toast.success("Students Roster Exported", {
      description: "Downloaded registered students database as CSV/Excel.",
    });
  };

  const handlePrintCertificate = (student: StudentItem) => {
    const html = generateSchoolCertificateHtml({
      studentName: student.name,
      studentId: student.matricule,
      birthDate: "15/04/2001",
      birthPlace: "Paris, France",
      academicYear: "2024 - 2025",
      programTitle: "Master of Science in Software & Cloud Engineering",
      departmentName: student.department,
      degreeLevel: "Master Degree (RNCP Level 7, Bac+5)",
      campusName: "Paris Central Campus - Turing Hub",
      enrollmentStatus: "Apprenticeship CFA",
    });

    printHtmlDocument({
      title: `Certificate_Enrollment_${student.matricule}_${student.name.replace(/\s+/g, "_")}`,
      htmlContent: html,
      pageOrientation: "portrait",
    });

    toast.success("Certificate of Enrollment Generated", {
      description: `Official enrollment certificate generated for ${student.name}.`,
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matricule.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.cohort.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "all" || s.department === selectedDept;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.status === "Active") ||
      (statusFilter === "graduated" && s.status === "Graduated") ||
      (statusFilter === "suspended" && s.status === "Suspended");

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = students.filter((s) => s.status === "Active").length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight md:text-3xl">
            Students & Learners Directory
          </h1>
          <p className="text-muted-foreground text-sm">
            Academic records, cohorts enrollment, attendance telemetry and student transcripts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportRoster}>
            <Download className="size-4" />
            Export Roster
          </Button>
          <CreateStudentDialog onStudentCreated={handleStudentCreated} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Total Learners</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{students.length}</div>
            <p className="text-muted-foreground text-xs">{activeCount} active in current cohorts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Avg. Attendance</CardTitle>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{avgAttendance}%</div>
            <p className="text-muted-foreground text-xs">Monitored across 6 active cohorts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Graduated Alumni</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{students.filter((s) => s.status === "Graduated").length}</div>
            <p className="text-muted-foreground text-xs">100% diploma verification rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">At-Risk / Suspended</CardTitle>
            <UserX className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{students.filter((s) => s.status === "Suspended").length}</div>
            <p className="text-muted-foreground text-xs">Requires academic intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All Students ({students.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
                <TabsTrigger value="graduated">Graduated</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search student, matricule, cohort..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-8 w-[180px] text-xs">
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
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Cohort / Promotion</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Grade Avg.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-sm">{student.name}</span>
                        <span className="text-muted-foreground text-xs">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{student.matricule}</TableCell>
                  <TableCell className="font-medium text-foreground text-xs">{student.cohort}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{student.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-xs">
                      <span className={student.attendanceRate < 80 ? "text-destructive" : "text-foreground"}>
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs">
                    {student.gradeAverage > 0 ? `${student.gradeAverage} / 20` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStudentBadgeClass(student.status)}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleViewDetails(student)}>
                        <Eye className="size-4" />
                        <span className="sr-only">View Student</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Student Options</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                            View Full Transcript
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintCertificate(student)}>
                            <Printer className="mr-2 size-3.5" />
                            Print School Certificate (PDF)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`Transfer dialog opened for ${student.name}`)}>
                            Change Cohort
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success(`Transcript sent to ${student.email}`)}>
                            Email Transcript
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              handleStatusChange(student.id, student.status === "Active" ? "Suspended" : "Active")
                            }
                          >
                            {student.status === "Active" ? "Suspend Student" : "Reactivate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <StudentDetailsDialog
        student={selectedStudent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
