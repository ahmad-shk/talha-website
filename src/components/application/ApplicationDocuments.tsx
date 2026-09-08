"use client";

import { useMemo, useState } from "react";
import type { Application, ApplicationDocumentReference } from "@/lib/api";
import { downloadApplicationDocument, uploadApplicationDocument } from "@/lib/api";
import { getDocumentsForService } from "@/lib/documents/catalog";
import { useApplicationState } from "./ApplicationStateProvider";
import { Card } from "@/components/ui/design-system";

type ApplicationDocumentsProps = {
  application?: Pick<Application, "id" | "serviceSlug" | "members" | "documents" | "answers"> | null;
  applicationId?: string;
  readOnly?: boolean;
  onUploaded?: (document: ApplicationDocumentReference) => void;
};

const memberSlots = [
  { type: "member-identity", label: "Passport or CNIC", description: "Upload a clear passport or CNIC copy for this member." },
  { type: "member-address-proof", label: "Bank statement or utility bill", description: "Upload a recent bank statement or utility bill showing the member's address." },
] as const;

function latestDocument(documents: ApplicationDocumentReference[] | undefined, type: string, ownerId?: string) {
  return (documents ?? [])
    .filter((document) => document.documentType === type && document.ownerType === (ownerId ? "member" : "application") && document.ownerId === ownerId && document.status !== "rejected")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

export default function ApplicationDocuments({ application: suppliedApplication, applicationId, readOnly = false, onUploaded }: ApplicationDocumentsProps) {
  const { application: stateApplication } = useApplicationState();
  const application = suppliedApplication ?? (applicationId ? stateApplication : null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const members = useMemo(() => application?.members ?? [], [application?.members]);
  if (!application) return null;
  const currentApplication = application;

  const definitions = getDocumentsForService(currentApplication.serviceSlug);
  const applicationSlots = definitions.filter((definition) => definition.ownerScope === "application" && definition.id !== "company-information");
  const visibleApplicationSlots = currentApplication.serviceSlug === "ein-without-ssn"
    ? applicationSlots.filter((definition) => definition.id === (currentApplication.answers?.formation_document_type === "ss4" ? "ss4" : "articles-of-organization"))
    : applicationSlots;

  async function handleUpload(documentType: string, file: File, ownerId?: string) {
    const key = `${ownerId ?? "application"}:${documentType}`;
    setError(null); setUploading(key);
    try {
      const response = await uploadApplicationDocument(currentApplication.id, { file, documentType, ownerType: ownerId ? "member" : "application", ...(ownerId ? { ownerId } : {}) });
      onUploaded?.(response.data.document);
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "We couldn't upload the document."); }
    finally { setUploading(null); }
  }

  async function handleDownload(document: ApplicationDocumentReference) {
    setError(null); setDownloading(document.id);
    try { await downloadApplicationDocument(currentApplication.id, document.id, document.fileName); }
    catch (downloadError) { setError(downloadError instanceof Error ? downloadError.message : "We couldn't download the document."); }
    finally { setDownloading(null); }
  }

  function UploadSlot({ type, label, description, ownerId }: { type: string; label: string; description: string; ownerId?: string }) {
    const document = latestDocument(currentApplication.documents, type, ownerId);
    const key = `${ownerId ?? "application"}:${type}`;
    return <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium text-[var(--fm-text-primary)]">{label}</p><p className="mt-1 text-sm leading-5 text-[var(--fm-text-tertiary)]">{description}</p>{document && <button type="button" onClick={() => void handleDownload(document)} disabled={downloading !== null} className="mt-2 text-left text-xs text-[var(--fm-lime-bright)] underline-offset-4 hover:underline disabled:opacity-50">{downloading === document.id ? "Preparing download..." : `Uploaded: ${document.fileName}`}</button>}</div>{!readOnly && <label className="inline-flex shrink-0 cursor-pointer"><input type="file" className="sr-only" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; if (file) void handleUpload(type, file, ownerId); }} /><span className="inline-flex h-10 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border-accent)] px-4 text-sm font-medium text-[var(--fm-lime-bright)] transition-colors hover:bg-[var(--fm-lime-soft)]">{uploading === key ? "Uploading..." : document ? "Replace" : "Upload document"}</span></label>}</div></div>;
  }

  return <section className="space-y-8">
    <header><p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fm-lime)]">Supporting documents</p><h1 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)] md:text-3xl">Upload your documents</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)] md:text-base">Files are securely attached to this application rather than stored inside your questionnaire answers. PDF, JPEG, PNG and WebP files up to 10 MB are supported.</p></header>
    {error && <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/40 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]" role="alert">{error}</div>}
    {currentApplication.serviceSlug === "usa-llc" ? <div className="space-y-5">{members.length === 0 ? <Card className="p-5 text-sm text-[var(--fm-text-secondary)]">Add the company members before uploading their documents.</Card> : members.map((member, index) => <Card key={member.id} className="p-5 md:p-6"><div className="mb-5"><p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">Member {index + 1}</p><h2 className="mt-1 font-semibold text-[var(--fm-text-primary)]">{member.fullName || `Member ${index + 1}`}</h2></div><div className="space-y-4">{memberSlots.map((slot) => <UploadSlot key={slot.type} type={slot.type} label={slot.label} description={slot.description} ownerId={member.id} />)}</div></Card>)}</div> : <Card className="space-y-4 p-5 md:p-6"><div><p className="text-sm font-semibold text-[var(--fm-text-primary)]">Application documents</p><p className="mt-1 text-sm text-[var(--fm-text-tertiary)]">Upload the documents requested for this service.</p></div>{visibleApplicationSlots.map((definition) => <UploadSlot key={definition.id} type={definition.id} label={definition.name} description={definition.description} />)}</Card>}
  </section>;
}
