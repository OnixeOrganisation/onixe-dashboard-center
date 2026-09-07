"use client";

import { Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { DiplomaItem } from "./data";

interface VerifyDiplomaDialogProps {
  diploma: DiplomaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerifyDiplomaDialog({ diploma, open, onOpenChange }: VerifyDiplomaDialogProps) {
  if (!diploma) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(diploma.cryptoHash);
    toast.success("Cryptographic Hash Copied", {
      description: "Hash copied to clipboard for verification audits.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {diploma.certificateNumber}
            </Badge>
            <Badge
              variant="secondary"
              className="border-emerald-600/30 bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400"
            >
              Cryptographically Authenticated
            </Badge>
          </div>
          <DialogTitle className="text-xl">{diploma.degreeTitle}</DialogTitle>
          <DialogDescription>
            Conferred upon {diploma.studentName} ({diploma.studentMatricule}) • {diploma.cohort}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Degree Seal Details */}
          <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Honors Conferred</span>
              <span className="font-bold text-foreground">{diploma.honors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Graduation Date</span>
              <span className="font-medium text-foreground">{diploma.graduationDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Issuing Authority</span>
              <span className="font-medium text-foreground">Onixe Higher Institute of Technology</span>
            </div>
          </div>

          {/* Cryptographic Proof */}
          <div className="space-y-2 rounded-xl border bg-card p-3.5">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                Immutable Digital Certificate Proof
              </span>
              <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-[11px]" onClick={handleCopyHash}>
                <Copy className="size-3" />
                Copy
              </Button>
            </div>
            <div className="break-all rounded-md bg-muted/30 p-2.5 font-mono text-[11px] text-muted-foreground leading-relaxed">
              {diploma.cryptoHash}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              toast.success("PDF Parchment Downloaded", {
                description: `Official sealed degree certificate for ${diploma.studentName} downloaded.`,
              });
            }}
          >
            Download Digital Parchment (PDF)
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
