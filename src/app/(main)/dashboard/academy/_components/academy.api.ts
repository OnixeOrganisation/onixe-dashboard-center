import { apiClient } from "@/lib/api-client";

import type { AttendanceSessionItem } from "../../attendance/_components/data";

export interface AcademyOverview {
  tenantId: string;
  totalActiveStudents: number;
  totalInstructors: number;
  totalActiveCohorts: number;
  totalCampuses: number;
  totalDepartments: number;
  totalCourses: number;
  totalExams: number;
  issuedDiplomasCount: number;
  activeInternshipsCount: number;
  awardedScholarshipsCount: number;
  overallAttendanceRate: number;
  retentionRatePercent: number;
  atRiskStudentsCount: number;
  totalInvoicesCount: number;
  totalBilled: number;
  totalCollected: number;
}

export async function fetchAcademyOverview(): Promise<AcademyOverview> {
  const res = await apiClient<AcademyOverview>("centre/analytics/overview");
  return res.data;
}

export async function fetchSessions(): Promise<AttendanceSessionItem[]> {
  const res = await apiClient<AttendanceSessionItem[]>("centre/attendance");
  return res.data;
}
