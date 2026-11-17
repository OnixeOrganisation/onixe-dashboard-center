import { apiClient } from "@/lib/api-client";

import type { ExamItem } from "./data";

export interface ScheduleExamPayload {
  title?: string;
  code?: string;
  course: string;
  courseId?: string;
  cohort: string;
  cohortId?: string;
  date?: string;
  examDate?: string;
  time?: string;
  durationMinutes?: number;
  room?: string;
  examiner?: string;
  type?: ExamItem["type"];
  totalCandidates?: number;
}

export async function fetchExams(): Promise<ExamItem[]> {
  const response = await apiClient<ExamItem[]>("centre/gradebook");
  return response.data;
}

export async function scheduleExamApi(payload: ScheduleExamPayload): Promise<ExamItem> {
  const response = await apiClient<ExamItem>("centre/gradebook/exams/schedule", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function submitGradesApi(
  examId: string,
  instructorId: string,
  grades: Array<{ studentId: string; grade20: number; comments?: string }>,
) {
  const response = await apiClient("centre/gradebook/submit-grades", {
    method: "POST",
    body: JSON.stringify({ examId, instructorId, grades }),
  });
  return response.data;
}

export async function validateGradebookApi(examId: string, hodInstructorId?: string) {
  const response = await apiClient("centre/gradebook/validate-grades", {
    method: "POST",
    body: JSON.stringify({ examId, hodInstructorId }),
  });
  return response.data;
}
