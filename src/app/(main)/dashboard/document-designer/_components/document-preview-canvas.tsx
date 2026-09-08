"use client";

import { QrCode } from "lucide-react";

import type { CenterBrandingSettings, DocumentType } from "../types";

interface DocumentPreviewCanvasProps {
  branding: CenterBrandingSettings;
  selectedDoc: DocumentType;
  zoomLevel: number;
}

export function DocumentPreviewCanvas({ branding, selectedDoc, zoomLevel }: DocumentPreviewCanvasProps) {
  const isLandscape = selectedDoc === "diploma";

  const getFontClass = (family: CenterBrandingSettings["fontFamily"]) => {
    if (family === "serif") return "font-serif";
    if (family === "mono") return "font-mono";
    return "font-sans";
  };

  const fontClass = getFontClass(branding.fontFamily);

  return (
    <div className="flex min-h-[600px] flex-1 flex-col items-center justify-start overflow-auto bg-muted/20 p-4 sm:p-8">
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease-out",
        }}
        className={`border border-border/60 bg-white text-slate-900 shadow-2xl transition-all ${fontClass} ${
          isLandscape ? "min-h-[680px] w-[960px] p-10" : "min-h-[1020px] w-[760px] p-10"
        } relative flex select-none flex-col justify-between`}
      >
        {/* Security Guilloché Background Watermark */}
        {branding.showWatermark && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
            <div className="rotate-[-30deg] select-none font-black text-[120px] text-slate-900 uppercase tracking-widest">
              {branding.centerName.split(" ")[0] || "ONIXE"} SECURE
            </div>
          </div>
        )}

        {/* DOCUMENT CONTENT SWITCHER */}
        {selectedDoc === "invoice" && <InvoicePreviewContent branding={branding} />}
        {selectedDoc === "transcript" && <TranscriptPreviewContent branding={branding} />}
        {selectedDoc === "certificate" && <CertificatePreviewContent branding={branding} />}
        {selectedDoc === "diploma" && <DiplomaPreviewContent branding={branding} />}
        {selectedDoc === "attendance" && <AttendancePreviewContent branding={branding} />}
        {selectedDoc === "internship" && <InternshipPreviewContent branding={branding} />}
      </div>
    </div>
  );
}

