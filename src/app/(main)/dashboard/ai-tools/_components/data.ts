import type { ChatSession, PromptStarter } from "../types";

export const PROMPT_STARTERS: PromptStarter[] = [
  {
    id: "prompt-syllabus",
    title: "Generate Modular Syllabus",
    description: "Build 4-module curriculum with ECTS, competencies, and practical lab assignments.",
    category: "syllabus",
    prompt:
      "Generate a full modular syllabus for 'Distributed Event-Driven Microservices in NestJS & RabbitMQ' for Master Level (Bac+5), 6 ECTS, with 4 detailed modules, practical workshops, and evaluation rubrics.",
  },
  {
    id: "prompt-retention",
    title: "Analyze At-Risk Students",
    description: "Scan gradebook and attendance signals to suggest personalized remediation workflows.",
    category: "retention",
    prompt:
      "Analyze the current telemetry for Promo Dev Master 2024-A students with risk scores above 70%. Provide individual pedagogical diagnosis and recommended remedial action plans.",
  },
  {
    id: "prompt-qualiopi",
    title: "Audit Qualiopi Criterion #6",
    description: "Review teaching resources, instructor certifications, and pedagogical tracking.",
    category: "qualiopi",
    prompt:
      "Perform a mock audit against Qualiopi Indicator 21 and 22 (trainer qualifications, continuous skill updates, and adapted pedagogical resources). Generate compliant documentation checklist.",
  },
  {
    id: "prompt-scheduling",
    title: "Resolve Schedule Bottlenecks",
    description: "Detect amphitheater and instructor room allocation conflicts for next semester.",
    category: "scheduling",
    prompt:
      "Evaluate weekly timetable constraints for 3 concurrent cohorts (Dev, Data, Cloud) across 6 amphitheaters and suggest an optimal allocation matrix.",
  },
];

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "Syllabus: Event-Driven NestJS & RabbitMQ",
    lastMessageSnippet: "Syllabus synthesized: 4 modules, 48 hours total, 6 ECTS credits.",
    updatedAt: "10 mins ago",
    category: "syllabus",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content:
          "Generate a full modular syllabus for 'Distributed Event-Driven Microservices in NestJS & RabbitMQ' for Master Level (Bac+5), 6 ECTS, with 4 detailed modules, practical workshops, and evaluation rubrics.",
        timestamp: "10:14 AM",
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content: `### Pedagogical Syllabus: Distributed Event-Driven Microservices in NestJS

**Target Level**: Master (Bac+5) | **ECTS**: 6 Credits | **Total Volume**: 48 Hours

---

#### Module 1: Clean Architecture & Hexagonal Domain Modeling (12h)
- Domain entities, aggregates, and repository ports & adapters.
- Inversion of Control with NestJS dependency injection containers.
- **Hands-on Workshop**: Building a multi-tenant tenant isolation layer.

#### Module 2: Asynchronous Message Brokering with RabbitMQ (12h)
- Topic exchanges, fanout topologies, dead-letter exchanges (DLX), and worker retries.
- Consumer idempotency patterns and outbox database transactions.
- **Hands-on Workshop**: Resilient order ingestion and delivery notification queue.

#### Module 3: Database Isolation, Prisma & Migration Strategies (12h)
- Multi-schema PostgreSQL partitioning and connection pooling with PgBouncer.
- Automated migration pipelines and zero-downtime schema evolution.

#### Module 4: Observability, OpenTelemetry & Production Deployment (12h)
- Distributed tracing with Jaeger, structured JSON logs, and Prometheus metrics.
- Containerization with Docker multi-stage builds and Kubernetes health probes.

---

#### Evaluation & Grading Rubrics
- **Continuous Assessment (40%)**: 2 Pair-Programming Sprint Labs
- **Final Capstone Project (60%)**: Production-ready microservices mesh with automated test suite and load-testing report.`,
        timestamp: "10:15 AM",
        metadata: {
          model: "Onixe Pedagogical Copilot v2.4",
          tokensUsed: 620,
          category: "syllabus",
        },
        suggestedActions: [
          {
            label: "Export to Course Catalog",
            actionKey: "export-catalog",
            variant: "default",
          },
          {
            label: "Open in Document Studio",
            actionKey: "open-doc-designer",
            variant: "secondary",
          },
        ],
      },
    ],
  },
  {
    id: "session-2",
    title: "Retention Telemetry: Emma Roche & Karim B.",
    lastMessageSnippet: "Pedagogical diagnosis complete: Recommended action plans for 2 high-risk learners.",
    updatedAt: "2 hours ago",
    category: "retention",
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content:
          "Analyze the current telemetry for Promo Dev Master 2024-A students with risk scores above 70%. Provide individual pedagogical diagnosis and recommended remedial action plans.",
        timestamp: "08:45 AM",
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content: `### Telemetric Diagnosis & Dropout Risk Analysis

#### 1. Emma Roche (STU-2024-006) — Risk Score: 82% [High Risk]
- **Root Cause Factors**:
  - Attendance drop: -18% in the last 30 days (currently 72% overall attendance).
  - Failing score in Distributed Systems examination: **9.1/20**.
  - 0 practical lab submissions recorded over the past 14 days.
- **Pedagogical Prescription**:
  1. Trigger immediate meeting with Academic Tutor.
  2. Assign dedicated remedial session for Distributed Systems retake.
  3. Notify employer / enterprise tutor per CFA training contract terms.

#### 2. Karim Belkacem (STU-2024-031) — Risk Score: 74% [High Risk]
- **Root Cause Factors**:
  - Score in Deep Learning / PyTorch: **7.8/20**.
  - 2 unjustified consecutive absences logged during cohort group project.
- **Pedagogical Prescription**:
  1. Pair with peer student mentor for upcoming PyTorch sprint.
  2. Request formal absence justification for OPCO compliance record.`,
        timestamp: "08:46 AM",
        metadata: {
          model: "Onixe Pedagogical Copilot v2.4",
          tokensUsed: 490,
          category: "retention",
        },
        suggestedActions: [
          {
            label: "Generate Remediation Schedule",
            actionKey: "open-remediation",
            variant: "default",
          },
          {
            label: "Send Alert to Tutors",
            actionKey: "send-alerts",
            variant: "outline",
          },
        ],
      },
    ],
  },
  {
    id: "session-3",
    title: "Qualiopi Criterion #6 Compliance Checklist",
    lastMessageSnippet: "Checklist generated with 8 key evidence artifacts required.",
    updatedAt: "Yesterday",
    category: "qualiopi",
    messages: [
      {
        id: "msg-3-1",
        role: "user",
        content:
          "Perform a mock audit against Qualiopi Indicator 21 and 22 (trainer qualifications, continuous skill updates, and adapted pedagogical resources). Generate compliant documentation checklist.",
        timestamp: "Yesterday, 3:20 PM",
      },
      {
        id: "msg-3-2",
        role: "assistant",
        content: `### Qualiopi Quality Standard: Indicators 21 & 22 Compliance Matrix

#### Indicator 21: Instructor Competencies & Professional Certification
- [x] **Faculty CVs & Diplomas**: Verified and archived in Digital Vault.
- [x] **Continuous Training Proofs**: 100% of lead instructors have attended modern tech upskilling in the last 12 months.
- [ ] **Action Required**: Collect updated certifications for 2 adjunct trainers in Cybersecurity.

#### Indicator 22: Technical & Educational Resources
- [x] **LMS Platform Access**: Onixe workspace provisioned for all learners within 24h of registration.
- [x] **Lab Infrastructure**: Cloud computing sandbox quota allocated per student.
- [x] **Accessibility Audit**: Ergonomic equipment available for learners with disabilities (PSH).`,
        timestamp: "Yesterday, 3:21 PM",
        metadata: {
          model: "Onixe Pedagogical Copilot v2.4",
          tokensUsed: 430,
          category: "qualiopi",
        },
      },
    ],
  },
];
