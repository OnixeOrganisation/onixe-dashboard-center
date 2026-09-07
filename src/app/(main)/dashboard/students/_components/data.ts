export type StudentStatus = "Active" | "Pending Registration" | "On Leave" | "Suspended" | "Graduated";

export interface StudentItem {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  cohort: string;
  cohortId: string;
  enrollmentDate: string;
  attendanceRate: number;
  gradeAverage: number;
  creditsEarned: number;
  guardianName?: string;
  guardianEmail?: string;
  status: StudentStatus;
}

export const mockStudents: StudentItem[] = [
  {
    id: "stu-001",
    matricule: "STU-2026-081",
    name: "Lucas Vance",
    email: "l.vance@student.onixe.edu",
    phone: "+33 6 12 34 56 78",
    department: "Computer Science",
    cohort: "Software Engineering 2026-A",
    cohortId: "coh-001",
    enrollmentDate: "2026-09-01",
    attendanceRate: 98.4,
    gradeAverage: 16.8,
    creditsEarned: 60,
    guardianName: "Robert Vance",
    guardianEmail: "r.vance@family.com",
    status: "Active",
  },
  {
    id: "stu-002",
    matricule: "STU-2026-082",
    name: "Amira Zahra",
    email: "a.zahra@student.onixe.edu",
    phone: "+33 6 23 45 67 89",
    department: "Computer Science",
    cohort: "Software Engineering 2026-A",
    cohortId: "coh-001",
    enrollmentDate: "2026-09-01",
    attendanceRate: 99.1,
    gradeAverage: 18.2,
    creditsEarned: 60,
    guardianName: "Karim Zahra",
    guardianEmail: "k.zahra@family.com",
    status: "Active",
  },
  {
    id: "stu-003",
    matricule: "STU-2026-095",
    name: "Marc Dupont",
    email: "m.dupont@student.onixe.edu",
    phone: "+33 6 34 56 78 90",
    department: "Security & Networks",
    cohort: "Cybersecurity & Cloud Defense",
    cohortId: "coh-002",
    enrollmentDate: "2026-09-15",
    attendanceRate: 94.5,
    gradeAverage: 15.1,
    creditsEarned: 54,
    guardianName: "Claire Dupont",
    guardianEmail: "c.dupont@family.com",
    status: "Active",
  },
  {
    id: "stu-004",
    matricule: "STU-2026-104",
    name: "Sofia Chen",
    email: "s.chen@student.onixe.edu",
    phone: "+33 6 45 67 89 01",
    department: "Artificial Intelligence",
    cohort: "Data Science & Applied AI",
    cohortId: "coh-003",
    enrollmentDate: "2026-09-01",
    attendanceRate: 97.8,
    gradeAverage: 17.5,
    creditsEarned: 60,
    guardianName: "Wei Chen",
    guardianEmail: "w.chen@family.com",
    status: "Active",
  },
  {
    id: "stu-005",
    matricule: "STU-2026-112",
    name: "Kofi Mensah",
    email: "k.mensah@student.onixe.edu",
    phone: "+33 6 56 78 90 12",
    department: "Software Systems",
    cohort: "Fullstack Web & Mobile Systems",
    cohortId: "coh-004",
    enrollmentDate: "2026-01-15",
    attendanceRate: 93.2,
    gradeAverage: 14.3,
    creditsEarned: 48,
    status: "Active",
  },
  {
    id: "stu-006",
    matricule: "STU-2026-128",
    name: "David Kim",
    email: "d.kim@student.onixe.edu",
    phone: "+33 6 67 89 01 23",
    department: "Cloud Architecture",
    cohort: "DevOps & Infrastructure Automation",
    cohortId: "coh-005",
    enrollmentDate: "2026-10-01",
    attendanceRate: 100,
    gradeAverage: 0,
    creditsEarned: 0,
    status: "Pending Registration",
  },
  {
    id: "stu-007",
    matricule: "STU-2025-044",
    name: "Youssef Benali",
    email: "y.benali@student.onixe.edu",
    phone: "+33 6 78 90 12 34",
    department: "Design & UX",
    cohort: "Product Design & HCI 2025",
    cohortId: "coh-006",
    enrollmentDate: "2025-09-01",
    attendanceRate: 99.0,
    gradeAverage: 17.0,
    creditsEarned: 120,
    status: "Graduated",
  },
  {
    id: "stu-008",
    matricule: "STU-2026-056",
    name: "Lea Fontaine",
    email: "l.fontaine@student.onixe.edu",
    phone: "+33 6 89 01 23 45",
    department: "Computer Science",
    cohort: "Software Engineering 2026-A",
    cohortId: "coh-001",
    enrollmentDate: "2026-09-01",
    attendanceRate: 72.0,
    gradeAverage: 9.5,
    creditsEarned: 30,
    guardianName: "Alain Fontaine",
    guardianEmail: "a.fontaine@family.com",
    status: "Suspended",
  },
];
