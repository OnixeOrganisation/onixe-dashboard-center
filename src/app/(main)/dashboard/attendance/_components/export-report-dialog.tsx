"use client";

import * as React from "react";

import { Download, FileText } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ExportReportDialog() {
  const [open, setOpen] = React.useState(false);
  const [cohort, setCohort] = React.useState("Promo Dev Master 2024-A");
  const [period, setPeriod] = React.useState("November 2024");
  const [format, setFormat] = React.useState("OPCO Standard PDF Certificate");

  const handleExport = () => {
    toast.success("Attendance Compliance Report Generated", {
      description: `Certified monthly attendance report for ${cohort} (${period}) generated for institutional/OPCO submission.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          Export OPCO Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Generate Compliance Certificate
          </DialogTitle>
          <DialogDescription>
            Export certified monthly or quarterly attendance certificates for apprenticeship funding bodies and
            corporate sponsors.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="rep-cohort">Target Cohort</Label>
            <Select value={cohort} onValueChange={setCohort}>
              <SelectTrigger id="rep-cohort">
                <SelectValue placeholder="Select Cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Promo Dev Master 2024-A">Promo Dev Master 2024-A</SelectItem>
                <SelectItem value="Promo Dev Master 2024-B">Promo Dev Master 2024-B</SelectItem>
                <SelectItem value="Promo Cloud & DevOps 2024-A">Promo Cloud & DevOps 2024-A</SelectItem>
                <SelectItem value="Promo Cyber Ops 2024-A">Promo Cyber Ops 2024-A</SelectItem>
                <SelectItem value="Promo Data & AI 2024-A">Promo Data & AI 2024-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-period">Reporting Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="rep-period">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="November 2024">November 2024 (Current)</SelectItem>
                <SelectItem value="October 2024">October 2024</SelectItem>
                <SelectItem value="September 2024">September 2024</SelectItem>
                <SelectItem value="Q4 2024 (Full Quarter)">Q4 2024 (Full Quarter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-fmt">Certificate Template</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="rep-fmt">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPCO Standard PDF Certificate">
                  OPCO / CFA Certified PDF with Digital Stamp
                </SelectItem>
                <SelectItem value="Excel Detailed Telemetry Matrix">
                  Excel Detailed Hourly Telemetry Matrix (.xlsx)
                </SelectItem>
                <SelectItem value="Employer Sponsor Monthly Summary">Employer Sponsor Monthly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-1.5">
            <Download className="size-3.5" />
            Download Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
