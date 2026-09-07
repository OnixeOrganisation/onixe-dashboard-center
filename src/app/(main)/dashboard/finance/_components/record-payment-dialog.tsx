"use client";

import * as React from "react";

import { Receipt } from "lucide-react";
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

  React.useEffect(() => {
    if (invoice) {
      const remaining = invoice.amount - invoice.paidAmount;
      setAmount(remaining.toString());
      setReference(`VIR-${Date.now().toString().slice(-6)}`);
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = Number.parseFloat(amount) || 0;
    if (paymentAmount <= 0) {
      toast.error("Validation Error", { description: "Payment amount must be greater than zero." });
      return;
    }

    const newPayment: PaymentRecordItem = {
      id: `pay-${Date.now()}`,
      invoiceNumber: invoice.number,
      studentName: invoice.studentName,
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: method,
      transactionReference: reference.trim() || `TXN-${Date.now()}`,
      status: "Settled",
    };

    onAddPayment(newPayment, invoice.id, invoice.paidAmount + paymentAmount);
    toast.success("Payment Recorded", {
      description: `Payment of ${paymentAmount} EUR recorded for ${invoice.studentName} (${invoice.number}).`,
    });
    onOpenChange(false);
  };

  const remainingBalance = invoice.amount - invoice.paidAmount;

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
                  <SelectItem value="Bank Transfer">Bank Wire Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card / POS</SelectItem>
                  <SelectItem value="OPCO Wire">OPCO Direct Wire</SelectItem>
                  <SelectItem value="Direct Debit (SEPA)">Direct Debit (SEPA)</SelectItem>
                  <SelectItem value="Cashier / Cash">Cash at Bursar Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-ref">Transaction Reference / Receipt ID</Label>
              <Input
                id="pay-ref"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="TXN-FR-889021"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Payment Receipt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
