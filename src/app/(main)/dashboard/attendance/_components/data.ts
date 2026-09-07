export interface AttendanceSessionItem {
  id: string;
  code: string;
  date: string;
  slot: string;
  course: string;
  cohort: string;
  instructor: string;
  room: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  justifiedCount: number;
  rate: number;
  status: "Recorded" | "Pending Signatures" | "Under Review";
}

export interface StudentAttendanceEntry {
  studentId: string;
  matricule: string;
  name: string;
  status: "Present" | "Absent Unjustified" | "Absent Justified" | "Late";
  checkInTime: string;
  justificationNote?: string;
}

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSessionItem[] = [
  {
    id: "att-1",
    code: "ATT-2024-1101",
    date: "2024-11-18",
    slot: "09:00 - 12:30",
    course: "Distributed Microservices Architecture with NestJS",
    cohort: "Promo Dev Master 2024-A",
    instructor: "Dr. Alexandre Merceron",
    room: "Alan Turing Amphitheatre",
    totalEnrolled: 32,
    presentCount: 30,
    absentCount: 1,
    justifiedCount: 1,
    rate: 94,
    status: "Recorded",
  },
  {
    id: "att-2",
    code: "ATT-2024-1102",
    date: "2024-11-18",
    slot: "14:00 - 17:30",
    course: "Kubernetes Cluster Administration & GitOps",
    cohort: "Promo Cloud & DevOps 2024-A",
    instructor: "Elena Rostova",
    room: "Linus Torvalds Cloud Lab",
    totalEnrolled: 28,
    presentCount: 26,
    absentCount: 2,
    justifiedCount: 0,
    rate: 93,
    status: "Recorded",
  },
  {
    id: "att-3",
    code: "ATT-2024-1103",
    date: "2024-11-19",
    slot: "09:00 - 12:30",
    course: "Applied Machine Learning & Deep Learning with PyTorch",
    cohort: "Promo Data & AI 2024-A",
    instructor: "Prof. Sarah Benali",
    room: "Ada Lovelace GPU Lab",
    totalEnrolled: 26,
    presentCount: 25,
    absentCount: 0,
    justifiedCount: 1,
    rate: 96,
    status: "Recorded",
  },
  {
    id: "att-4",
    code: "ATT-2024-1104",
    date: "2024-11-19",
    slot: "14:00 - 17:30",
    course: "Offensive Security & Red Teaming Operations",
    cohort: "Promo Cyber Ops 2024-A",
    instructor: "Marc Vasseur",
    room: "Rhône Cybersecurity Lab",
    totalEnrolled: 24,
    presentCount: 21,
    absentCount: 2,
    justifiedCount: 1,
    rate: 88,
    status: "Pending Signatures",
  },
];

export const SAMPLE_STUDENT_ATTENDANCE: StudentAttendanceEntry[] = [
  { studentId: "std-1", matricule: "STU-2024-001", name: "Lucas Moreau", status: "Present", checkInTime: "08:55 AM" },
  { studentId: "std-2", matricule: "STU-2024-002", name: "Amina Diallo", status: "Present", checkInTime: "08:52 AM" },
  { studentId: "std-3", matricule: "STU-2024-003", name: "Julien Mercier", status: "Late", checkInTime: "09:18 AM" },
  { studentId: "std-4", matricule: "STU-2024-004", name: "Chloé Lefebvre", status: "Present", checkInTime: "08:58 AM" },
  {
    studentId: "std-5",
    matricule: "STU-2024-005",
    name: "Youssef El Mansouri",
    status: "Absent Justified",
    checkInTime: "—",
    justificationNote: "Medical Certificate #MED-948",
  },
  { studentId: "std-6", matricule: "STU-2024-006", name: "Emma Roche", status: "Absent Unjustified", checkInTime: "—" },
  { studentId: "std-7", matricule: "STU-2024-007", name: "David Kovacs", status: "Present", checkInTime: "08:50 AM" },
  { studentId: "std-8", matricule: "STU-2024-008", name: "Inès Benzakour", status: "Present", checkInTime: "08:56 AM" },
];
