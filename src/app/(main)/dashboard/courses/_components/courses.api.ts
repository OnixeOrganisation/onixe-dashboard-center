import { apiClient } from "@/lib/api-client";

import type { CourseItem, CourseModuleItem } from "./data";

export interface CreateCoursePayload {
  title: string;
  code?: string;
  department?: string;
  credits?: number;
  ectsCredits?: number;
  coefficient?: number;
  totalHours?: number;
  semester?: CourseItem["semester"];
  description?: string;
}

export async function fetchCourses(): Promise<CourseItem[]> {
  const response = await apiClient<CourseItem[]>("centre/courses");
  return response.data;
}

export async function createCourseApi(payload: CreateCoursePayload): Promise<CourseItem> {
  const response = await apiClient<CourseItem>("centre/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function addCourseModuleApi(
  courseId: string,
  payload: { title: string; order: number; hours?: number; description?: string },
): Promise<CourseModuleItem> {
  const response = await apiClient<CourseModuleItem>(`centre/courses/${courseId}/modules`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateCourseModulesApi(courseId: string, modules: CourseModuleItem[]): Promise<CourseItem> {
  const response = await apiClient<CourseItem>(`centre/courses/${courseId}/modules`, {
    method: "PUT",
    body: JSON.stringify({ modules }),
  });
  return response.data;
}
