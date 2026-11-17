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

export const financeApi = {
  getInvoices: async (status?: string): Promise<InvoiceItem[]> => {
    const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
    return apiClient.get<InvoiceItem[]>(`/centre/finance/invoices${query}`);
  },

  getPayments: async (): Promise<PaymentRecordItem[]> => {
    return apiClient.get<PaymentRecordItem[]>("/centre/finance/payments");
  },

  getRevenueSummary: async (): Promise<RevenueSummary> => {
    return apiClient.get<RevenueSummary>("/centre/finance/revenue-summary");
  },

  createInvoice: async (data: {
    studentName: string;
    studentMatricule?: string;
    cohort: string;
    sponsor?: string;
    amount: number;
    dueDate: string;
    issueDate?: string;
  }): Promise<InvoiceItem> => {
    return apiClient.post<InvoiceItem>("/centre/finance/invoices", data);
  },

  recordPayment: async (data: {
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    transactionReference?: string;
  }): Promise<{ payment: PaymentRecordItem; updatedInvoice: InvoiceItem }> => {
    return apiClient.post<{ payment: PaymentRecordItem; updatedInvoice: InvoiceItem }>(
      "/centre/finance/record-payment",
      data,
    );
  },
};
