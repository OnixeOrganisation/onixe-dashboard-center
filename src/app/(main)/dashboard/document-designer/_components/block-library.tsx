"use client";

import {
  AlignLeft,
  Building,
  Columns,
  DollarSign,
  FileCheck,
  FileSignature,
  Heading,
  Layers,
  Minus,
  Plus,
  Table,
} from "lucide-react";

import type { BlockType, CanvasBlock } from "../types";

interface BlockLibraryProps {
  onAddBlock: (block: CanvasBlock) => void;
}

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  const createBlock = (type: BlockType, overrides?: Partial<CanvasBlock>): CanvasBlock => {
    const id = `b-${Date.now().toString().slice(-6)}`;
    switch (type) {
      case "header":
        return {
          id,
          type: "header",
          content: "{{center.name}}",
          ...overrides,
        };
      case "heading":
        return {
          id,
          type: "heading",
          content: "SECTION TITLE HEADING",
          level: 2,
          textAlign: "left",
          ...overrides,
        };
      case "paragraph":
        return {
          id,
          type: "paragraph",
          content: "This is a certified academic statement issued for {{student.name}} (Matricule: {{student.id}}).",
          textAlign: "left",
          ...overrides,
        };
      case "columns":
        return {
          id,
          type: "columns",
          columnsCount: 2,
          columnRatio: "50/50",
          keyValues: [
            { label: "Left Column Item", value: "{{student.department}}" },
            { label: "Right Column Item", value: "{{student.cohort}}" },
          ],
          ...overrides,
        };
      case "key-values":
        return {
          id,
          type: "key-values",
          keyValues: [
            { label: "Student Name", value: "{{student.name}}" },
            { label: "Student ID", value: "{{student.id}}" },
            { label: "Department", value: "{{student.department}}" },
            { label: "Promotion", value: "{{student.cohort}}" },
          ],
          ...overrides,
        };
      case "grades-table":
        return {
          id,
          type: "grades-table",
          title: "Modular Academic Performance & ECTS Credits",
          ...overrides,
        };
      case "invoice-table":
        return {
          id,
          type: "invoice-table",
          title: "Billed Educational Units & Training Fees",
          ...overrides,
        };
      case "attendance-table":
        return {
          id,
          type: "attendance-table",
          title: "Session Attendance & Telemetry Records",
          ...overrides,
        };
      case "signature-seal":
        return {
          id,
          type: "signature-seal",
          content: "Certified by {{center.deanName}} ({{center.deanTitle}}).",
          hasStamp: true,
          hasQrCode: true,
          hasSignatureBox: true,
          ...overrides,
        };
      case "callout":
        return {
          id,
          type: "callout",
          title: "Important Institutional Notice",
          content: "Official mention: {{exam.juryVerdict}} • Verified under ID {{document.id}}.",
          backgroundColor: "#f0fdf4",
          borderColor: "#86efac",
          ...overrides,
        };
      case "divider":
        return {
          id,
          type: "divider",
          borderColor: "#cbd5e1",
          ...overrides,
        };
    }
  };

  const blockCategories = [
    {
      name: "Layout & Containers",
      items: [
        {
          type: "columns" as BlockType,
          label: "2-Columns Flexbox (50/50)",
          icon: <Columns className="size-4 text-blue-600" />,
          description: "Dual side-by-side flexbox columns.",
        },
        {
          type: "callout" as BlockType,
          label: "Highlighted Callout Card",
          icon: <Layers className="size-4 text-emerald-600" />,
          description: "Bordered box with custom background and notice text.",
        },
        {
          type: "divider" as BlockType,
          label: "Horizontal Divider",
          icon: <Minus className="size-4 text-slate-500" />,
          description: "Visual separation line between sections.",
        },
      ],
    },
    {
      name: "Typography & Text",
      items: [
        {
          type: "heading" as BlockType,
          label: "Section Heading (H1/H2)",
          icon: <Heading className="size-4 text-indigo-600" />,
          description: "Custom styled uppercase section title.",
        },
        {
          type: "paragraph" as BlockType,
          label: "Text Paragraph",
          icon: <AlignLeft className="size-4 text-slate-600" />,
          description: "Multi-line text block with embedded variables.",
        },
        {
          type: "key-values" as BlockType,
          label: "Metadata Key-Values Grid",
          icon: <Table className="size-4 text-amber-600" />,
          description: "Structured student/institution metadata table.",
        },
      ],
    },
    {
      name: "Pedagogical & Financial Data Tables",
      items: [
        {
          type: "grades-table" as BlockType,
          label: "Grades & ECTS Evaluation Matrix",
          icon: <FileCheck className="size-4 text-purple-600" />,
          description: "Module scores, coefficients, and jury validation column.",
        },
        {
          type: "invoice-table" as BlockType,
          label: "Tuition Invoicing Matrix",
          icon: <DollarSign className="size-4 text-green-600" />,
          description: "Hourly training rates, subtotal HT, and VAT exemption.",
        },
        {
          type: "attendance-table" as BlockType,
          label: "OPCO Emargement Grid",
          icon: <Building className="size-4 text-cyan-600" />,
          description: "Attendance sessions, check-in method, and student signatures.",
        },
      ],
    },
    {
      name: "Official Seals & Authenticity",
      items: [
        {
          type: "header" as BlockType,
          label: "Institutional Campus Header",
          icon: <Building className="size-4 text-slate-800" />,
          description: "Campus logo, SIRET, UAI, Qualiopi, and legal address.",
        },
        {
          type: "signature-seal" as BlockType,
          label: "Dean Signature & Official Stamp",
          icon: <FileSignature className="size-4 text-rose-600" />,
          description: "Circular stamp, blockchain QR code, and signature box.",
        },
      ],
    },
  ];

  return (
    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
      <div className="text-muted-foreground text-xs">
        Click any block to append it to your custom document layout. You can then reorder, style, and insert variables.
      </div>

      {blockCategories.map((cat) => (
        <div key={cat.name} className="space-y-2">
          <div className="px-0.5 font-bold text-[11px] text-muted-foreground uppercase tracking-wider">{cat.name}</div>
          <div className="grid grid-cols-1 gap-1.5">
            {cat.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onAddBlock(createBlock(item.type))}
                className="group flex items-start gap-2.5 rounded-lg border bg-card p-2.5 text-left transition-all hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="mt-0.5 shrink-0 rounded-md bg-muted p-1.5 group-hover:bg-primary/10">{item.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between font-semibold text-foreground text-xs">
                    <span>{item.label}</span>
                    <Plus className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
