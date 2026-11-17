import { apiClient } from "@/lib/api-client";

import type { ScholarshipItem } from "./data";

export interface AwardScholarshipPayload {
  studentName: string;
  studentMatricule?: string;
  cohort?: string;
  type?: ScholarshipItem["type"];
  amount?: number;
  discountPercentage?: number;
  awardDate?: string;
  justification?: string;
  approvedBy?: string;
  status?: ScholarshipItem["status"];
}

export async function fetchScholarships(): Promise<ScholarshipItem[]> {
  const response = await apiClient<ScholarshipItem[]>("centre/scholarships");
  return response.data;
}

export async function awardScholarshipApi(payload: AwardScholarshipPayload): Promise<ScholarshipItem> {
  const response = await apiClient<ScholarshipItem>("centre/scholarships/award", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateScholarshipStatusApi(
  id: string,
  status: ScholarshipItem["status"],
): Promise<ScholarshipItem> {
  const response = await apiClient<ScholarshipItem>(`centre/scholarships/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
