"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApplicationField, ApplicationConfig } from "@/lib/services";
import { useApplicationState } from "./ApplicationStateProvider";
import ApplicationProgress from "./ApplicationProgress";
import ApplicationStep from "./ApplicationStep";
import ApplicationNavigation from "./ApplicationNavigation";
import { Card, SectionLabel, StatusBadge } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/interaction-controls";

type ApplicationShellProps = {
  config: ApplicationConfig;
  serviceName: string;
  applicationId?: string;
  initialAnswers?: Record<string, unknown>;
  initialStep?: number;
};

const LOCKED_STATUSES = new Set(["paid", "processing", "completed", "cancelled"]);

type StatusTone = "success" | "info" | "warning" | "danger" | "neutral";

function getStatusTone(status: string): StatusTone {
  if (status === "completed") return "success";
  if (["paid", "processing"].includes(status)) return "info";
  if (["in_review", "ready_for_payment"].includes(status)) return "warning";
  if (status === "cancelled") return "danger";
  return "neutral";
}

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ApplicationShell({ config, serviceName, applicationId, initialAnswers = {}, initialStep = 0 }: ApplicationShellProps) {
  const { application, startApplication, updateApplication } = useApplicationState();
  const matchingApplication = application?.serviceSlug === config.serviceSlug ? application : null;
  const effectiveApplicationId = applicationId ?? matchingApplication?.id;
  const readOnly = Boolean(matchingApplication && LOCKED_STATUSES.has(matchingApplication.status));
  const [currentStep, setCurrentStep] = useState(() => Math.min(Math.max(initialStep, 0), Math.max(config.steps.length - 1, 0)));
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (applicationId || matchingApplication) return;
    void startApplication({ serviceSlug: config.serviceSlug }).catch((error) => console.error("Unable to create application:", error));
  }, [applicationId, matchingApplication, startApplication, config.serviceSlug]);

  useEffect(() => {
    if (!matchingApplication) return;
    setAnswers(matchingApplication.answers);
    setCurrentStep(Math.min(Math.max(matchingApplication.currentStep, 0), Math.max(config.steps.length - 1, 0)));
  }, [matchingApplication, config.steps.length]);

  const stepCount = config.steps.length;
  const stepProgress = useMemo(() => config.steps.map((item) => ({ id: item.id, title: item.title })), [config.steps]);

  function updateAnswer(field: ApplicationField, value: unknown) {
    if (readOnly) return;
    setAnswers((current) => ({ ...current, [field.key]: value }));
    setErrors((current) => { const next = { ...current }; delete next[field.key]; return next; });
  }

  function validateStep() {
    const step = config.steps[currentStep];
    if (!step) return false;
    const nextErrors: Record<string, string> = {};
    for (const field of step.fields) {
      const value = answers[field.key];
      const empty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
      if (field.required && empty) { nextErrors[field.key] = "This field is required."; continue; }
      if (typeof value === "string" && field.validation?.minLength !== undefined && value.length < field.validation.minLength) nextErrors[field.key] = `Please enter at least ${field.validation.minLength} characters.`;
      if (typeof value === "string" && field.validation?.maxLength !== undefined && value.length > field.validation.maxLength) nextErrors[field.key] = `Please enter no more than ${field.validation.maxLength} characters.`;
      if (typeof value === "number" && field.validation?.min !== undefined && value < field.validation.min) nextErrors[field.key] = `The minimum value is ${field.validation.min}.`;
      if (typeof value === "number" && field.validation?.max !== undefined && value > field.validation.max) nextErrors[field.key] = `The maximum value is ${field.validation.max}.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function saveApplication(nextStep: number, status = matchingApplication?.status) {
    if (readOnly || !matchingApplication) return false;
    setSaving(true);
    try {
      await updateApplication({ currentStep: nextStep, answers, ...(status ? { status } : {}) });
      return true;
    } catch (error) {
      console.error("Unable to save application:", error);
      setErrors((current) => ({ ...current, _application: "We couldn't save your application. Please try again." }));
      return false;
    } finally { setSaving(false); }
  }

  async function handleNext() {
    if (readOnly || saving || !validateStep()) return;
    if (currentStep === stepCount - 1) {
      const saved = await saveApplication(currentStep, "ready_for_payment");
      if (saved) setShowReview(true);
      return;
    }
    const nextStep = currentStep + 1;
    const saved = await saveApplication(nextStep, "draft");
    if (!saved) return;
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleBack() {
    if (readOnly || saving) return;
    if (showReview) { setShowReview(false); return; }
    if (currentStep === 0) return;
    const nextStep = currentStep - 1;
    const saved = await saveApplication(nextStep, "draft");
    if (!saved) return;
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function continueToCheckout() {
    if (readOnly || !effectiveApplicationId || saving) return;
    const saved = await saveApplication(currentStep, "ready_for_payment");
    if (!saved) return;
    window.location.href = `/checkout?applicationId=${encodeURIComponent(effectiveApplicationId)}`;
  }

  function getDisplayValue(value: unknown): string {
    if (Array.isArray(value)) return value.join(", ");
    if (value === undefined || value === null || value === "") return "Not provided";
    return String(value);
  }

  if (!matchingApplication && applicationId) return <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6 text-[var(--fm-text-primary)]"><LoadingState label="Loading your application..." /></main>;

  if (readOnly) {
    const lockedApplication = matchingApplication;
    if (!lockedApplication) return null;
    return (
      <div className="min-h-screen bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
        <div className="border-b border-[var(--fm-border-soft)] bg-[var(--fm-graphite)]"><div className="mx-auto max-w-5xl px-4 py-5 md:px-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><SectionLabel>Audvertax</SectionLabel><p className="mt-1 font-semibold">{serviceName}</p></div><StatusBadge status={getStatusTone(lockedApplication.status)}><span className="h-1.5 w-1.5 rounded-full bg-current" />{lockedApplication.status === "paid" ? "Paid" : getStatusLabel(lockedApplication.status)}</StatusBadge></div></div></div>
        <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8"><SectionLabel>Application details</SectionLabel><h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Your application</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">This application is locked because it has already been submitted for processing. Your saved information is shown below for reference.</p></div>
          <Card className="mb-8 border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)] p-5 text-sm text-[var(--fm-text-secondary)]">{lockedApplication.status === "paid" ? "Payment has been received. Your application can no longer be edited." : "This application can no longer be edited."}</Card>
          <div className="mb-8"><ApplicationProgress steps={stepProgress} currentStep={stepCount - 1} /></div>
          <div className="space-y-5">{config.steps.map((reviewStep) => <Card key={reviewStep.id} className="p-5 md:p-6"><div className="mb-5"><h2 className="font-semibold">{reviewStep.title}</h2><p className="mt-1 text-sm text-[var(--fm-text-secondary)]">{reviewStep.description}</p></div><div className="divide-y divide-[var(--fm-border-soft)]">{reviewStep.fields.map((field) => <div key={field.key} className="grid gap-1 py-4 first:pt-0 last:pb-0 md:grid-cols-2"><div className="text-sm text-[var(--fm-text-secondary)]">{field.label}</div><div className="text-sm font-medium md:text-right">{getDisplayValue(lockedApplication.answers[field.key])}</div></div>)}</div></Card>)}</div>
        </main>
      </div>
    );
  }

  const step = config.steps[currentStep];
  if (!step) return null;

  if (showReview) return (
    <div className="min-h-screen bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]"><div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12"><Button type="button" variant="ghost" onClick={handleBack} disabled={saving} className="mb-6 px-0">← Back to application</Button><SectionLabel>Final review</SectionLabel><h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Review your application</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">Check your information before continuing to checkout.</p><div className="mt-8 space-y-5">{config.steps.map((reviewStep, index) => <Card key={reviewStep.id} className="p-5 md:p-6"><div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="font-semibold">{reviewStep.title}</h2><p className="mt-1 text-sm text-[var(--fm-text-secondary)]">{reviewStep.description}</p></div><Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => { setCurrentStep(index); setShowReview(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</Button></div><div className="divide-y divide-[var(--fm-border-soft)]">{reviewStep.fields.map((field) => <div key={field.key} className="grid gap-1 py-4 first:pt-0 last:pb-0 md:grid-cols-2"><div className="text-sm text-[var(--fm-text-secondary)]">{field.label}</div><div className="text-sm font-medium md:text-right">{getDisplayValue(answers[field.key])}</div></div>)}</div></Card>)}</div><Card variant="elevated" className="mt-8 p-6">{errors._application && <p className="mb-4 rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/40 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]" role="alert">{errors._application}</p>}<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">Application complete</p><p className="mt-1 text-sm text-[var(--fm-text-secondary)]">Your application is ready for checkout.</p></div><Button type="button" size="lg" disabled={!effectiveApplicationId || saving} onClick={() => void continueToCheckout()}>{saving ? "Saving..." : "Continue to checkout"}</Button></div></Card></div></div>
  );

  return <div className="min-h-screen bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]"><div className="border-b border-[var(--fm-border-soft)] bg-[var(--fm-graphite)]"><div className="mx-auto max-w-5xl px-4 py-5 md:px-6"><div className="flex items-center justify-between gap-4"><div><SectionLabel>Audvertax</SectionLabel><p className="mt-1 font-semibold">{serviceName}</p></div><span className="rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-3 py-1.5 font-mono text-[11px] text-[var(--fm-text-secondary)]">{saving ? "Saving..." : "Saved automatically"}</span></div></div></div><main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12"><div className="mb-10"><ApplicationProgress steps={stepProgress} currentStep={currentStep} /></div>{errors._application && <div className="mb-5 rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/40 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]" role="alert">{errors._application}</div>}<Card className="p-5 md:p-8"><ApplicationStep step={step} answers={answers} errors={errors} onChange={updateAnswer} /><div className="mt-10"><ApplicationNavigation currentStep={currentStep} totalSteps={stepCount} onBack={() => void handleBack()} onNext={() => void handleNext()} isLastStep={currentStep === stepCount - 1} /></div></Card></main></div>;
}
