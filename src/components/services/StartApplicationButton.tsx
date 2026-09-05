"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKey, SignIn, UserPlus, X } from "@phosphor-icons/react";

import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { getServiceBySlug } from "@/lib/services";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

type Props = {
  serviceSlug: string;
  packageSlug?: string;
  formationState?: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function StartApplicationButton({
  serviceSlug,
  packageSlug,
  formationState,
  children,
  className,
  variant,
  size,
}: Props) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { startApplication } = useApplicationState();
  const [loading, setLoading] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  async function start() {
    if (loading) return;
    if (authLoading) return;
    if (!user) {
      setShowAuthMessage(true);
      return;
    }

    const service = getServiceBySlug(serviceSlug);
    if (!service) {
      console.error(`Unknown service: ${serviceSlug}`);
      return;
    }

    setLoading(true);
    try {
      const id = await startApplication({ serviceSlug, packageSlug, formationState });
      router.push(`/apply/${id}`);
    } catch (error) {
      console.error("Unable to start application:", error);
      setLoading(false);
    }
  }

  function chooseAuth(destination: "/login" | "/signup") {
    setShowAuthMessage(false);
    router.push(destination);
  }

  const authMessage = showAuthMessage && typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[rgba(11,14,11,.75)] px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAuthMessage(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-llc-auth-title"
            className="my-auto w-full max-w-[430px] rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 shadow-[var(--fm-shadow-overlay)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime-bright)]">
                <LockKey className="h-5 w-5" weight="duotone" />
              </div>
              <button
                type="button"
                onClick={() => setShowAuthMessage(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--fm-radius-md)] text-[var(--fm-text-tertiary)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 id="start-llc-auth-title" className="mt-5 font-sans text-[22px] font-semibold tracking-[-0.02em] text-[var(--fm-text-primary)]">
              Sign in to start your LLC
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[var(--fm-text-secondary)]">
              Create an account or sign in to save your application and track your LLC formation from your dashboard.
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseAuth("/login")}
                className="flex h-11 items-center justify-center gap-2 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[14px] font-semibold text-[var(--fm-text-primary)] transition-[border-color,background-color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
              >
                <SignIn className="h-4 w-4" />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => chooseAuth("/signup")}
                className="flex h-11 items-center justify-center gap-2 rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[14px] font-semibold text-[var(--fm-graphite-deep)] transition-[background-color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"
              >
                <UserPlus className="h-4 w-4" />
                Create account
                <ArrowRight className="h-3.5 w-3.5" weight="bold" />
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={start}
        disabled={loading || authLoading}
        className={cn(variant ? buttonVariants({ variant, size }) : undefined, className)}
      >
        {loading ? "Starting..." : children}
      </button>
      {authMessage}
    </>
  );
}
