const API_BASE = process.env.NEXT_PUBLIC_CENTRE_API_URL || "http://localhost:3003";

export type ApiRecord = Record<string, unknown>;

export interface CampusRecord {
  id: string;
  name: string;
  location: string;
  capacity?: number;
  code?: string;
  classrooms?: Array<{ id: string; roomName: string; type: string; capacity?: number; equipment?: string[] }>;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  campusId?: string;
  programs?: Array<{ id: string; title: string; degreeType: string; totalCredits?: number }>;
  hodInstructorId?: string;
}

export interface CohortRecord {
  id: string;
  name: string;
  code?: string;
  departmentId: string;
  departmentName?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  enrolledStudentIds?: string[];
}

export interface StudentRecord {
  id: string;
  matricule: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  cohortId?: string;
  cohort?: string;
  departmentId?: string;
  department?: string;
  createdAt?: string;
  attendanceRate?: number;
  gradeAverage?: number;
  creditsEarned?: number;
  status: string;
}

export interface InviteStudentResult {
  inviteLink: string;
  token?: string;
  student?: StudentRecord;
}

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("onixe_auth_token") : null;
  const tenantId =
    typeof window !== "undefined" ? localStorage.getItem("onixe_tenant_id") || "tenant_inphb" : "tenant_inphb";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-ID": tenantId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message ?? `API error (${res.status}) on ${path}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