// 1. INVOICE PREVIEW
function InvoicePreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div className="flex flex-col gap-6 text-slate-800 text-xs leading-relaxed">
      {/* Institutional Header */}
      <div className="flex items-start justify-between border-b-2 pb-4" style={{ borderColor: branding.primaryColor }}>
        <div>
          <h1 className="font-black text-lg uppercase tracking-tight" style={{ color: branding.primaryColor }}>
            {branding.centerName}
          </h1>
          <p className="text-[11px] text-slate-600">{branding.tagline}</p>
          <p className="text-[10px] text-slate-500">
            SIRET: {branding.siret} | Qualiopi: {branding.qualiopiId} | UAI: {branding.uai}
          </p>
          <p className="text-[10px] text-slate-500">{branding.address}</p>
        </div>
        <div className="text-right">
          <div className="font-extrabold text-xl uppercase tracking-widest" style={{ color: branding.primaryColor }}>
            INVOICE
          </div>
          <div className="font-mono font-semibold text-slate-700 text-xs">#INV-2024-8842</div>
          <div className="text-[11px] text-slate-500">Date: 18 Nov 2024</div>
          <div className="text-[11px] text-slate-500">Due Date: 15 Dec 2024</div>
        </div>
      </div>

      {/* Bill To Info */}
      <div className="grid grid-cols-2 gap-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-xs">
        <div>
          <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Billed To / Payer</span>
          <div className="mt-1 font-bold text-slate-900">ATOS IT Services France (OPCO ATLAS)</div>
          <div>Apprentice: Alexandre Mercier (Promo Dev Master 2024-A)</div>
          <div>18 Rue du Pont de Flandre, 75019 Paris</div>
          <div className="text-[11px] text-slate-500">VAT ID: FR 82 458920194</div>
        </div>
        <div>
          <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Payment Instructions</span>
          <div className="mt-1 font-semibold text-slate-900">Bank: {branding.bankName}</div>
          <div className="font-mono text-[11px]">IBAN: {branding.iban}</div>
          <div className="font-mono text-[11px]">BIC: {branding.bic}</div>
          <div className="mt-1 text-[11px] text-slate-600">Ref: INV-2024-8842 / Alexandre Mercier</div>
        </div>
      </div>

      {/* Items Table */}
      <table className="my-2 w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b bg-slate-100 font-bold text-[10px] text-slate-700 uppercase">
            <th className="px-3 py-2">Description / Training Item</th>
            <th className="px-3 py-2 text-center">Hours</th>
            <th className="px-3 py-2 text-right">Unit Rate</th>
            <th className="px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="px-3 py-2.5">
              <div className="font-semibold text-slate-900">
                Master Degree in Distributed Cloud & Software Engineering (Year 2)
              </div>
              <div className="text-[11px] text-slate-500">
                CFA Apprenticeship Module: Microservices, Kubernetes & Cloud Architecture
              </div>
            </td>
            <td className="px-3 py-2.5 text-center font-mono">420h</td>
            <td className="px-3 py-2.5 text-right font-mono">18.50 €</td>
            <td className="px-3 py-2.5 text-right font-bold font-mono">7,770.00 €</td>
          </tr>
          <tr>
            <td className="px-3 py-2.5">
              <div className="font-semibold text-slate-900">Pedagogical Infrastructure & Lab Access</div>
              <div className="text-[11px] text-slate-500">Cloud Cluster sandbox access & certification exam fees</div>
            </td>
            <td className="px-3 py-2.5 text-center font-mono">—</td>
            <td className="px-3 py-2.5 text-right font-mono">650.00 €</td>
            <td className="px-3 py-2.5 text-right font-bold font-mono">650.00 €</td>
          </tr>
        </tbody>
      </table>

      {/* Totals Box */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1.5 rounded border border-slate-200 bg-slate-50 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal HT:</span>
            <span className="font-medium font-mono">8,420.00 €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">VAT (Training Exemption Art. 261-4-4a):</span>
            <span className="font-medium font-mono">0.00 €</span>
          </div>
          <div
            className="flex justify-between border-slate-300 border-t pt-1.5 font-bold text-sm"
            style={{ color: branding.primaryColor }}
          >
            <span>Total Net Due:</span>
            <span className="font-mono">8,420.00 €</span>
          </div>
        </div>
      </div>

      {/* Signatures & Stamps */}
      <div className="mt-6 grid grid-cols-2 gap-6 border-slate-200 border-t pt-4">
        <div className="flex h-24 flex-col justify-between rounded border border-dashed bg-slate-50/50 p-3">
          <span className="font-bold text-[10px] text-slate-500 uppercase">Authorized Bursar</span>
          <div className="font-semibold text-slate-900 text-xs">{branding.deanName}</div>
          <div className="text-[10px] text-slate-500">{branding.deanTitle}</div>
        </div>

        {branding.showStamp && (
          <div className="flex items-center justify-end gap-3">
            <div
              className="rounded-md border-2 p-2 text-center font-extrabold text-[10px] uppercase leading-tight tracking-wider"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              {branding.stampText.split("\n").map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            {branding.showQrCode && (
              <div className="flex size-16 items-center justify-center rounded border bg-slate-100 text-slate-600">
                <QrCode className="size-12" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. GRADE TRANSCRIPT PREVIEW
function TranscriptPreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div className="flex flex-col gap-5 text-slate-800 text-xs">
      <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: branding.primaryColor }}>
        <div>
          <h1 className="font-black text-base uppercase tracking-tight" style={{ color: branding.primaryColor }}>
            {branding.centerName}
          </h1>
          <p className="text-[10px] text-slate-600">{branding.tagline}</p>
          <p className="text-[9px] text-slate-500">RNCP Accreditation | European ECTS Framework</p>
        </div>
        <div className="text-right">
          <div className="font-extrabold text-sm uppercase tracking-wider" style={{ color: branding.primaryColor }}>
            ACADEMIC TRANSCRIPT
          </div>
          <div className="text-[10px] text-slate-500">Academic Year: {branding.academicYear}</div>
          <div className="font-mono text-[10px] text-slate-500">Ref: TR-2024-9912</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded border bg-slate-50 p-3 text-xs">
        <div>
          <div>
            <span className="text-slate-500">Student:</span> <strong>Alexandre Mercier</strong>
          </div>
          <div>
            <span className="text-slate-500">Matricule:</span> <strong className="font-mono">STU-2024-001</strong>
          </div>
          <div>
            <span className="text-slate-500">Cohort:</span> Promo Dev Master 2024-A
          </div>
        </div>
        <div>
          <div>
            <span className="text-slate-500">Department:</span> Software Engineering
          </div>
          <div>
            <span className="text-slate-500">Program:</span> Master of Science in Cloud Architecture
          </div>
          <div>
            <span className="text-slate-500">Level:</span> {branding.rncpLevelTitle}
          </div>
        </div>
      </div>

      <table className="my-1 w-full border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b bg-slate-100 font-bold text-[9px] text-slate-700 uppercase">
            <th className="px-2 py-1.5">Code</th>
            <th className="px-2 py-1.5">Teaching Unit & Module Title</th>
            <th className="px-2 py-1.5 text-center">ECTS</th>
            <th className="px-2 py-1.5 text-center">Coeff</th>
            <th className="px-2 py-1.5 text-center">Grade /20</th>
            <th className="px-2 py-1.5 text-center">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="px-2 py-2 font-bold font-mono">DEV-501</td>
            <td className="px-2 py-2">Distributed Microservices Architecture with NestJS</td>
            <td className="px-2 py-2 text-center">6</td>
            <td className="px-2 py-2 text-center">3</td>
            <td className="px-2 py-2 text-center font-bold">16.50</td>
            <td className="px-2 py-2 text-center font-bold text-emerald-600">VALIDATED</td>
          </tr>
          <tr>
            <td className="px-2 py-2 font-bold font-mono">DEV-502</td>
            <td className="px-2 py-2">Cloud Infrastructure, Kubernetes & GitOps</td>
            <td className="px-2 py-2 text-center">5</td>
            <td className="px-2 py-2 text-center">2</td>
            <td className="px-2 py-2 text-center font-bold">15.00</td>
            <td className="px-2 py-2 text-center font-bold text-emerald-600">VALIDATED</td>
          </tr>
          <tr>
            <td className="px-2 py-2 font-bold font-mono">DEV-503</td>
            <td className="px-2 py-2">Applied Machine Learning & Telemetry Systems</td>
            <td className="px-2 py-2 text-center">5</td>
            <td className="px-2 py-2 text-center">2</td>
            <td className="px-2 py-2 text-center font-bold">14.80</td>
            <td className="px-2 py-2 text-center font-bold text-emerald-600">VALIDATED</td>
          </tr>
        </tbody>
      </table>

      <div className="my-2 grid grid-cols-2 gap-4">
        <div className="space-y-1 rounded border bg-slate-50 p-2.5 text-xs">
          <div className="flex justify-between">
            <span>Validated ECTS Credits:</span>
            <strong>30 / 30 ECTS</strong>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>General Weighted Average:</span>
            <strong style={{ color: branding.primaryColor }}>15.65 / 20.00</strong>
          </div>
        </div>
        <div className="flex flex-col justify-center rounded border border-emerald-200 bg-emerald-50 p-2.5 text-xs">
          <div className="font-bold text-[10px] text-emerald-800 uppercase">Academic Jury Verdict</div>
          <div className="font-extrabold text-emerald-700 text-sm">ADMITTED WITH HONORS (Mention Bien)</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6 border-t pt-3">
        <div className="text-[10px] text-slate-500">
          <div>Signed by: {branding.deanName}</div>
          <div>{branding.deanTitle}</div>
        </div>
        {branding.showStamp && (
          <div className="flex items-center justify-end gap-3">
            <div
              className="rounded border-2 p-1.5 text-center font-bold text-[9px] uppercase"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              {branding.stampText.split("\n")[0]}
            </div>
            <QrCode className="size-10 text-slate-500" />
          </div>
        )}
      </div>
    </div>
  );
}

// 3. CERTIFICATE OF ENROLLMENT PREVIEW
function CertificatePreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div className="my-auto flex flex-col gap-6 text-slate-800 text-xs">
      <div className="border-b-2 pb-4 text-center" style={{ borderColor: branding.primaryColor }}>
        <h1 className="font-black text-lg uppercase tracking-tight" style={{ color: branding.primaryColor }}>
          {branding.centerName}
        </h1>
        <p className="text-slate-600 text-xs">{branding.tagline}</p>
        <p className="text-[10px] text-slate-500">
          UAI: {branding.uai} | SIRET: {branding.siret}
        </p>
      </div>

      <div
        className="rounded border-2 p-3 text-center"
        style={{ borderColor: branding.primaryColor, backgroundColor: "#f8fafc" }}
      >
        <div className="font-extrabold text-base uppercase tracking-wider" style={{ color: branding.primaryColor }}>
          CERTIFICATE OF ENROLLMENT
        </div>
        <div className="font-semibold text-[11px] text-slate-600">CERTIFICAT DE SCOLARITÉ & D&apos;INSCRIPTION</div>
      </div>

      <div className="space-y-3 text-slate-700 leading-relaxed">
        <p>The Academic Registrar hereby certifies that:</p>
        <div className="space-y-1.5 rounded border bg-slate-50 p-4 text-xs">
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Student Name:</span>
            <span className="col-span-2 font-bold text-slate-900 text-sm">Alexandre Mercier</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Student ID / INE:</span>
            <span className="col-span-2 font-bold font-mono">STU-2024-001</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Enrolled Program:</span>
            <span className="col-span-2 font-semibold">Master of Science in Software & Cloud Architecture</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Academic Year:</span>
            <span className="col-span-2 font-semibold">{branding.academicYear}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Degree Level:</span>
            <span className="col-span-2">{branding.rncpLevelTitle}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-500">Regime:</span>
            <span className="col-span-2 font-bold text-emerald-700">Apprenticeship CFA</span>
          </div>
        </div>
        <p>
          Is officially enrolled as a regular full-time apprentice student for the current academic session. This
          certificate is issued to serve and establish administrative rights.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-4">
        <div className="space-y-1">
          <div className="font-bold text-[10px] text-slate-500 uppercase">Academic Authority</div>
          <div className="font-bold text-slate-900">{branding.deanName}</div>
          <div className="text-[10px] text-slate-500">{branding.deanTitle}</div>
        </div>
        {branding.showStamp && (
          <div className="flex items-center justify-end gap-3">
            <div
              className="rounded border-2 p-2 text-center font-extrabold text-[10px] uppercase"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              {branding.stampText.split("\n")[0]}
              <br />
              OFFICIAL SEAL
            </div>
            <QrCode className="size-12 text-slate-600" />
          </div>
        )}
      </div>
    </div>
  );
}

