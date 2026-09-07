export type UserStatus = "Active" | "Pending invite" | "Deactivated" | "Graduated" | "Suspended";

const departmentValues = [
  "Computer Science",
  "Security & Networks",
  "Artificial Intelligence",
  "Software Systems",
  "Cloud Architecture",
  "Design & UX",
  "Pedagogical Direction",
  "Academic Office",
] as const;

export type UserDepartment = (typeof departmentValues)[number];

export type UserRow = {
  email: string;
  joinedDate: string;
  lastActive: number;
  name: string;
  role: string;
  status: UserStatus;
  team: UserDepartment;
  workspace: string[];
};

export const users: UserRow[] = [
  {
    name: "Dr. Thomas Moreau",
    email: "t.moreau@onixe-academy.edu",
    role: "Lead Instructor",
    status: "Active",
    team: "Computer Science",
    workspace: ["SE-2026A", "Algo Lab"],
    joinedDate: "12 Jan 2024, 08:30 AM",
    lastActive: 0,
  },
  {
    name: "Prof. Sarah Connor",
    email: "s.connor@onixe-academy.edu",
    role: "Lead Instructor",
    status: "Active",
    team: "Security & Networks",
    workspace: ["CYB-2026B", "Cyber Lab"],
    joinedDate: "15 Sep 2023, 09:15 AM",
    lastActive: 8,
  },
  {
    name: "Lucas Vance",
    email: "l.vance@student.onixe.edu",
    role: "Student / Learner",
    status: "Active",
    team: "Computer Science",
    workspace: ["SE-2026A"],
    joinedDate: "01 Sep 2026, 09:00 AM",
    lastActive: 2,
  },
  {
    name: "Amira Zahra",
    email: "a.zahra@student.onixe.edu",
    role: "Student / Learner",
    status: "Active",
    team: "Computer Science",
    workspace: ["SE-2026A"],
    joinedDate: "01 Sep 2026, 09:00 AM",
    lastActive: 15,
  },
  {
    name: "Dr. Alexandre Dumas",
    email: "a.dumas@onixe-academy.edu",
    role: "Academic Director",
    status: "Active",
    team: "Pedagogical Direction",
    workspace: ["DSAI-2026", "Academic Board"],
    joinedDate: "01 Feb 2023, 10:00 AM",
    lastActive: 4,
  },
  {
    name: "Marc Dupont",
    email: "m.dupont@student.onixe.edu",
    role: "Student / Learner",
    status: "Active",
    team: "Security & Networks",
    workspace: ["CYB-2026B"],
    joinedDate: "15 Sep 2026, 08:30 AM",
    lastActive: 45,
  },
  {
    name: "Sofia Chen",
    email: "s.chen@student.onixe.edu",
    role: "Student / Learner",
    status: "Active",
    team: "Artificial Intelligence",
    workspace: ["DSAI-2026"],
    joinedDate: "01 Sep 2026, 09:00 AM",
    lastActive: 1,
  },
  {
    name: "Elena Rostova",
    email: "e.rostova@onixe-academy.edu",
    role: "Instructor",
    status: "Active",
    team: "Software Systems",
    workspace: ["DEV-2026F"],
    joinedDate: "10 Jan 2024, 02:00 PM",
    lastActive: 22,
  },
  {
    name: "Kofi Mensah",
    email: "k.mensah@student.onixe.edu",
    role: "Student / Learner",
    status: "Active",
    team: "Software Systems",
    workspace: ["DEV-2026F"],
    joinedDate: "15 Jan 2026, 11:00 AM",
    lastActive: 120,
  },
  {
    name: "Marcus Vance",
    email: "m.vance@onixe-academy.edu",
    role: "Instructor",
    status: "Active",
    team: "Cloud Architecture",
    workspace: ["DOPS-2027"],
    joinedDate: "01 Mar 2024, 09:00 AM",
    lastActive: 14,
  },
  {
    name: "Nathalie Bernard",
    email: "n.bernard@onixe-academy.edu",
    role: "Pedagogical Coordinator",
    status: "Active",
    team: "Academic Office",
    workspace: ["Student Services", "CFA Compliance"],
    joinedDate: "05 May 2023, 08:45 AM",
    lastActive: 3,
  },
  {
    name: "David Kim",
    email: "d.kim@student.onixe.edu",
    role: "Student / Learner",
    status: "Pending invite",
    team: "Cloud Architecture",
    workspace: ["DOPS-2027"],
    joinedDate: "28 Aug 2026, 03:20 PM",
    lastActive: 1440,
  },
  {
    name: "Clara Beauchamp",
    email: "c.beauchamp@onixe-academy.edu",
    role: "Instructor",
    status: "Active",
    team: "Design & UX",
    workspace: ["UXD-2025"],
    joinedDate: "01 Sep 2023, 09:00 AM",
    lastActive: 60,
  },
  {
    name: "Youssef Benali",
    email: "y.benali@student.onixe.edu",
    role: "Student / Learner",
    status: "Graduated",
    team: "Design & UX",
    workspace: ["UXD-2025"],
    joinedDate: "01 Sep 2025, 09:00 AM",
    lastActive: 10080,
  },
  {
    name: "Lea Fontaine",
    email: "l.fontaine@student.onixe.edu",
    role: "Student / Learner",
    status: "Suspended",
    team: "Computer Science",
    workspace: ["SE-2026A"],
    joinedDate: "01 Sep 2026, 09:00 AM",
    lastActive: 4320,
  },
];

export const filters = {
  role: ["All", "Student / Learner", "Lead Instructor", "Instructor", "Academic Director", "Pedagogical Coordinator"],
  team: ["All", ...departmentValues],
  status: ["All", "Active", "Pending invite", "Deactivated", "Graduated", "Suspended"],
  workspace: ["All", "SE-2026A", "CYB-2026B", "DSAI-2026", "DEV-2026F", "DOPS-2027", "UXD-2025"],
};

export const statusMeta: Record<UserStatus, { badgeClass: string; dotClass: string }> = {
  Active: {
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "Pending invite": {
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  Deactivated: {
    badgeClass: "border-border bg-muted/50 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  Graduated: {
    badgeClass: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    dotClass: "bg-sky-500",
  },
  Suspended: {
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive dark:text-destructive",
    dotClass: "bg-destructive",
  },
};
