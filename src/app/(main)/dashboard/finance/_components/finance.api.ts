import { apiClient } from "@/lib/api-client";

import type { InvoiceItem, PaymentRecordItem } from "./data";

export interface RevenueSummary {
  tenantId: string;
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  recoveryRate: number;
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  invoicesTotalCount: number;
  paymentsTotalCount: number;
}

export async function fetchInvoices(status?: string): Promise<InvoiceItem[]> {
  const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  const res = await apiClient<InvoiceItem[]>(`centre/finance/invoices${query}`);
  return res.data;
}

export async function fetchPayments(): Promise<PaymentRecordItem[]> {
  const res = await apiClient<PaymentRecordItem[]>("centre/finance/payments");
  return res.data;
}

export async function fetchRevenueSummary(): Promise<RevenueSummary> {
  const res = await apiClient<RevenueSummary>("centre/finance/revenue-summary");
  return res.data;
}

export async function createInvoiceApi(data: {
  studentName: string;
  studentMatricule?: string;
  cohort: string;
  sponsor?: string;
  amount: number;
  dueDate: string;
  issueDate?: string;
}): Promise<InvoiceItem> {
  const res = await apiClient<InvoiceItem>("centre/finance/invoices", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function recordPaymentApi(data: {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
}): Promise<{ payment: PaymentRecordItem; updatedInvoice: InvoiceItem }> {
  const res = await apiClient<{ payment: PaymentRecordItem; updatedInvoice: InvoiceItem }>(
    "centre/finance/record-payment",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  return res.data;
}
