export type CohortStatus = "In Progress" | "Starting Soon" | "Graduated" | "Archived";

export interface CohortItem {
  id: string;
  code: string;
  name: string;
  department: string;
  departmentId: string;
  leadInstructor: {
    name: string;
    email: string;
    avatar?: string;
  };
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  primaryRoom: string;
  attendanceRate: number;
  status: CohortStatus;
  scheduleSummary: string;
}

export const mockCohorts: CohortItem[] = [
  {
    id: "coh-001",
    code: "SE-2026A",
    name: "Software Engineering 2026-A",
    department: "Computer Science",
    departmentId: "dept-cs",
    leadInstructor: {
      name: "Dr. Thomas Moreau",
      email: "t.moreau@onixe-academy.edu",
    },
    capacity: 40,
    enrolledStudents: 38,
    startDate: "2026-09-01",
    endDate: "2027-06-30",
    primaryRoom: "Amphi Turing",
    attendanceRate: 97.4,
    status: "In Progress",
    scheduleSummary: "Mon - Fri • 08:30 - 16:30",
  },
  {
    id: "coh-002",
    code: "CYB-2026B",
    name: "Cybersecurity & Cloud Defense",
    department: "Security & Networks",
    departmentId: "dept-sec",
    leadInstructor: {
      name: "Prof. Sarah Connor",
      email: "s.connor@onixe-academy.edu",
    },
    capacity: 35,
    enrolledStudents: 32,
    startDate: "2026-09-15",
    endDate: "2027-07-15",
    primaryRoom: "Lab Cyber 01",
    attendanceRate: 95.8,
    status: "In Progress",
    scheduleSummary: "Mon, Wed, Fri • 09:00 - 17:00",
  },
  {
    id: "coh-003",
    code: "DSAI-2026",
    name: "Data Science & Applied AI",
    department: "Artificial Intelligence",
    departmentId: "dept-ai",
    leadInstructor: {
      name: "Dr. Alexandre Dumas",
      email: "a.dumas@onixe-academy.edu",
    },
    capacity: 30,
    enrolledStudents: 29,
    startDate: "2026-09-01",
    endDate: "2027-06-30",
    primaryRoom: "Research Lab 3.02",
    attendanceRate: 98.2,
    status: "In Progress",
    scheduleSummary: "Tue, Thu • 08:30 - 18:00",
  },
  {
    id: "coh-004",
    code: "DEV-2026F",
    name: "Fullstack Web & Mobile Systems",
    department: "Software Systems",
    departmentId: "dept-soft",
    leadInstructor: {
      name: "Elena Rostova",
      email: "e.rostova@onixe-academy.edu",
    },
    capacity: 45,
    enrolledStudents: 44,
    startDate: "2026-01-15",
    endDate: "2026-12-15",
    primaryRoom: "Dev Studio B",
    attendanceRate: 94.1,
    status: "In Progress",
    scheduleSummary: "Mon - Thu • 09:00 - 16:30",
  },
  {
    id: "coh-005",
    code: "DOPS-2027",
    name: "DevOps & Infrastructure Automation",
    department: "Cloud Architecture",
    departmentId: "dept-cloud",
    leadInstructor: {
      name: "Marcus Vance",
      email: "m.vance@onixe-academy.edu",
    },
    capacity: 30,
    enrolledStudents: 26,
    startDate: "2026-10-01",
    endDate: "2027-08-30",
    primaryRoom: "Lab Cloud 04",
    attendanceRate: 96.0,
    status: "Starting Soon",
    scheduleSummary: "Mon, Wed • 13:00 - 19:00",
  },
  {
    id: "coh-006",
    code: "UXD-2025",
    name: "Product Design & HCI 2025",
    department: "Design & UX",
    departmentId: "dept-design",
    leadInstructor: {
      name: "Clara Beauchamp",
      email: "c.beauchamp@onixe-academy.edu",
    },
    capacity: 25,
    enrolledStudents: 25,
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    primaryRoom: "Studio Créatif 12",
    attendanceRate: 99.0,
    status: "Graduated",
    scheduleSummary: "Full Curriculum Completed",
  },
];
