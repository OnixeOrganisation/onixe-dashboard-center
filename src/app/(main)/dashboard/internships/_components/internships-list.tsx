"use client";

import * as React from "react";

import { Briefcase, Building, Calendar, CheckCircle2, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";

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

import { CreateInternshipDialog } from "./create-internship-dialog";
import { INITIAL_INTERNSHIPS, type InternshipItem } from "./data";
import { ScheduleDefenseDialog } from "./schedule-defense-dialog";

export function InternshipsList() {
  const [internships, setInternships] = React.useState<InternshipItem[]>(INITIAL_INTERNSHIPS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const [selectedInternship, setSelectedInternship] = React.useState<InternshipItem | null>(null);
  const [defenseDialogOpen, setDefenseDialogOpen] = React.useState(false);

  const handleAddInternship = (newIntern: InternshipItem) => {
    setInternships([newIntern, ...internships]);
  };

  const handleUpdateDefense = (id: string, date: string, room: string) => {
    setInternships((prev) =>
      prev.map((i) => (i.id === id ? { ...i, defenseDate: date, defenseRoom: room, status: "Defense Scheduled" } : i)),
    );
  };

  const filteredInternships = internships.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      i.studentName.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q) ||
      i.pfeTopic.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q);

    const matchesType = typeFilter === "all" || i.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalContracts = internships.length;
  const apprenticeships = internships.filter((i) => i.type === "Apprenticeship (Alternance)").length;
  const scheduledDefenses = internships.filter((i) => i.status === "Defense Scheduled").length;
  const validatedDefenses = internships.filter((i) => i.status === "Validated").length;

  const getStatusBadgeClass = (status: InternshipItem["status"]) => {
    if (status === "Validated") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Defense Scheduled") {
      return "border-purple-600/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
    return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Internships & Apprenticeship Contracts (PFE)</h1>
          <p className="text-muted-foreground text-sm">
            Track industry internships, apprenticeship agreements, enterprise tutors, and thesis defense deliberations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateInternshipDialog onAddInternship={handleAddInternship} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Active Contracts</span>
            <Briefcase className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalContracts}</div>
          <div className="mt-1 text-muted-foreground text-xs">Apprenticeships & PFE placements</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Apprenticeships (CFA)
            </span>
            <Building className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{apprenticeships}</div>
          <div className="mt-1 text-muted-foreground text-xs">Work-study industry contracts</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Scheduled Defenses
            </span>
            <Calendar className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{scheduledDefenses}</div>
          <div className="mt-1 font-medium text-purple-600 text-xs">Juries and amphitheatres assigned</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Validated Juries</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{validatedDefenses}</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">Approved capstone projects</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Contract & Capstone Registry</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search student, enterprise, topic..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[190px] text-xs">
                  <SelectValue placeholder="Contract Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contracts</SelectItem>
                  <SelectItem value="Apprenticeship (Alternance)">Apprenticeship (Alternance)</SelectItem>
                  <SelectItem value="End-of-Studies Internship (PFE)">End-of-Studies Internship (PFE)</SelectItem>
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
                  <TableHead className="w-[240px]">Learner / Contract</TableHead>
                  <TableHead>Hosting Enterprise</TableHead>
                  <TableHead>PFE / Thesis Topic</TableHead>
                  <TableHead>Tutors & Defense</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInternships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No contracts found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInternships.map((intern) => (
                    <TableRow key={intern.id}>
                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-semibold text-foreground text-sm">{intern.studentName}</span>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="font-mono text-[11px]">{intern.code}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">{intern.studentMatricule}</span>
                          </div>
                          <Badge variant="outline" className="mt-0.5 w-fit text-[10px]">
                            {intern.type}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-semibold text-foreground">{intern.companyName}</span>
                          <span className="text-muted-foreground">{intern.companyAddress}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="line-clamp-2 max-w-[280px] text-muted-foreground text-xs">{intern.pfeTopic}</p>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span>
                            Academic: <strong className="text-foreground">{intern.academicSupervisor}</strong>
                          </span>
                          <span>
                            Mentor: <strong className="text-foreground">{intern.companyTutor}</strong>
                          </span>
                          {intern.defenseDate && (
                            <span className="pt-0.5 font-medium text-[11px] text-purple-600">
                              Defense: {intern.defenseDate} ({intern.defenseRoom})
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-1">
                          <Badge variant="secondary" className={getStatusBadgeClass(intern.status)}>
                            {intern.status}
                          </Badge>
                          {intern.juryScore && (
                            <span className="font-bold text-[11px] text-emerald-600">
                              Jury Score: {intern.juryScore} / 20
                            </span>
                          )}
                        </div>
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
                                setSelectedInternship(intern);
                                setDefenseDialogOpen(true);
                              }}
                            >
                              Schedule Thesis Defense
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success("Contract Document Exported", {
                                  description: `Official tri-partite convention for ${intern.studentName} generated.`,
                                });
                              }}
                            >
                              Export Tri-partite Convention
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

      {/* Defense Modal */}
      <ScheduleDefenseDialog
        internship={selectedInternship}
        open={defenseDialogOpen}
        onOpenChange={setDefenseDialogOpen}
        onUpdateDefense={handleUpdateDefense}
      />
    </div>
  );
}
