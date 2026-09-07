export interface InternshipItem {
  id: string;
  code: string;
  studentName: string;
  studentMatricule: string;
  cohort: string;
  type: "Apprenticeship (Alternance)" | "End-of-Studies Internship (PFE)" | "Professional Immersion";
  companyName: string;
  companyAddress: string;
  companyTutor: string;
  academicSupervisor: string;
  pfeTopic: string;
  startDate: string;
  endDate: string;
  defenseDate?: string;
  defenseRoom?: string;
  juryScore?: number; // /20
  status: "In Progress" | "Defense Scheduled" | "Validated" | "Draft";
}

export const INITIAL_INTERNSHIPS: InternshipItem[] = [
  {
    id: "intern-1",
    code: "PFE-2024-001",
    studentName: "Lucas Moreau",
    studentMatricule: "STU-2024-001",
    cohort: "Promo Dev Master 2024-A",
    type: "Apprenticeship (Alternance)",
    companyName: "Capgemini Engineering",
    companyAddress: "Issy-les-Moulineaux, France",
    companyTutor: "Laurent Dupont (Lead Architect)",
    academicSupervisor: "Dr. Alexandre Merceron",
    pfeTopic: "High-Throughput Distributed Event Streaming Architecture with Kafka and NestJS",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    defenseDate: "2025-06-25",
    defenseRoom: "Alan Turing Amphitheatre",
    status: "Defense Scheduled",
  },
  {
    id: "intern-2",
    code: "PFE-2024-002",
    studentName: "Amina Diallo",
    studentMatricule: "STU-2024-002",
    cohort: "Promo Dev Master 2024-A",
    type: "End-of-Studies Internship (PFE)",
    companyName: "Dassault Systèmes",
    companyAddress: "Vélizy-Villacoublay, France",
    companyTutor: "Claire Martin (R&D Director)",
    academicSupervisor: "Dr. Alexandre Merceron",
    pfeTopic: "Multi-Tenant Cloud Microservices Orchestration with Automated Telemetry",
    startDate: "2024-10-01",
    endDate: "2025-03-31",
    status: "In Progress",
  },
  {
    id: "intern-3",
    code: "PFE-2024-003",
    studentName: "Julien Mercier",
    studentMatricule: "STU-2024-003",
    cohort: "Promo Cloud & DevOps 2024-A",
    type: "Apprenticeship (Alternance)",
    companyName: "Thales Cloud Solutions",
    companyAddress: "La Défense, Paris, France",
    companyTutor: "Stéphane Meyer (Cloud SRE Lead)",
    academicSupervisor: "Elena Rostova",
    pfeTopic: "Zero-Trust Infrastructure Automation & Multi-Cloud Kubernetes Hardening",
    startDate: "2024-09-15",
    endDate: "2025-09-14",
    status: "In Progress",
  },
  {
    id: "intern-4",
    code: "PFE-2024-004",
    studentName: "Chloé Lefebvre",
    studentMatricule: "STU-2024-004",
    cohort: "Promo Data & AI 2024-A",
    type: "End-of-Studies Internship (PFE)",
    companyName: "Sanofi Digital Health AI",
    companyAddress: "Paris, France",
    companyTutor: "Dr. Marc Vaneck (AI Research Fellow)",
    academicSupervisor: "Prof. Sarah Benali",
    pfeTopic: "Transformer-based Predictive Bio-Telemetry Modeling with PyTorch",
    startDate: "2024-09-01",
    endDate: "2025-02-28",
    defenseDate: "2025-03-10",
    defenseRoom: "Ada Lovelace GPU Lab",
    juryScore: 18.5,
    status: "Validated",
  },
];
