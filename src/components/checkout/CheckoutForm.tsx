"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { calculateApplicationPricing } from "@/lib/pricing";
import { createBillingOrder, getApplication, getBilling, payBillingOrder, type Application, type BillingOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, StatusBadge } from "@/components/ui/design-system";
import { Input, FieldLabel } from "@/components/ui/form-controls";

type Props = { applicationId: string };

export default function CheckoutForm({ applicationId }: Props) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [billingOrder, setBillingOrder] = useState<BillingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getApplication(applicationId)
      .then(async (applicationResponse) => {
        if (cancelled) return;
        const current = applicationResponse.data.application;
        setApplication(current);
        setName(typeof current.answers.customer_name === "string" ? current.answers.customer_name : "");
        setEmail(typeof current.answers.customer_email === "string" ? current.answers.customer_email : "");

        try {
          const billingResponse = await getBilling(applicationId);
          if (!cancelled) setBillingOrder(billingResponse.data);
        } catch (billingError) {
          // A ready_for_payment application is valid for checkout even when its
          // billing order has not been created yet. The order is created on submit.
          if (billingError instanceof Error && !billingError.message.toLowerCase().includes("billing information is not available")) {
            console.warn("Unable to load existing billing order:", billingError);
          }
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We couldn't load this checkout. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const service = application ? getServiceBySlug(application.serviceSlug) : undefined;
  const selectedAddOns = useMemo(() => Array.isArray(application?.addOnSlugs) ? application.addOnSlugs.map(String) : [], [application?.addOnSlugs]);
  const variantSlug = application?.variantSlug;
  const displayPricing = useMemo(() => application ? calculateApplicationPricing({ serviceSlug: application.serviceSlug, packageSlug: application.packageSlug, formationState: application.formationState, addOnSlugs: selectedAddOns, variantSlug }) : null, [application, selectedAddOns, variantSlug]);
  const alreadyPaid = ["paid", "processing", "completed"].includes(application?.status ?? "");
  const readyForPayment = application?.status === "ready_for_payment";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) return setError("Please enter your name and email address.");
    if (!application || application.id !== applicationId) return setError("This application is no longer available. Please return to your dashboard and try again.");

    setSubmitting(true);
    try {
      const currentResponse = await getApplication(applicationId);
      const current = currentResponse.data.application;
      setApplication(current);

      if (["paid", "processing", "completed"].includes(current.status)) {
        setError("This application has already been paid.");
        return;
      }
      if (current.status !== "ready_for_payment") {
        throw new Error("This application is not ready for payment. Return to the application and complete the required information first.");
      }

      const order = await createBillingOrder(applicationId);
      setBillingOrder(order.data);
      await payBillingOrder(applicationId);

      const paidApplicationResponse = await getApplication(applicationId);
      const paidApplication = paidApplicationResponse.data.application;
      setApplication(paidApplication);
      if (paidApplication.status !== "paid") throw new Error("Payment was received, but the application status could not be confirmed. Please refresh your dashboard before trying again.");
      router.push(`/checkout/success?applicationId=${encodeURIComponent(applicationId)}`);
    } catch (submitError) {
      console.error("Unable to complete checkout:", submitError);
      setError(submitError instanceof Error ? submitError.message : "We couldn't complete your checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6"><Card className="w-full max-w-md p-8 text-center"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">Checkout</p><h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">Loading checkout</h1><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">Loading your application and order details.</p></Card></main>;
  }

  if (!application || application.id !== applicationId) {
    return <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6"><Card className="w-full max-w-md p-8 text-center"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">Checkout</p><h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">Checkout unavailable</h1><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">{error || "This application is not available."}</p><Button type="button" variant="outline" className="mt-5 w-full" onClick={() => router.push("/dashboard")}>Return to dashboard</Button></Card></main>;
  }

  const currency = billingOrder?.currency ?? displayPricing?.currency ?? "USD";
  const total = billingOrder?.total ?? displayPricing?.total ?? 0;

  return <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-4 py-10 md:px-6 md:py-16"><div className="mx-auto max-w-5xl"><header className="mb-8"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">Audvertax checkout</p><div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">{alreadyPaid ? "Order already paid" : "Review your order"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">{alreadyPaid ? "This application has already been paid and cannot be paid again." : readyForPayment ? "Confirm your contact information before submitting your order." : "This application is not currently ready for payment."}</p></div><StatusBadge status={alreadyPaid ? "success" : readyForPayment ? "neutral" : "warning"}>{alreadyPaid ? "Paid" : readyForPayment ? "Ready for payment" : "Not ready"}</StatusBadge></div></header><div className="grid gap-6 lg:grid-cols-[1fr_380px]"><Card variant="elevated" className="p-6 md:p-8"><div className="mb-7"><p className="text-sm font-semibold text-[var(--fm-text-primary)]">Contact information</p><p className="mt-1 text-sm text-[var(--fm-text-tertiary)]">We'll use this information for your order and application records.</p></div><form onSubmit={submit} className="space-y-6"><div className="space-y-2"><FieldLabel htmlFor="checkout-name">Full name</FieldLabel><Input id="checkout-name" required disabled={alreadyPaid || submitting || !readyForPayment} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" /></div><div className="space-y-2"><FieldLabel htmlFor="checkout-email">Email address</FieldLabel><Input id="checkout-email" required disabled={alreadyPaid || submitting || !readyForPayment} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div>{error && <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)] bg-[var(--fm-danger-soft)] p-4 text-sm text-[var(--fm-danger)]" role="alert">{error}</div>}{alreadyPaid ? <Button type="button" variant="outline" className="w-full" onClick={() => router.push(`/dashboard/application?id=${encodeURIComponent(applicationId)}`)}>View application</Button> : <Button type="submit" disabled={submitting || !readyForPayment || !displayPricing?.lineItems.length} className="w-full">{submitting ? "Processing order..." : `Complete order — ${currency} ${total.toFixed(2)}`}</Button>}</form></Card><Card variant="standard" className="h-fit p-6 lg:sticky lg:top-6"><div className="border-b border-[var(--fm-border)] pb-5"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-text-tertiary)]">Order summary</p><h2 className="mt-2 text-xl font-semibold text-[var(--fm-text-primary)]">{service?.name ?? "Service"}</h2></div><div className="space-y-4 py-5">{billingOrder?.lineItems?.length ? billingOrder.lineItems.map((item) => <div key={item.key} className="flex items-start justify-between gap-4 text-sm"><span className="text-[var(--fm-text-secondary)]">{item.label}</span><span className="font-medium text-[var(--fm-text-primary)]">{item.currency} {item.total.toFixed(2)}</span></div>) : displayPricing?.lineItems.map((item) => <div key={item.key} className="flex items-start justify-between gap-4 text-sm"><span className="text-[var(--fm-text-secondary)]">{item.label}</span><span className="font-medium text-[var(--fm-text-primary)]">{item.currency} {item.total.toFixed(2)}</span></div>)}</div><div className="border-t border-[var(--fm-border)] pt-5"><div className="flex items-center justify-between"><span className="font-semibold text-[var(--fm-text-primary)]">Total</span><span className="text-xl font-semibold text-[var(--fm-lime-bright)]">{currency} {total.toFixed(2)}</span></div></div><div className="mt-5 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-3 text-xs leading-5 text-[var(--fm-text-tertiary)]">This is a temporary payment simulation. A real payment provider will replace it later.</div></Card></div></div></main>;
}