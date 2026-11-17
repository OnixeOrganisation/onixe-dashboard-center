import { apiClient } from "@/lib/api-client";

import type { Role } from "./roles-table/data";

export interface CustomRoleResponse {
  id: string;
  roleName: string;
  description: string;
  permissions: string[];
  group?: string;
  accessLevel?: string;
  users?: number;
  lastReview?: string;
  owner?: string;
  status?: "Active" | "Needs review";
}

export async function fetchRoles(): Promise<Role[]> {
  const res = await apiClient<CustomRoleResponse[]>("centre/roles");
  return (res.data || []).map((r) => ({
    role: r.roleName,
    group: r.group || "Custom roles",
    accessLevel: r.accessLevel || "Scoped",
    users: r.users || 0,
    permissionSets: r.permissions.map((p) => p.replace("MANAGE_", "").replace("VIEW_", "")),
    lastReview: r.lastReview || "May 2026",
    owner: r.owner || "System",
    status: r.status || "Active",
  }));
}

export async function createRoleApi(data: {
  roleName: string;
  description: string;
  permissions: string[];
}): Promise<any> {
  const res = await apiClient("centre/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}
