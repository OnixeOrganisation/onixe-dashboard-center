"use client";

import * as React from "react";

import { Plus, QrCode } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { type CanvasBlock, type CanvasDocument, DYNAMIC_VARIABLES } from "../types";

interface CanvasPaperProps {
  document: CanvasDocument;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  isPreviewMode: boolean; // false = Template Design mode with {{variables}}, true = Live Simulation with real data
  zoomLevel: number;
}

const getFontClass = (fontFamily?: string) => {
  if (fontFamily === "serif") return "font-serif";
  if (fontFamily === "mono") return "font-mono";
  return "font-sans";
};

const getAlignClass = (align?: string) => {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
};

const getSelectionClass = (isSelected: boolean, isPreview: boolean) => {
  if (isPreview) return "";
  if (isSelected) return "bg-primary/[0.02] ring-2 ring-primary ring-offset-2";
  return "hover:bg-muted/10 hover:ring-1 hover:ring-primary/40";
};

export function CanvasPaper({ document, selectedBlockId, onSelectBlock, isPreviewMode, zoomLevel }: CanvasPaperProps) {
  const isLandscape = document.orientation === "landscape";

  // Build variable lookup dictionary for preview interpolation
  const varMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const v of DYNAMIC_VARIABLES) {
      map[v.key] = v.exampleValue;
    }
    return map;
  }, []);

  // Interpolation helper
  const interpolateText = (text?: string): string => {
    if (!text) return "";
    if (!isPreviewMode) return text;

    let result = text;
    for (const [key, val] of Object.entries(varMap)) {
      result = result.replaceAll(key, val);
    }
    return result;
  };

  const fontClass = getFontClass(document.fontFamily);

  return (
    <div className="flex min-h-[640px] flex-1 flex-col items-center justify-start overflow-auto bg-muted/20 p-4 sm:p-8">
      {/* Visual Canvas Paper */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease-out",
        }}
        className={`border border-border/60 bg-white text-slate-900 shadow-xl transition-all ${fontClass} ${
          isLandscape ? "min-h-[680px] w-[960px] p-10" : "min-h-[1020px] w-[760px] p-10"
        } relative flex select-none flex-col justify-between space-y-5`}
      >
        {/* Security Watermark */}
        {document.showWatermark && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
            <div className="rotate-[-30deg] select-none font-black text-[110px] text-slate-900 uppercase tracking-widest">
              ONIXE SECURE
            </div>
          </div>
        )}

        {/* Blocks Rendering Stream */}
        <div className="flex-1 space-y-4">
          {document.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground">
              <Plus className="mb-2 size-8 opacity-40" />
              <p className="font-semibold text-foreground text-xs">Empty Document Canvas</p>
              <p className="mt-1 max-w-sm text-[11px]">
                Add layout rows, typography headers, key-value tables, or seal blocks from the left library to build
                your document.
              </p>
            </div>
          ) : (
            document.blocks.map((block) => {
              const isSelected = selectedBlockId === block.id;
              const selectionStyle = getSelectionClass(isSelected, isPreviewMode);

              return (
                // biome-ignore lint/a11y/useSemanticElements: Canvas block wrapper contains child tables, headers, and seals
                <div
                  key={block.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onSelectBlock(block.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group relative w-full cursor-pointer rounded-md text-left transition-all ${selectionStyle}`}
                >
                  {/* Block Type Badge & Delete button on Hover (Design Mode only) */}
                  {!isPreviewMode && isSelected && (
                    <div className="absolute -top-3 left-2 z-10 flex items-center gap-1">
                      <Badge variant="default" className="h-4 px-1.5 py-0 font-mono text-[9px] uppercase">
                        {block.type}
                      </Badge>
                    </div>
                  )}

                  {/* Render Specific Block */}
                  <RenderBlock block={block} interpolate={interpolateText} doc={document} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

interface RenderBlockProps {
  block: CanvasBlock;
  interpolate: (text?: string) => string;
  doc: CanvasDocument;
}

function RenderBlock({ block, interpolate, doc }: RenderBlockProps) {
  switch (block.type) {
    case "header":
      return (
        <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: doc.primaryColor }}>
          <div>
            <h1 className="font-black text-base uppercase tracking-tight" style={{ color: doc.primaryColor }}>
              {interpolate(block.content ?? "{{center.name}}")}
            </h1>
            <p className="text-[10px] text-slate-600">Higher Academy of Computer Sciences & CFA Apprenticeship</p>
            <p className="font-mono text-[9px] text-slate-500">
              SIRET: {interpolate("{{center.siret}}")} | UAI: {interpolate("{{center.uai}}")} | Qualiopi:{" "}
              {interpolate("{{center.qualiopiId}}")}
            </p>
            <p className="text-[9px] text-slate-500">{interpolate("{{center.address}}")}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">Doc Ref: {interpolate("{{document.id}}")}</div>
            <div className="text-[10px] text-slate-500">Date: {interpolate("{{document.date}}")}</div>
          </div>
        </div>
      );

    case "heading": {
      const alignClass = getAlignClass(block.textAlign);
      if (block.level === 1) {
        return (
          <h1
            className={`my-1 font-black text-lg uppercase tracking-wide ${alignClass}`}
            style={{ color: doc.primaryColor }}
          >
            {interpolate(block.content)}
          </h1>
        );
      }
      if (block.level === 3) {
        return (
          <h3 className={`my-0.5 font-bold text-slate-700 text-xs uppercase tracking-wider ${alignClass}`}>
            {interpolate(block.content)}
          </h3>
        );
      }
      return (
        <h2
          className={`my-1 font-extrabold text-sm uppercase tracking-wide ${alignClass}`}
          style={{ color: doc.primaryColor }}
        >
          {interpolate(block.content)}
        </h2>
      );
    }

    case "paragraph": {
      const alignClass = getAlignClass(block.textAlign);
      return <p className={`text-slate-700 text-xs leading-relaxed ${alignClass}`}>{interpolate(block.content)}</p>;
    }

    case "key-values":
    case "columns":
      return (
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {(block.keyValues ?? []).map((kv) => (
              <div
                key={kv.id ?? `${kv.label}-${kv.value}`}
                className="flex items-center justify-between border-slate-200/60 border-b py-0.5 last:border-0"
              >
                <span className="font-medium text-[11px] text-slate-500">{kv.label}:</span>
                <span className="max-w-[200px] truncate text-right font-semibold text-[11px] text-slate-900">
                  {interpolate(kv.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "callout":
      return (
        <div
          className="rounded-lg border p-3 text-xs shadow-xs"
          style={{
            backgroundColor: block.backgroundColor ?? "#f8fafc",
            borderColor: block.borderColor ?? doc.primaryColor,
          }}
        >
          {block.title && (
            <div className="mb-1 font-bold text-[11px] uppercase tracking-wider" style={{ color: doc.primaryColor }}>
              {interpolate(block.title)}
            </div>
          )}
          <p className="text-slate-800 text-xs leading-relaxed">{interpolate(block.content)}</p>
        </div>
      );

    case "divider":
      return <hr className="my-2 border-slate-200" />;

    case "grades-table":
      return (
        <div className="space-y-1.5">
          {block.title && (
            <h4 className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
              {interpolate(block.title)}
            </h4>
          )}
          <div className="overflow-hidden rounded border border-slate-200">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-1.5 text-left font-semibold">Course Code</th>
                  <th className="p-1.5 text-left font-semibold">Module Name</th>
                  <th className="p-1.5 text-center font-semibold">ECTS</th>
                  <th className="p-1.5 text-center font-semibold">Coef</th>
                  <th className="p-1.5 text-right font-semibold">Grade / 20</th>
                  <th className="p-1.5 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="p-1.5 font-mono text-slate-500">CS-501</td>
                  <td className="p-1.5 font-medium">Distributed Microservices</td>
                  <td className="p-1.5 text-center">6</td>
                  <td className="p-1.5 text-center">4.0</td>
                  <td className="p-1.5 text-right font-bold text-slate-900">17.50</td>
                  <td className="p-1.5 text-right font-semibold text-emerald-700">Validated</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono text-slate-500">CS-502</td>
                  <td className="p-1.5 font-medium">Cloud Infrastructure & Kubernetes</td>
                  <td className="p-1.5 text-center">6</td>
                  <td className="p-1.5 text-center">4.0</td>
                  <td className="p-1.5 text-right font-bold text-slate-900">16.00</td>
                  <td className="p-1.5 text-right font-semibold text-emerald-700">Validated</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono text-slate-500">CS-503</td>
                  <td className="p-1.5 font-medium">Cybersecurity & Zero Trust</td>
                  <td className="p-1.5 text-center">6</td>
                  <td className="p-1.5 text-center">3.0</td>
                  <td className="p-1.5 text-right font-bold text-slate-900">15.25</td>
                  <td className="p-1.5 text-right font-semibold text-emerald-700">Validated</td>
                </tr>
                <tr className="bg-slate-50/80 font-bold">
                  <td colSpan={4} className="p-1.5 text-right text-slate-700">
                    Weighted Grade Average (Moyenne Générale):
                  </td>
                  <td className="p-1.5 text-right text-slate-900" style={{ color: doc.primaryColor }}>
                    {interpolate("{{student.gradeAverage}}")}
                  </td>
                  <td className="p-1.5 text-right text-emerald-700">Admitted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "invoice-table":
      return (
        <div className="space-y-1.5">
          {block.title && (
            <h4 className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
              {interpolate(block.title)}
            </h4>
          )}
          <div className="overflow-hidden rounded border border-slate-200">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-1.5 text-left font-semibold">Description</th>
                  <th className="p-1.5 text-center font-semibold">Qty</th>
                  <th className="p-1.5 text-right font-semibold">Unit Price</th>
                  <th className="p-1.5 text-right font-semibold">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="p-1.5">Apprenticeship Tuition Fee (OPCO Coverage)</td>
                  <td className="p-1.5 text-center">1</td>
                  <td className="p-1.5 text-right">9,500.00 EUR</td>
                  <td className="p-1.5 text-right font-semibold">9,500.00 EUR</td>
                </tr>
                <tr>
                  <td className="p-1.5">Technical Lab Cloud Environment Quota</td>
                  <td className="p-1.5 text-center">1</td>
                  <td className="p-1.5 text-right">450.00 EUR</td>
                  <td className="p-1.5 text-right font-semibold">450.00 EUR</td>
                </tr>
                <tr className="bg-slate-50/80 font-bold">
                  <td colSpan={3} className="p-1.5 text-right text-slate-700">
                    Net Amount Payable (TTC):
                  </td>
                  <td className="p-1.5 text-right text-slate-900">{interpolate("{{invoice.totalTtc}}")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "attendance-table":
      return (
        <div className="space-y-1.5">
          {block.title && (
            <h4 className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
              {interpolate(block.title)}
            </h4>
          )}
          <div className="overflow-hidden rounded border border-slate-200">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-1.5 text-left font-semibold">Date</th>
                  <th className="p-1.5 text-left font-semibold">Course & Module</th>
                  <th className="p-1.5 text-center font-semibold">Slot (AM/PM)</th>
                  <th className="p-1.5 text-center font-semibold">Hours</th>
                  <th className="p-1.5 text-right font-semibold">Attendance State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="p-1.5 font-mono">04/11/2024</td>
                  <td className="p-1.5">Distributed Microservices (NestJS)</td>
                  <td className="p-1.5 text-center">09:00 - 13:00</td>
                  <td className="p-1.5 text-center">4.0h</td>
                  <td className="p-1.5 text-right font-semibold text-emerald-700">Present (Digital Sign)</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono">04/11/2024</td>
                  <td className="p-1.5">Message Brokering & RabbitMQ</td>
                  <td className="p-1.5 text-center">14:00 - 18:00</td>
                  <td className="p-1.5 text-center">4.0h</td>
                  <td className="p-1.5 text-right font-semibold text-emerald-700">Present (Digital Sign)</td>
                </tr>
                <tr className="bg-slate-50/80 font-bold">
                  <td colSpan={3} className="p-1.5 text-right text-slate-700">
                    Monthly Assiduity Rate:
                  </td>
                  <td className="p-1.5 text-center">35.0h / 35.0h</td>
                  <td className="p-1.5 text-right text-emerald-700">100.0% Compliant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case "signature-seal":
      return (
        <div className="flex items-end justify-between border-slate-300 border-t pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <QrCode className="size-10 text-slate-800" />
              <div>
                <div className="font-bold text-[9px] text-slate-700 uppercase">Onixe Verifiable Credential</div>
                <div className="font-mono text-[8px] text-slate-500">SHA-256: {interpolate("{{security.sha256}}")}</div>
                <div className="text-[8px] text-slate-400">Scan to verify authentic tamper-proof ledger record</div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-[11px] text-slate-800 uppercase">{interpolate("{{center.deanTitle}}")}</div>
            <div className="font-medium text-[10px] text-slate-600">{interpolate("{{center.deanName}}")}</div>
            <div className="mt-2 inline-flex h-12 w-32 items-center justify-center rounded border border-slate-300 bg-slate-50/80 font-serif text-[10px] text-slate-400 italic">
              [ Official Digital Stamp & Signature ]
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
