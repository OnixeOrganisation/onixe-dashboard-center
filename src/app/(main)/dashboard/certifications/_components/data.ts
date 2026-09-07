export interface DiplomaItem {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentMatricule: string;
  degreeTitle: string;
  cohort: string;
  graduationDate: string;
  honors: "Summa Cum Laude (Félicitations du Jury)" | "Magna Cum Laude (Très Bien)" | "Cum Laude (Bien)" | "Passed";
  cryptoHash: string;
  verificationUrl: string;
  status: "Issued" | "Pending Signatures" | "Revoked";
}

export const INITIAL_DIPLOMAS: DiplomaItem[] = [
  {
    id: "dip-1",
    certificateNumber: "ONIXE-DIP-2024-8891",
    studentName: "Lucas Moreau",
    studentMatricule: "STU-2024-001",
    degreeTitle: "Master of Science in Distributed Software Engineering",
    cohort: "Promo Dev Master 2024-A",
    graduationDate: "2024-11-20",
    honors: "Summa Cum Laude (Félicitations du Jury)",
    cryptoHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    verificationUrl:
      "https://verify.onixe.institute/cert/0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    status: "Issued",
  },
  {
    id: "dip-2",
    certificateNumber: "ONIXE-DIP-2024-8892",
    studentName: "Amina Diallo",
    studentMatricule: "STU-2024-002",
    degreeTitle: "Master of Science in Distributed Software Engineering",
    cohort: "Promo Dev Master 2024-A",
    graduationDate: "2024-11-20",
    honors: "Summa Cum Laude (Félicitations du Jury)",
    cryptoHash: "0x9b43e12089f2ca53a92ee18148b2d75efc2d4c3fa3d677284addd200126e8812",
    verificationUrl:
      "https://verify.onixe.institute/cert/0x9b43e12089f2ca53a92ee18148b2d75efc2d4c3fa3d677284addd200126e8812",
    status: "Issued",
  },
  {
    id: "dip-3",
    certificateNumber: "ONIXE-DIP-2024-8893",
    studentName: "Chloé Lefebvre",
    studentMatricule: "STU-2024-004",
    degreeTitle: "Master of Science in Applied AI & Machine Learning",
    cohort: "Promo Data & AI 2024-A",
    graduationDate: "2024-11-20",
    honors: "Magna Cum Laude (Très Bien)",
    cryptoHash: "0x3a77f1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126f9944",
    verificationUrl:
      "https://verify.onixe.institute/cert/0x3a77f1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126f9944",
    status: "Issued",
  },
];
