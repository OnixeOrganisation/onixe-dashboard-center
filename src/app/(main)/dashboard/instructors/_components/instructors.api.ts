import { apiClient } from "@/lib/api-client";

import type { InstructorItem } from "./data";

export interface CreateInstructorPayload {
  name: string;
  email: string;
  phone?: string;
  department: string;
  specialization?: string;
  status: InstructorItem["status"];
  maxWeeklyHours: number;
  initialCourse?: string;
  avatar?: string;
}

export async function fetchInstructors(): Promise<InstructorItem[]> {
  const response = await apiClient<InstructorItem[]>("centre/instructors");
  return response.data;
}

export async function createInstructorApi(payload: CreateInstructorPayload): Promise<InstructorItem> {
  const response = await apiClient<InstructorItem>("centre/instructors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function assignCourseApi(
  instructorId: string,
  payload: { courseId?: string; courseName?: string; cohortName?: string; weeklyHours?: number },
): Promise<InstructorItem> {
  const response = await apiClient<InstructorItem>(`centre/instructors/${instructorId}/assign-course`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateInstructorCoursesApi(
  instructorId: string,
  courses: string[],
  cohorts: string[],
  weeklyHours: number,
): Promise<InstructorItem> {
  const response = await apiClient<InstructorItem>(`centre/instructors/${instructorId}/courses`, {
    method: "PATCH",
    body: JSON.stringify({ courses, cohorts, weeklyHours }),
  });
  return response.data;
}

export async function updateInstructorStatusApi(
  instructorId: string,
  status: InstructorItem["status"],
): Promise<InstructorItem> {
  const response = await apiClient<InstructorItem>(`centre/instructors/${instructorId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
