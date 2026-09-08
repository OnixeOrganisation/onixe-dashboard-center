export type DocumentType = "invoice" | "transcript" | "certificate" | "diploma" | "attendance" | "internship";

export type ColorTheme = "navy" | "emerald" | "royal" | "bordeaux" | "slate";
export type FontFamily = "sans" | "serif" | "mono";

export interface CenterBrandingSettings {
  // Institutional Details
  centerName: string;
  tagline: string;
  siret: string;
  uai: string;
  qualiopiId: string;
  address: string;
  phone: string;
  email: string;
  website: string;

  // Banking & Financial
  bankName: string;
  iban: string;
  bic: string;

  // Signatory & Seal
  deanName: string;
  deanTitle: string;
  stampText: string;
  showStamp: boolean;
  showQrCode: boolean;
  showWatermark: boolean;
  showSignature: boolean;

  // Visual Appearance
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  primaryColor: string;
  accentColor: string;

  // Specific Document Tweaks
  invoicePrefix: string;
  vatRate: number;
  ectsPassingGrade: number;
  academicYear: string;
  rncpLevelTitle: string;
}

export const DEFAULT_BRANDING: CenterBrandingSettings = {
  centerName: "ONIXE INSTITUTE OF TECHNOLOGY",
  tagline: "Higher Academy of Computer Sciences & CFA Apprenticeship Center",
  siret: "893 492 102 00018",
  uai: "0755928K",
  qualiopiId: "QUALIOPI-FR-2024-8891",
  address: "142 Avenue de France, 75013 Paris, France",
  phone: "+33 1 89 45 20 00",
  email: "academic@onixe.institute",
  website: "www.onixe.institute",

  bankName: "BNP Paribas Corporate France",
  iban: "FR76 3000 4001 2345 6789 0123 456",
  bic: "BNPAFRPPXXX",

  deanName: "Dr. Elena Rostova",
  deanTitle: "Dean of Academic Affairs & Registrar",
  stampText: "ONIXE INSTITUTE\nACCREDITED CAMPUS",
  showStamp: true,
  showQrCode: true,
  showWatermark: true,
  showSignature: true,

  colorTheme: "navy",
  fontFamily: "sans",
  primaryColor: "#0f172a",
  accentColor: "#3b82f6",

  invoicePrefix: "INV-2024-",
  vatRate: 0,
  ectsPassingGrade: 10,
  academicYear: "2024 - 2025",
  rncpLevelTitle: "Level 7 (Master of Science Equivalent, EQF Level 7)",
};

export interface DocumentTypeOption {
  id: DocumentType;
  title: string;
  category: string;
  description: string;
  orientation: "portrait" | "landscape";
}

export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  {
    id: "invoice",
    title: "Tuition Invoice & Fee Schedule",
    category: "Finance & Accounting",
    description: "Official student & corporate OPCO billing invoice with tax exemption formulas.",
    orientation: "portrait",
  },
  {
    id: "transcript",
    title: "Official Grade Transcript & ECTS Deliberation",
    category: "Pedagogy & Exams",
    description: "Semester grade report, module coefficients, weighted averages, and jury validation.",
    orientation: "portrait",
  },
  {
    id: "certificate",
    title: "Certificate of Enrollment (Certificat de Scolarité)",
    category: "Student Life & Administration",
    description: "Administrative registration certificate for public welfare, transport, and visa.",
    orientation: "portrait",
  },
  {
    id: "diploma",
    title: "Graduation Parchment (Attestation de Réussite / Diplôme)",
    category: "Degrees & Credentials",
    description: "Certified graduation parchment with RNCP title, Latin honors, and verification QR.",
    orientation: "landscape",
  },
  {
    id: "attendance",
    title: "OPCO Monthly Attendance & Telemetry Sheet",
    category: "Compliance & Audits",
    description: "Certified emargement document compliant with French OPCO and funding mandates.",
    orientation: "portrait",
  },
  {
    id: "internship",
    title: "Internship & Apprenticeship Agreement",
    category: "Corporate & Careers",
    description: "Tripartite corporate training contract between center, student, and sponsor company.",
    orientation: "portrait",
  },
];
