import { apiClient } from "@/lib/api-client";

import type { EligibleStudentItem, RetakeSessionItem } from "./data";

export async function fetchEligibleStudents(): Promise<EligibleStudentItem[]> {
  const res = await apiClient<EligibleStudentItem[]>("centre/remediation/eligible-students");
  return res.data;
}

export async function fetchRetakeSessions(): Promise<RetakeSessionItem[]> {
  const res = await apiClient<RetakeSessionItem[]>("centre/remediation/sessions");
  return res.data;
}

export async function scheduleRetakeApi(data: {
  course: string;
  title?: string;
  examiner?: string;
  date: string;
  time?: string;
  room: string;
}): Promise<RetakeSessionItem> {
  const res = await apiClient<RetakeSessionItem>("centre/remediation/schedule-retake", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}
