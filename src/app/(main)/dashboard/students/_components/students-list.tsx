"use client";

import * as React from "react";

import {
  Download,
  Eye,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { StudentItem } from "./data";
import { ImportStudentsDialog } from "./import-students-dialog";
import { StudentDetailsDialog } from "./student-details-dialog";
import { type CreateStudentPayload, createStudentApi, fetchStudents, updateStudentStatusApi } from "./students.api";

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
  const [students, setStudents] = React.useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedStudent, setSelectedStudent] = React.useState<StudentItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      const data = await fetchStudents();
      setStudents(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Apprenants synchronisés", {
          description: "Dossiers étudiants chargés en direct depuis le serveur NestJS.",
        });
      }
    } catch (err) {
      toast.error("Impossible de charger les étudiants", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(false);
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
  };

  const handleStudentCreated = async (payload: CreateStudentPayload): Promise<boolean> => {
    try {
      const newStudent = await createStudentApi(payload);
      setStudents((prev) => [newStudent, ...prev]);
      toast.success("Étudiant inscrit avec succès", {
        description: `${newStudent.name} inscrit avec le matricule ${newStudent.matricule}.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de l'inscription de l'étudiant", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleStudentsImported = (newStudents: StudentItem[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
  };

  const handleStatusChange = async (id: string, newStatus: StudentItem["status"]) => {
    try {
      const updated = await updateStudentStatusApi(id, newStatus);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Statut mis à jour", {
        description: `Statut de l'étudiant modifié en ${newStatus}.`,
      });
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
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
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeStudentsCount = students.filter((s) => s.status === "Active").length;
  const graduatedCount = students.filter((s) => s.status === "Graduated").length;
  const pendingCount = students.filter((s) => s.status === "Pending Registration").length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl">{students.length}</div>
              <div className="text-muted-foreground text-xs">Total Registered Students</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <UserCheck className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl">{activeStudentsCount}</div>
              <div className="text-muted-foreground text-xs">Active Learners Enrolled</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl">{graduatedCount}</div>
              <div className="text-muted-foreground text-xs">Graduated Alumni</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <UserX className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl">{pendingCount}</div>
              <div className="text-muted-foreground text-xs">Pending Registrations</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Students Directory</CardTitle>
            <p className="text-muted-foreground text-xs">
              Manage student registrations, cohort enrollments, grades and academic certificates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportRoster} className="gap-2">
              <Download className="size-4" />
              Export CSV
            </Button>
            <ImportStudentsDialog onStudentsImported={handleStudentsImported} />
            <CreateStudentDialog onStudentCreated={handleStudentCreated} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="Active" className="text-xs">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="Pending Registration" className="text-xs">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="Graduated" className="text-xs">
                    Graduated
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Grade Avg.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        Loading student directory...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-sm">
                      No students found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            {student.avatar && <AvatarImage src={student.avatar} alt={student.name} />}
                            <AvatarFallback className="text-xs">
                              {student.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleViewDetails(student)}
                          >
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
                              <DropdownMenuItem
                                onClick={() => toast.info(`Transfer dialog opened for ${student.name}`)}
                              >
                                Change Cohort
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Transcript sent to ${student.email}`)}>
                                Email Transcript
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  void handleStatusChange(
                                    student.id,
                                    student.status === "Active" ? "Suspended" : "Active",
                                  )
                                }
                              >
                                {student.status === "Active" ? "Suspend Student" : "Reactivate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <StudentDetailsDialog
        student={selectedStudent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStatusChange={(id, status) => {
          void handleStatusChange(id, status);
        }}
      />
    </div>
  );
}
