"use client";

type ApplicationProgressProps = {
  steps: { id: string; title: string }[];
  currentStep: number;
};

export default function ApplicationProgress({ steps, currentStep }: ApplicationProgressProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), Math.max(steps.length - 1, 0));
  const progress = steps.length ? ((safeStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-[var(--fm-text-primary)]">Application progress</span>
        <span className="font-mono text-[11px] text-[var(--fm-text-tertiary)]">Step {safeStep + 1} of {steps.length}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-[var(--fm-radius-pill)] bg-[var(--fm-surface-raised)]">
        <div className="h-full rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] transition-[width] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 hidden gap-3 md:grid" style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(steps.length, 1), 6)}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const completed = index < safeStep;
          const active = index === safeStep;
          return (
            <div key={step.id} className="min-w-0">
              <div className="flex items-center gap-2">
                <div className={["flex size-7 shrink-0 items-center justify-center rounded-[var(--fm-radius-pill)] border text-xs font-semibold transition-[background-color,border-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]", completed ? "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]" : active ? "border-[var(--fm-lime)] bg-[var(--fm-lime-soft)] text-[var(--fm-lime)]" : "border-[var(--fm-border)] bg-[var(--fm-surface-raised)] text-[var(--fm-text-tertiary)]"].join(" ")}>{completed ? "✓" : index + 1}</div>
                <span className={["truncate text-xs", active || completed ? "font-medium text-[var(--fm-text-primary)]" : "text-[var(--fm-text-tertiary)]"].join(" ")}>{step.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
