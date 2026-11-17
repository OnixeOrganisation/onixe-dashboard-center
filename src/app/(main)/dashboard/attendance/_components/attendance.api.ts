import { apiClient } from "@/lib/api-client";

import type { AttendanceSessionItem } from "./data";

export interface RecordAttendancePayload {
  cohortId?: string;
  cohort?: string;
  course?: string;
  courseId?: string;
  sessionDate?: string;
  slot?: string;
  room?: string;
  instructor?: string;
  records?: Array<{ studentId: string; status: "PRESENT" | "ABSENT" | "EXCUSED" }>;
  presentCount?: number;
  absentCount?: number;
  justifiedCount?: number;
  totalEnrolled?: number;
}

export async function fetchAttendanceSessions(): Promise<AttendanceSessionItem[]> {
  const response = await apiClient<AttendanceSessionItem[]>("centre/attendance");
  return response.data;
}

export async function recordAttendanceApi(payload: RecordAttendancePayload): Promise<AttendanceSessionItem> {
  const response = await apiClient<AttendanceSessionItem>("centre/attendance/record", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAttendanceCountsApi(
  sessionId: string,
  counts: { present: number; absent: number; justified: number },
): Promise<AttendanceSessionItem> {
  const response = await apiClient<AttendanceSessionItem>(`centre/attendance/${sessionId}/counts`, {
    method: "PATCH",
    body: JSON.stringify(counts),
  });
  return response.data;
}
