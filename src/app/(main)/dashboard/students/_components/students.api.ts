import { apiClient } from "@/lib/api-client";

import type { StudentItem, StudentStatus } from "./data";

export interface CreateStudentPayload {
  matricule?: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  cohort: string;
  cohortId?: string;
  guardianName?: string;
  guardianEmail?: string;
  avatar?: string;
  status?: StudentStatus;
}

export async function fetchStudents(): Promise<StudentItem[]> {
  const response = await apiClient<StudentItem[]>("centre/students");
  return response.data;
}

export async function createStudentApi(payload: CreateStudentPayload): Promise<StudentItem> {
  const response = await apiClient<StudentItem>("centre/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateStudentStatusApi(studentId: string, status: StudentItem["status"]): Promise<StudentItem> {
  const response = await apiClient<StudentItem>(`centre/students/${studentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}

export async function fetchStudentTranscriptApi(studentId: string): Promise<unknown> {
  const response = await apiClient<unknown>(`centre/students/${studentId}/transcript`);
  return response.data;
}
