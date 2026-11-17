import { apiClient } from "@/lib/api-client";

import type { InternshipItem } from "./data";

export interface CreateInternshipPayload {
  studentName: string;
  studentMatricule?: string;
  cohort?: string;
  type?: InternshipItem["type"];
  companyName: string;
  companyAddress?: string;
  companyTutor?: string;
  academicSupervisor?: string;
  pfeTopic?: string;
  startDate?: string;
  endDate?: string;
  status?: InternshipItem["status"];
}

export async function fetchInternships(): Promise<InternshipItem[]> {
  const response = await apiClient<InternshipItem[]>("centre/internships");
  return response.data;
}

export async function createInternshipApi(payload: CreateInternshipPayload): Promise<InternshipItem> {
  const response = await apiClient<InternshipItem>("centre/internships", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function scheduleDefenseApi(
  id: string,
  payload: { defenseDate: string; defenseRoom: string },
): Promise<InternshipItem> {
  const response = await apiClient<InternshipItem>(`centre/internships/${id}/defense`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateInternshipStatusApi(
  id: string,
  status: InternshipItem["status"],
  juryScore?: number,
): Promise<InternshipItem> {
  const response = await apiClient<InternshipItem>(`centre/internships/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, juryScore }),
  });
  return response.data;
}
