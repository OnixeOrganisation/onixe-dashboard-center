export interface EligibleStudentItem {
  id: string;
  matricule: string;
  name: string;
  cohort: string;
  failedCourse: string;
  failedGrade: number;
  ectsAtRisk: number;
  retakeStatus: "Eligible" | "Session Scheduled" | "Retake Passed" | "Retake Failed";
  scheduledDate?: string;
}

export interface RetakeSessionItem {
  id: string;
  code: string;
  title: string;
  course: string;
  examiner: string;
  date: string;
  time: string;
  room: string;
  enrolledStudentsCount: number;
  status: "Scheduled" | "Completed";
}

export const INITIAL_ELIGIBLE_STUDENTS: EligibleStudentItem[] = [
  {
    id: "rem-1",
    matricule: "STU-2024-006",
    name: "Emma Roche",
    cohort: "Promo Dev Master 2024-A",
    failedCourse: "Distributed Microservices Architecture with NestJS",
    failedGrade: 9.1,
    ectsAtRisk: 6,
    retakeStatus: "Session Scheduled",
    scheduledDate: "2024-12-18",
  },
  {
    id: "rem-2",
    matricule: "STU-2024-014",
    name: "Romain Garnier",
    cohort: "Promo Cloud & DevOps 2024-A",
    failedCourse: "Kubernetes Cluster Administration & GitOps",
    failedGrade: 8.0,
    ectsAtRisk: 6,
    retakeStatus: "Eligible",
  },
  {
    id: "rem-3",
    matricule: "STU-2024-022",
    name: "Sonia Haddad",
    cohort: "Promo Cyber Ops 2024-A",
    failedCourse: "Offensive Security & Red Teaming Operations",
    failedGrade: 8.5,
    ectsAtRisk: 5,
    retakeStatus: "Session Scheduled",
    scheduledDate: "2024-12-20",
  },
  {
    id: "rem-4",
    matricule: "STU-2024-031",
    name: "Karim Belkacem",
    cohort: "Promo Data & AI 2024-A",
    failedCourse: "Applied Machine Learning & Deep Learning with PyTorch",
    failedGrade: 7.5,
    ectsAtRisk: 6,
    retakeStatus: "Eligible",
  },
];

export const INITIAL_RETAKE_SESSIONS: RetakeSessionItem[] = [
  {
    id: "ret-1",
    code: "RETAKE-SWE-401",
    title: "Distributed Microservices Retake Examination",
    course: "Distributed Microservices Architecture with NestJS",
    examiner: "Dr. Alexandre Merceron",
    date: "2024-12-18",
    time: "10:00 - 12:00",
    room: "Classroom Euler",
    enrolledStudentsCount: 3,
    status: "Scheduled",
  },
  {
    id: "ret-2",
    code: "RETAKE-CYB-402",
    title: "Offensive Security Practical Retake Session",
    course: "Offensive Security & Red Teaming Operations",
    examiner: "Marc Vasseur",
    date: "2024-12-20",
    time: "14:00 - 16:30",
    room: "Rhône Cybersecurity Lab",
    enrolledStudentsCount: 2,
    status: "Scheduled",
  },
];
