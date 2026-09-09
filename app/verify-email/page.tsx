"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailWarning, RefreshCw } from "lucide-react";
import { resendVerification, verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? params.get("verificationToken") ?? params.get("verifyToken");
  const emailFromQuery = params.get("email") ?? "";
  const [email, setEmail] = useState(emailFromQuery);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing-token" | "missing-email">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setStatus("missing-email");
      setMessage("Enter your email address to request a new verification link.");
      return;
    }

    setResending(true);
    try {
      await resendVerification(targetEmail);
      setResent(true);
      setStatus("error");
      setMessage("A fresh verification email has been sent. Please use the new link to continue.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send a new verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus("missing-token");
      setMessage("This verification link is missing the token. Please request a new verification email from the app.");
      return;
    }

    verifyEmail(email || null, token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully.");
        window.setTimeout(() => router.replace("/login"), 1800);
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "This verification link is invalid or expired. Please request a new verification email from the app.");
      });
  }, [email, router, token]);

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[var(--fm-graphite-deep)] px-6 py-12 text-[var(--fm-text-primary)]">
      <div className="w-full max-w-lg rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-8 text-center shadow-2xl shadow-black/20">
        {status === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--fm-lime)]" />}
        {status === "success" && <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--fm-lime)]" />}
        {(status === "error" || status === "missing-token" || status === "missing-email") && <MailWarning className="mx-auto h-12 w-12 text-[var(--fm-warning)]" />}

        <h1 className="mt-5 font-display text-3xl font-bold tracking-[-.04em]">
          {status === "success" ? "Email verified" : "Verification status"}
        </h1>

        <p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">{message}</p>

        {(status === "success" || status === "error" || status === "missing-token" || status === "missing-email") && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)]">
              Go to login
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-5 py-3 text-sm font-semibold text-[var(--fm-text-primary)] transition hover:border-[var(--fm-lime)]">
              Create account
            </Link>
          </div>
        )}

        {(status === "error" || status === "missing-token" || status === "missing-email") && (
          <div className="mt-6 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-left">
            <label className="block text-left text-xs font-mono uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">Email address</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 py-2.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)]"
              />
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-4 py-2.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {resending ? "Sending..." : "Send new link"}
              </button>
            </div>
            {resent && <p className="mt-3 text-xs text-[var(--fm-lime)]">New verification email sent.</p>}
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[var(--fm-graphite-deep)]"><Loader2 className="h-8 w-8 animate-spin text-[var(--fm-lime)]" /></main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
