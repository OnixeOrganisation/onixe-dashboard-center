"use client";

import * as React from "react";

import { Clock, GraduationCap, Layers, Loader2, MapPin, MoreHorizontal, RefreshCw, Search, Users } from "lucide-react";
import { toast } from "sonner";

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

import {
  type CreateCohortPayload,
  createCohortApi,
  enrollStudentsApi,
  fetchCohorts,
  updateCohortStatusApi,
} from "./cohorts.api";
import { CreateCohortDialog } from "./create-cohort-dialog";
import type { CohortItem } from "./data";
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
  const [cohorts, setCohorts] = React.useState<CohortItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const loadData = React.useCallback(async (showToast = false) => {
    try {
      const data = await fetchCohorts();
      setCohorts(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Promotions synchronisées", {
          description: "Données des promotions académiques récupérées en direct depuis le serveur NestJS.",
        });
      }
    } catch (err) {
      toast.error("Impossible de charger les promotions", {
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

  const handleAddCohort = async (payload: CreateCohortPayload): Promise<boolean> => {
    try {
      const newCohort = await createCohortApi(payload);
      setCohorts((prev) => [newCohort, ...prev]);
      toast.success("Promotion créée avec succès", {
        description: `La promotion ${newCohort.name} (${newCohort.code}) a été enregistrée en base de données.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de création de la promotion", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleStudentsEnrolled = async (cohortId: string, studentIds: string[], count: number): Promise<boolean> => {
    try {
      const updated = await enrollStudentsApi(cohortId, studentIds, count);
      setCohorts((prev) => prev.map((c) => (c.id === cohortId ? updated : c)));
      toast.success("Apprenants inscrits avec succès", {
        description: `${count} étudiant(s) inscrit(s) dans la promotion.`,
      });
      return true;
    } catch (err) {
      toast.error("Échec de l'inscription des étudiants", {
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  const handleStatusChange = async (cohortId: string, newStatus: CohortItem["status"]) => {
    try {
      const updated = await updateCohortStatusApi(cohortId, newStatus);
      setCohorts((prev) => prev.map((c) => (c.id === cohortId ? updated : c)));
      toast.success("Statut de la promotion mis à jour", {
        description: `Statut modifié avec succès en ${newStatus}.`,
      });
    } catch (err) {
      toast.error("Erreur de mise à jour du statut", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
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
  const avgAttendance =
    cohorts.length > 0 ? (cohorts.reduce((acc, c) => acc + c.attendanceRate, 0) / cohorts.length).toFixed(1) : "0.0";

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
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
              {cohorts.filter((c) => c.status === "In Progress").length} in session ·{" "}
              {cohorts.filter((c) => c.status === "Starting Soon").length} starting soon
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
            <p className="text-muted-foreground text-xs">Capacity: {totalCapacity} places across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Capacity Fill Rate</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {totalCapacity > 0 ? Math.round((totalLearners / totalCapacity) * 100) : 0}%
            </div>
            <p className="text-muted-foreground text-xs">Optimal pedagogical ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">Avg. Attendance</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{avgAttendance}%</div>
            <p className="text-muted-foreground text-xs">Across all active academic promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search cohort or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs">
                In Session
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="graduated" className="text-xs">
                Graduated
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-lg border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" />
            Loading academic cohorts catalog...
          </div>
        </div>
      ) : filteredCohorts.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border bg-card text-muted-foreground text-sm">
          No cohorts found matching your criteria.
        </div>
      ) : (
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
                    onEnrolled={(ids, count) => handleStudentsEnrolled(cohort.id, ids, count)}
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
                      <DropdownMenuItem onClick={() => toast.info(`Viewing student roster for ${cohort.name}`)}>
                        View Student Roster
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success(`Generated timetable for ${cohort.name}`)}>
                        Generate Weekly Timetable
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success(`Exported attendance sheet for ${cohort.name}`)}>
                        Export Attendance Sheet
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          void handleStatusChange(cohort.id, cohort.status === "Archived" ? "In Progress" : "Archived")
                        }
                      >
                        {cohort.status === "Archived" ? "Restore Cohort" : "Archive Cohort"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
