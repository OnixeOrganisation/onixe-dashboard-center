import { apiClient } from "@/lib/api-client";

import type { StaffItem } from "./data";

export async function fetchStaff(): Promise<StaffItem[]> {
  const res = await apiClient<StaffItem[]>("centre/users/staff");
  return res.data;
}

export async function createStaffApi(data: {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  accessLevel: StaffItem["accessLevel"];
  permissions?: string[];
  avatar?: string;
}): Promise<StaffItem> {
  const res = await apiClient<StaffItem>("centre/users/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateStaffApi(id: string, data: Partial<StaffItem>): Promise<StaffItem> {
  const res = await apiClient<StaffItem>(`centre/users/staff/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteStaffApi(id: string): Promise<{ id: string; deleted: boolean }> {
  const res = await apiClient<{ id: string; deleted: boolean }>(`centre/users/staff/${id}`, {
    method: "DELETE",
  });
  return res.data;
}
