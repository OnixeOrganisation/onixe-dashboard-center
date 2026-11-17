import { apiClient } from "@/lib/api-client";

import type { CohortItem, CohortStatus } from "./data";

export interface CreateCohortPayload {
  name: string;
  code?: string;
  department: string;
  departmentId?: string;
  capacity: number;
  primaryRoom?: string;
  startDate?: string;
  endDate?: string;
  status?: CohortStatus;
}

export async function fetchCohorts(): Promise<CohortItem[]> {
  const response = await apiClient<CohortItem[]>("centre/cohorts");
  return response.data;
}

export async function createCohortApi(payload: CreateCohortPayload): Promise<CohortItem> {
  const response = await apiClient<CohortItem>("centre/cohorts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function enrollStudentsApi(cohortId: string, studentIds: string[], count?: number): Promise<CohortItem> {
  const response = await apiClient<CohortItem>(`centre/cohorts/${cohortId}/enroll-students`, {
    method: "POST",
    body: JSON.stringify({ studentIds, count }),
  });
  return response.data;
}

export async function updateCohortStatusApi(cohortId: string, status: CohortStatus): Promise<CohortItem> {
  const response = await apiClient<CohortItem>(`centre/cohorts/${cohortId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
