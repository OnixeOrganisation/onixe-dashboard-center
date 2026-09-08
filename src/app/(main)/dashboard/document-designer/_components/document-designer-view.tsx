"use client";

import * as React from "react";

import {
  Award,
  Building,
  DollarSign,
  Eye,
  FileCheck,
  FileEdit,
  FileSignature,
  FileText,
  Layers,
  Palette,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Settings2,
  Variable,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { printHtmlDocument } from "@/lib/export-engine/print-document";
import { generateDiplomaAttestationHtml } from "@/lib/export-engine/templates/diploma-attestation";
import { generateTranscriptHtml } from "@/lib/export-engine/templates/grade-transcript";
import { generateSchoolCertificateHtml } from "@/lib/export-engine/templates/school-certificate";

import {
  type CanvasBlock,
  type CanvasDocument,
  type DocumentType,
  type FontFamily,
  type PageOrientation,
  STARTER_TEMPLATES,
} from "../types";
import { BlockInspector } from "./block-inspector";
import { BlockLibrary } from "./block-library";
import { CanvasPaper } from "./canvas-paper";
import { VariablesPalette } from "./variables-palette";

export function DocumentDesignerView() {
  const [selectedDocType, setSelectedDocType] = React.useState<DocumentType>("transcript");
  const [currentDoc, setCurrentDoc] = React.useState<CanvasDocument>(STARTER_TEMPLATES.transcript);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>("b-3");
  const [isPreviewMode, setIsPreviewMode] = React.useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [activeTab, setActiveTab] = React.useState<string>("library");

  // Switch template
  const handleSelectTemplate = (type: DocumentType) => {
    setSelectedDocType(type);
    const template = STARTER_TEMPLATES[type] || STARTER_TEMPLATES.custom;
    setCurrentDoc(JSON.parse(JSON.stringify(template)));
    setSelectedBlockId(template.blocks[0]?.id || null);
    toast.info(`Loaded ${template.name}`);
  };

  // Block handlers
  const handleAddBlock = (newBlock: CanvasBlock) => {
    setCurrentDoc((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
    setActiveTab("inspector");
    toast.success(`Added ${newBlock.type} block`);
  };

  const handleUpdateBlock = (updated: CanvasBlock) => {
    setCurrentDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setCurrentDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
      setActiveTab("library");
    }
    toast.info("Block removed from canvas");
  };

  const handleDuplicateBlock = (block: CanvasBlock) => {
    const duplicated: CanvasBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: `b-${Date.now().toString().slice(-6)}`,
    };
    setCurrentDoc((prev) => ({
      ...prev,
      blocks: [...prev.blocks, duplicated],
    }));
    setSelectedBlockId(duplicated.id);
    toast.success("Block duplicated");
  };

  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const index = currentDoc.blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === currentDoc.blocks.length - 1) return;

    const nextBlocks = [...currentDoc.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = nextBlocks[index];
    nextBlocks[index] = nextBlocks[targetIndex];
    nextBlocks[targetIndex] = temp;

    setCurrentDoc((prev) => ({ ...prev, blocks: nextBlocks }));
  };

  const handleInsertVariable = (varKey: string) => {
    if (!selectedBlockId) {
      toast.info("Please select a block first on the canvas to insert this variable.");
      return;
    }
    const block = currentDoc.blocks.find((b) => b.id === selectedBlockId);
    if (!block) return;

    if (block.content !== undefined) {
      handleUpdateBlock({ ...block, content: `${block.content} ${varKey}` });
    } else if (block.keyValues && block.keyValues.length > 0) {
      const updatedKv = [...block.keyValues];
      updatedKv[0].value = varKey;
      handleUpdateBlock({ ...block, keyValues: updatedKv });
    }
    setActiveTab("inspector");
  };

  const handleSaveTemplate = () => {
    try {
      localStorage.setItem(`onixe_template_${currentDoc.documentType}`, JSON.stringify(currentDoc));
      toast.success("Template Saved Successfully", {
        description: `Custom layout for "${currentDoc.name}" has been saved to your institutional library.`,
      });
    } catch {
      toast.error("Failed to save template");
    }
  };

  const handlePrintDocument = () => {
    if (selectedDocType === "transcript") {
      const html = generateTranscriptHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-2024-001",
        cohortName: "Promo Dev Master 2024-A",
        academicYear: "2024 - 2025",
        programTitle: "Master of Science in Software & Cloud Architecture",
        departmentName: "Software Engineering & Distributed Systems",
        courses: [
          {
            courseCode: "DEV-501",
            courseTitle: "Distributed Microservices Architecture with NestJS",
            ectsCredits: 6,
            coefficient: 3,
            grade: 16.5,
            status: "Validated",
            evaluator: "Dr. Alexandre Merceron",
          },
          {
            courseCode: "DEV-502",
            courseTitle: "Cloud Infrastructure, Kubernetes & GitOps",
            ectsCredits: 5,
            coefficient: 2,
            grade: 15.0,
            status: "Validated",
            evaluator: "Dr. Elena Rostova",
          },
        ],
        juryVerdict: "ADMITTED - HONORS (Mention Très Bien)",
      });
      printHtmlDocument({
        title: `Custom_Transcript_${Date.now().toString().slice(-6)}`,
        htmlContent: html,
        pageOrientation: currentDoc.orientation,
      });
    } else if (selectedDocType === "diploma") {
      const html = generateDiplomaAttestationHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-GRAD-001",
        birthDate: "15/04/2001",
        birthPlace: "Paris, France",
        diplomaTitle: "Master of Science in Distributed Software Architecture",
        specialization: "Cloud Infrastructure & AI Engineering",
        rncpLevel: "RNCP Level 7 (Master Degree Equivalent, Bac+5)",
        ectsCredits: 120,
        honors: "Summa Cum Laude (Félicitations du Jury)",
        juryDate: "20 November 2024",
        certificateHash: "0x7F83B1657FF1FC53B92DC18148A1D65DFC2D4B1FA3D677284ADDD200126D9069",
      });
      printHtmlDocument({
        title: `Custom_Diploma_${Date.now().toString().slice(-6)}`,
        htmlContent: html,
        pageOrientation: "landscape",
      });
    } else if (selectedDocType === "certificate") {
      const html = generateSchoolCertificateHtml({
        studentName: "Alexandre Mercier",
        studentId: "STU-2024-001",
        birthDate: "15/04/2001",
        birthPlace: "Paris, France",
        academicYear: "2024 - 2025",
        programTitle: "Master of Science in Software & Cloud Architecture",
        departmentName: "Software Engineering & Distributed Systems",
        degreeLevel: "RNCP Level 7 (Master Degree Equivalent, Bac+5)",
        campusName: "Paris Central Campus - Turing Hub",
        enrollmentStatus: "Apprenticeship CFA",
      });
      printHtmlDocument({
        title: `Custom_Certificate_${Date.now().toString().slice(-6)}`,
        htmlContent: html,
        pageOrientation: "portrait",
      });
    } else {
      toast.success("Print Preview Triggered", {
        description: "Document prepared for high-resolution PDF rendering.",
      });
      window.print();
    }
  };

  const selectedBlock = currentDoc.blocks.find((b) => b.id === selectedBlockId) || null;
  const selectedBlockIndex = currentDoc.blocks.findIndex((b) => b.id === selectedBlockId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 font-bold text-2xl tracking-tight">
            <FileSignature className="size-6 text-primary" />
            Institutional Document Studio & Visual Canvas Builder
          </h1>
          <p className="text-muted-foreground text-sm">
            Drag-and-drop Elementor-style canvas builder. Compose custom layouts, align flexbox containers, and map
            dynamic student & institutional variables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preview vs Design Switch */}
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              toast.info(isPreviewMode ? "Design & Tokens Mode" : "Live Simulation with Sample Data");
            }}
          >
            {isPreviewMode ? <FileEdit className="size-3.5" /> : <Eye className="size-3.5" />}
            {isPreviewMode ? "Edit Design & Tokens" : "Simulate Real Data"}
          </Button>

          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrintDocument}>
            <Printer className="size-3.5" />
            Print / PDF
          </Button>

          <Button size="sm" className="gap-1.5" onClick={handleSaveTemplate}>
            <Save className="size-3.5" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Template Quick Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="shrink-0 font-semibold text-muted-foreground text-xs">Document Model:</span>
        <div className="flex flex-1 items-center gap-1.5">
          <Button
            type="button"
            variant={selectedDocType === "transcript" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("transcript")}
          >
            <FileCheck className="size-3.5" />
            Grade Transcript
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "certificate" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("certificate")}
          >
            <FileText className="size-3.5" />
            School Certificate
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "diploma" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("diploma")}
          >
            <Award className="size-3.5" />
            Graduation Parchment
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "invoice" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("invoice")}
          >
            <DollarSign className="size-3.5" />
            Tuition Invoice
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "attendance" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("attendance")}
          >
            <Building className="size-3.5" />
            OPCO Attendance
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "internship" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("internship")}
          >
            <FileSignature className="size-3.5" />
            Internship Agreement
          </Button>
          <Button
            type="button"
            variant={selectedDocType === "custom" ? "default" : "outline"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => handleSelectTemplate("custom")}
          >
            <Plus className="size-3.5" />
            Blank Canvas
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Side: 4 Columns Builder Palette */}
        <div className="flex h-[820px] flex-col lg:col-span-4">
          <Card className="flex h-full flex-col border-border/80 shadow-xs">
            <CardHeader className="border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-semibold text-sm">Elementor Studio Palette</CardTitle>
                  <CardDescription className="text-xs">Blocks, dynamic tokens, and element styles.</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {currentDoc.blocks.length} Blocks
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full flex-1 flex-col">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-muted/30 p-1">
                  <TabsTrigger value="library" className="gap-1 py-1.5 text-xs">
                    <Layers className="size-3" />
                    Blocks
                  </TabsTrigger>
                  <TabsTrigger value="variables" className="gap-1 py-1.5 text-xs">
                    <Variable className="size-3 text-primary" />
                    Variables
                  </TabsTrigger>
                  <TabsTrigger value="inspector" className="gap-1 py-1.5 text-xs">
                    <Settings2 className="size-3" />
                    Edit Block
                  </TabsTrigger>
                  <TabsTrigger value="page" className="gap-1 py-1.5 text-xs">
                    <Palette className="size-3" />
                    Page
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: Blocks Library */}
                <TabsContent value="library" className="m-0 flex-1 overflow-y-auto p-3">
                  <BlockLibrary onAddBlock={handleAddBlock} />
                </TabsContent>

                {/* TAB 2: Variables Palette */}
                <TabsContent value="variables" className="m-0 flex-1 overflow-y-auto p-3">
                  <VariablesPalette onInsertVariable={handleInsertVariable} />
                </TabsContent>

                {/* TAB 3: Block Inspector */}
                <TabsContent value="inspector" className="m-0 flex-1 overflow-y-auto p-3">
                  <BlockInspector
                    block={selectedBlock}
                    onUpdateBlock={handleUpdateBlock}
                    onDeleteBlock={handleDeleteBlock}
                    onDuplicateBlock={handleDuplicateBlock}
                    onMoveBlock={handleMoveBlock}
                    isFirst={selectedBlockIndex === 0}
                    isLast={selectedBlockIndex === currentDoc.blocks.length - 1}
                  />
                </TabsContent>

                {/* TAB 4: Page Settings */}
                <TabsContent value="page" className="m-0 flex-1 space-y-4 overflow-y-auto p-4 text-xs">
                  <div className="space-y-1.5">
                    <Label>Page Orientation</Label>
                    <Select
                      value={currentDoc.orientation}
                      onValueChange={(val) =>
                        setCurrentDoc((prev) => ({ ...prev, orientation: val as PageOrientation }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">A4 Portrait (210 × 297 mm)</SelectItem>
                        <SelectItem value="landscape">A4 Landscape (297 × 210 mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Typography Style</Label>
                    <Select
                      value={currentDoc.fontFamily}
                      onValueChange={(val) => setCurrentDoc((prev) => ({ ...prev, fontFamily: val as FontFamily }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Modern Sans-Serif (Geist / Inter)</SelectItem>
                        <SelectItem value="serif">Academic Serif (Playfair / Garamond)</SelectItem>
                        <SelectItem value="mono">Technical Monospace (GeistMono)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Primary Brand Color</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentDoc((prev) => ({ ...prev, primaryColor: "#0f172a", accentColor: "#2563eb" }))
                        }
                        className={`flex items-center gap-2 rounded border p-2 text-left ${
                          currentDoc.primaryColor === "#0f172a" ? "border-primary bg-primary/5 font-semibold" : ""
                        }`}
                      >
                        <div className="size-3.5 rounded-full bg-[#0f172a]" />
                        <span>Onixe Navy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentDoc((prev) => ({ ...prev, primaryColor: "#064e3b", accentColor: "#059669" }))
                        }
                        className={`flex items-center gap-2 rounded border p-2 text-left ${
                          currentDoc.primaryColor === "#064e3b" ? "border-primary bg-primary/5 font-semibold" : ""
                        }`}
                      >
                        <div className="size-3.5 rounded-full bg-[#064e3b]" />
                        <span>Emerald CFA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentDoc((prev) => ({ ...prev, primaryColor: "#4c0519", accentColor: "#be123c" }))
                        }
                        className={`flex items-center gap-2 rounded border p-2 text-left ${
                          currentDoc.primaryColor === "#4c0519" ? "border-primary bg-primary/5 font-semibold" : ""
                        }`}
                      >
                        <div className="size-3.5 rounded-full bg-[#4c0519]" />
                        <span>Bordeaux</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentDoc((prev) => ({ ...prev, primaryColor: "#312e81", accentColor: "#6366f1" }))
                        }
                        className={`flex items-center gap-2 rounded border p-2 text-left ${
                          currentDoc.primaryColor === "#312e81" ? "border-primary bg-primary/5 font-semibold" : ""
                        }`}
                      >
                        <div className="size-3.5 rounded-full bg-[#312e81]" />
                        <span>Royal Indigo</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded border bg-card p-2">
                    <span>Guilloché Security Watermark</span>
                    <Switch
                      checked={currentDoc.showWatermark}
                      onCheckedChange={(checked) => setCurrentDoc((prev) => ({ ...prev, showWatermark: checked }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: 8 Columns Live Canvas */}
        <div className="flex h-[820px] flex-col overflow-hidden rounded-xl border bg-card shadow-xs lg:col-span-8">
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between border-b bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">Canvas View:</span>
              <Badge variant={isPreviewMode ? "default" : "secondary"} className="text-xs">
                {isPreviewMode ? "Live Simulation (Real Data)" : "Elementor Builder Mode (Dynamic Tokens)"}
              </Badge>
              <span className="hidden text-[11px] text-muted-foreground sm:inline">
                • {currentDoc.orientation.toUpperCase()}
              </span>
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

          {/* Canvas Scroll Paper Area */}
          <CanvasPaper
            document={currentDoc}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(id) => {
              setSelectedBlockId(id);
              setActiveTab("inspector");
            }}
            onDeleteBlock={handleDeleteBlock}
            isPreviewMode={isPreviewMode}
            zoomLevel={zoomLevel}
          />
        </div>
      </div>
    </div>
  );
}
