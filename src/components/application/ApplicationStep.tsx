"use client";

import type { ApplicationField, ApplicationStep as ApplicationStepConfig } from "@/lib/services";
import ApplicationFieldComponent from "./ApplicationField";

type ApplicationStepProps = {
  step: ApplicationStepConfig;
  answers: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (field: ApplicationField, value: unknown) => void;
};

export default function ApplicationStep({ step, answers, errors, onChange }: ApplicationStepProps) {
  return (
    <section className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">Application information</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)] md:text-3xl">{step.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)] md:text-base">{step.description}</p>
      </header>
      <div className="space-y-7">
        {step.fields.map((field) => <ApplicationFieldComponent key={field.key} field={field} value={answers[field.key]} error={errors[field.key]} onChange={(value) => onChange(field, value)} />)}
      </div>
    </section>
  );
}
