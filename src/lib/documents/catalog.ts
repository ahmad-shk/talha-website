export type DocumentCategory = "required" | "formation" | "tax" | "identity" | "support";
export type DocumentStatus = "required" | "requested" | "uploaded" | "approved" | "available";
export type DocumentOwnerScope = "application" | "member";

export type DocumentDefinition = {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  status: DocumentStatus;
  required: boolean;
  ownerScope: DocumentOwnerScope;
  fileName?: string;
};

/** Document requirements live here, not inside UI components. */
export const documentCatalog: Record<string, DocumentDefinition[]> = {
  "usa-llc": [
    { id: "member-identity", name: "Passport or CNIC", description: "A clear copy of the passport or CNIC for each company member/owner.", category: "identity", status: "required", required: true, ownerScope: "member" },
    { id: "member-address-proof", name: "Bank statement or utility bill", description: "A recent bank statement or utility bill for each company member/owner as address proof.", category: "identity", status: "required", required: true, ownerScope: "member" },
    { id: "company-information", name: "Company information", description: "Business and formation details supplied during your LLC application.", category: "required", status: "approved", required: true, ownerScope: "application" },
    { id: "articles-of-organization", name: "Articles of Organization", description: "Upload the formation document when it is already available or requested for the application.", category: "formation", status: "requested", required: false, ownerScope: "application" },
    { id: "operating-agreement", name: "Operating Agreement", description: "Company operating agreement when applicable to the selected service.", category: "formation", status: "requested", required: false, ownerScope: "application" },
    { id: "ein-confirmation", name: "EIN Confirmation Letter", description: "Federal EIN confirmation document when applicable.", category: "tax", status: "requested", required: false, ownerScope: "application" },
  ],
  "itin-processing": [
    { id: "applicant-identity", name: "Scanned passport", description: "A clear scanned copy of the applicant's passport.", category: "identity", status: "required", required: true, ownerScope: "application" },
    { id: "articles-of-organization", name: "Articles of Organization", description: "Upload your Articles of Organization if they are available.", category: "formation", status: "requested", required: false, ownerScope: "application" },
    { id: "ein-form", name: "EIN form", description: "Upload the EIN form if it is available for your ITIN application.", category: "tax", status: "requested", required: false, ownerScope: "application" },
  ],
  "ein-without-ssn": [
    { id: "articles-of-organization", name: "Articles of Organization", description: "Upload the Articles of Organization when this is the formation document you selected.", category: "formation", status: "requested", required: true, ownerScope: "application" },
    { id: "ss4", name: "SS-4", description: "Upload the SS-4 when this is the EIN document you selected.", category: "tax", status: "requested", required: true, ownerScope: "application" },
  ],
};

export function getDocumentsForService(serviceSlug: string): DocumentDefinition[] {
  return documentCatalog[serviceSlug] ?? [];
}
