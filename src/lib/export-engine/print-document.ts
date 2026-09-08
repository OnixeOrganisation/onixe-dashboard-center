export interface PrintDocumentOptions {
  title: string;
  htmlContent: string;
  pageOrientation?: "portrait" | "landscape";
}

export function printHtmlDocument({ title, htmlContent, pageOrientation = "portrait" }: PrintDocumentOptions): void {
  const printWindow = window.open("", "_blank", "width=900,height=1000");

  if (!printWindow) {
    // Fallback: use hidden iframe if popup blocker is active
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(generateFullHtml(title, htmlContent, pageOrientation));
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    }
    return;
  }

  printWindow.document.open();
  printWindow.document.write(generateFullHtml(title, htmlContent, pageOrientation));
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };
}

function generateFullHtml(title: string, content: string, orientation: "portrait" | "landscape"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    @page {
      size: A4 ${orientation};
      margin: 15mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc-page {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .doc-brand {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .doc-org-name {
      font-size: 16pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
      text-transform: uppercase;
    }
    .doc-org-sub {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.3;
    }
    .doc-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #475569;
    }
    .doc-title-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0f172a;
      padding: 12px 16px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .doc-title {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .doc-subtitle {
      font-size: 9pt;
      color: #64748b;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 9.5pt;
    }
    th {
      background-color: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      font-size: 8.5pt;
      text-transform: uppercase;
    }
    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-warning { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
    .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .badge-info { background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc; }
    .doc-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8pt;
      color: #64748b;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 25px;
      page-break-inside: avoid;
    }
    .signature-box {
      border: 1px dashed #94a3b8;
      border-radius: 4px;
      padding: 12px;
      background: #fafafa;
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .signature-title {
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      color: #334155;
    }
    .official-stamp {
      border: 2px solid #0f172a;
      padding: 8px 12px;
      border-radius: 6px;
      display: inline-block;
      text-align: center;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="doc-page">
    ${content}
  </div>
</body>
</html>`;
}
