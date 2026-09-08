"use client";

import * as React from "react";

import {
  CheckCircle2,
  Download,
  GraduationCap,
  MoreHorizontal,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToCsv } from "@/lib/export-engine/export-csv";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateDiplomaAttestationHtml } from "@/lib/export-engine/templates/diploma-attestation";

import { type DiplomaItem, INITIAL_DIPLOMAS } from "./data";
import { IssueDiplomaDialog } from "./issue-diploma-dialog";
import { VerifyDiplomaDialog } from "./verify-diploma-dialog";

export function CertificationsList() {
  const [diplomas, setDiplomas] = React.useState<DiplomaItem[]>(INITIAL_DIPLOMAS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDiploma, setSelectedDiploma] = React.useState<DiplomaItem | null>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = React.useState(false);

  const handleIssueDiploma = (newDip: DiplomaItem) => {
    setDiplomas([newDip, ...diplomas]);
  };

  const handleExportRegistry = () => {
    exportToCsv("Diplomas_And_Credentials_Registry", diplomas, [
      { key: "certificateNumber", label: "Certificate Number" },
      { key: "studentName", label: "Graduate Name" },
      { key: "degreeTitle", label: "Conferred Degree" },
      { key: "cohort", label: "Cohort" },
      { key: "graduationDate", label: "Conferral Date" },
      { key: "honors", label: "Academic Honors" },
      { key: "cryptoHash", label: "Blockchain Verification Hash" },
      { key: "status", label: "Status" },
    ]);
    toast.success("Credentials Registry Exported", {
      description: "Downloaded registered diplomas ledger as CSV/Excel.",
    });
  };

  const handlePrintParchment = (dip: DiplomaItem) => {
    const html = generateDiplomaAttestationHtml({
      studentName: dip.studentName,
      studentId: `STU-GRAD-${dip.id}`,
      birthDate: "12/06/2000",
      birthPlace: "Paris, France",
      diplomaTitle: dip.degreeTitle,
      specialization: "Advanced Distributed Systems & AI Engineering",
      rncpLevel: "Level 7 (Master of Science Equivalent, EQF Level 7)",
      ectsCredits: 120,
      honors: dip.honors,
      juryDate: dip.graduationDate,
      certificateHash: dip.cryptoHash,
    });

    printHtmlDocument({
      title: `Diploma_${dip.certificateNumber}_${dip.studentName.replace(/\s+/g, "_")}`,
      htmlContent: html,
      pageOrientation: "landscape",
    });

    toast.success("Official Parchment Generated", {
      description: `Official certified diploma generated for ${dip.studentName}.`,
    });
  };

  const filteredDiplomas = diplomas.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.studentName.toLowerCase().includes(q) ||
      d.certificateNumber.toLowerCase().includes(q) ||
      d.degreeTitle.toLowerCase().includes(q) ||
      d.cohort.toLowerCase().includes(q)
    );
  });

  const totalDiplomas = diplomas.length;
  const summaCumLaude = diplomas.filter((d) => d.honors.includes("Summa Cum Laude")).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Diplomas & Certified Credentials</h1>
          <p className="text-muted-foreground text-sm">
            Deliver digitally signed parchments, cryptographic verification seals, and academic degree records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportRegistry}>
            <Download className="size-4" />
            Export Registry
          </Button>
          <IssueDiplomaDialog onIssueDiploma={handleIssueDiploma} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Conferred Degrees
            </span>
            <GraduationCap className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{totalDiplomas}</div>
          <div className="mt-1 text-muted-foreground text-xs">Official academic parchments</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Cryptographic Seals
            </span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">100%</div>
          <div className="mt-1 font-medium text-emerald-600 text-xs">Verifiable on public ledger</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Summa Cum Laude</span>
            <Sparkles className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">{summaCumLaude}</div>
          <div className="mt-1 font-medium text-purple-600 text-xs">Félicitations du Jury</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Verification Audits
            </span>
            <CheckCircle2 className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 font-bold text-2xl tracking-tight">Active</div>
          <div className="mt-1 text-muted-foreground text-xs">Public hash lookup active</div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 pb-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Conferred Degrees Registry</CardTitle>
            <div className="relative min-w-[260px]">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search diploma, recipient, degree..."
                className="h-9 pl-8 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Certificate / Recipient</TableHead>
                  <TableHead>Conferred Degree Title</TableHead>
                  <TableHead>Graduating Cohort</TableHead>
                  <TableHead>Honors Conferred</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiplomas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No diplomas found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDiplomas.map((dip) => (
                    <TableRow key={dip.id}>
                      <TableCell>
                        <div className="grid gap-0.5 text-xs">
                          <span className="font-semibold text-foreground text-sm">{dip.studentName}</span>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="font-mono text-[11px]">{dip.certificateNumber}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">{dip.studentMatricule}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-foreground text-xs">{dip.degreeTitle}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-muted-foreground text-xs">{dip.cohort}</span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-purple-600/30 bg-purple-500/10 text-purple-600 text-xs dark:text-purple-400"
                        >
                          {dip.honors}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-emerald-600/30 bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400"
                        >
                          {dip.status}
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
                                setSelectedDiploma(dip);
                                setVerifyDialogOpen(true);
                              }}
                            >
                              Verify Proof & Hash
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrintParchment(dip)}>
                              <Printer className="mr-2 size-3.5" />
                              Print Official Parchment (PDF)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Verify Proof Modal */}
      <VerifyDiplomaDialog diploma={selectedDiploma} open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen} />
    </div>
  );
}
