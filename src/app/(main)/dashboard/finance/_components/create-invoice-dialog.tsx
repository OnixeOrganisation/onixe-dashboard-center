"use client";

import * as React from "react";

import { FilePlus, Plus } from "lucide-react";
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
  const [studentName, setStudentName] = React.useState("");
  const [studentMatricule, setStudentMatricule] = React.useState("");
  const [cohort, setCohort] = React.useState(COHORTS[0]);
  const [sponsor, setSponsor] = React.useState("OPCO Atlas (Apprenticeship)");
  const [amount, setAmount] = React.useState("9500");
  const [dueDate, setDueDate] = React.useState("2024-12-31");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      toast.error("Validation Error", { description: "Student name is required." });
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      number: `INV-2024-${randomNum}`,
      studentName: studentName.trim(),
      studentMatricule: studentMatricule.trim() || `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      cohort,
      sponsor: sponsor.trim() || "Personal Tuition",
      amount: Number.parseFloat(amount) || 9000,
      paidAmount: 0,
      dueDate,
      issueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    onAddInvoice(newInv);
    toast.success("Tuition Invoice Issued", {
      description: `Invoice ${newInv.number} (${newInv.amount} EUR) generated for ${newInv.studentName}.`,
    });

    setStudentName("");
    setStudentMatricule("");
    setOpen(false);
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
                <Label htmlFor="inv-name">Learner Full Name *</Label>
                <Input
                  id="inv-name"
                  placeholder="e.g. Lucas Moreau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-mat">Learner Matricule</Label>
                <Input
                  id="inv-mat"
                  placeholder="STU-2024-001"
                  value={studentMatricule}
                  onChange={(e) => setStudentMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-cohort">Cohort</Label>
                <Select value={cohort} onValueChange={setCohort}>
                  <SelectTrigger id="inv-cohort">
                    <SelectValue placeholder="Select Cohort" />
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
                <Label htmlFor="inv-sponsor">Funding Body / Sponsor</Label>
                <Input
                  id="inv-sponsor"
                  placeholder="OPCO Atlas, Enterprise, or Self-Funded"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-amt">Invoice Amount (EUR) *</Label>
                <Input id="inv-amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inv-due">Payment Due Date</Label>
                <Input id="inv-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Issue Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
