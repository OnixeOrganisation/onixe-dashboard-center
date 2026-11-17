import { apiClient } from "@/lib/api-client";

import type { ParentItem } from "./data";

export async function fetchParents(): Promise<ParentItem[]> {
  const res = await apiClient<ParentItem[]>("centre/parents");
  return res.data;
}

export async function registerParentApi(data: {
  name: string;
  email: string;
  phone?: string;
  relationshipType?: ParentItem["relationshipType"];
  avatar?: string;
}): Promise<ParentItem> {
  const res = await apiClient<ParentItem>("centre/parents", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function linkStudentApi(parentId: string, studentIds: string[]): Promise<ParentItem> {
  const res = await apiClient<ParentItem>(`centre/parents/${parentId}/link-students`, {
    method: "POST",
    body: JSON.stringify({ studentIds }),
  });
  return res.data;
}
