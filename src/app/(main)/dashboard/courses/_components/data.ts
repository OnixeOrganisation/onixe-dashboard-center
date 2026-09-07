export interface CourseModuleItem {
  id: string;
  order: number;
  title: string;
  hours: number;
  description: string;
}

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  department: string;
  ectsCredits: number;
  coefficient: number;
  totalHours: number;
  semester: "Semester 1" | "Semester 2" | "Annual";
  status: "Published" | "Draft" | "Archived";
  modulesCount: number;
  modules: CourseModuleItem[];
  assignedInstructorsCount: number;
  enrolledCohorts: string[];
}

export const COURSE_DEPARTMENTS = [
  "Software Engineering & Architecture",
  "Cloud Computing & DevOps",
  "Cybersecurity & Systems Defence",
  "Data Science & Artificial Intelligence",
  "Digital Product Design & Interaction",
] as const;

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: "crs-1",
    code: "SWE-401",
    title: "Distributed Microservices Architecture with NestJS",
    department: "Software Engineering & Architecture",
    ectsCredits: 6,
    coefficient: 3,
    totalHours: 48,
    semester: "Semester 1",
    status: "Published",
    modulesCount: 4,
    assignedInstructorsCount: 2,
    enrolledCohorts: ["Promo Dev Master 2024-A", "Promo Dev Master 2024-B"],
    modules: [
      {
        id: "mod-1",
        order: 1,
        title: "Domain-Driven Design (DDD) & Clean Architecture",
        hours: 12,
        description: "Entities, value objects, domain events, and repository patterns.",
      },
      {
        id: "mod-2",
        order: 2,
        title: "Inter-service Communication & RabbitMQ",
        hours: 12,
        description: "Message brokers, event-driven decoupling, and pub/sub patterns.",
      },
      {
        id: "mod-3",
        order: 3,
        title: "Multi-tenant PostgreSQL & Prisma ORM",
        hours: 12,
        description: "Database migrations, tenant isolation, and connection pooling.",
      },
      {
        id: "mod-4",
        order: 4,
        title: "Resilience, Circuit Breakers & Telemetry",
        hours: 12,
        description: "OpenTelemetry, structured logging, and health probe endpoints.",
      },
    ],
  },
  {
    id: "crs-2",
    code: "CLD-501",
    title: "Kubernetes Cluster Administration & GitOps",
    department: "Cloud Computing & DevOps",
    ectsCredits: 6,
    coefficient: 3,
    totalHours: 42,
    semester: "Semester 1",
    status: "Published",
    modulesCount: 3,
    assignedInstructorsCount: 1,
    enrolledCohorts: ["Promo Cloud & DevOps 2024-A"],
    modules: [
      {
        id: "mod-201",
        order: 1,
        title: "Kubernetes Core Architecture & Control Plane",
        hours: 14,
        description: "Pods, Deployments, Services, and Ingress controllers.",
      },
      {
        id: "mod-202",
        order: 2,
        title: "Infrastructure as Code with Terraform",
        hours: 14,
        description: "Declarative cloud provisioning on AWS & Google Cloud.",
      },
      {
        id: "mod-203",
        order: 3,
        title: "GitOps Continuous Delivery with ArgoCD",
        hours: 14,
        description: "Automated sync, rollbacks, and Helm chart templating.",
      },
    ],
  },
  {
    id: "crs-3",
    code: "CYB-402",
    title: "Offensive Security & Red Teaming Operations",
    department: "Cybersecurity & Systems Defence",
    ectsCredits: 5,
    coefficient: 2.5,
    totalHours: 36,
    semester: "Semester 2",
    status: "Published",
    modulesCount: 3,
    assignedInstructorsCount: 1,
    enrolledCohorts: ["Promo Cyber Ops 2024-A"],
    modules: [
      {
        id: "mod-301",
        order: 1,
        title: "Network Reconnaissance & Port Scanning",
        hours: 12,
        description: "Nmap scripting engine, OSINT, and attack surface mapping.",
      },
      {
        id: "mod-302",
        order: 2,
        title: "Web Vulnerability Exploitation (OWASP Top 10)",
        hours: 12,
        description: "SQLi, SSRF, IDOR, and privilege escalation vectors.",
      },
      {
        id: "mod-303",
        order: 3,
        title: "Active Directory Attacks & Pivoting",
        hours: 12,
        description: "Kerberoasting, Pass-the-Hash, and lateral network movement.",
      },
    ],
  },
  {
    id: "crs-4",
    code: "AI-301",
    title: "Applied Machine Learning & Deep Learning with PyTorch",
    department: "Data Science & Artificial Intelligence",
    ectsCredits: 6,
    coefficient: 3,
    totalHours: 45,
    semester: "Semester 1",
    status: "Published",
    modulesCount: 3,
    assignedInstructorsCount: 1,
    enrolledCohorts: ["Promo Data & AI 2024-A"],
    modules: [
      {
        id: "mod-401",
        order: 1,
        title: "Statistical Foundations & Feature Engineering",
        hours: 15,
        description: "Data cleaning, dimension reduction, and pipeline scaling.",
      },
      {
        id: "mod-402",
        order: 2,
        title: "Deep Neural Networks with PyTorch",
        hours: 15,
        description: "Backpropagation, CNNs, Transformers, and fine-tuning.",
      },
      {
        id: "mod-403",
        order: 3,
        title: "MLOps & Model Serving with FastAPI",
        hours: 15,
        description: "Model containerization, ONNX runtime, and latency optimization.",
      },
    ],
  },
  {
    id: "crs-5",
    code: "DES-201",
    title: "Advanced Design Systems & Interactive Prototyping",
    department: "Digital Product Design & Interaction",
    ectsCredits: 4,
    coefficient: 2,
    totalHours: 30,
    semester: "Semester 2",
    status: "Published",
    modulesCount: 2,
    assignedInstructorsCount: 1,
    enrolledCohorts: ["Promo UX Product 2024-A"],
    modules: [
      {
        id: "mod-501",
        order: 1,
        title: "Atomic Design Tokens & Component Libraries",
        hours: 15,
        description: "Design tokens in Figma and synchronisation with Tailwind CSS.",
      },
      {
        id: "mod-502",
        order: 2,
        title: "Micro-Interactions & Usability Testing",
        hours: 15,
        description: "Framer prototypes, user telemetry, and A/B test analysis.",
      },
    ],
  },
];
