"use client";

import { Button } from "@/components/ui/button";

type ApplicationNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isLastStep?: boolean;
};

export default function ApplicationNavigation({ currentStep, totalSteps, onBack, onNext, isLastStep = false }: ApplicationNavigationProps) {
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-[var(--fm-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Button type="button" variant="ghost" onClick={onBack} disabled={isFirstStep}>Back</Button>
      <span className="hidden font-mono text-[11px] text-[var(--fm-text-tertiary)] sm:block">{currentStep + 1} / {totalSteps}</span>
      <Button type="button" onClick={onNext}>{isLastStep ? "Review application" : "Continue"}</Button>
    </div>
  );
}
