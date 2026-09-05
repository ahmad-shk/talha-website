"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug } from "@/lib/services";
import { calculateApplicationPricing } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, IconContainer, SectionLabel, StatusBadge } from "@/components/ui/design-system";

export default function CheckoutSuccessPage() {
  return <Suspense fallback={<CheckoutSuccessFallback />}><CheckoutSuccessContent /></Suspense>;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const { application } = useApplicationState();
  const validApplication = application && (!applicationId || application.id === applicationId) ? application : null;

  if (!validApplication) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <SectionLabel>Confirmation</SectionLabel>
          <h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">Confirmation unavailable</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">We couldn&apos;t find the application associated with this confirmation in this browser session.</p>
          <Button asChild className="mt-6 w-full"><Link href="/">Return home</Link></Button>
        </Card>
      </main>
    );
  }

  const service = getServiceBySlug(validApplication.serviceSlug);
  const selectedServices = Array.isArray(validApplication.answers.additional_services) ? validApplication.answers.additional_services.map(String) : [];
  const pricing = calculateApplicationPricing({ serviceSlug: validApplication.serviceSlug, packageSlug: validApplication.packageSlug, additionalServices: selectedServices });

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Card variant="feature" className="p-7 md:p-12">
          <div className="flex flex-col items-center text-center">
            <IconContainer className="size-14 rounded-[var(--fm-radius-pill)] border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)] text-xl">✓</IconContainer>
            <div className="mt-6"><StatusBadge status="success">Order confirmed</StatusBadge></div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">Your application is ready</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--fm-text-secondary)]">Your application has been recorded in this browser session. Payment and backend persistence will be connected in the integration phase.</p>
          </div>

          <div className="mt-8 rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-5">
            <div className="flex flex-col gap-fm-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-text-tertiary)]">Application ID</p><p className="mt-1 break-all font-mono text-sm text-[var(--fm-text-primary)]">{validApplication.id}</p></div>
              <div className="sm:text-right"><p className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-text-tertiary)]">Service</p><p className="mt-1 text-sm font-semibold text-[var(--fm-text-primary)]">{service?.name ?? "Formation service"}</p></div>
            </div>
            <div className="mt-5 grid gap-fm-5 border-t border-[var(--fm-border)] pt-5 sm:grid-cols-2">
              <div><p className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-text-tertiary)]">Customer</p><p className="mt-1 text-sm text-[var(--fm-text-secondary)]">{String(validApplication.answers.customer_name ?? "Not provided")}</p></div>
              <div><p className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-text-tertiary)]">Email</p><p className="mt-1 break-all text-sm text-[var(--fm-text-secondary)]">{String(validApplication.answers.customer_email ?? "Not provided")}</p></div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[var(--fm-border)] pt-5"><span className="font-semibold text-[var(--fm-text-primary)]">Order total</span><span className="text-xl font-semibold text-[var(--fm-lime-bright)]">{pricing.currency} {pricing.total.toFixed(2)}</span></div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline"><Link href={`/apply/${validApplication.id}`}>View application</Link></Button>
            <Button asChild><Link href="/">Return home</Link></Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

function CheckoutSuccessFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6">
      <Card className="w-full max-w-md p-8 text-center"><div className="mx-auto size-8 animate-pulse rounded-full bg-[var(--fm-surface-raised)]" /><p className="mt-4 text-sm text-[var(--fm-text-tertiary)]">Loading confirmation...</p></Card>
    </main>
  );
}
