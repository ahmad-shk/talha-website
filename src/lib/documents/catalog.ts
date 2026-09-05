export type DocumentCategory = "required" | "formation" | "tax" | "identity" | "support";
export type DocumentStatus = "required" | "requested" | "uploaded" | "approved" | "available";

export type DocumentDefinition = {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  status: DocumentStatus;
  required: boolean;
  fileName?: string;
};

/** Document requirements live here, not inside UI components. */
export const documentCatalog: Record<string, DocumentDefinition[]> = {
  "usa-llc": [
    { id: "government-id", name: "Government-issued ID", description: "Valid passport, national ID, or driver's license.", category: "identity", status: "required", required: true },
    { id: "company-information", name: "Company information", description: "Business details supplied during your LLC application.", category: "required", status: "approved", required: true },
    { id: "articles-of-organization", name: "Articles of Organization", description: "Your official LLC formation document.", category: "formation", status: "requested", required: false },
    { id: "operating-agreement", name: "Operating Agreement", description: "Company operating agreement prepared for your LLC.", category: "formation", status: "requested", required: false },
    { id: "ein-confirmation", name: "EIN Confirmation Letter", description: "Federal EIN confirmation document when applicable.", category: "tax", status: "requested", required: false },
  ],
};

export function getDocumentsForService(serviceSlug: string): DocumentDefinition[] {
  return documentCatalog[serviceSlug] ?? [];
}
