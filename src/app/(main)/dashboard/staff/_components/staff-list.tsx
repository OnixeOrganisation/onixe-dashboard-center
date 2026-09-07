"use client";

import * as React from "react";

import { Building2, CheckCircle2, CreditCard, MoreHorizontal, Search, ShieldCheck } from "lucide-react";
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

import { CreateStaffDialog } from "./create-staff-dialog";
import { ACCESS_LEVELS, INITIAL_STAFF, STAFF_DEPARTMENTS, type StaffItem } from "./data";
import { StaffDetailsDialog } from "./staff-details-dialog";

export function StaffList() {
  const [staffList, setStaffList] = React.useState<StaffItem[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState<string>("all");
  const [accessFilter, setAccessFilter] = React.useState<string>("all");

  const [selectedStaff, setSelectedStaff] = React.useState<StaffItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handleAddStaff = (newStaff: StaffItem) => {
    setStaffList([newStaff, ...staffList]);
  };

  const handleToggleStatus = (id: string, newStatus: StaffItem["status"]) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    const matchesAccess = accessFilter === "all" || s.accessLevel === accessFilter;

    return matchesSearch && matchesDept && matchesAccess;
  });

  // KPI Calculations
  const totalStaff = staffList.length;
  const superAdmins = staffList.filter((s) => s.accessLevel === "Super Admin").length;
  const financeStaff = staffList.filter((s) => s.accessLevel === "Financial Officer").length;
  const activeStaff = staffList.filter((s) => s.status === "Active").length;

  const getStatusBadgeClass = (status: StaffItem["status"]) => {
    if (status === "Active") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "On Leave") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  const getAccessBadgeClass = (access: StaffItem["accessLevel"]) => {
    if (access === "Super Admin") {
      return "border-purple-600/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
    if (access === "Financial Officer") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (access === "Academic Officer") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    return "border-muted bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Center Staff & Administration</h1>
          <p className="text-muted-foreground text-sm">
            Manage academic leadership, finance officers, registrars, and operational campus staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateStaffDialog onAddStaff={handleAddStaff} />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Total Staff</span>
            <Building2 className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalStaff}</div>
          <div className="mt-1 text-muted-foreground text-xs">{activeStaff} active accounts</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Super Administrators
            </span>
            <ShieldCheck className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{superAdmins}</div>
          <div className="mt-1 font-medium text-purple-600 text-xs">Full organizational scope</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Finance & Cashiers
            </span>
            <CreditCard className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{financeStaff}</div>
          <div className="mt-1 text-muted-foreground text-xs">Bursary & treasury management</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Departments Represented
            </span>
            <CheckCircle2 className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{STAFF_DEPARTMENTS.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">Comprehensive operations</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Staff Directory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff, role, email..."
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
                  {STAFF_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Levels</SelectItem>
                  {ACCESS_LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
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
                  <TableHead className="w-[280px]">Staff Member</TableHead>
                  <TableHead>Role & Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="w-[140px]">Access Level</TableHead>
                  <TableHead className="w-[160px]">Last Activity</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No staff members found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="font-semibold text-xs">
                              {staff.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <span className="font-semibold text-sm leading-none">{staff.name}</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <span className="font-mono text-[11px]">{staff.matricule}</span>
                              <span>•</span>
                              <span className="max-w-[140px] truncate">{staff.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-foreground text-xs">{staff.role}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-muted-foreground text-xs">{staff.department}</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className={getAccessBadgeClass(staff.accessLevel)}>
                          {staff.accessLevel}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-muted-foreground text-xs">{staff.lastLogin}</span>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className={getStatusBadgeClass(staff.status)}>
                          {staff.status}
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
                                setSelectedStaff(staff);
                                setDetailsOpen(true);
                              }}
                            >
                              View Permissions & Scopes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const nextStatus = staff.status === "Active" ? "Suspended" : "Active";
                                handleToggleStatus(staff.id, nextStatus);
                                toast.info("Status Changed", {
                                  description: `${staff.name}'s status is now ${nextStatus}.`,
                                });
                              }}
                              className={staff.status === "Active" ? "text-destructive" : "text-emerald-600"}
                            >
                              {staff.status === "Active" ? "Suspend Account" : "Reactivate Account"}
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

      {/* Modals */}
      <StaffDetailsDialog
        staff={selectedStaff}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
