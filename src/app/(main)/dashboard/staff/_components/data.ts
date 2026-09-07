export interface StaffItem {
  id: string;
  matricule: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  accessLevel: "Super Admin" | "Financial Officer" | "Academic Officer" | "Operator";
  status: "Active" | "On Leave" | "Suspended";
  lastLogin: string;
  joinedDate: string;
  permissions: string[];
}

export const STAFF_ROLES = [
  "Campus Director",
  "Pedagogical Coordinator",
  "Chief Accountant",
  "Cashier / Bursar",
  "Registrar & Admissions Officer",
  "Campus Infrastructure & IT Lead",
] as const;

export const STAFF_DEPARTMENTS = [
  "Executive & Governance",
  "Pedagogy & Academics",
  "Finance & Treasury",
  "Admissions & Student Affairs",
  "Campus Infrastructure & IT",
] as const;

export const ACCESS_LEVELS = ["Super Admin", "Financial Officer", "Academic Officer", "Operator"] as const;

export const INITIAL_STAFF: StaffItem[] = [
  {
    id: "stf-1",
    matricule: "STF-2024-001",
    name: "Catherine Delorme",
    email: "c.delorme@onixe.institute",
    phone: "+33 1 45 67 89 10",
    role: "Campus Director",
    department: "Executive & Governance",
    accessLevel: "Super Admin",
    status: "Active",
    lastLogin: "Today at 09:15 AM",
    joinedDate: "2023-01-15",
    permissions: ["org:manage", "centre:full_access", "finance:approve", "audit:view", "users:all"],
  },
  {
    id: "stf-2",
    matricule: "STF-2024-002",
    name: "Jean-Paul Gautier",
    email: "jp.gautier@onixe.institute",
    phone: "+33 1 45 67 89 20",
    role: "Chief Accountant",
    department: "Finance & Treasury",
    accessLevel: "Financial Officer",
    status: "Active",
    lastLogin: "Yesterday at 04:30 PM",
    joinedDate: "2023-03-01",
    permissions: ["tuition:manage", "invoices:generate", "expenses:approve", "finance:reports"],
  },
  {
    id: "stf-3",
    matricule: "STF-2024-003",
    name: "Nadine Touré",
    email: "n.toure@onixe.institute",
    phone: "+33 1 45 67 89 30",
    role: "Pedagogical Coordinator",
    department: "Pedagogy & Academics",
    accessLevel: "Academic Officer",
    status: "Active",
    lastLogin: "Today at 08:45 AM",
    joinedDate: "2023-05-10",
    permissions: ["cohorts:manage", "timetable:edit", "transcripts:sign", "attendance:override"],
  },
  {
    id: "stf-4",
    matricule: "STF-2024-004",
    name: "Mickael Roy",
    email: "m.roy@onixe.institute",
    phone: "+33 1 45 67 89 40",
    role: "Registrar & Admissions Officer",
    department: "Admissions & Student Affairs",
    accessLevel: "Operator",
    status: "Active",
    lastLogin: "Today at 10:00 AM",
    joinedDate: "2023-09-01",
    permissions: ["students:create", "enrollments:validate", "documents:verify"],
  },
  {
    id: "stf-5",
    matricule: "STF-2024-005",
    name: "Fatou Sow",
    email: "f.sow@onixe.institute",
    phone: "+33 1 45 67 89 50",
    role: "Cashier / Bursar",
    department: "Finance & Treasury",
    accessLevel: "Financial Officer",
    status: "Active",
    lastLogin: "Today at 08:30 AM",
    joinedDate: "2023-10-15",
    permissions: ["payments:collect", "receipts:issue", "cashier:reconcile"],
  },
  {
    id: "stf-6",
    matricule: "STF-2024-006",
    name: "Antoine Lebrun",
    email: "a.lebrun@onixe.institute",
    phone: "+33 1 45 67 89 60",
    role: "Campus Infrastructure & IT Lead",
    department: "Campus Infrastructure & IT",
    accessLevel: "Super Admin",
    status: "Active",
    lastLogin: "2 days ago",
    joinedDate: "2023-04-12",
    permissions: ["it:devices", "badge_readers:sync", "network:manage", "security:audit"],
  },
];
