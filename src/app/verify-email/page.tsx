"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing-token" | "missing-email">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("missing-token");
      setMessage("This verification link is missing the token.");
      return;
    }

    if (!email) {
      setStatus("missing-email");
      setMessage("This verification link is incomplete. Please request a new verification email from the app.");
      return;
    }

    verifyEmail(email, token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully.");
        window.setTimeout(() => router.replace("/login"), 1800);
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "This verification link is invalid or expired.");
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
