import Link from "next/link";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { formationStates, getServiceBySlug } from "@/lib/services";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { SectionHeader } from "@/components/ui/interaction-controls";

export const metadata = {
  title: "USA LLC Formation | Audvertax",
  description: "Form a U.S. LLC remotely with guided formation support, state selection and business setup services.",
};

const primaryLink = "inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-6 py-3.5 text-sm font-semibold text-[var(--fm-graphite-deep)] transition-colors duration-[var(--fm-motion-component)] hover:bg-[var(--fm-lime-bright)]";
const secondaryLink = "inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--fm-text-primary)] transition-colors duration-[var(--fm-motion-component)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]";

export default function USALLCPage() {
  const service = getServiceBySlug("usa-llc");
  if (!service) return null;

  return (
    <main className="bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
      <section className="border-b border-[var(--fm-border)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <SectionLabel>USA LLC Formation</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">Start your U.S. business from anywhere.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--fm-text-secondary)] md:text-lg">Form your U.S. LLC through a guided application and get the essential business services you need to move from formation to operation.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartApplicationButton serviceSlug="usa-llc" variant="default" size="lg">Start your LLC</StartApplicationButton>
              <Link href="/usa-llc/pricing" className={secondaryLink}>View pricing</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]"><span>✓ Guided application</span><span>✓ Remote-friendly process</span><span>✓ Formation support</span></div>
          </div>
          <Card variant="feature" className="p-5 md:p-7"><div className="rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-6"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fm-lime)]">Formation journey</p><div className="mt-6 space-y-1">{["Choose your package", "Select your state", "Complete your application", "Review and checkout", "Track your order"].map((title, index) => <div key={title} className="flex items-center gap-4 border-l border-[var(--fm-border)] py-3 pl-4 first:border-[var(--fm-lime)]"><span className="font-mono text-[11px] font-bold text-[var(--fm-lime)]">0{index + 1}</span><span className="text-sm font-medium text-[var(--fm-text-primary)]">{title}</span></div>)}</div></div></Card>
        </div>
      </section>

      <section className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite)]"><div className="mx-auto max-w-7xl px-6 py-20 md:px-8"><SectionHeader eyebrow="Packages" title="Choose the level of support you need." description="Start with essential formation or choose a more complete setup." /><div className="mt-10 grid gap-fm-5 lg:grid-cols-3">{service.packages?.map((pkg) => { const featured = pkg.slug === "advanced"; return <Card key={pkg.slug} variant={featured ? "feature" : "standard"} className={featured ? "border-[var(--fm-border-accent)] bg-[var(--fm-surface-raised)]" : ""}><div className="p-6"><p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">{pkg.name}</p><div className="mt-4 flex items-end gap-2"><span className="text-4xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">{pkg.price === 0 ? "Custom" : `$${pkg.price}`}</span>{pkg.price > 0 && <span className="mb-1 text-sm text-[var(--fm-text-tertiary)]">USD</span>}</div><p className="mt-4 min-h-12 text-sm leading-6 text-[var(--fm-text-secondary)]">{pkg.description}</p><ul className="mt-6 space-y-3">{pkg.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-[var(--fm-text-secondary)]"><span className="text-[var(--fm-lime)]">✓</span><span>{feature}</span></li>)}</ul><StartApplicationButton serviceSlug="usa-llc" packageSlug={pkg.slug} variant={featured ? "default" : "outline"} size="lg" className="mt-8 w-full">Choose {pkg.name}</StartApplicationButton></div></Card>; })}</div></div></section>

      <section className="border-b border-[var(--fm-border)]"><div className="mx-auto max-w-7xl px-6 py-20 md:px-8"><SectionHeader eyebrow="Formation states" title="Choose where to form your LLC." description="Different states have different costs, requirements and practical considerations." /><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{formationStates.map((state) => <Card key={state.slug} variant="interactive" className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-[var(--fm-text-primary)]">{state.name}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">{state.tag}</p></div><span className="rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-2.5 py-1 font-mono text-[10px] text-[var(--fm-text-secondary)]">{state.abbreviation}</span></div><p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">{state.description}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3"><p className="text-xs text-[var(--fm-text-tertiary)]">Filing</p><p className="mt-1 font-semibold text-[var(--fm-text-primary)]">${state.filingFee}</p></div><div className="rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3"><p className="text-xs text-[var(--fm-text-tertiary)]">Renewal</p><p className="mt-1 font-semibold text-[var(--fm-text-primary)]">{state.renewalFee === 0 ? "None" : `$${state.renewalFee}`}</p></div></div><StartApplicationButton serviceSlug="usa-llc" formationState={state.slug} className="mt-5 text-sm font-semibold text-[var(--fm-lime)] underline decoration-[var(--fm-border-accent)] underline-offset-4">Select this state →</StartApplicationButton></Card>)}</div></div></section>

      <section><div className="mx-auto max-w-7xl px-6 py-20 md:px-8"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionLabel>Beyond formation</SectionLabel><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Build your business stack after formation.</h2><p className="mt-5 text-fm-body text-[var(--fm-text-secondary)]">Your LLC is the foundation. Add the services you actually need as your business grows.</p></div><div className="grid gap-3 sm:grid-cols-2">{["EIN assistance", "Registered agent", "Business address", "Operating agreement", "Business banking", "Payment gateway"].map((item) => <Card key={item} className="p-4"><div className="flex items-center gap-3"><IconContainer className="size-8 rounded-[var(--fm-radius-pill)] text-xs">✓</IconContainer><span className="text-sm font-medium text-[var(--fm-text-primary)]">{item}</span></div></Card>)}</div></div></div></section>

      <section className="border-t border-[var(--fm-border)] bg-[var(--fm-surface)]"><div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-8"><SectionLabel>Ready to begin?</SectionLabel><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">Ready to start your U.S. business?</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--fm-text-secondary)] md:text-base">Complete the guided application and move from business idea to company formation.</p><Link href="/usa-llc/apply" className={`${primaryLink} mt-8`}>Start your USA LLC</Link></div></section>
    </main>
  );
}