// 1. CAMPUSES
export const CampusesApi = {
  list: () => fetchApi<CampusRecord[]>("/centre/campuses"),
  get: (id: string) => fetchApi<CampusRecord>(`/centre/campuses/${id}`),
  create: (data: { name: string; location: string; capacity?: number; code?: string }) =>
    fetchApi<CampusRecord>("/centre/campuses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CampusRecord>) =>
    fetchApi<CampusRecord>(`/centre/campuses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/centre/campuses/${id}`, { method: "DELETE" }),
  addClassroom: (data: { campusId: string; roomName: string; type: string; capacity?: number; equipment?: string[] }) =>
    fetchApi<CampusRecord>("/centre/campuses/classrooms", { method: "POST", body: JSON.stringify(data) }),
};

// 2. DEPARTMENTS
export const DepartmentsApi = {
  list: () => fetchApi<DepartmentRecord[]>("/centre/departments"),
  get: (id: string) => fetchApi<DepartmentRecord>(`/centre/departments/${id}`),
  create: (data: { name: string; code: string; campusId?: string }) =>
    fetchApi<DepartmentRecord>("/centre/departments", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<DepartmentRecord>) =>
    fetchApi<DepartmentRecord>(`/centre/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/centre/departments/${id}`, { method: "DELETE" }),
  addProgram: (data: { departmentId: string; title: string; degreeType: string; totalCredits?: number }) =>
    fetchApi<DepartmentRecord>("/centre/departments/programs", { method: "POST", body: JSON.stringify(data) }),
  assignHod: (departmentId: string, data: { instructorId: string; instructorName?: string }) =>
    fetchApi<DepartmentRecord>(`/centre/departments/${departmentId}/assign-hod`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// 3. COHORTS
export const CohortsApi = {
  list: (departmentId?: string) =>
    fetchApi<CohortRecord[]>(`/centre/cohorts${departmentId ? `?departmentId=${departmentId}` : ""}`),
  get: (id: string) => fetchApi<CohortRecord>(`/centre/cohorts/${id}`),
  create: (data: {
    departmentId: string;
    name: string;
    startDate?: string;
    endDate?: string;
    capacity?: number;
    departmentName?: string;
  }) => fetchApi<CohortRecord>("/centre/cohorts", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CohortRecord>) =>
    fetchApi<CohortRecord>(`/centre/cohorts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/centre/cohorts/${id}`, { method: "DELETE" }),
  enrollStudents: (cohortId: string, studentIds: string[]) =>
    fetchApi<CohortRecord>(`/centre/cohorts/${cohortId}/enroll-students`, {
      method: "POST",
      body: JSON.stringify({ studentIds }),
    }),
};

// 4. STUDENTS & MULTI-CENTRE INVITATIONS
export const StudentsApi = {
  list: (cohortId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (cohortId) params.append("cohortId", cohortId);
    if (search) params.append("search", search);
    const qs = params.toString();
    return fetchApi<StudentRecord[]>(`/centre/students${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => fetchApi<StudentRecord>(`/centre/students/${id}`),
  invite: (data: {
    email: string;
    firstName: string;
    lastName: string;
    cohortId?: string;
    cohortName?: string;
    departmentId?: string;
    departmentName?: string;
    phone?: string;
  }) => fetchApi<InviteStudentResult>("/centre/students/invite", { method: "POST", body: JSON.stringify(data) }),
  acceptInvite: (token: string) =>
    fetchApi<{ success: boolean; student: StudentRecord }>("/centre/students/accept-invite", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  update: (id: string, data: Partial<StudentRecord>) =>
    fetchApi<StudentRecord>(`/centre/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<{ success: boolean }>(`/centre/students/${id}`, { method: "DELETE" }),
  transcript: (id: string) => fetchApi<ApiRecord>(`/centre/students/${id}/transcript`),
};

// 5. ATTENDANCE (Tied to Cohorts)
export const AttendanceApi = {
  listSessions: (cohortId?: string) =>
    fetchApi<ApiRecord[]>(`/centre/attendance${cohortId ? `?cohortId=${cohortId}` : ""}`),
  getSession: (id: string) => fetchApi<ApiRecord>(`/centre/attendance/${id}`),
  recordSession: (data: {
    cohortId: string;
    sessionDate: string;
    records: Array<{ studentId: string; studentName: string; matricule?: string; status: string; comment?: string }>;
    cohortName?: string;
    courseTitle?: string;
    classroomId?: string;
    classroomName?: string;
  }) => fetchApi<ApiRecord>("/centre/attendance/record", { method: "POST", body: JSON.stringify(data) }),
  updateSession: (id: string, records: ApiRecord[]) =>
    fetchApi<ApiRecord>(`/centre/attendance/${id}`, { method: "PUT", body: JSON.stringify({ records }) }),
  deleteSession: (id: string) => fetchApi<{ success: boolean }>(`/centre/attendance/${id}`, { method: "DELETE" }),
  getAbsenceReports: (cohortId?: string) =>
    fetchApi<ApiRecord[]>(`/centre/attendance/absence-reports${cohortId ? `?cohortId=${cohortId}` : ""}`),
};

// 6. GRADEBOOK (Tied to Cohorts)
export const GradebookApi = {
  listExams: (cohortId?: string) =>
    fetchApi<ApiRecord[]>(`/centre/gradebook/exams${cohortId ? `?cohortId=${cohortId}` : ""}`),
  getExam: (id: string) => fetchApi<ApiRecord>(`/centre/gradebook/exams/${id}`),
  scheduleExam: (data: {
    cohortId: string;
    courseId: string;
    title: string;
    examDate: string;
    cohortName?: string;
    courseTitle?: string;
    room?: string;
    weight?: number;
    maxScore?: number;
  }) => fetchApi<ApiRecord>("/centre/gradebook/exams/schedule", { method: "POST", body: JSON.stringify(data) }),
  updateExam: (id: string, data: ApiRecord) =>
    fetchApi<ApiRecord>(`/centre/gradebook/exams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExam: (id: string) => fetchApi<{ success: boolean }>(`/centre/gradebook/exams/${id}`, { method: "DELETE" }),
  submitGrades: (data: {
    examId: string;
    instructorId?: string;
    grades: Array<{ studentId: string; studentName: string; matricule?: string; grade20: number; comments?: string }>;
  }) => fetchApi<ApiRecord>("/centre/gradebook/submit-grades", { method: "POST", body: JSON.stringify(data) }),
  validateGrades: (examId: string, hodInstructorId?: string) =>
    fetchApi<ApiRecord>("/centre/gradebook/validate-grades", {
      method: "POST",
      body: JSON.stringify({ examId, hodInstructorId }),
    }),
};
