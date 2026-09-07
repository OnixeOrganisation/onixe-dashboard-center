export interface InstructorItem {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  status: "Full-Time" | "Adjunct" | "On Leave" | "Inactive";
  weeklyHours: number;
  maxWeeklyHours: number;
  assignedCourses: string[];
  assignedCohorts: string[];
  rating: number;
  totalStudentsTaught: number;
  joinedDate: string;
}

export const DEPARTMENTS = [
  "Software Engineering",
  "Cloud & DevOps",
  "Cybersecurity & Networks",
  "Data Science & AI",
  "Digital Design & UX",
] as const;

export const INSTRUCTOR_STATUSES = ["Full-Time", "Adjunct", "On Leave", "Inactive"] as const;

export const INITIAL_INSTRUCTORS: InstructorItem[] = [
  {
    id: "inst-1",
    matricule: "FAC-2024-001",
    name: "Dr. Alexandre Merceron",
    email: "a.merceron@onixe.institute",
    phone: "+33 6 12 34 56 78",
    department: "Software Engineering",
    specialization: "Distributed Systems & Cloud Architecture",
    status: "Full-Time",
    weeklyHours: 18,
    maxWeeklyHours: 20,
    assignedCourses: ["Distributed Systems", "NestJS Microservices Architecture", "API Design"],
    assignedCohorts: ["Promo Dev Master 2024-A", "Promo Dev Master 2024-B"],
    rating: 4.9,
    totalStudentsTaught: 94,
    joinedDate: "2023-09-01",
  },
  {
    id: "inst-2",
    matricule: "FAC-2024-002",
    name: "Prof. Sarah Benali",
    email: "s.benali@onixe.institute",
    phone: "+33 6 98 76 54 32",
    department: "Data Science & AI",
    specialization: "Deep Learning & Applied NLP",
    status: "Full-Time",
    weeklyHours: 16,
    maxWeeklyHours: 20,
    assignedCourses: ["Applied Machine Learning", "PyTorch Deep Learning", "MLOps Pipelines"],
    assignedCohorts: ["Promo Data & AI 2024-A"],
    rating: 4.8,
    totalStudentsTaught: 58,
    joinedDate: "2023-11-15",
  },
  {
    id: "inst-3",
    matricule: "FAC-2024-003",
    name: "Marc Vasseur",
    email: "m.vasseur@onixe.institute",
    phone: "+33 6 45 67 89 01",
    department: "Cybersecurity & Networks",
    specialization: "Offensive Security & Red Teaming",
    status: "Adjunct",
    weeklyHours: 10,
    maxWeeklyHours: 12,
    assignedCourses: ["Penetration Testing & Red Teaming", "Network Protocol Audits"],
    assignedCohorts: ["Promo Cyber Ops 2024-A"],
    rating: 4.7,
    totalStudentsTaught: 36,
    joinedDate: "2024-01-10",
  },
  {
    id: "inst-4",
    matricule: "FAC-2024-004",
    name: "Elena Rostova",
    email: "e.rostova@onixe.institute",
    phone: "+33 6 23 45 67 89",
    department: "Cloud & DevOps",
    specialization: "Kubernetes & Infrastructure as Code",
    status: "Full-Time",
    weeklyHours: 20,
    maxWeeklyHours: 20,
    assignedCourses: ["Kubernetes Cluster Administration", "Terraform & AWS DevOps"],
    assignedCohorts: ["Promo Cloud & DevOps 2024-A", "Promo Dev Master 2024-B"],
    rating: 4.95,
    totalStudentsTaught: 72,
    joinedDate: "2023-08-20",
  },
  {
    id: "inst-5",
    matricule: "FAC-2024-005",
    name: "Thomas Dubois",
    email: "t.dubois@onixe.institute",
    phone: "+33 6 34 56 78 90",
    department: "Digital Design & UX",
    specialization: "Design Systems & Product Interaction",
    status: "Adjunct",
    weeklyHours: 8,
    maxWeeklyHours: 12,
    assignedCourses: ["Design Systems in Figma", "Micro-Interactions & Prototyping"],
    assignedCohorts: ["Promo UX Product 2024-A"],
    rating: 4.6,
    totalStudentsTaught: 28,
    joinedDate: "2024-02-01",
  },
  {
    id: "inst-6",
    matricule: "FAC-2024-006",
    name: "Dr. Karim Mansouri",
    email: "k.mansouri@onixe.institute",
    phone: "+33 6 78 90 12 34",
    department: "Cybersecurity & Networks",
    specialization: "Cryptography & Zero Trust Architecture",
    status: "On Leave",
    weeklyHours: 0,
    maxWeeklyHours: 18,
    assignedCourses: ["Applied Cryptography"],
    assignedCohorts: [],
    rating: 4.85,
    totalStudentsTaught: 45,
    joinedDate: "2023-10-01",
  },
];
