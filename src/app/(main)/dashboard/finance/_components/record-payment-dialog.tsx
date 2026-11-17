"use client";

import * as React from "react";

import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { InvoiceItem, PaymentRecordItem } from "./data";
import { recordPaymentApi } from "./finance.api";

interface RecordPaymentDialogProps {
  invoice: InvoiceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (payment: PaymentRecordItem, updatedInvoiceId: string, paidAmount: number) => void;
}

export function RecordPaymentDialog({ invoice, open, onOpenChange, onAddPayment }: RecordPaymentDialogProps) {
  const [amount, setAmount] = React.useState("0");
  const [method, setMethod] = React.useState<PaymentRecordItem["paymentMethod"]>("Bank Transfer");
  const [reference, setReference] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (invoice) {
      const remaining = Math.max(0, invoice.amount - invoice.paidAmount);
      setAmount(remaining.toString());
      setReference(`VIR-${Date.now().toString().slice(-6)}`);
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = Number.parseFloat(amount) || 0;
    if (paymentAmount <= 0) {
      toast.error("Validation Error", { description: "Payment amount must be greater than zero." });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await recordPaymentApi({
        invoiceId: invoice.id,
        amount: paymentAmount,
        paymentMethod: method,
        transactionReference: reference.trim() || `TXN-${Date.now()}`,
      });

      onAddPayment(res.payment, invoice.id, res.updatedInvoice.paidAmount);
      toast.success("Payment Recorded", {
        description: `Payment of ${paymentAmount} EUR recorded for ${invoice.studentName} (${invoice.number}).`,
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Failed to record payment", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingBalance = Math.max(0, invoice.amount - invoice.paidAmount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              Record Tuition Payment
            </DialogTitle>
            <DialogDescription>
              Register settlement for {invoice.number} ({invoice.studentName}). Remaining balance: {remainingBalance}{" "}
              EUR.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay-amt">Collected Amount (EUR) *</Label>
              <Input id="pay-amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-method">Payment Instrument</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentRecordItem["paymentMethod"])}>
                <SelectTrigger id="pay-method">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer (Virement)</SelectItem>
                  <SelectItem value="Direct Debit (SEPA)">Direct Debit (Prélèvement SEPA)</SelectItem>
                  <SelectItem value="OPCO Wire">OPCO / Corporate Wire</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Cashier / Cash">Cashier / Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-ref">Transaction / Reference #</Label>
              <Input
                id="pay-ref"
                placeholder="e.g. VIR-2024-8849"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Validate Settlement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
