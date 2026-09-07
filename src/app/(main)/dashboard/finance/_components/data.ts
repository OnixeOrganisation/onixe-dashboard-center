export interface InvoiceItem {
  id: string;
  number: string;
  studentName: string;
  studentMatricule: string;
  cohort: string;
  sponsor: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  issueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Partially Paid";
}

export interface PaymentRecordItem {
  id: string;
  invoiceNumber: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "Bank Transfer" | "Credit Card" | "Direct Debit (SEPA)" | "Cashier / Cash" | "OPCO Wire";
  transactionReference: string;
  status: "Settled" | "Processing" | "Failed";
}

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    number: "INV-2024-1001",
    studentName: "Lucas Moreau",
    studentMatricule: "STU-2024-001",
    cohort: "Promo Dev Master 2024-A",
    sponsor: "OPCO Atlas (Apprenticeship)",
    amount: 9500,
    paidAmount: 9500,
    dueDate: "2024-11-15",
    issueDate: "2024-09-01",
    status: "Paid",
  },
  {
    id: "inv-2",
    number: "INV-2024-1002",
    studentName: "Amina Diallo",
    studentMatricule: "STU-2024-002",
    cohort: "Promo Dev Master 2024-A",
    sponsor: "Personal / Self-Funded",
    amount: 8500,
    paidAmount: 4250,
    dueDate: "2024-12-01",
    issueDate: "2024-09-01",
    status: "Partially Paid",
  },
  {
    id: "inv-3",
    number: "INV-2024-1003",
    studentName: "Julien Mercier",
    studentMatricule: "STU-2024-003",
    cohort: "Promo Cloud & DevOps 2024-A",
    sponsor: "Akka Technologies Corporate Sponsor",
    amount: 9500,
    paidAmount: 9500,
    dueDate: "2024-10-30",
    issueDate: "2024-09-01",
    status: "Paid",
  },
  {
    id: "inv-4",
    number: "INV-2024-1004",
    studentName: "Chloé Lefebvre",
    studentMatricule: "STU-2024-004",
    cohort: "Promo Data & AI 2024-A",
    sponsor: "Personal / Installments",
    amount: 9000,
    paidAmount: 0,
    dueDate: "2024-11-01",
    issueDate: "2024-09-01",
    status: "Overdue",
  },
  {
    id: "inv-5",
    number: "INV-2024-1005",
    studentName: "David Kovacs",
    studentMatricule: "STU-2024-007",
    cohort: "Promo Cyber Ops 2024-A",
    sponsor: "OPCO EP Apprenticeship Fund",
    amount: 9500,
    paidAmount: 0,
    dueDate: "2024-12-15",
    issueDate: "2024-10-01",
    status: "Pending",
  },
];

export const INITIAL_PAYMENTS: PaymentRecordItem[] = [
  {
    id: "pay-1",
    invoiceNumber: "INV-2024-1001",
    studentName: "Lucas Moreau",
    amount: 9500,
    paymentDate: "2024-11-10",
    paymentMethod: "OPCO Wire",
    transactionReference: "VIR-OPCO-984210",
    status: "Settled",
  },
  {
    id: "pay-2",
    invoiceNumber: "INV-2024-1002",
    studentName: "Amina Diallo",
    amount: 4250,
    paymentDate: "2024-09-15",
    paymentMethod: "Bank Transfer",
    transactionReference: "TXN-FR-771920",
    status: "Settled",
  },
  {
    id: "pay-3",
    invoiceNumber: "INV-2024-1003",
    studentName: "Julien Mercier",
    amount: 9500,
    paymentDate: "2024-10-25",
    paymentMethod: "Bank Transfer",
    transactionReference: "CORP-WIRE-0042",
    status: "Settled",
  },
];
