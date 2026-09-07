"use client";

import * as React from "react";

import { Award, DollarSign, MoreHorizontal, Search, Sparkles, Users } from "lucide-react";
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

import { AwardScholarshipDialog } from "./award-scholarship-dialog";
import { INITIAL_SCHOLARSHIPS, SCHOLARSHIP_TYPES, type ScholarshipItem } from "./data";

export function ScholarshipsList() {
  const [scholarships, setScholarships] = React.useState<ScholarshipItem[]>(INITIAL_SCHOLARSHIPS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const handleAddScholarship = (newSch: ScholarshipItem) => {
    setScholarships([newSch, ...scholarships]);
  };

  const handleRevokeScholarship = (schId: string) => {
    setScholarships((prev) => prev.map((s) => (s.id === schId ? { ...s, status: "Revoked" } : s)));
    toast.info("Scholarship Revoked", {
      description: "Scholarship status updated to revoked.",
    });
  };

  const filteredScholarships = scholarships.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.studentName.toLowerCase().includes(q) ||
      s.studentMatricule.toLowerCase().includes(q) ||
      s.cohort.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q);

    const matchesType = typeFilter === "all" || s.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalAid = scholarships.filter((s) => s.status === "Active").reduce((acc, s) => acc + s.amount, 0);

  const activeRecipients = scholarships.filter((s) => s.status === "Active").length;
  const avgAid = Math.round(totalAid / (activeRecipients || 1));

  const getTypeBadgeClass = (type: ScholarshipItem["type"]) => {
    if (type === "Merit Excellence") {
      return "border-purple-600/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
    if (type === "Women in Tech") {
      return "border-pink-600/30 bg-pink-500/10 text-pink-600 dark:text-pink-400";
    }
    if (type === "Corporate Tech Partner") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Scholarships & Financial Aid</h1>
          <p className="text-muted-foreground text-sm">
            Manage merit scholarships, social equity grants, and corporate co-funded tuition waivers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AwardScholarshipDialog onAddScholarship={handleAddScholarship} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Total Financial Aid
            </span>
            <DollarSign className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalAid.toLocaleString()} €</div>
          <div className="mt-1 text-muted-foreground text-xs">Total tuition subsidies granted</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Active Beneficiaries
            </span>
            <Users className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{activeRecipients}</div>
          <div className="mt-1 font-medium text-purple-600 text-xs">Supported student learners</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Average Grant</span>
            <Award className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{avgAid.toLocaleString()} €</div>
          <div className="mt-1 text-muted-foreground text-xs">Per scholarship recipient</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Programs Funded</span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{SCHOLARSHIP_TYPES.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">Merit, Equity, Diversity & Corporate</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Awarded Scholarships</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search student, matricule, cohort..."
                  className="h-9 pl-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[180px] text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SCHOLARSHIP_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
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
                  <TableHead className="w-[220px]">Learner / Matricule</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Justification & Decision</TableHead>
                  <TableHead className="w-[120px] text-right">Award Amount</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholarships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No scholarships found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScholarships.map((sch) => (
                    <TableRow key={sch.id}>
                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-semibold text-foreground text-sm">{sch.studentName}</span>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="font-mono text-[11px]">{sch.code}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">{sch.studentMatricule}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-foreground text-xs">{sch.cohort}</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className={getTypeBadgeClass(sch.type)}>
                          {sch.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="grid max-w-[280px] gap-0.5 text-xs">
                          <span className="truncate text-foreground">{sch.justification}</span>
                          <span className="text-[11px] text-muted-foreground">By {sch.approvedBy}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-bold text-emerald-600 text-sm">
                        {sch.amount.toLocaleString()} €
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sch.status === "Active"
                              ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400"
                              : "border-destructive/30 bg-destructive/10 text-destructive text-xs"
                          }
                        >
                          {sch.status}
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {sch.status === "Active" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRevokeScholarship(sch.id)}
                              >
                                Revoke Scholarship
                              </DropdownMenuItem>
                            )}
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
    </div>
  );
}
