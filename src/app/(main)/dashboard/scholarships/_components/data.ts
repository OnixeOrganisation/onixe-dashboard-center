export interface ScholarshipItem {
  id: string;
  code: string;
  studentName: string;
  studentMatricule: string;
  cohort: string;
  type: "Merit Excellence" | "Social Equity Fund" | "Corporate Tech Partner" | "Women in Tech";
  amount: number;
  awardDate: string;
  justification: string;
  approvedBy: string;
  status: "Approved" | "Active" | "Revoked";
}

export const SCHOLARSHIP_TYPES = [
  "Merit Excellence",
  "Social Equity Fund",
  "Corporate Tech Partner",
  "Women in Tech",
] as const;

export const INITIAL_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    id: "sch-1",
    code: "SCH-2024-001",
    studentName: "Amina Diallo",
    studentMatricule: "STU-2024-002",
    cohort: "Promo Dev Master 2024-A",
    type: "Merit Excellence",
    amount: 4250,
    awardDate: "2024-09-01",
    justification: "Outstanding entrance exam ranking (19.4/20) and top academic performance.",
    approvedBy: "Catherine Delorme (Campus Director)",
    status: "Active",
  },
  {
    id: "sch-2",
    code: "SCH-2024-002",
    studentName: "Inès Benzakour",
    studentMatricule: "STU-2024-008",
    cohort: "Promo Data & AI 2024-A",
    type: "Women in Tech",
    amount: 3000,
    awardDate: "2024-09-10",
    justification: "Institutional initiative supporting female talent in AI and Data Engineering.",
    approvedBy: "Prof. Sarah Benali (Head of AI Department)",
    status: "Active",
  },
  {
    id: "sch-3",
    code: "SCH-2024-003",
    studentName: "Lucas Moreau",
    studentMatricule: "STU-2024-001",
    cohort: "Promo Dev Master 2024-A",
    type: "Corporate Tech Partner",
    amount: 5000,
    awardDate: "2024-09-15",
    justification: "Co-funded scholarship supported by Cloud Partner Alliance.",
    approvedBy: "Catherine Delorme (Campus Director)",
    status: "Active",
  },
];
