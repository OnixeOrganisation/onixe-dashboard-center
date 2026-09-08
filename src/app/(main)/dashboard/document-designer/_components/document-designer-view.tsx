"use client";

import * as React from "react";

import {
  Award,
  Building,
  DollarSign,
  FileCheck,
  FileSignature,
  FileText,
  Printer,
  RotateCcw,
  Save,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateAttendanceSheetHtml } from "@/lib/export-engine/templates/attendance-sheet";
import { generateDiplomaAttestationHtml } from "@/lib/export-engine/templates/diploma-attestation";
import { generateTranscriptHtml } from "@/lib/export-engine/templates/grade-transcript";
import { generateSchoolCertificateHtml } from "@/lib/export-engine/templates/school-certificate";

import { type CenterBrandingSettings, DEFAULT_BRANDING, DOCUMENT_TYPE_OPTIONS, type DocumentType } from "../types";
import { DesignerControls } from "./designer-controls";
import { DocumentPreviewCanvas } from "./document-preview-canvas";

export function DocumentDesignerView() {
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentType>("invoice");
  const [branding, setBranding] = React.useState<CenterBrandingSettings>(DEFAULT_BRANDING);
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);

  // Load persisted branding from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("onixe_center_branding");
      if (saved) {
        setBranding(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUpdateBranding = (updated: Partial<CenterBrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setBranding(DEFAULT_BRANDING);
    toast.info("Branding Reset", {
      description: "Center identity and visual preferences restored to defaults.",
    });
  };

  const handleSavePreset = () => {
    try {
      localStorage.setItem("onixe_center_branding", JSON.stringify(branding));
      toast.success("Institutional Template Saved", {
        description: `Visual theme and accreditation parameters updated for ${branding.centerName}.`,
      });
    } catch {
      toast.error("Failed to save institutional template");
    }
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === "french-cfa") {
      setBranding((prev) => ({
        ...prev,
        colorTheme: "emerald",
        primaryColor: "#064e3b",
        accentColor: "#059669",
        fontFamily: "sans",
        tagline: "Higher Academy of Computer Sciences & CFA Apprenticeship Center",
        qualiopiId: "QUALIOPI-FR-2024-8891",
        rncpLevelTitle: "Level 7 (Master of Science Equivalent, EQF Level 7)",
      }));
      toast.success("Preset Applied: French CFA & Higher Ed");
    } else if (presetName === "tech-institute") {
      setBranding((prev) => ({
        ...prev,
        colorTheme: "navy",
        primaryColor: "#0f172a",
        accentColor: "#2563eb",
        fontFamily: "mono",
        tagline: "Center for Advanced Cloud Architecture & AI Engineering",
        rncpLevelTitle: "Master of Science (M.Sc. EQF Level 7)",
      }));
      toast.success("Preset Applied: International Tech Academy");
    } else if (presetName === "executive-school") {
      setBranding((prev) => ({
        ...prev,
        colorTheme: "bordeaux",
        primaryColor: "#4c0519",
        accentColor: "#be123c",
        fontFamily: "serif",
        tagline: "Executive Institute of Applied Leadership & Computer Technologies",
        rncpLevelTitle: "Executive Master of Science (RNCP Niveau 7)",
      }));
      toast.success("Preset Applied: Executive Business School");
    }
  };

  const handlePrintCurrentDocument = () => {
    if (selectedDoc === "attendance") {
      const html = generateAttendanceSheetHtml({
        cohortName: "Promo Dev Master 2024-A",
        period: "November 2024",
        courseName: "Distributed Microservices Architecture with NestJS",
        instructorName: "Dr. Alexandre Merceron",
        records: [
          {
            studentName: "Lucas Moreau",
            studentId: "STU-2024-001",
            courseName: "Distributed Microservices Architecture",
            date: "18/11/2024",
            timeSlot: "09:00 - 12:30",
            status: "Present",
            method: "Digital PIN",
          },
          {
            studentName: "Amina Diallo",
            studentId: "STU-2024-002",
            courseName: "Distributed Microservices Architecture",
            date: "18/11/2024",
            timeSlot: "09:00 - 12:30",
            status: "Present",
            method: "Digital PIN",
          },
        ],
      });
      printHtmlDocument({
        title: `Attendance_Template_${branding.centerName.replace(/\s+/g, "_")}`,
        htmlContent: html,
        pageOrientation: "portrait",
      });
    } else if (selectedDoc === "transcript") {
      const html = generateTranscriptHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-2024-001",
        cohortName: "Promo Dev Master 2024-A",
        academicYear: branding.academicYear,
        programTitle: "Master of Science in Software & Cloud Architecture",
        departmentName: "Software Engineering",
        courses: [
          {
            courseCode: "DEV-501",
            courseTitle: "Distributed Microservices Architecture",
            ectsCredits: 6,
            coefficient: 3,
            grade: 16.5,
            status: "Validated",
            evaluator: "Dr. Alexandre Merceron",
          },
        ],
        juryVerdict: "ADMITTED - HONORS (Mention Bien)",
      });
      printHtmlDocument({
        title: `Transcript_Template_${branding.centerName.replace(/\s+/g, "_")}`,
        htmlContent: html,
        pageOrientation: "portrait",
      });
    } else if (selectedDoc === "diploma") {
      const html = generateDiplomaAttestationHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-GRAD-001",
        birthDate: "15/04/2001",
        birthPlace: "Paris, France",
        diplomaTitle: "Master of Science in Distributed Software Architecture",
        specialization: "Cloud & Distributed Microservices",
        rncpLevel: branding.rncpLevelTitle,
        ectsCredits: 120,
        honors: "Summa Cum Laude (Félicitations du Jury)",
        juryDate: "20 November 2024",
        certificateHash: "0x7F83B1657FF1FC53B92DC18148A1D65DFC2D4B1FA3D677284ADDD200126D9069",
      });
      printHtmlDocument({
        title: `Diploma_Template_${branding.centerName.replace(/\s+/g, "_")}`,
        htmlContent: html,
        pageOrientation: "landscape",
      });
    } else if (selectedDoc === "certificate") {
      const html = generateSchoolCertificateHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-2024-001",
        birthDate: "15/04/2001",
        birthPlace: "Paris, France",
        academicYear: branding.academicYear,
        programTitle: "Master of Science in Software & Cloud Architecture",
        departmentName: "Software Engineering",
        degreeLevel: branding.rncpLevelTitle,
        campusName: "Paris Central Campus - Turing Hub",
        enrollmentStatus: "Apprenticeship CFA",
      });
      printHtmlDocument({
        title: `School_Certificate_Template_${branding.centerName.replace(/\s+/g, "_")}`,
        htmlContent: html,
        pageOrientation: "portrait",
      });
    } else {
      toast.success("Document Print Engine Triggered", {
        description: `Ready to print or save high-resolution PDF for ${selectedDoc}.`,
      });
      window.print();
    }
  };

  const getDocIcon = (doc: DocumentType) => {
    switch (doc) {
      case "invoice":
        return <DollarSign className="size-4" />;
      case "transcript":
        return <FileCheck className="size-4" />;
      case "certificate":
        return <FileText className="size-4" />;
      case "diploma":
        return <Award className="size-4" />;
      case "attendance":
        return <Building className="size-4" />;
      case "internship":
        return <FileSignature className="size-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 font-bold text-2xl tracking-tight">
            <FileSignature className="size-6 text-primary" />
            Institutional Document Studio & Designer
          </h1>
          <p className="text-muted-foreground text-sm">
            Design, brand, and preview certified invoices, transcripts, diplomas, certificates, and OPCO attendance
            sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrintCurrentDocument}>
            <Printer className="size-3.5" />
            Print Sample PDF
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleSavePreset}>
            <Save className="size-3.5" />
            Save Institutional Theme
          </Button>
        </div>
      </div>

      {/* Document Type Selector Bar */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {DOCUMENT_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelectedDoc(opt.id)}
            className={`flex flex-col rounded-lg border p-3 text-left transition-all ${
              selectedDoc === opt.id
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                : "border-border/70 hover:border-border hover:bg-muted/40"
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div
                className={`rounded-md p-1.5 ${
                  selectedDoc === opt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {getDocIcon(opt.id)}
              </div>
              <Badge variant="outline" className="font-mono text-[10px] capitalize">
                {opt.orientation}
              </Badge>
            </div>
            <span className="line-clamp-1 font-semibold text-foreground text-xs leading-tight">{opt.title}</span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">{opt.category}</span>
          </button>
        ))}
      </div>

      {/* Main Studio Workspace: Controls (Left) & Canvas Preview (Right) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: 4 Cols */}
        <div className="h-[780px] lg:col-span-4">
          <DesignerControls
            branding={branding}
            onChange={handleUpdateBranding}
            onReset={handleReset}
            onApplyPreset={handleApplyPreset}
          />
        </div>

        {/* Right: 8 Cols Live Interactive Canvas */}
        <div className="flex h-[780px] flex-col overflow-hidden rounded-xl border bg-card shadow-xs lg:col-span-8">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between border-b bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">Live Interactive Canvas:</span>
              <Badge variant="secondary" className="font-normal text-xs">
                {DOCUMENT_TYPE_OPTIONS.find((d) => d.id === selectedDoc)?.title}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
                title="Zoom Out"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="px-1 font-mono text-muted-foreground text-xs">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setZoomLevel(100)}
                title="Reset Zoom"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <DocumentPreviewCanvas branding={branding} selectedDoc={selectedDoc} zoomLevel={zoomLevel} />
        </div>
      </div>
    </div>
  );
}
