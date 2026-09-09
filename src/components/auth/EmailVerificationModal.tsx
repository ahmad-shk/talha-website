"use client";

import { useEffect, useState } from "react";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { getCurrentUser, resendVerification } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

export default function EmailVerificationModal({
  email,
  open,
  onVerified,
}: {
  email: string | null;
  open: boolean;
  onVerified?: () => Promise<void> | void;
}) {
  const { setAuthenticatedUser } = useAuth();
  const [resendSeconds, setResendSeconds] = useState(60);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkIfVerified = async () => {
    if (!email || !open) return false;

    try {
      const response = await getCurrentUser();
      const nextUser = response.data.user;

      if (nextUser.emailVerified === true) {
        setAuthenticatedUser(nextUser);
        await onVerified?.();
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!open || !email) return;

    setResendSeconds(60);
    const countdown = window.setInterval(() => {
      setResendSeconds((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [open, email]);

  useEffect(() => {
    if (!open || !email) return;

    const poll = window.setInterval(() => {
      void checkIfVerified();
    }, 5000);

    return () => window.clearInterval(poll);
  }, [email, open, onVerified, setAuthenticatedUser]);

  const handleResend = async () => {
    if (!email || resendSeconds > 0 || resending) return;

    setResending(true);
    try {
      await resendVerification(email);
      setResendSeconds(60);
    } finally {
      setResending(false);
    }
  };

  const handleCheckNow = async () => {
    if (!email || checking) return;

    setChecking(true);
    try {
      await checkIfVerified();
    } finally {
      setChecking(false);
    }
  };

  if (!open || !email) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(4,8,12,0.72)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--fm-lime)]/30 bg-[var(--fm-lime-soft)] text-[var(--fm-lime)]">
          <MailCheck className="h-5 w-5" />
        </div>

        <p className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-lime)]">Verification required</p>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">Please verify your email</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">
          We sent a confirmation link to <span className="font-semibold text-[var(--fm-text-primary)]">{email}</span>. Please check your inbox and click it to continue.
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--fm-border)] pt-4 text-sm">
          {resendSeconds > 0 ? (
            <span className="font-mono text-xs text-[var(--fm-text-tertiary)]">Resend available in {resendSeconds}s</span>
          ) : (
            <button type="button" onClick={handleResend} disabled={resending} className="inline-flex items-center gap-2 font-semibold text-[var(--fm-lime)] transition hover:text-[var(--fm-lime-bright)] disabled:opacity-60">
              {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {resending ? "Sending..." : "Resend email"}
            </button>
          )}

          <button
            type="button"
            onClick={handleCheckNow}
            disabled={checking}
            className="flex flex-1 items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-4 py-3 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : "I verified it"}
          </button>
        </div>
      </div>
    </div>
  );
}
