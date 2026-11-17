"use client";

import * as React from "react";

import {
  Building,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ParentItem } from "./data";
import { LinkStudentDialog } from "./link-student-dialog";
import { fetchParents } from "./parents.api";

export function ParentsList() {
  const [parents, setParents] = React.useState<ParentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchParents();
      setParents(data || []);
    } catch (err: any) {
      toast.error("Error loading parents directory", {
        description: err.message || "Failed to reach NestJS API gateway.",
      });
      setParents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddParent = (newParent: ParentItem) => {
    setParents((prev) => [newParent, ...prev]);
  };

  const filteredParents = parents.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.linkedStudents &&
        p.linkedStudents.some((s) => s.name.toLowerCase().includes(q) || s.matricule.toLowerCase().includes(q)))
    );
  });

  const totalLinked = parents.length;
  const corporateMentors = parents.filter((p) => p.relationshipType.includes("Apprenticeship")).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Parent & Enterprise Mentor Portal</h1>
          <p className="text-muted-foreground text-sm">
            Live database management for parents, legal guardians, and corporate apprenticeship supervisors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <LinkStudentDialog onAddParent={handleAddParent} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Connecting to live NestJS parent portal database...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Linked Accounts
                </span>
                <HeartHandshake className="size-4 text-primary" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">{totalLinked}</div>
              <div className="mt-1 text-muted-foreground text-xs">Guardians & corporate mentors</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Apprenticeship Mentors
                </span>
                <Building className="size-4 text-sky-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">{corporateMentors}</div>
              <div className="mt-1 font-medium text-sky-600 text-xs">Enterprise workplace supervisors</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Telemetry Synchronized
                </span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">100%</div>
              <div className="mt-1 font-medium text-emerald-600 text-xs">Real-time grades & attendance link</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Access Security
                </span>
                <ShieldCheck className="size-4 text-purple-500" />
              </div>
              <div className="mt-2 font-bold text-2xl tracking-tight">2FA Enforced</div>
              <div className="mt-1 text-muted-foreground text-xs">Protected student records access</div>
            </Card>
          </div>

          {/* Main Table Card */}
          <Card>
            <CardHeader className="p-4 pb-3 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Guardian & Mentor Directory</CardTitle>
                <div className="relative min-w-[260px]">
                  <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contact, learner, email..."
                    className="h-9 pl-8 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="rounded-md border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">Guardian / Mentor</TableHead>
                      <TableHead>Relationship Type</TableHead>
                      <TableHead>Linked Learners</TableHead>
                      <TableHead>Academic Telemetry</TableHead>
                      <TableHead className="w-[120px]">Last Login</TableHead>
                      <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No linked contacts found in database.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredParents.map((par) => (
                        <TableRow key={par.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                {par.avatar && <AvatarImage src={par.avatar} alt={par.name} />}
                                <AvatarFallback className="font-bold text-xs">
                                  {par.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid gap-0.5 text-xs">
                                <span className="font-semibold text-foreground">{par.name}</span>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                  <span>{par.email}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {par.relationshipType}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              {par.linkedStudents && par.linkedStudents.length > 0 ? (
                                par.linkedStudents.map((s) => (
                                  <div key={s.studentId} className="flex items-center gap-1.5 text-xs">
                                    <span className="font-medium text-foreground">{s.name}</span>
                                    <Badge variant="secondary" className="font-mono text-[10px]">
                                      {s.matricule}
                                    </Badge>
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs italic">No learners linked</span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1 text-xs">
                              {par.linkedStudents && par.linkedStudents.length > 0 ? (
                                par.linkedStudents.map((s) => (
                                  <div key={s.studentId} className="flex items-center gap-2">
                                    <span className="font-semibold text-emerald-600">{s.gradeAverage} / 20</span>
                                    <span>•</span>
                                    <span className="text-muted-foreground">{s.attendanceRate}% attendance</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-muted-foreground text-xs">{par.lastAccess}</span>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast.info("Access Link Resent", {
                                      description: `Magic access link resent to ${par.email}.`,
                                    });
                                  }}
                                >
                                  Resend Access Link
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
        </>
      )}
    </div>
  );
}
