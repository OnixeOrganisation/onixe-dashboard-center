import type { Metadata } from "next";

import { DocumentDesignerView } from "./_components/document-designer-view";

export const metadata: Metadata = {
  title: "Document Studio & Template Designer | Onixe Academy",
  description: "Design, brand, and customize institutional invoices, transcripts, diplomas, and certificates.",
};

export default function DocumentDesignerPage() {
  return <DocumentDesignerView />;
}
