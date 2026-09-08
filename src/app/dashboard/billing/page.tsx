"use client";

import Link from "next/link";
import { CreditCard, FileText, Receipt, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug } from "@/lib/services";
import { calculateApplicationPricing } from "@/lib/pricing";
import { Card, SectionLabel, StatusBadge } from "@/components/ui/design-system";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  ready_for_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BillingPage() {
  const { application } = useApplicationState();

  if (!application) {
    return (
      <main className="min-h-screen bg-[var(--fm-graphite)] px-4 py-12 text-[var(--fm-text-primary)] md:px-8">
        <div className="mx-auto max-w-5xl">
          <Card variant="feature" className="p-10 text-center">
            <CreditCard className="mx-auto text-[var(--fm-lime)]" size={34} />
            <h1 className="mt-4 text-2xl font-semibold">Billing</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--fm-text-secondary)]">Your invoices and payment history will appear here after you start an application.</p>
            <Link href="/usa-llc" className={cn(buttonVariants(), "mt-6")}>Start an LLC</Link>
          </Card>
        </div>
      </main>
    );
  }

  const service = getServiceBySlug(application.serviceSlug);
  const pricing = calculateApplicationPricing({
    serviceSlug: application.serviceSlug,
    packageSlug: application.packageSlug,
    formationState: application.formationState,
    variantSlug: application.variantSlug,
    addOnSlugs: application.addOnSlugs,
  });
  const customerEmail = String(application.answers.customer_email ?? application.answers.email ?? "");
  const paymentReady = application.status === "ready_for_payment" || application.status === "draft";

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
          <div><SectionLabel>Audvertax</SectionLabel><h1 className="mt-1 font-semibold">Billing & Payments</h1></div>
          <Link href="/dashboard" className="text-sm font-medium text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]">Back to dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8"><SectionLabel>Payments</SectionLabel><h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Billing overview</h2><p className="mt-2 text-sm text-[var(--fm-text-secondary)]">Review your current application charges and payment status.</p></div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card variant="standard" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--fm-border)] px-6 py-5"><div><h3 className="font-semibold">Current order</h3><p className="mt-1 text-xs text-[var(--fm-text-tertiary)]">{service?.name ?? application.serviceSlug}</p></div><StatusBadge status={application.status === "cancelled" ? "danger" : application.status === "paid" || application.status === "completed" ? "success" : "info"}>{statusLabel[application.status]}</StatusBadge></div>
            <div className="p-6">
              {pricing.lineItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between border-b border-[var(--fm-border)] py-4 first:pt-0"><div><p className="text-sm font-semibold text-[var(--fm-text-primary)]">{item.label}</p><p className="mt-1 text-xs text-[var(--fm-text-tertiary)]">Qty {item.quantity}</p></div><p className="text-sm font-semibold">{item.currency} {item.total.toFixed(2)}</p></div>
              ))}
              <div className="mt-5 flex items-center justify-between"><span className="text-sm text-[var(--fm-text-secondary)]">Total</span><span className="text-xl font-semibold">{pricing.currency} {pricing.total.toFixed(2)}</span></div>
              {paymentReady && <Link href={`/checkout?applicationId=${application.id}`} className={cn(buttonVariants(), "mt-6 w-full")}>Continue to payment <ArrowUpRight size={16} /></Link>}
            </div>
          </Card>

          <aside className="space-y-6">
            <Card variant="standard" className="p-6"><CreditCard className="text-[var(--fm-lime)]" size={22} /><h3 className="mt-4 font-semibold">Payment method</h3><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">Secure card payments will be enabled when Stripe is reconnected.</p><div className="mt-4 flex items-center gap-2 rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3 text-xs text-[var(--fm-text-secondary)]"><ShieldCheck size={16} /> Payment details are not stored in this frontend.</div></Card>
            <Card variant="standard" className="p-6"><Receipt className="text-[var(--fm-text-secondary)]" size={21} /><h3 className="mt-4 font-semibold">Billing details</h3><p className="mt-2 text-sm text-[var(--fm-text-secondary)]">{customerEmail || "Email not provided"}</p><p className="mt-1 font-mono text-[10px] text-[var(--fm-text-tertiary)]">Application {application.id}</p></Card>
          </aside>
        </div>

        <Card variant="standard" className="mt-6 p-6"><div className="flex items-start gap-4"><FileText className="mt-0.5 text-[var(--fm-text-secondary)]" size={21} /><div><h3 className="font-semibold">Invoices & receipts</h3><p className="mt-1 text-sm leading-6 text-[var(--fm-text-secondary)]">No downloadable invoices yet. Once real payments are connected, receipts will be generated from confirmed Stripe payments.</p></div></div></Card>
      </div>
    </main>
  );
}