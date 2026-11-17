"use client";
import { useEffect, useState } from "react";

import { type ColumnFiltersState, type PaginationState, useTable } from "@tanstack/react-table";
import { AlertTriangle, ChevronRight, FileUp, Loader2, RefreshCw, Search } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTableFeatures } from "@/lib/data-table-features";

import { fetchRoles } from "./roles.api";
import { rolesColumns } from "./roles-table/columns";
import type { Role } from "./roles-table/data";
import { RolesTable } from "./roles-table/table";

function getRoleTypeFilter(groupFilter: string) {
  if (groupFilter === "System roles") {
    return "System";
  }

  if (groupFilter === "Custom roles") {
    return "Custom";
  }

  return "All";
}

function getRoleGroupFilterValue(typeFilter: string) {
  if (typeFilter === "System") {
    return "System roles";
  }

  if (typeFilter === "Custom") {
    return "Custom roles";
  }

  return undefined;
}

export function Roles({ roles: initialRoles }: { roles?: Role[] }) {
  const [rolesData, setRolesData] = useState<Role[]>(initialRoles ?? []);
  const [isLoading, setIsLoading] = useState(!initialRoles || initialRoles.length === 0);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRoles();
      setRolesData(data || []);
    } catch (err) {
      console.error("Failed to load roles from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const table = useTable({
    features: dataTableFeatures,
    data: rolesData,
    columns: rolesColumns,
    defaultColumn: {
      size: 140,
      minSize: 80,
      maxSize: 420,
    },
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    initialState: {
      columnVisibility: { group: false, search: false },
    },
  });

  const search = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const groupFilter = (table.getColumn("group")?.getFilterValue() as string | undefined) ?? "";
  const typeFilter = getRoleTypeFilter(groupFilter);
  const ownerFilter = (table.getColumn("owner")?.getFilterValue() as string | undefined) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm">
            Live database RBAC: manage access roles and privileges across your training center organization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <FileUp data-icon="inline-start" />
            Import JSON
          </Button>
          <Button size="sm">Create role</Button>
        </div>
      </div>

      <Tabs className="h-full gap-4" defaultValue="roles">
        <TabsList
          variant="line"
          className="w-full justify-start gap-2 border-b ps-0 *:data-[slot=tabs-trigger]:flex-none"
        >
          <TabsTrigger value="roles">Roles ({rolesData.length})</TabsTrigger>
          <TabsTrigger value="permission-sets">Permission sets</TabsTrigger>
          <TabsTrigger value="access-reviews">Access reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Connecting to live NestJS roles database...</p>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <InputGroup className="w-full max-w-sm">
                  <InputGroupInput
                    placeholder="Search roles"
                    value={search}
                    onChange={(e) => table.getColumn("search")?.setFilterValue(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={typeFilter}
                    onValueChange={(val) => {
                      table.getColumn("group")?.setFilterValue(getRoleGroupFilterValue(val));
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Role type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="All">All types</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ownerFilter}
                    onValueChange={(val) => {
                      table.getColumn("owner")?.setFilterValue(val === "All" ? undefined : val);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="All">All owners</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Catherine Delorme">Catherine Delorme</SelectItem>
                        <SelectItem value="Nadine Touré">Nadine Touré</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(val) => {
                      table.getColumn("status")?.setFilterValue(val === "All" ? undefined : val);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="All">All statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Needs review">Needs review</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <RolesTable table={table} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="permission-sets">
          <div className="p-8 text-center text-muted-foreground text-sm">
            Role permission sets and granular ACL scopes. Synchronized with live RBAC gateway.
          </div>
        </TabsContent>

        <TabsContent value="access-reviews">
          <div className="p-8 text-center text-muted-foreground text-sm">
            Periodic compliance reviews and user privilege recertification logs.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
