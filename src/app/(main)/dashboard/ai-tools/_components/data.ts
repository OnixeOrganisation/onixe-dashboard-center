export interface RetentionRiskItem {
  id: string;
  studentName: string;
  matricule: string;
  cohort: string;
  riskScore: number; // percentage (e.g. 78%)
  riskLevel: "High Risk" | "Moderate Risk" | "Low Risk";
  contributingFactors: string[];
  recommendedAction: string;
}

export const INITIAL_RISK_STUDENTS: RetentionRiskItem[] = [
  {
    id: "risk-1",
    studentName: "Emma Roche",
    matricule: "STU-2024-006",
    cohort: "Promo Dev Master 2024-A",
    riskScore: 82,
    riskLevel: "High Risk",
    contributingFactors: [
      "Attendance drop (-18% last month)",
      "Failing mark in Distributed Systems (9.1/20)",
      "0 lab submissions in last 14 days",
    ],
    recommendedAction: "Schedule urgent one-on-one pedagogical mentoring & enroll in retake workshop.",
  },
  {
    id: "risk-2",
    studentName: "Karim Belkacem",
    matricule: "STU-2024-031",
    cohort: "Promo Data & AI 2024-A",
    riskScore: 74,
    riskLevel: "High Risk",
    contributingFactors: ["Grade average below 8.0/20 in PyTorch", "2 unjustified absences logged"],
    recommendedAction: "Offer remedial tutoring with faculty assistant & verify sponsorship status.",
  },
  {
    id: "risk-3",
    studentName: "Romain Garnier",
    matricule: "STU-2024-014",
    cohort: "Promo Cloud & DevOps 2024-A",
    riskScore: 48,
    riskLevel: "Moderate Risk",
    contributingFactors: ["Retake exam required in Kubernetes", "Attendance steady at 88%"],
    recommendedAction: "Send reminder for upcoming December retake examination session.",
  },
];
