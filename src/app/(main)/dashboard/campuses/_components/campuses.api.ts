import { apiClient } from "@/lib/api-client";

import type { CampusItem, ClassroomItem } from "./data";

export interface CreateCampusPayload {
  name: string;
  code?: string;
  type?: CampusItem["type"];
  address?: string;
  city?: string;
  country?: string;
  manager?: string;
  phone?: string;
}

export interface AllocateClassroomPayload {
  name: string;
  code?: string;
  type?: ClassroomItem["type"];
  capacity?: number;
  floor?: string;
  equipment?: string[];
}

export async function fetchCampuses(): Promise<CampusItem[]> {
  const response = await apiClient<CampusItem[]>("centre/campuses");
  return response.data;
}

export async function createCampusApi(payload: CreateCampusPayload): Promise<CampusItem> {
  const response = await apiClient<CampusItem>("centre/campuses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function allocateClassroomApi(campusId: string, payload: AllocateClassroomPayload): Promise<CampusItem> {
  const response = await apiClient<CampusItem>(`centre/campuses/${campusId}/classrooms`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateClassroomStatusApi(
  campusId: string,
  roomId: string,
  status: ClassroomItem["status"],
): Promise<CampusItem> {
  const response = await apiClient<CampusItem>(`centre/campuses/${campusId}/classrooms/${roomId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
