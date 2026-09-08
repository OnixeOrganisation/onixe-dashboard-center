import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  FileCheck,
  FileSignature,
  FolderOpen,
  Gauge,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Institutional Intelligence",
    items: [
      {
        id: "academy",
        title: "Academy Overview",
        url: "/dashboard/academy",
        icon: GraduationCap,
      },
      {
        id: "analytics",
        title: "Pedagogical Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        id: "ai-tools",
        title: "AI Pedagogical Engine",
        url: "/dashboard/ai-tools",
        icon: Sparkles,
      },
    ],
  },
  {
    id: 2,
    label: "Academic Structure",
    items: [
      {
        id: "departments",
        title: "Departments & Tracks",
        url: "/dashboard/departments",
        icon: Building,
      },
      {
        id: "campuses",
        title: "Campuses & Classrooms",
        url: "/dashboard/campuses",
        icon: Building2,
      },
      {
        id: "courses",
        title: "Courses & Syllabus",
        url: "/dashboard/courses",
        icon: BookOpen,
      },
      {
        id: "cohorts",
        title: "Cohorts & Classes",
        url: "/dashboard/cohorts",
        icon: Layers,
      },
    ],
  },
  {
    id: 3,
    label: "Pedagogy & Student Life",
    items: [
      {
        id: "students",
        title: "Students / Learners",
        url: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        id: "instructors",
        title: "Instructors / Faculty",
        url: "/dashboard/instructors",
        icon: UserCheck,
      },
      {
        id: "gradebook",
        title: "Gradebook & Deliberations",
        url: "/dashboard/gradebook",
        icon: FileCheck,
      },
      {
        id: "attendance",
        title: "Attendance (Émargement)",
        url: "/dashboard/attendance",
        icon: Clock,
      },
      {
        id: "remediation",
        title: "Remediation & Retakes",
        url: "/dashboard/remediation",
        icon: RefreshCw,
      },
      {
        id: "internships",
        title: "Internships & Capstones",
        url: "/dashboard/internships",
        icon: Briefcase,
      },
      {
        id: "certifications",
        title: "Diplomas & Credentials",
        url: "/dashboard/certifications",
        icon: Award,
      },
      {
        id: "parents",
        title: "Parent & Mentor Portal",
        url: "/dashboard/parents",
        icon: HeartHandshake,
      },
    ],
  },
  {
    id: 4,
    label: "Finance & Operations",
    items: [
      {
        id: "finance",
        title: "Tuition & Invoicing",
        url: "/dashboard/finance",
        icon: DollarSign,
      },
      {
        id: "invoice-builder",
        title: "Invoice Designer",
        url: "/dashboard/invoice",
        icon: Receipt,
      },
      {
        id: "scholarships",
        title: "Scholarships & Grants",
        url: "/dashboard/scholarships",
        icon: Award,
      },
      {
        id: "staff",
        title: "Center Staff & Admin",
        url: "/dashboard/staff",
        icon: ShieldCheck,
      },
      {
        id: "roles",
        title: "Roles & Permissions",
        url: "/dashboard/roles",
        icon: Lock,
      },
    ],
  },
  {
    id: 5,
    label: "Workspace & Tools",
    items: [
      {
        id: "document-designer",
        title: "Document Studio",
        url: "/dashboard/document-designer",
        icon: FileSignature,
      },
      {
        id: "calendar",
        title: "Campus Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "chat",
        title: "Messages & Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "email",
        title: "Institutional Mail",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "tasks",
        title: "Tasks & Workflows",
        url: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        id: "file-manager",
        title: "Document Vault",
        url: "/dashboard/file-manager",
        icon: FolderOpen,
      },
    ],
  },
];
