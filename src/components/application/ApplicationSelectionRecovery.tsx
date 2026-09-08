"use client";

import { useMemo, useState } from "react";
import type { Application } from "@/lib/api";
import type { Service } from "@/lib/services";
import { useApplicationState } from "./ApplicationStateProvider";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

type Props = { application: Pick<Application, "id" | "serviceSlug" | "packageSlug" | "formationState" | "variantSlug">; service: Service };

export default function ApplicationSelectionRecovery({ application, service }: Props) {
  const { updateApplication, refreshApplication } = useApplicationState();
  const [packageSlug, setPackageSlug] = useState(application.packageSlug ?? "");
  const [formationState, setFormationState] = useState(application.formationState ?? "");
  const [variantSlug, setVariantSlug] = useState(application.variantSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const needsPackage = Boolean(service.capabilities.requiresPackage && !application.packageSlug);
  const needsJurisdiction = Boolean(service.capabilities.requiresJurisdiction && !application.formationState);
  const needsVariant = Boolean(service.variants?.length && !application.variantSlug);
  const complete = useMemo(
    () => (!needsPackage || Boolean(packageSlug)) && (!needsJurisdiction || Boolean(formationState)) && (!needsVariant || Boolean(variantSlug)),
    [formationState, needsJurisdiction, needsPackage, needsVariant, packageSlug, variantSlug],
  );

  async function handleSave() {
    if (!complete || saving) return;
    setSaving(true);
    setError("");
    try {
      await updateApplication({ packageSlug: packageSlug || undefined, formationState: formationState || undefined, variantSlug: variantSlug || undefined });
      await refreshApplication(application.id);
    } catch (value) {
      setError(value instanceof Error ? value.message : "We couldn't restore the application selection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-4 py-10 text-[var(--fm-text-primary)] md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        <SectionLabel>Application recovery</SectionLabel>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Finish your application setup</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">This saved application is missing commercial selection information required to continue. Choose the missing options below; your existing answers and documents will remain unchanged.</p>
        <Card variant="elevated" className="mt-8 space-y-6 p-6 md:p-8">
          {needsPackage && <label className="block"><span className="mb-2 block text-sm font-medium">Service package</span><select value={packageSlug} onChange={(event) => setPackageSlug(event.target.value)} className="h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-3 text-sm text-[var(--fm-text-primary)]"><option value="">Select a package</option>{(service.packages ?? []).map((item) => <option key={item.slug} value={item.slug}>{item.name} — {item.currency} {item.price}</option>)}</select></label>}
          {needsJurisdiction && <label className="block"><span className="mb-2 block text-sm font-medium">Formation state</span><select value={formationState} onChange={(event) => setFormationState(event.target.value)} className="h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-3 text-sm text-[var(--fm-text-primary)]"><option value="">Select a state</option>{(service.jurisdictions ?? []).map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>}
          {needsVariant && <label className="block"><span className="mb-2 block text-sm font-medium">Service option</span><select value={variantSlug} onChange={(event) => setVariantSlug(event.target.value)} className="h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-3 text-sm text-[var(--fm-text-primary)]"><option value="">Select an option</option>{(service.variants ?? []).map((item) => <option key={item.variantSlug} value={item.variantSlug}>{item.name} — {item.currency} {item.price}</option>)}</select></label>}
          {error && <p className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/40 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]" role="alert">{error}</p>}
          <Button type="button" size="lg" disabled={!complete || saving} onClick={() => void handleSave()}>{saving ? "Saving selection..." : "Continue application"}</Button>
        </Card>
      </div>
    </main>
  );
}
