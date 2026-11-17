"use client";

import * as React from "react";

import { FilePlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { InvoiceItem } from "./data";
import { financeApi } from "./finance.api";

interface CreateInvoiceDialogProps {
  onAddInvoice: (inv: InvoiceItem) => void;
}

const COHORTS = [
  "Promo Dev Master 2024-A",
  "Promo Cloud & DevOps 2024-A",
  "Promo Cyber Ops 2024-A",
  "Promo Data & AI 2024-A",
  "Promo UX Product 2024-A",
];

export function CreateInvoiceDialog({ onAddInvoice }: CreateInvoiceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [cohort, setCohort] = React.useState(COHORTS[0]);
  const [sponsor, setSponsor] = React.useState("OPCO Atlas (Apprenticeship)");
  const [amount, setAmount] = React.useState("9500");
  const [dueDate, setDueDate] = React.useState("2024-12-31");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Validation Error", { description: "Student name is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await financeApi.createInvoice({
        studentName: studentName.trim(),
        studentMatricule: studentMatricule.trim() || undefined,
        cohort,
        sponsor: sponsor.trim() || "Personal Tuition",
        amount: Number.parseFloat(amount) || 9000,
        dueDate,
      });

      onAddInvoice(created);
      toast.success("Tuition Invoice Issued", {
        description: `Invoice ${created.number} (${created.amount} EUR) generated for ${created.studentName}.`,
      });

      setStudentName("");
      setStudentMatricule("");
      setOpen(false);
    } catch (err: any) {
      toast.error("Failed to issue invoice", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Issue Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePlus className="size-5 text-primary" />
              Issue Tuition & Apprenticeship Invoice
            </DialogTitle>
            <DialogDescription>
              Generate an official tuition invoice for a self-funded learner or corporate/OPCO funding body.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-student">Student / Learner Name *</Label>
                <Input
                  id="inv-student"
                  placeholder="e.g. Lucas Moreau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inv-mat">Student ID / Matricule</Label>
                <Input
                  id="inv-mat"
                  placeholder="e.g. STU-2024-001"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-cohort">Cohort / Class</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="inv-cohort">
                    <SelectValue placeholder="Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {COHORTS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inv-sponsor">Billing Entity / Sponsor</Label>
                <Input
                  id="inv-sponsor"
                  placeholder="OPCO Atlas, Self-Funded, etc."
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-amount">Tuition Fee (EUR) *</Label>
                <Input
                  id="inv-amount"
                  type="number"
                  placeholder="9500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inv-due">Payment Due Date *</Label>
                <Input id="inv-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Issuing...
                </>
              ) : (
                "Issue Official Invoice"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
