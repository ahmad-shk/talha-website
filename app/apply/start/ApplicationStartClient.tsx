"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug, getJurisdiction } from "@/lib/services";

export default function ApplicationStartClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { startApplication } = useApplicationState();
  const serviceSlug = params.get("service") ?? "";
  const service = getServiceBySlug(serviceSlug);
  const initialPackage = params.get("package") ?? service?.packages?.[0]?.slug ?? "";
  const initialState = params.get("state") ?? "";
  const initialVariant = params.get("variant") ?? "";
  const initialAddOns = (params.get("addons") ?? "").split(",").filter(Boolean);
  const [packageSlug, setPackageSlug] = useState(initialPackage);
  const [jurisdictionSlug, setJurisdictionSlug] = useState(initialState);
  const [variantSlug, setVariantSlug] = useState(initialVariant);
  const [addOnSlugs, setAddOnSlugs] = useState(initialAddOns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPackage = service?.packages?.find((item) => item.slug === packageSlug);
  const selectedJurisdiction = service?.jurisdictions?.find((item) => item.slug === jurisdictionSlug) ?? getJurisdiction(jurisdictionSlug);
  const selectedVariant = service?.variants?.find((item) => item.variantSlug === variantSlug);
  const addOns = service?.addOns ?? [];
  const canContinue = Boolean(service)
    && (!service?.capabilities.requiresPackage || Boolean(selectedPackage))
    && (!service?.capabilities.requiresJurisdiction || Boolean(selectedJurisdiction))
    && (!service?.variants?.length || Boolean(selectedVariant));
  const totalPreview = useMemo(
    () => selectedVariant?.price ?? ((selectedPackage?.price ?? 0) + (selectedJurisdiction?.filingFee ?? 0) + addOnSlugs.reduce((sum, slug) => sum + (addOns.find((item) => item.slug === slug)?.price ?? 0), 0)),
    [selectedVariant, selectedPackage, selectedJurisdiction, addOnSlugs, addOns],
  );

  async function continueToApplication() {
    if (!service || !canContinue) return;
    setLoading(true);
    setError("");
    try {
      const id = await startApplication({
        serviceSlug: service.slug,
        packageSlug: packageSlug || undefined,
        formationState: jurisdictionSlug || undefined,
        variantSlug: variantSlug || undefined,
        addOnSlugs,
      });
      router.replace(`/apply/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start the application.");
      setLoading(false);
    }
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-24 text-[var(--fm-text-primary)]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <SectionLabel>Application</SectionLabel>
            <h1 className="mt-3 text-3xl font-semibold">Service not found</h1>
            <p className="mt-3 text-[var(--fm-text-secondary)]">The selected service is unavailable.</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-5 py-14 text-[var(--fm-text-primary)] sm:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <SectionLabel>Application setup</SectionLabel>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.045em] md:text-5xl">Set up your {service.name} application.</h1>
          <p className="mt-4 text-base leading-7 text-[var(--fm-text-secondary)]">Confirm the commercial options first. Your selections become part of the application and pricing record.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {service.variants && service.variants.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Choose your service type</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {service.variants.map((item) => (
                    <button key={item.variantSlug} type="button" onClick={() => setVariantSlug(item.variantSlug)} className={`rounded-[var(--fm-radius-md)] border p-4 text-left ${variantSlug === item.variantSlug ? "border-[var(--fm-lime)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)]"}`}>
                      <div className="flex items-center justify-between"><span className="font-semibold">{item.name}</span>{variantSlug === item.variantSlug && <Check className="h-4 w-4 text-[var(--fm-lime)]" />}</div>
                      <p className="mt-2 font-display text-2xl font-bold">${item.price} <span className="text-xs font-normal text-[var(--fm-text-tertiary)]">{item.currency}</span></p>
                    </button>
                  ))}
                </div>
              </Card>
            )}
            {service.capabilities.requiresPackage && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Choose your package</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {service.packages?.map((item) => (
                    <button key={item.slug} type="button" onClick={() => setPackageSlug(item.slug)} className={`rounded-[var(--fm-radius-md)] border p-4 text-left ${packageSlug === item.slug ? "border-[var(--fm-lime)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)]"}`}>
                      <div className="flex items-center justify-between"><span className="font-semibold">{item.name}</span>{packageSlug === item.slug && <Check className="h-4 w-4 text-[var(--fm-lime)]" />}</div>
                      <p className="mt-2 font-display text-2xl font-bold">${item.price} <span className="text-xs font-normal text-[var(--fm-text-tertiary)]">{item.currency}</span></p>
                      <p className="mt-2 text-xs leading-5 text-[var(--fm-text-secondary)]">{item.description}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}
            {service.capabilities.requiresJurisdiction && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Choose your jurisdiction</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.jurisdictions?.map((item) => (
                    <button key={item.slug} type="button" onClick={() => setJurisdictionSlug(item.slug)} className={`rounded-[var(--fm-radius-md)] border p-4 text-left ${jurisdictionSlug === item.slug ? "border-[var(--fm-lime)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:border-[var(--fm-border-accent)]"}`}>
                      <div className="flex items-center justify-between"><span className="font-semibold">{item.name}</span>{jurisdictionSlug === item.slug && <Check className="h-4 w-4 text-[var(--fm-lime)]" />}</div>
                      <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">${item.filingFee} filing fee</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}
            {service.capabilities.supportsAddOns && addOns.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold">Optional services</h2>
                <div className="mt-4 space-y-3">
                  {addOns.map((item) => {
                    const checked = addOnSlugs.includes(item.slug);
                    return (
                      <button key={item.slug} type="button" onClick={() => setAddOnSlugs((current) => checked ? current.filter((slug) => slug !== item.slug) : [...current, item.slug])} className={`flex w-full items-center justify-between rounded-[var(--fm-radius-md)] border p-4 text-left ${checked ? "border-[var(--fm-lime)] bg-[var(--fm-lime-soft)]" : "border-[var(--fm-border)] bg-[var(--fm-surface)]"}`}>
                        <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-[var(--fm-text-secondary)]">{item.description}</p></div>
                        <span className="font-semibold">+${item.price}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
          <Card variant="feature" tone="dark" className="h-fit p-6 lg:sticky lg:top-24">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-lime)]">Your selection</p>
            <h2 className="mt-2 text-2xl font-semibold">{service.name}</h2>
            <div className="mt-6 space-y-3 border-y border-[var(--fm-border)] py-5">
              {selectedVariant && <Row label={selectedVariant.name} value={`$${selectedVariant.price}`} />}
              {!selectedVariant && selectedPackage && <Row label={selectedPackage.name} value={`$${selectedPackage.price}`} />}
              {selectedJurisdiction && <Row label={`${selectedJurisdiction.name} filing`} value={`$${selectedJurisdiction.filingFee}`} />}
              {!selectedVariant && addOnSlugs.map((slug) => { const item = addOns.find((addon) => addon.slug === slug); return item ? <Row key={slug} label={item.name} value={`$${item.price}`} /> : null; })}
            </div>
            <div className="flex items-end justify-between gap-4"><span className="text-sm text-[var(--fm-text-secondary)]">Starting total</span><span className="font-display text-4xl font-bold text-[var(--fm-lime-bright)]">${totalPreview}</span></div>
            {error && <p role="alert" className="mt-4 rounded-[var(--fm-radius-md)] bg-[var(--fm-danger-soft)] p-3 text-sm text-[var(--fm-danger)]">{error}</p>}
            <button type="button" disabled={!canContinue || loading} onClick={continueToApplication} className="mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Starting..." : <>Continue application <ArrowRight className="h-4 w-4" /></>}</button>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 text-sm"><span className="text-[var(--fm-text-secondary)]">{label}</span><span className="font-semibold text-[var(--fm-text-primary)]">{value}</span></div>;
}
