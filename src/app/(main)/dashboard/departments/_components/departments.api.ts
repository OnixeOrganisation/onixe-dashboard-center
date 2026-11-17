import { apiClient } from "@/lib/api-client";

import type { DepartmentItem, ProgramItem } from "./data";

export interface CreateDepartmentPayload {
  name: string;
  code?: string;
  description?: string;
  headOfDepartmentName?: string;
  headOfDepartmentEmail?: string;
  establishedYear?: number;
  status?: DepartmentItem["status"];
}

export interface CreateProgramPayload {
  name: string;
  code?: string;
  degreeLevel?: ProgramItem["degreeLevel"];
  durationMonths?: number;
  totalEcts?: number;
}

export async function fetchDepartments(): Promise<DepartmentItem[]> {
  const response = await apiClient<DepartmentItem[]>("centre/departments");
  return response.data;
}

export async function createDepartmentApi(payload: CreateDepartmentPayload): Promise<DepartmentItem> {
  const response = await apiClient<DepartmentItem>("centre/departments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function createProgramApi(departmentId: string, payload: CreateProgramPayload): Promise<DepartmentItem> {
  const response = await apiClient<DepartmentItem>(`centre/departments/${departmentId}/programs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function assignHodApi(
  departmentId: string,
  payload: { instructorId: string; name?: string; email?: string; matricule?: string },
): Promise<DepartmentItem> {
  const response = await apiClient<DepartmentItem>(`centre/departments/${departmentId}/assign-hod`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateDepartmentStatusApi(
  departmentId: string,
  status: DepartmentItem["status"],
): Promise<DepartmentItem> {
  const response = await apiClient<DepartmentItem>(`centre/departments/${departmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
