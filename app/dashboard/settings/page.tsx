"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Bell, Shield, Save, CheckCircle2, Lock } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/lib/api";

export default function SettingsPage() {
  const [name, setName] = useState("Justina");
  const [email, setEmail] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function save() {
    window.localStorage.setItem("audvertax.settings", JSON.stringify({ name, email, emailUpdates, applicationAlerts }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  async function handleUpdatePassword() {
    setPasswordError("");
    setPasswordMessage("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword || undefined,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Unable to update password.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8"><div><SectionLabel>Audvertax</SectionLabel><h1 className="mt-1 font-semibold">Settings</h1></div><Link href="/dashboard" className="text-sm font-medium text-[var(--fm-text-secondary)] hover:text-[var(--fm-text-primary)]">Back to dashboard</Link></div></header>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8"><SectionLabel>Account</SectionLabel><h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Settings</h2><p className="mt-2 text-sm text-[var(--fm-text-secondary)]">Manage your customer profile and notification preferences.</p></div>
        <div className="space-y-6">
          <Card variant="standard" className="p-6"><div className="flex items-center gap-3"><IconContainer><User size={19} /></IconContainer><div><h3 className="font-semibold">Profile</h3><p className="text-xs text-[var(--fm-text-tertiary)]">Basic customer information.</p></div></div><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-medium">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]" /></label><label className="text-sm font-medium">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]" /></label></div></Card>
          <Card variant="standard" className="p-6"><div className="flex items-center gap-3"><IconContainer><Bell size={19} /></IconContainer><div><h3 className="font-semibold">Notifications</h3><p className="text-xs text-[var(--fm-text-tertiary)]">Choose which customer updates you receive.</p></div></div><div className="mt-5 divide-y divide-[var(--fm-border)]"><label className="flex cursor-pointer items-center justify-between py-4"><span><span className="block text-sm font-semibold">Email updates</span><span className="mt-1 block text-xs text-[var(--fm-text-secondary)]">General service and account updates.</span></span><input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} className="h-5 w-5 accent-[var(--fm-lime)]" /></label><label className="flex cursor-pointer items-center justify-between py-4"><span><span className="block text-sm font-semibold">Application alerts</span><span className="mt-1 block text-xs text-[var(--fm-text-secondary)]">Important changes to your LLC application.</span></span><input type="checkbox" checked={applicationAlerts} onChange={(e) => setApplicationAlerts(e.target.checked)} className="h-5 w-5 accent-[var(--fm-lime)]" /></label></div></Card>
          <Card variant="standard" className="p-6"><div className="flex items-center gap-4"><IconContainer><Shield size={19} /></IconContainer><div><h3 className="font-semibold">Security</h3><p className="text-sm leading-6 text-[var(--fm-text-secondary)]">Update your password and manage account security.</p></div></div><div className="mt-6 space-y-4"><label className="block text-sm font-medium">Current password<input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))} placeholder="Current password" className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]" /></label><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium">New password<input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))} placeholder="New password" className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]" /></label><label className="block text-sm font-medium">Confirm password<input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))} placeholder="Confirm new password" className="mt-2 h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] focus:border-[var(--fm-border-accent)] focus:ring-2 focus:ring-[var(--fm-lime-soft)]" /></label></div>{passwordError && <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/25 bg-[var(--fm-danger-soft)] px-3 py-2 text-sm text-[var(--fm-danger)]">{passwordError}</div>}{passwordMessage && <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/30 bg-[var(--fm-lime-soft)] px-3 py-2 text-sm text-[var(--fm-lime)]">{passwordMessage}</div>}<div className="flex justify-end"><button type="button" onClick={handleUpdatePassword} className="inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-4 py-2.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)]"><Lock size={16} />Update password</button></div></div></Card>
          <div className="flex items-center justify-end gap-3"><span className="text-sm font-medium text-[var(--fm-success)]">{saved && <><CheckCircle2 size={16} className="mr-1 inline" />Saved locally</>}</span><Button onClick={save}><Save size={16} />Save settings</Button></div>
        </div>
      </div>
    </main>
  );
}
