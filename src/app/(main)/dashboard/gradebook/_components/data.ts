export interface ExamItem {
  id: string;
  code: string;
  title: string;
  course: string;
  cohort: string;
  date: string;
  time: string;
  durationMinutes: number;
  room: string;
  examiner: string;
  type: "Final Exam" | "Continuous Assessment" | "Project Defense" | "Midterm";
  totalCandidates: number;
  status: "Scheduled" | "Grading" | "Validated";
}

export interface StudentGradeRecord {
  studentId: string;
  matricule: string;
  studentName: string;
  assessment1: number; // /20
  assessment2: number; // /20
  examScore: number; // /20
  finalGrade: number; // /20
  status: "Passed" | "Failed" | "Honors";
}

export interface GradebookValidation {
  cohort: string;
  course: string;
  semester: string;
  juryPresident: string;
  validationDate: string;
  isLocked: boolean;
  records: StudentGradeRecord[];
}

export const INITIAL_EXAMS: ExamItem[] = [
  {
    id: "exam-1",
    code: "EXAM-SWE-401",
    title: "Distributed Architectures & Microservices Final Jury",
    course: "Distributed Microservices Architecture with NestJS",
    cohort: "Promo Dev Master 2024-A",
    date: "2024-11-20",
    time: "09:00 - 12:00",
    durationMinutes: 180,
    room: "Alan Turing Amphitheatre",
    examiner: "Dr. Alexandre Merceron",
    type: "Final Exam",
    totalCandidates: 32,
    status: "Validated",
  },
  {
    id: "exam-2",
    code: "EXAM-CLD-501",
    title: "Kubernetes Cluster Hands-On Practical Assessment",
    course: "Kubernetes Cluster Administration & GitOps",
    cohort: "Promo Cloud & DevOps 2024-A",
    date: "2024-11-24",
    time: "14:00 - 17:00",
    durationMinutes: 180,
    room: "Linus Torvalds Cloud Lab",
    examiner: "Elena Rostova",
    type: "Continuous Assessment",
    totalCandidates: 28,
    status: "Grading",
  },
  {
    id: "exam-3",
    code: "EXAM-AI-301",
    title: "PyTorch Deep Learning Model Evaluation",
    course: "Applied Machine Learning & Deep Learning with PyTorch",
    cohort: "Promo Data & AI 2024-A",
    date: "2024-12-05",
    time: "10:00 - 13:00",
    durationMinutes: 180,
    room: "Ada Lovelace GPU Lab",
    examiner: "Prof. Sarah Benali",
    type: "Final Exam",
    totalCandidates: 26,
    status: "Scheduled",
  },
  {
    id: "exam-4",
    code: "EXAM-CYB-402",
    title: "Red Teaming & Active Directory Penetration Defense",
    course: "Offensive Security & Red Teaming Operations",
    cohort: "Promo Cyber Ops 2024-A",
    date: "2024-12-10",
    time: "09:30 - 12:30",
    durationMinutes: 180,
    room: "Rhône Cybersecurity Lab",
    examiner: "Marc Vasseur",
    type: "Project Defense",
    totalCandidates: 24,
    status: "Scheduled",
  },
];

export const SAMPLE_GRADEBOOK_RECORDS: StudentGradeRecord[] = [
  {
    studentId: "std-1",
    matricule: "STU-2024-001",
    studentName: "Lucas Moreau",
    assessment1: 16.5,
    assessment2: 17.0,
    examScore: 18.0,
    finalGrade: 17.4,
    status: "Honors",
  },
  {
    studentId: "std-2",
    matricule: "STU-2024-002",
    studentName: "Amina Diallo",
    assessment1: 18.0,
    assessment2: 18.5,
    examScore: 19.0,
    finalGrade: 18.6,
    status: "Honors",
  },
  {
    studentId: "std-3",
    matricule: "STU-2024-003",
    studentName: "Julien Mercier",
    assessment1: 14.0,
    assessment2: 13.5,
    examScore: 15.0,
    finalGrade: 14.3,
    status: "Passed",
  },
  {
    studentId: "std-4",
    matricule: "STU-2024-004",
    studentName: "Chloé Lefebvre",
    assessment1: 15.5,
    assessment2: 16.0,
    examScore: 16.5,
    finalGrade: 16.1,
    status: "Honors",
  },
  {
    studentId: "std-5",
    matricule: "STU-2024-005",
    studentName: "Youssef El Mansouri",
    assessment1: 11.0,
    assessment2: 12.0,
    examScore: 13.0,
    finalGrade: 12.2,
    status: "Passed",
  },
  {
    studentId: "std-6",
    matricule: "STU-2024-006",
    studentName: "Emma Roche",
    assessment1: 8.5,
    assessment2: 9.0,
    examScore: 9.5,
    finalGrade: 9.1,
    status: "Failed",
  },
  {
    studentId: "std-7",
    matricule: "STU-2024-007",
    studentName: "David Kovacs",
    assessment1: 13.0,
    assessment2: 14.0,
    examScore: 14.5,
    finalGrade: 14.0,
    status: "Passed",
  },
  {
    studentId: "std-8",
    matricule: "STU-2024-008",
    studentName: "Inès Benzakour",
    assessment1: 15.0,
    assessment2: 15.5,
    examScore: 16.0,
    finalGrade: 15.6,
    status: "Honors",
  },
];
