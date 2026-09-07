export interface ProgramItem {
  id: string;
  code: string;
  name: string;
  degreeLevel: "Bachelor" | "Master" | "Executive Certificate" | "Bootcamp";
  durationMonths: number;
  totalEcts: number;
  activeCohortsCount: number;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  headOfDepartment: {
    id: string;
    name: string;
    email: string;
    matricule: string;
  };
  description: string;
  programsCount: number;
  facultyCount: number;
  enrolledStudentsCount: number;
  programs: ProgramItem[];
  status: "Active" | "Under Review" | "Archived";
  establishedYear: number;
}

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: "dept-1",
    code: "SWE",
    name: "Software Engineering & Architecture",
    headOfDepartment: {
      id: "inst-1",
      name: "Dr. Alexandre Merceron",
      email: "a.merceron@onixe.institute",
      matricule: "FAC-2024-001",
    },
    description: "Distributed architectures, microservices engineering, web & mobile pedagogical tracks.",
    programsCount: 3,
    facultyCount: 8,
    enrolledStudentsCount: 142,
    establishedYear: 2022,
    status: "Active",
    programs: [
      {
        id: "prog-101",
        code: "M-SWE",
        name: "Master in Distributed Software Engineering",
        degreeLevel: "Master",
        durationMonths: 24,
        totalEcts: 120,
        activeCohortsCount: 2,
      },
      {
        id: "prog-102",
        code: "B-SWE",
        name: "Bachelor in Web & Mobile Technologies",
        degreeLevel: "Bachelor",
        durationMonths: 36,
        totalEcts: 180,
        activeCohortsCount: 3,
      },
      {
        id: "prog-103",
        code: "CERT-NEST",
        name: "Enterprise Microservices with NestJS",
        degreeLevel: "Executive Certificate",
        durationMonths: 6,
        totalEcts: 30,
        activeCohortsCount: 1,
      },
    ],
  },
  {
    id: "dept-2",
    code: "CLD",
    name: "Cloud Computing & DevOps",
    headOfDepartment: {
      id: "inst-4",
      name: "Elena Rostova",
      email: "e.rostova@onixe.institute",
      matricule: "FAC-2024-004",
    },
    description: "Cloud-native infrastructure, Kubernetes orchestration, CI/CD automation, and site reliability.",
    programsCount: 2,
    facultyCount: 6,
    enrolledStudentsCount: 96,
    establishedYear: 2023,
    status: "Active",
    programs: [
      {
        id: "prog-201",
        code: "M-CLD",
        name: "Master in Cloud & Site Reliability Engineering",
        degreeLevel: "Master",
        durationMonths: 24,
        totalEcts: 120,
        activeCohortsCount: 2,
      },
      {
        id: "prog-202",
        code: "CERT-K8S",
        name: "Cloud Native & Kubernetes Practitioner",
        degreeLevel: "Executive Certificate",
        durationMonths: 6,
        totalEcts: 30,
        activeCohortsCount: 1,
      },
    ],
  },
  {
    id: "dept-3",
    code: "SEC",
    name: "Cybersecurity & Systems Defence",
    headOfDepartment: {
      id: "inst-6",
      name: "Dr. Karim Mansouri",
      email: "k.mansouri@onixe.institute",
      matricule: "FAC-2024-006",
    },
    description: "Offensive security, SOC operations, cryptography, zero-trust architectures, and compliance.",
    programsCount: 2,
    facultyCount: 5,
    enrolledStudentsCount: 88,
    establishedYear: 2023,
    status: "Active",
    programs: [
      {
        id: "prog-301",
        code: "M-CYB",
        name: "Master in Cybersecurity Operations & Defense",
        degreeLevel: "Master",
        durationMonths: 24,
        totalEcts: 120,
        activeCohortsCount: 2,
      },
      {
        id: "prog-302",
        code: "BOOT-RED",
        name: "Ethical Hacking & Penetration Testing",
        degreeLevel: "Bootcamp",
        durationMonths: 4,
        totalEcts: 25,
        activeCohortsCount: 1,
      },
    ],
  },
  {
    id: "dept-4",
    code: "DAI",
    name: "Data Science & Artificial Intelligence",
    headOfDepartment: {
      id: "inst-2",
      name: "Prof. Sarah Benali",
      email: "s.benali@onixe.institute",
      matricule: "FAC-2024-002",
    },
    description: "Machine learning engineering, deep learning architectures, MLOps, and big data telemetry.",
    programsCount: 2,
    facultyCount: 7,
    enrolledStudentsCount: 110,
    establishedYear: 2022,
    status: "Active",
    programs: [
      {
        id: "prog-401",
        code: "M-DAI",
        name: "Master in Applied AI & Machine Learning",
        degreeLevel: "Master",
        durationMonths: 24,
        totalEcts: 120,
        activeCohortsCount: 2,
      },
      {
        id: "prog-402",
        code: "B-DATA",
        name: "Bachelor in Data Analytics & Engineering",
        degreeLevel: "Bachelor",
        durationMonths: 36,
        totalEcts: 180,
        activeCohortsCount: 2,
      },
    ],
  },
  {
    id: "dept-5",
    code: "DES",
    name: "Digital Product Design & Interaction",
    headOfDepartment: {
      id: "inst-5",
      name: "Thomas Dubois",
      email: "t.dubois@onixe.institute",
      matricule: "FAC-2024-005",
    },
    description: "UX research, design systems, interactive prototyping, and digital product strategy.",
    programsCount: 1,
    facultyCount: 4,
    enrolledStudentsCount: 54,
    establishedYear: 2024,
    status: "Active",
    programs: [
      {
        id: "prog-501",
        code: "B-UX",
        name: "Bachelor in UX & Product Design",
        degreeLevel: "Bachelor",
        durationMonths: 36,
        totalEcts: 180,
        activeCohortsCount: 1,
      },
    ],
  },
];
