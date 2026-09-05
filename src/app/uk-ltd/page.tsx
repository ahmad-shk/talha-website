import Link from "next/link";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export const metadata = {
  title: "UK LTD Formation | Audvertax",
  description:
    "Form a UK private limited company through a guided application with Audvertax.",
};

export default function UKLTDPage() {
  const service = getServiceBySlug("uk-ltd");

  if (!service) return null;

  const journey = [
    "Choose your package",
    "Complete company details",
    "Add optional services",
    "Review and checkout",
    "Track your order",
  ];

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <section className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <SectionLabel>UK LTD Formation</SectionLabel>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-[var(--fm-text-primary)] md:text-6xl">Start your UK company from anywhere.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--fm-text-secondary)] md:text-lg">Form your UK private limited company through a guided application, with a clear setup process for local and international founders.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartApplicationButton serviceSlug="uk-ltd" packageSlug="standard" variant="default" size="lg">Start your UK LTD</StartApplicationButton>
              <Link href="/services" className="inline-flex h-12 items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 text-sm font-medium text-[var(--fm-text-primary)] transition-colors duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]">View services</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]"><span>✓ Guided application</span><span>✓ Remote-friendly process</span><span>✓ Formation support</span></div>
          </div>

          <Card variant="feature" className="p-5 md:p-7">
            <div className="border-b border-[var(--fm-border)] pb-5"><SectionLabel>Formation journey</SectionLabel><p className="mt-2 text-sm text-[var(--fm-text-secondary)]">A guided path from company details to registration.</p></div>
            <div className="mt-6 space-y-2">
              {journey.map((title, index) => (
                <div key={title} className="flex items-center gap-4 p-3 transition-colors duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-raised)]"><IconContainer className="size-9 rounded-full text-xs font-mono font-semibold">{String(index + 1).padStart(2, "0")}</IconContainer><span className="text-sm font-medium text-[var(--fm-text-primary)]">{title}</span></div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="border-b border-[var(--fm-border)]"><div className="mx-auto max-w-7xl px-6 py-20 md:px-8"><div className="max-w-2xl"><SectionLabel>Packages</SectionLabel><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)] md:text-4xl">Choose the level of support you need.</h2><p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">Start with essential formation or choose a more complete setup.</p></div><div className="mt-10 grid gap-5 lg:grid-cols-3">{service.packages?.map((pkg) => { const featured = pkg.slug === "complete"; return <Card key={pkg.slug} variant={featured ? "elevated" : "standard"} className={featured ? "border-[var(--fm-border-accent)]" : ""}><div className="flex min-h-full flex-col p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">{pkg.name}</p>{featured && <span className="mt-2 inline-flex rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime-soft)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--fm-lime)]">Recommended</span>}</div></div><div className="mt-5 flex items-end gap-1"><span className="text-4xl font-semibold tracking-[-0.04em]">{pkg.price === 0 ? "Custom" : `£${pkg.price}`}</span>{pkg.price > 0 && <span className="mb-1 font-mono text-[10px] uppercase text-[var(--fm-text-tertiary)]">GBP</span>}</div><p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">{pkg.description}</p><ul className="mt-6 flex-1 space-y-3 border-t border-[var(--fm-border)] pt-5">{pkg.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-[var(--fm-text-secondary)]"><span className="text-[var(--fm-lime)]">✓</span><span>{feature}</span></li>)}</ul><StartApplicationButton serviceSlug="uk-ltd" packageSlug={pkg.slug} variant="default" size="default" className="mt-8 w-full">Choose {pkg.name}</StartApplicationButton></div></Card>; })}</div></div></section>

      <section className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]"><div className="mx-auto max-w-7xl px-6 py-20 md:px-8"><SectionLabel>Formation decision</SectionLabel><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-4xl">A UK company setup should feel like a system, not a form.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01", "Company", "Set up the legal entity and core company details."],["02", "Services", "Add only the operational services your business needs."],["03", "Progress", "Review, pay and track the formation from one place."]].map(([number, title, description]) => <Card key={number} variant="standard" className="p-5"><p className="font-mono text-[11px] text-[var(--fm-lime)]">{number}</p><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">{description}</p></Card>)}</div></div></section>

      <section className="border-t border-[var(--fm-border)] bg-[var(--fm-surface)]"><div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-8"><SectionLabel>Ready when you are</SectionLabel><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Ready to establish your UK company?</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--fm-text-secondary)] md:text-base">Complete the guided application and move from company idea to UK registration.</p><StartApplicationButton serviceSlug="uk-ltd" packageSlug="standard" variant="default" size="lg" className="mt-8">Start your UK LTD</StartApplicationButton></div></section>
    </main>
  );
}
