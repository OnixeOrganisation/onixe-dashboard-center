export type DocumentType =
  | "transcript"
  | "invoice"
  | "certificate"
  | "diploma"
  | "attendance"
  | "internship"
  | "custom";

export type BlockType =
  | "header"
  | "heading"
  | "paragraph"
  | "columns"
  | "key-values"
  | "grades-table"
  | "invoice-table"
  | "attendance-table"
  | "signature-seal"
  | "divider"
  | "callout";

export type PageOrientation = "portrait" | "landscape";
export type FontFamily = "sans" | "serif" | "mono";

export interface DynamicVariable {
  key: string; // e.g. "{{student.name}}"
  label: string;
  category: "Student" | "Institution" | "Academic" | "Financial" | "Security";
  exampleValue: string;
  description: string;
}

export const DYNAMIC_VARIABLES: DynamicVariable[] = [
  // Student Variables
  {
    key: "{{student.name}}",
    label: "Student Full Name",
    category: "Student",
    exampleValue: "Alexandre Mercier",
    description: "Learner first & last name",
  },
  {
    key: "{{student.id}}",
    label: "Student ID (Matricule)",
    category: "Student",
    exampleValue: "STU-2024-001",
    description: "Unique learner matricule or INE",
  },
  {
    key: "{{student.email}}",
    label: "Student Email",
    category: "Student",
    exampleValue: "alexandre.mercier@onixe.institute",
    description: "Institutional email",
  },
  {
    key: "{{student.cohort}}",
    label: "Cohort / Class",
    category: "Student",
    exampleValue: "Promo Dev Master 2024-A",
    description: "Enrolled promotion",
  },
  {
    key: "{{student.department}}",
    label: "Department",
    category: "Student",
    exampleValue: "Software Engineering & Cloud",
    description: "Academic track department",
  },
  {
    key: "{{student.gradeAverage}}",
    label: "Weighted Average (/20)",
    category: "Student",
    exampleValue: "15.80",
    description: "Calculated general grade average",
  },
  {
    key: "{{student.attendanceRate}}",
    label: "Attendance Rate (%)",
    category: "Student",
    exampleValue: "96%",
    description: "Compliance percentage",
  },
  {
    key: "{{student.ectsCredits}}",
    label: "Earned ECTS",
    category: "Student",
    exampleValue: "60 ECTS",
    description: "Validated credit points",
  },
  {
    key: "{{student.birthDate}}",
    label: "Date of Birth",
    category: "Student",
    exampleValue: "15 April 2001",
    description: "Birthdate",
  },
  {
    key: "{{student.birthPlace}}",
    label: "Place of Birth",
    category: "Student",
    exampleValue: "Paris, France",
    description: "Birth city",
  },

  // Institution Variables
  {
    key: "{{center.name}}",
    label: "Center Name",
    category: "Institution",
    exampleValue: "ONIXE INSTITUTE OF TECHNOLOGY",
    description: "Official campus legal name",
  },
  {
    key: "{{center.siret}}",
    label: "SIRET Number",
    category: "Institution",
    exampleValue: "893 492 102 00018",
    description: "State business registration",
  },
  {
    key: "{{center.uai}}",
    label: "UAI Code",
    category: "Institution",
    exampleValue: "0755928K",
    description: "Education ministry code",
  },
  {
    key: "{{center.qualiopiId}}",
    label: "Qualiopi Ref",
    category: "Institution",
    exampleValue: "QUALIOPI-FR-2024-8891",
    description: "CFA certified body code",
  },
  {
    key: "{{center.address}}",
    label: "Campus Address",
    category: "Institution",
    exampleValue: "142 Avenue de France, 75013 Paris",
    description: "Physical campus location",
  },
  {
    key: "{{center.phone}}",
    label: "Telephone",
    category: "Institution",
    exampleValue: "+33 1 89 45 20 00",
    description: "Administrative contact",
  },
  {
    key: "{{center.email}}",
    label: "General Email",
    category: "Institution",
    exampleValue: "academic@onixe.institute",
    description: "Registrar email",
  },
  {
    key: "{{center.deanName}}",
    label: "Dean / Director Name",
    category: "Institution",
    exampleValue: "Dr. Elena Rostova",
    description: "Authorized academic officer",
  },
  {
    key: "{{center.deanTitle}}",
    label: "Dean Title",
    category: "Institution",
    exampleValue: "Dean of Academic Affairs & Registrar",
    description: "Signatory title",
  },
  {
    key: "{{center.bankIban}}",
    label: "Bank IBAN",
    category: "Institution",
    exampleValue: "FR76 3000 4001 2345 6789 0123 456",
    description: "Treasury settlement account",
  },

  // Academic & Exam Variables
  {
    key: "{{exam.title}}",
    label: "Assessment / Exam Title",
    category: "Academic",
    exampleValue: "Final Architecture Defense & Deliberation",
    description: "Examination name",
  },
  {
    key: "{{exam.date}}",
    label: "Session Date",
    category: "Academic",
    exampleValue: "18 November 2024",
    description: "Exam / Session date",
  },
  {
    key: "{{exam.juryVerdict}}",
    label: "Jury Verdict",
    category: "Academic",
    exampleValue: "ADMITTED - HONORS (Mention Très Bien)",
    description: "Deliberation outcome",
  },
  {
    key: "{{exam.academicYear}}",
    label: "Academic Year",
    category: "Academic",
    exampleValue: "2024 - 2025",
    description: "Current academic session",
  },
  {
    key: "{{exam.degreeLevel}}",
    label: "Degree Level",
    category: "Academic",
    exampleValue: "RNCP Level 7 (Master Degree Equivalent, Bac+5)",
    description: "Official degree level",
  },

  // Financial Variables
  {
    key: "{{invoice.number}}",
    label: "Invoice Number",
    category: "Financial",
    exampleValue: "INV-2024-8842",
    description: "Generated invoice reference",
  },
  {
    key: "{{invoice.amount}}",
    label: "Total Amount (€)",
    category: "Financial",
    exampleValue: "8,420.00 €",
    description: "Total billed amount",
  },
  {
    key: "{{invoice.dueDate}}",
    label: "Payment Due Date",
    category: "Financial",
    exampleValue: "15 December 2024",
    description: "Settlement deadline",
  },
  {
    key: "{{invoice.sponsorName}}",
    label: "Sponsor / OPCO",
    category: "Financial",
    exampleValue: "OPCO ATLAS / ATOS Services",
    description: "Corporate or funding payer",
  },

  // Security & Document Variables
  {
    key: "{{document.id}}",
    label: "Document Ref ID",
    category: "Security",
    exampleValue: "DOC-2024-9918",
    description: "Unique document record ID",
  },
  {
    key: "{{document.hash}}",
    label: "Blockchain Verification Hash",
    category: "Security",
    exampleValue: "0x7F83B1657FF1FC53B92DC18148A1D65DFC2D4B1F",
    description: "SHA-256 cryptographic proof",
  },
  {
    key: "{{document.date}}",
    label: "Generation Date",
    category: "Security",
    exampleValue: "08/09/2026",
    description: "Current timestamp",
  },
];