// 4. DIPLOMA / PARCHMENT PREVIEW (LANDSCAPE)
function DiplomaPreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div
      className="flex h-full flex-col justify-between border-8 border-double p-8 text-center"
      style={{ borderColor: branding.primaryColor }}
    >
      <div className="flex items-center justify-between border-b pb-3 text-[10px] text-slate-500 uppercase tracking-widest">
        <span>RÉPUBLIQUE FRANÇAISE — MINISTÈRE DE L&apos;ENSEIGNEMENT SUPÉRIEUR</span>
        <span className="font-mono">REF: 0x7F83B16...26D9069</span>
      </div>

      <div className="my-3 space-y-1">
        <h1 className="font-black text-xl uppercase tracking-wider" style={{ color: branding.primaryColor }}>
          {branding.centerName}
        </h1>
        <div className="font-semibold text-slate-600 text-xs uppercase tracking-widest">
          PROVISIONAL ATTESTATION OF GRADUATION & DEGREE CONFERRAL
        </div>
      </div>

      <div className="mx-auto my-2 max-w-2xl space-y-2 text-xs leading-relaxed">
        <p className="text-slate-600">
          Upon the recommendation of the Academic Examination Board dated November 20, 2024,
        </p>
        <p className="text-slate-600">The Degree and Title of:</p>
        <div className="font-black text-base uppercase tracking-wide" style={{ color: branding.primaryColor }}>
          MASTER OF SCIENCE IN DISTRIBUTED SOFTWARE ARCHITECTURE
        </div>
        <div className="text-slate-500 text-xs italic">{branding.rncpLevelTitle} — 120 ECTS Credits Validated</div>
        <p className="mt-2 text-slate-600">Is officially conferred upon:</p>
        <div className="font-black text-2xl text-slate-900 uppercase tracking-wide">ALEXANDRE MERCIER</div>
        <div className="inline-block rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 font-bold text-emerald-800 text-xs">
          Graduated with Summa Cum Laude (Félicitations du Jury)
        </div>
      </div>

      <div className="grid grid-cols-3 items-end border-t pt-4 text-xs">
        <div className="space-y-0.5 text-left">
          <div className="font-bold text-slate-900">Prof. Marcus Vance</div>
          <div className="text-[10px] text-slate-500">President of Examination Jury</div>
        </div>

        <div className="flex items-center justify-center">
          {branding.showStamp && (
            <div
              className="flex size-20 flex-col items-center justify-center rounded-full border-2 text-center font-black text-[9px] uppercase tracking-tight"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              ONIXE
              <br />
              SEAL
            </div>
          )}
        </div>

        <div className="space-y-0.5 text-right">
          <div className="font-bold text-slate-900">{branding.deanName}</div>
          <div className="text-[10px] text-slate-500">{branding.deanTitle}</div>
        </div>
      </div>
    </div>
  );
}

