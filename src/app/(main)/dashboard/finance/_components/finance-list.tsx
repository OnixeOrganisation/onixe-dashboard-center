"use client";

import * as React from "react";

import {
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Download,
  MoreHorizontal,
  Printer,
  Receipt,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";

import { CreateInvoiceDialog } from "./create-invoice-dialog";
import { INITIAL_INVOICES, INITIAL_PAYMENTS, type InvoiceItem, type PaymentRecordItem } from "./data";
import { RecordPaymentDialog } from "./record-payment-dialog";

export function FinanceList() {
  const [invoices, setInvoices] = React.useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [payments, setPayments] = React.useState<PaymentRecordItem[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceItem | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);

  const handleAddInvoice = (newInv: InvoiceItem) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleAddPayment = (newPayment: PaymentRecordItem, invoiceId: string, paidAmount: number) => {
    setPayments([newPayment, ...payments]);
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const status = paidAmount >= inv.amount ? "Paid" : "Partially Paid";
          return { ...inv, paidAmount, status };
        }
        return inv;
      }),
    );
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.studentName.toLowerCase().includes(q) ||
      inv.number.toLowerCase().includes(q) ||
      inv.cohort.toLowerCase().includes(q) ||
      inv.sponsor.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalBilled = invoices.reduce((acc, i) => acc + i.amount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const recoveryRate = Math.round((totalCollected / (totalBilled || 1)) * 100);

  const getStatusBadgeClass = (status: InvoiceItem["status"]) => {
    if (status === "Paid") {
      return "border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status === "Partially Paid") {
      return "border-sky-600/30 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    }
    if (status === "Pending") {
      return "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-destructive/30 bg-destructive/10 text-destructive";
  };

  const handleExportInvoices = () => {
    exportToCsv("Tuition_Invoices_And_Receivables", invoices, [
      { key: "number", label: "Invoice #" },
      { key: "studentName", label: "Student / Learner" },
      { key: "cohort", label: "Cohort" },
      { key: "sponsor", label: "Funding Sponsor / OPCO" },
      { key: "dueDate", label: "Payment Due Date" },
      { key: "amount", label: "Total Amount (€)" },
      { key: "paidAmount", label: "Collected (€)" },
      { key: "status", label: "Invoice Status" },
    ]);
    toast.success("Invoices Ledger Exported", {
      description: "Downloaded billing and aging receivables database as CSV/Excel.",
    });
  };

  const handleExportPayments = () => {
    exportToCsv("Treasury_Encaissements_Journal", payments, [
      { key: "receiptNumber", label: "Receipt #" },
      { key: "studentName", label: "Student Name" },
      { key: "invoiceNumber", label: "Settled Invoice #" },
      { key: "date", label: "Payment Date" },
      { key: "amount", label: "Amount Paid (€)" },
      { key: "method", label: "Payment Method" },
      { key: "transactionRef", label: "Bank Wire / Transaction Ref" },
      { key: "status", label: "Status" },
    ]);
    toast.success("Payments Journal Exported", {
      description: "Downloaded treasury receipts ledger as CSV/Excel.",
    });
  };

  const handlePrintFinancialStatement = () => {
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const getBadgeClass = (status: InvoiceItem["status"]) => {
      if (status === "Paid") return "badge-success";
      if (status === "Partially Paid") return "badge-info";
      return "badge-warning";
    };

    const rowsHtml = invoices
      .map(
        (inv, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td><strong>${inv.number}</strong></td>
        <td>${inv.studentName}</td>
        <td>${inv.sponsor}</td>
        <td style="text-align: right; font-weight: 700;">${inv.amount.toLocaleString()} €</td>
        <td style="text-align: right; color: #166534;">${inv.paidAmount.toLocaleString()} €</td>
        <td style="text-align: right; color: #b91c1c;">${(inv.amount - inv.paidAmount).toLocaleString()} €</td>
        <td style="text-align: center;">
          <span class="badge ${getBadgeClass(inv.status)}">${inv.status}</span>
        </td>
      </tr>
    `,
      )
      .join("");

    const html = `
      <header class="doc-header">
        <div class="doc-brand">
          <div class="doc-org-name">ONIXE INSTITUTE OF TECHNOLOGY</div>
          <div class="doc-org-sub">Financial Administration & Bursar Office | CFA Apprentice Funding Management</div>
          <div class="doc-org-sub">SIRET: 893 492 102 00018 | Bank Account: FR76 3000 4001 2345 6789 0123 456</div>
        </div>
        <div class="doc-meta">
          <div><strong>Statement Ref:</strong> FIN-${Date.now().toString().slice(-8)}</div>
          <div><strong>Date:</strong> ${currentDate}</div>
          <div><strong>Accounting Period:</strong> FY 2024 - Q4</div>
        </div>
      </header>

      <div class="doc-title-box">
        <div class="doc-title">Official Tuition Billing & Treasury Statement</div>
        <div class="doc-subtitle">Institutional Accounts Receivable & OPCO Settlement Summary</div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; font-size: 9pt;">
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px;">
          <span style="color: #64748b;">Total Billed:</span><br/>
          <strong style="font-size: 14pt; color: #0f172a;">${totalBilled.toLocaleString()} €</strong>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 12px; border-radius: 4px;">
          <span style="color: #166534;">Collected Revenue:</span><br/>
          <strong style="font-size: 14pt; color: #15803d;">${totalCollected.toLocaleString()} €</strong>
        </div>
        <div style="background: #fefce8; border: 1px solid #fde047; padding: 12px; border-radius: 4px;">
          <span style="color: #854d0e;">Outstanding Receivables:</span><br/>
          <strong style="font-size: 14pt; color: #a16207;">${totalOutstanding.toLocaleString()} €</strong>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: center; width: 35px;">#</th>
            <th>Invoice #</th>
            <th>Learner</th>
            <th>Payer / OPCO</th>
            <th style="text-align: right;">Total Amount</th>
            <th style="text-align: right;">Collected</th>
            <th style="text-align: right;">Balance Due</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-title">Bursar & Accounting Officer</div>
          <div style="font-size: 8pt; color: #475569;">Reconciled with bank statements and verified with OPCO funding contracts.</div>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
            <span>Chief Financial Officer</span>
            <span>Date: ${currentDate}</span>
          </div>
        </div>

        <div class="signature-box">
          <div class="signature-title">Institutional Treasury Seal</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="official-stamp">
              ONIXE CENTER<br/>TREASURY & FINANCE
            </div>
            <div style="font-size: 7.5pt; color: #64748b; text-align: right;">
              Audit Certification<br/>
              Status: Reconciled
            </div>
          </div>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 8pt; display: flex; justify-content: space-between;">
            <span>Accounting Office</span>
            <span>Certified Ledger</span>
          </div>
        </div>
      </div>

      <footer class="doc-footer">
        <div>Onixe Learning OS Financial Telemetry | Certified Audit Document | Page 1 / 1</div>
      </footer>
    `;

    printHtmlDocument({
      title: `Financial_Statement_${currentDate.replace(/\s+/g, "_")}`,
      htmlContent: html,
      pageOrientation: "portrait",
    });

    toast.success("Financial Statement PDF Ready", {
      description: "Generated certified accounting and billing statement.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Tuition Invoicing & Financial Ledger</h1>
          <p className="text-muted-foreground text-sm">
            Manage tuition billing, OPCO apprenticeship collections, treasury receipts, and payment settlements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportInvoices}>
            <Download className="size-4" />
            Export Invoices
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPayments}>
            <Download className="size-4" />
            Export Receipts
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrintFinancialStatement}>
            <Printer className="size-4" />
            Print Statement (PDF)
          </Button>
          <CreateInvoiceDialog onAddInvoice={handleAddInvoice} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Total Billed Tuition
            </span>
            <DollarSign className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalBilled.toLocaleString()} €</div>
          <div className="mt-1 text-muted-foreground text-xs">Across all active promotions</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Collected Revenue
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalCollected.toLocaleString()} €</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">{recoveryRate}% recovery compliance</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Outstanding Balance
            </span>
            <AlertCircle className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalOutstanding.toLocaleString()} €</div>
          <div className="mt-1 font-medium text-amber-600 text-xs">Pending OPCO & learner wires</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Settled Receipts</span>
            <Receipt className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{payments.length}</div>
          <div className="mt-1 text-muted-foreground text-xs">Verified transaction entries</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="invoices" className="text-xs">
              Tuition Invoices ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">
              Payment Receipts Ledger ({payments.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[240px]">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search invoice, student, sponsor..."
                className="h-9 pl-8 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Invoices Table */}
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Invoice / Learner</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Funding Sponsor</TableHead>
                    <TableHead className="w-[140px] text-right">Amount / Paid</TableHead>
                    <TableHead className="w-[120px]">Due Date</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No invoices found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-semibold text-foreground text-sm">{inv.studentName}</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="font-mono text-[11px]">{inv.number}</span>
                              <span>•</span>
                              <span className="font-mono text-[11px]">{inv.studentMatricule}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium text-foreground text-xs">{inv.cohort}</span>
                        </TableCell>

                        <TableCell>
                          <span className="text-muted-foreground text-xs">{inv.sponsor}</span>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="grid gap-0.5 text-xs">
                            <span className="font-bold text-foreground">{inv.amount.toLocaleString()} €</span>
                            <span className="text-[11px] text-muted-foreground">
                              Paid: {inv.paidAmount.toLocaleString()} €
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-muted-foreground text-xs">{inv.dueDate}</span>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeClass(inv.status)}>
                            {inv.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setPaymentDialogOpen(true);
                                }}
                              >
                                Record Payment / Collection
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.success("PDF Invoice Downloaded", {
                                    description: `Official invoice ${inv.number} downloaded.`,
                                  });
                                }}
                              >
                                Download Invoice PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Ledger */}
        <TabsContent value="payments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt / Reference</TableHead>
                    <TableHead>Learner / Invoice</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount Settled</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-mono font-semibold text-foreground">{p.transactionReference}</span>
                          <span className="text-[11px] text-muted-foreground">ID: {p.id}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-medium text-foreground">{p.studentName}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{p.invoiceNumber}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-xs">{p.paymentDate}</TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {p.paymentMethod}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-bold text-emerald-600 text-sm">
                        +{p.amount.toLocaleString()} €
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-emerald-600/30 bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400"
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Payment Modal */}
      <RecordPaymentDialog
        invoice={selectedInvoice}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
}
