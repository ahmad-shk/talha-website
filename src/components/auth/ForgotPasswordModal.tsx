"use client";

import { useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await forgotPassword(email.trim());
      setStatus("success");
      setMessage("Password reset link sent. Please check your email.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(4,8,12,0.72)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-6 shadow-2xl shadow-black/25">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--fm-lime)]/30 bg-[var(--fm-lime-soft)] text-[var(--fm-lime)]">
          <Mail className="h-5 w-5" />
        </div>

        <p className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-lime)]">Forgot password</p>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">Reset your password</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">Enter the email address linked to your account and we’ll send a reset link.</p>

        <label className="mt-5 block">
          <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">Email address</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
          />
        </label>

        {message && (
          <div className={`mt-4 rounded-[var(--fm-radius-md)] px-3 py-2 text-sm ${status === "success" ? "border border-[var(--fm-lime)]/30 bg-[var(--fm-lime-soft)] text-[var(--fm-lime)]" : "border border-[var(--fm-danger)]/25 bg-[var(--fm-danger-soft)] text-[var(--fm-danger)]"}`}>
            {message}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3 text-sm font-semibold text-[var(--fm-text-primary)] transition hover:border-[var(--fm-lime)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-4 py-3 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </div>
    </div>
  );
}