// 5. ATTENDANCE PREVIEW
function AttendancePreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div className="flex flex-col gap-4 text-slate-800 text-xs">
      <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: branding.primaryColor }}>
        <div>
          <h1 className="font-black text-base uppercase tracking-tight" style={{ color: branding.primaryColor }}>
            {branding.centerName}
          </h1>
          <p className="text-[10px] text-slate-600">{branding.tagline}</p>
          <p className="text-[9px] text-slate-500">
            SIRET: {branding.siret} | Qualiopi: {branding.qualiopiId}
          </p>
        </div>
        <div className="text-right">
          <div className="font-extrabold text-xs uppercase" style={{ color: branding.primaryColor }}>
            OPCO ATTENDANCE SHEET
          </div>
          <div className="text-[10px] text-slate-500">Period: November 2024</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded border bg-slate-50 p-2.5 text-xs">
        <div>
          <span className="text-slate-500">Cohort:</span> <strong>Promo Dev Master 2024-A</strong>
        </div>
        <div>
          <span className="text-slate-500">Module:</span> <strong>Distributed Microservices</strong>
        </div>
        <div>
          <span className="text-slate-500">Instructor:</span> <strong>Dr. Alexandre Merceron</strong>
        </div>
      </div>

      <table className="my-1 w-full border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b bg-slate-100 font-bold text-[9px] text-slate-700 uppercase">
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Learner Name & ID</th>
            <th className="px-2 py-1 text-center">Session Date</th>
            <th className="px-2 py-1 text-center">Status</th>
            <th className="px-2 py-1 text-center">Signature Telemetry</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr>
            <td className="px-2 py-1.5">1</td>
            <td className="px-2 py-1.5 font-semibold">Lucas Moreau (STU-2024-001)</td>
            <td className="px-2 py-1.5 text-center">18/11/2024 (09:00 - 12:30)</td>
            <td className="px-2 py-1.5 text-center font-bold text-emerald-600">PRESENT</td>
            <td className="px-2 py-1.5 text-center text-[10px] text-slate-500 italic">[Digital PIN Confirmed]</td>
          </tr>
          <tr>
            <td className="px-2 py-1.5">2</td>
            <td className="px-2 py-1.5 font-semibold">Amina Diallo (STU-2024-002)</td>
            <td className="px-2 py-1.5 text-center">18/11/2024 (09:00 - 12:30)</td>
            <td className="px-2 py-1.5 text-center font-bold text-emerald-600">PRESENT</td>
            <td className="px-2 py-1.5 text-center text-[10px] text-slate-500 italic">[Digital PIN Confirmed]</td>
          </tr>
          <tr>
            <td className="px-2 py-1.5">3</td>
            <td className="px-2 py-1.5 font-semibold">Julien Mercier (STU-2024-003)</td>
            <td className="px-2 py-1.5 text-center">18/11/2024 (09:00 - 12:30)</td>
            <td className="px-2 py-1.5 text-center font-bold text-amber-600">LATE (09:18)</td>
            <td className="px-2 py-1.5 text-center text-[10px] text-slate-500 italic">[Badge Scan]</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-auto grid grid-cols-2 gap-4 border-t pt-3">
        <div className="rounded border bg-slate-50 p-2">
          <div className="font-bold text-[10px] text-slate-500 uppercase">Trainer Attestation</div>
          <div className="font-semibold text-xs">Dr. Alexandre Merceron</div>
        </div>
        <div className="flex items-center justify-between rounded border bg-slate-50 p-2">
          <div>
            <div className="font-bold text-[10px] text-slate-500 uppercase">Qualiopi Compliance Stamp</div>
            <div className="text-[10px] text-slate-600">ID: {branding.qualiopiId}</div>
          </div>
          {branding.showStamp && <QrCode className="size-8 text-slate-600" />}
        </div>
      </div>
    </div>
  );
}

