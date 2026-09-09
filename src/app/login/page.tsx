"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { login, loginWithGoogle } from "@/lib/api";
import GuestGuard from "@/components/auth/GuestGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, SectionLabel } from "@/components/ui/design-system";

type GoogleCredentialResponse = { credential: string };
type GoogleAccountsId = {
  initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void | Promise<void> }) => void;
  renderButton: (parent: HTMLElement, options: { theme: string; size: string; width: number; text: string; shape: string }) => void;
};
type GoogleIdentity = { accounts: { id: GoogleAccountsId } };
type GoogleWindow = Window & { google?: GoogleIdentity };

const pendingKey = "audvertax.pendingApplicationSelection";

function LoginForm() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);

  async function continueAfterAuth() {
    const raw = window.sessionStorage.getItem(pendingKey);
    if (!raw) {
      router.replace("/dashboard");
      return;
    }
    try {
      const selection = JSON.parse(raw) as { serviceSlug: string; packageSlug?: string; jurisdictionSlug?: string; variantSlug?: string; addOnSlugs?: string[] };
      window.sessionStorage.removeItem(pendingKey);
      const params = new URLSearchParams({ service: selection.serviceSlug });
      if (selection.packageSlug) params.set("package", selection.packageSlug);
      if (selection.jurisdictionSlug) params.set("state", selection.jurisdictionSlug);
      if (selection.variantSlug) params.set("variant", selection.variantSlug);
      if (selection.addOnSlugs?.length) params.set("addons", selection.addOnSlugs.join(","));
      router.replace(`/apply/start?${params.toString()}`);
    } catch {
      window.sessionStorage.removeItem(pendingKey);
      router.replace("/dashboard");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(email, password);
      setAuthenticatedUser(response.data.user);
      await continueAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const google = (window as GoogleWindow).google;
    if (!googleReady || !google || !googleButtonRef.current) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleLoading(false);
      return;
    }
    google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }: GoogleCredentialResponse) => {
        try {
          setError("");
          const response = await loginWithGoogle(credential);
          setAuthenticatedUser(response.data.user);
          await continueAfterAuth();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unable to sign in with Google.");
          setGoogleLoading(false);
        }
      },
    });
    googleButtonRef.current.innerHTML = "";
    google.accounts.id.renderButton(googleButtonRef.current, { theme: "outline", size: "large", width: 400, text: "continue_with", shape: "rectangular" });
    setGoogleLoading(false);
  }, [googleReady, router, setAuthenticatedUser]);

  const fields = [
    { label: "Email address", value: email, setValue: setEmail, type: "email" as const, placeholder: "you@example.com" },
    { label: "Password", value: password, setValue: setPassword, type: "password" as const, placeholder: "Enter your password" },
  ];

  return <>
    <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setGoogleReady(true)} />
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[var(--fm-graphite-deep)] px-5 py-16 text-[var(--fm-text-primary)] sm:px-8 lg:py-24">
      <Card variant="feature" tone="dark" className="relative mx-auto grid w-full max-w-5xl overflow-hidden lg:grid-cols-[.88fr_1.12fr]">
        <div className="relative hidden bg-[var(--fm-graphite-deep)] p-12 lg:flex lg:flex-col lg:justify-between"><div><div className="mb-8 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime-soft)] px-3 py-1.5 font-mono text-[9px] font-bold tracking-[.16em] text-[var(--fm-lime)]"><span className="size-1.5 rounded-full bg-[var(--fm-lime)]"/>AUDVERTAX / ACCOUNT</div><h1 className="max-w-sm font-display text-4xl font-bold leading-[.98] tracking-[-.055em]">Your business, <span className="text-[var(--fm-lime)]">one control layer.</span></h1><p className="mt-5 max-w-sm text-sm leading-7 text-[var(--fm-text-secondary)]">Continue applications, track orders, manage documents, and keep your Audvertax services organized.</p></div><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--fm-text-tertiary)]"><ShieldCheck className="h-5 w-5 text-[var(--fm-lime)]"/>Secure account access</div></div>
        <div className="bg-[var(--fm-surface-raised)] p-7 sm:p-10 lg:p-14"><div className="mb-8"><SectionLabel>Welcome back</SectionLabel><h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em]">Sign in to Audvertax</h2><p className="mt-2 text-sm text-[var(--fm-text-secondary)]">Access your applications and account dashboard.</p></div>{error&&<div role="alert" className="mb-5 rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/25 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]">{error}</div>}<div className="flex min-h-11 w-full items-center justify-center overflow-hidden rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-2 py-1"><div ref={googleButtonRef}/>{googleLoading&&<Loader2 className="h-4 w-4 animate-spin text-[var(--fm-lime)]"/>}</div><div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-[var(--fm-border)]"/><span className="font-mono text-[9px] text-[var(--fm-text-tertiary)]">OR</span><div className="h-px flex-1 bg-[var(--fm-border)]"/></div><form onSubmit={handleSubmit} className="space-y-5">{fields.map(({label,value,setValue,type,placeholder})=><label key={label} className="block"><span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">{label}</span><input value={value} onChange={e=>setValue(e.target.value)} type={type} autoComplete={type} required placeholder={placeholder} className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)]"/></label>)}<button disabled={loading} type="submit" className="group flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] disabled:opacity-60">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<>Sign in <ArrowRight className="h-4 w-4"/></>}</button></form><p className="mt-8 text-center text-sm text-[var(--fm-text-tertiary)]">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-[var(--fm-lime)] hover:underline">Create one</Link></p></div>
      </Card>
    </main>
  </>;
}

export default function Login(){return <GuestGuard><LoginForm/></GuestGuard>;}
