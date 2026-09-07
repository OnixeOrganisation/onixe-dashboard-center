export interface LinkedStudentInfo {
  studentId: string;
  matricule: string;
  name: string;
  cohort: string;
  gradeAverage: number;
  attendanceRate: number;
}

export interface ParentItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  relationshipType: "Parent / Legal Guardian" | "Corporate Apprenticeship Master" | "Sponsor Representative";
  linkedStudents: LinkedStudentInfo[];
  status: "Active" | "Invited" | "Suspended";
  lastAccess: string;
}

export const INITIAL_PARENTS: ParentItem[] = [
  {
    id: "par-1",
    code: "PAR-2024-001",
    name: "Jean & Sophie Moreau",
    email: "parents.moreau@email.fr",
    phone: "+33 6 11 22 33 44",
    relationshipType: "Parent / Legal Guardian",
    linkedStudents: [
      {
        studentId: "std-1",
        matricule: "STU-2024-001",
        name: "Lucas Moreau",
        cohort: "Promo Dev Master 2024-A",
        gradeAverage: 17.4,
        attendanceRate: 94,
      },
    ],
    status: "Active",
    lastAccess: "Today at 08:30 AM",
  },
  {
    id: "par-2",
    code: "PAR-2024-002",
    name: "Laurent Dupont",
    email: "l.dupont@capgemini.com",
    phone: "+33 1 49 00 12 34",
    relationshipType: "Corporate Apprenticeship Master",
    linkedStudents: [
      {
        studentId: "std-1",
        matricule: "STU-2024-001",
        name: "Lucas Moreau",
        cohort: "Promo Dev Master 2024-A",
        gradeAverage: 17.4,
        attendanceRate: 94,
      },
    ],
    status: "Active",
    lastAccess: "Yesterday at 05:15 PM",
  },
  {
    id: "par-3",
    code: "PAR-2024-003",
    name: "Fatima Diallo",
    email: "fatima.diallo@email.fr",
    phone: "+33 6 55 66 77 88",
    relationshipType: "Parent / Legal Guardian",
    linkedStudents: [
      {
        studentId: "std-2",
        matricule: "STU-2024-002",
        name: "Amina Diallo",
        cohort: "Promo Dev Master 2024-A",
        gradeAverage: 18.6,
        attendanceRate: 98,
      },
    ],
    status: "Active",
    lastAccess: "3 days ago",
  },
];