// 6. INTERNSHIP AGREEMENT PREVIEW
function InternshipPreviewContent({ branding }: { branding: CenterBrandingSettings }) {
  return (
    <div className="flex flex-col gap-5 text-slate-800 text-xs">
      <div className="flex items-start justify-between border-b-2 pb-3" style={{ borderColor: branding.primaryColor }}>
        <div>
          <h1 className="font-black text-base uppercase tracking-tight" style={{ color: branding.primaryColor }}>
            {branding.centerName}
          </h1>
          <p className="text-[10px] text-slate-600">{branding.tagline}</p>
        </div>
        <div className="text-right">
          <div className="font-extrabold text-xs uppercase" style={{ color: branding.primaryColor }}>
            INTERNSHIP & CFA AGREEMENT
          </div>
          <div className="font-mono text-[10px] text-slate-500">CONV-2024-089</div>
        </div>
      </div>

      <div className="text-center font-bold text-slate-900 text-sm uppercase">
        TRIPARTITE CORPORATE TRAINING & CAPSTONE AGREEMENT
      </div>

      <div className="grid grid-cols-3 gap-3 rounded border bg-slate-50 p-3 text-xs">
        <div className="border-r pr-2">
          <div className="font-bold text-[10px] text-slate-900 uppercase">1. The Institution</div>
          <div>{branding.centerName}</div>
          <div className="text-[10px] text-slate-500">Rep: {branding.deanName}</div>
        </div>
        <div className="border-r pr-2">
          <div className="font-bold text-[10px] text-slate-900 uppercase">2. The Host Company</div>
          <div>Dassault Systèmes SE</div>
          <div className="text-[10px] text-slate-500">Tutor: Sarah Lin (Lead Architect)</div>
        </div>
        <div>
          <div className="font-bold text-[10px] text-slate-900 uppercase">3. The Apprentice</div>
          <div>Alexandre Mercier</div>
          <div className="text-[10px] text-slate-500">Promo Dev Master 2024-A</div>
        </div>
      </div>

      <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
        <p>
          <strong>Article 1 — Purpose of Internship:</strong> The learner is assigned to the Distributed Systems
          Engineering division to conduct advanced cloud telemetry and containerization research.
        </p>
        <p>
          <strong>Article 2 — Duration:</strong> From 01/03/2025 to 31/08/2025 (6 months, 35h per week).
        </p>
        <p>
          <strong>Article 3 — Remuneration:</strong> Legal apprenticeship gratification of 1,650.00 € / month.
        </p>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-3 border-t pt-4 text-[10px]">
        <div className="rounded border p-2 text-center">Student Signature</div>
        <div className="rounded border p-2 text-center">Company Tutor Seal</div>
        <div className="rounded border p-2 text-center">Center Director Seal</div>
      </div>
    </div>
  );
}