export interface KeyValueItem {
  id?: string;
  label: string;
  value: string;
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  title?: string;
  content?: string;
  level?: 1 | 2 | 3;
  textAlign?: "left" | "center" | "right";
  columnsCount?: 1 | 2 | 3 | 4;
  columnRatio?: "50/50" | "30/70" | "70/30" | "33/33/33" | "25/25/25/25";
  keyValues?: KeyValueItem[];
  badgeText?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  hasStamp?: boolean;
  hasQrCode?: boolean;
  hasSignatureBox?: boolean;
  tableDataPreset?: "grades" | "invoice" | "attendance";
}

export interface CanvasDocument {
  id: string;
  name: string;
  documentType: DocumentType;
  orientation: PageOrientation;
  fontFamily: FontFamily;
  primaryColor: string;
  accentColor: string;
  showWatermark: boolean;
  blocks: CanvasBlock[];
}

export const STARTER_TEMPLATES: Record<DocumentType, CanvasDocument> = {
  transcript: {
    id: "tpl-transcript",
    name: "Official Grade Transcript & ECTS Deliberation",
    documentType: "transcript",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: true,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "OFFICIAL ACADEMIC TRANSCRIPT & ECTS RECORD",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "key-values",
        keyValues: [
          { label: "Student Full Name", value: "{{student.name}}" },
          { label: "Matricule / INE", value: "{{student.id}}" },
          { label: "Department", value: "{{student.department}}" },
          { label: "Cohort Promotion", value: "{{student.cohort}}" },
          { label: "Degree Level", value: "{{exam.degreeLevel}}" },
          { label: "Academic Session", value: "{{exam.academicYear}}" },
        ],
      },
      {
        id: "b-4",
        type: "grades-table",
        title: "Semester Modular Examination Results",
      },
      {
        id: "b-5",
        type: "callout",
        title: "Academic Jury Deliberation",
        content:
          "Verdict: {{exam.juryVerdict}} • Overall Weighted Average: {{student.gradeAverage}} / 20.00 • Total ECTS Earned: {{student.ectsCredits}}",
        backgroundColor: "#f0fdf4",
        borderColor: "#86efac",
      },
      {
        id: "b-6",
        type: "signature-seal",
        content: "Signed and sealed by {{center.deanName}} ({{center.deanTitle}}).",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  invoice: {
    id: "tpl-invoice",
    name: "Tuition Invoice & Fee Schedule",
    documentType: "invoice",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: false,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "TUITION & TRAINING INVOICE",
        level: 1,
        textAlign: "left",
      },
      {
        id: "b-3",
        type: "key-values",
        keyValues: [
          { label: "Invoice Ref", value: "{{invoice.number}}" },
          { label: "Issue Date", value: "{{document.date}}" },
          { label: "Payment Due Date", value: "{{invoice.dueDate}}" },
          { label: "Learner", value: "{{student.name}} ({{student.id}})" },
          { label: "Payer / OPCO", value: "{{invoice.sponsorName}}" },
          { label: "Bank IBAN", value: "{{center.bankIban}}" },
        ],
      },
      {
        id: "b-4",
        type: "invoice-table",
        title: "Billed Training Units & Educational Services",
      },
      {
        id: "b-5",
        type: "callout",
        title: "Payment Terms & Regulatory Exemption",
        content:
          "Vocational training is exempt from VAT pursuant to Article 261-4-4°a of the French Tax Code. Wire transfers must quote invoice ref {{invoice.number}}.",
        backgroundColor: "#f8fafc",
        borderColor: "#cbd5e1",
      },
      {
        id: "b-6",
        type: "signature-seal",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  certificate: {
    id: "tpl-certificate",
    name: "Certificate of Enrollment (Certificat de Scolarité)",
    documentType: "certificate",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: true,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "OFFICIAL CERTIFICATE OF ENROLLMENT",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "paragraph",
        content:
          "The Academic Registrar of {{center.name}} (SIRET: {{center.siret}}, UAI: {{center.uai}}) hereby certifies that the student named below is regularly enrolled in our accredited higher education program.",
      },
      {
        id: "b-4",
        type: "key-values",
        keyValues: [
          { label: "Student Full Name", value: "{{student.name}}" },
          { label: "Student ID (INE)", value: "{{student.id}}" },
          { label: "Date & Place of Birth", value: "{{student.birthDate}} in {{student.birthPlace}}" },
          { label: "Enrolled Department", value: "{{student.department}}" },
          { label: "Cohort / Class", value: "{{student.cohort}}" },
          { label: "Degree Level", value: "{{exam.degreeLevel}}" },
          { label: "Academic Session", value: "{{exam.academicYear}}" },
          { label: "Enrollment Regime", value: "Apprenticeship CFA (Alternance)" },
        ],
      },
      {
        id: "b-5",
        type: "paragraph",
        content:
          "This official certificate is delivered to serve all administrative, transportation, student welfare, social security, and visa renewal requirements.",
      },
      {
        id: "b-6",
        type: "signature-seal",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  diploma: {
    id: "tpl-diploma",
    name: "Graduation Parchment (Attestation de Réussite / Diplôme)",
    documentType: "diploma",
    orientation: "landscape",
    fontFamily: "serif",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: true,
    blocks: [
      {
        id: "b-1",
        type: "heading",
        content: "{{center.name}}",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-2",
        type: "paragraph",
        content:
          "RÉPUBLIQUE FRANÇAISE — ENSEIGNEMENT SUPÉRIEUR ET RECHERCHE\nPROVISIONAL ATTESTATION OF GRADUATION & DEGREE CONFERRAL",
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "paragraph",
        content:
          "In accordance with the deliberation of the Academic Examination Board dated {{exam.date}},\nThe Degree and Official Title of:",
        textAlign: "center",
      },
      {
        id: "b-4",
        type: "heading",
        content: "MASTER OF SCIENCE IN DISTRIBUTED SOFTWARE ARCHITECTURE",
        level: 2,
        textAlign: "center",
      },
      {
        id: "b-5",
        type: "paragraph",
        content:
          "Specialization: Cloud Infrastructure & AI Engineering • {{exam.degreeLevel}}\nIs officially conferred upon:",
        textAlign: "center",
      },
      {
        id: "b-6",
        type: "heading",
        content: "{{student.name}}",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-7",
        type: "callout",
        content: "Conferred with {{exam.juryVerdict}} • Verified under Hash {{document.hash}}",
        textAlign: "center",
        backgroundColor: "#f0fdf4",
        borderColor: "#86efac",
      },
      {
        id: "b-8",
        type: "signature-seal",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  attendance: {
    id: "tpl-attendance",
    name: "OPCO Monthly Attendance & Telemetry Sheet",
    documentType: "attendance",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: false,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "OFFICIAL OPCO / CFA MONTHLY ATTENDANCE SHEET",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "key-values",
        keyValues: [
          { label: "Target Cohort", value: "{{student.cohort}}" },
          { label: "Department", value: "{{student.department}}" },
          { label: "Qualiopi Certification", value: "{{center.qualiopiId}}" },
          { label: "Reporting Period", value: "November 2024" },
        ],
      },
      {
        id: "b-4",
        type: "attendance-table",
        title: "Session Emargement Telemetry Log",
      },
      {
        id: "b-5",
        type: "signature-seal",
        content: "Lead Trainer and Center Director formal sign-off.",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  internship: {
    id: "tpl-internship",
    name: "Tripartite Internship & Apprenticeship Agreement",
    documentType: "internship",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: false,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "TRIPARTITE CORPORATE TRAINING & CAPSTONE AGREEMENT",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "key-values",
        keyValues: [
          { label: "Training Body", value: "{{center.name}}" },
          { label: "Apprentice / Student", value: "{{student.name}} ({{student.id}})" },
          { label: "Sponsor Company", value: "{{invoice.sponsorName}}" },
          { label: "Academic Promotion", value: "{{student.cohort}}" },
        ],
      },
      {
        id: "b-4",
        type: "paragraph",
        content:
          "Article 1 — Purpose: The learner is assigned to conduct specialized software engineering and cloud telemetry operations under the dual supervision of the academic dean and the designated enterprise tutor.",
      },
      {
        id: "b-5",
        type: "paragraph",
        content:
          "Article 2 — Academic Validation: The company tutor commits to providing the bi-monthly evaluation and enabling attendance for all institutional examination jury sessions.",
      },
      {
        id: "b-6",
        type: "signature-seal",
        content: "Tripartite Signatures (Learner, Company Tutor, Academy Dean).",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
  custom: {
    id: "tpl-custom",
    name: "Blank Canvas Document",
    documentType: "custom",
    orientation: "portrait",
    fontFamily: "sans",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    showWatermark: false,
    blocks: [
      {
        id: "b-1",
        type: "header",
        content: "{{center.name}}",
      },
      {
        id: "b-2",
        type: "heading",
        content: "CUSTOM INSTITUTIONAL DOCUMENT",
        level: 1,
        textAlign: "center",
      },
      {
        id: "b-3",
        type: "paragraph",
        content:
          "Compose your layout by adding blocks from the left panel and inserting dynamic tokens like {{student.name}} or {{center.name}}.",
      },
      {
        id: "b-4",
        type: "signature-seal",
        hasStamp: true,
        hasQrCode: true,
        hasSignatureBox: true,
      },
    ],
  },
};
