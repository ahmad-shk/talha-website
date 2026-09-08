import Link from "next/link";
import { notFound } from "next/navigation";

import ApplicationShell from "@/components/application/ApplicationShell";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { formationStates, getApplicationConfig, getServiceBySlug } from "@/lib/services";

export const metadata = {
  title: "Apply for a USA LLC | Audvertax",
  description: "Complete your USA LLC formation application with Audvertax.",
};

type ApplyPageProps = {
  searchParams: Promise<{ package?: string; state?: string }>;
};

export default async function USALLCApplyPage({ searchParams }: ApplyPageProps) {
  const service = getServiceBySlug("usa-llc");
  const config = getApplicationConfig("usa-llc");
  if (!service || !config) notFound();

  const params = await searchParams;
  const packages = service.packages ?? [];
  const selectedPackage = packages.find((pkg) => pkg.slug === params.package);
  const selectedState = formationStates.find((state) => state.slug === params.state);

  if (!selectedPackage) {
    return (
      <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-16 text-[var(--fm-text-primary)] md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <SectionLabel>USA LLC formation</SectionLabel>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Choose your formation package.</h1>
            <p className="mt-5 text-base leading-7 text-[var(--fm-text-secondary)]">Select the level of support you want before starting your application. Your selection will stay attached to the application as you continue.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.slug} variant={pkg.slug === "standard" ? "elevated" : "feature"} className="flex flex-col p-7">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">{pkg.name}</p>
                <div className="mt-4 flex items-baseline gap-2"><span className="text-5xl font-semibold tracking-[-0.05em]">${pkg.price}</span><span className="text-sm text-[var(--fm-text-tertiary)]">+ state fee</span></div>
                <p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">{pkg.description}</p>
                <ul className="mt-6 flex-1 space-y-3">{pkg.features.map((feature) => <li key={feature} className="flex gap-3 text-sm text-[var(--fm-text-secondary)]"><span className="text-[var(--fm-lime)]">✓</span><span>{feature}</span></li>)}</ul>
                <Link href={`/usa-llc/apply?package=${encodeURIComponent(pkg.slug)}`} className="mt-8 inline-flex h-12 items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 text-sm font-semibold text-[var(--fm-graphite-deep)] transition-colors hover:bg-[var(--fm-lime-bright)]">Choose {pkg.name}</Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!selectedState) {
    return (
      <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-16 text-[var(--fm-text-primary)] md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <SectionLabel>USA LLC formation</SectionLabel>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Choose your formation state.</h1>
            <p className="mt-5 text-base leading-7 text-[var(--fm-text-secondary)]">You selected the {selectedPackage.name} package. Choose the state where you want to form your LLC to continue.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formationStates.map((state) => (
              <Card key={state.slug} variant="interactive" className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-[var(--fm-text-primary)]">{state.name}</h2>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">{state.tag}</p>
                  </div>
                  <span className="rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-2.5 py-1 font-mono text-[10px] text-[var(--fm-text-secondary)]">{state.abbreviation}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--fm-text-secondary)]">{state.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3"><p className="text-xs text-[var(--fm-text-tertiary)]">Filing</p><p className="mt-1 font-semibold text-[var(--fm-text-primary)]">${state.filingFee}</p></div>
                  <div className="rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3"><p className="text-xs text-[var(--fm-text-tertiary)]">Renewal</p><p className="mt-1 font-semibold text-[var(--fm-text-primary)]">{state.renewalFee === 0 ? "None" : `$${state.renewalFee}`}</p></div>
                </div>
                <StartApplicationButton serviceSlug="usa-llc" packageSlug={selectedPackage.slug} formationState={state.slug} className="mt-5 text-sm font-semibold text-[var(--fm-lime)] underline decoration-[var(--fm-border-accent)] underline-offset-4">Select this state →</StartApplicationButton>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return <ApplicationShell config={config} serviceName={service.name} packageSlug={selectedPackage.slug} formationState={selectedState.slug} />;
}
