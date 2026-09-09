"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/design-system";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { UsaGlowMap } from "@/components/UsaGlowMap";
import { formationStates, getServiceBySlug } from "@/lib/services";

type StateInfo = (typeof formationStates)[number];
const PACKAGES = getServiceBySlug("usa-llc")?.packages ?? [];

const styles = {
  section: "relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-[clamp(72px,10vh,110px)] text-[var(--fm-text-primary)]",
  background: "pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(46%_40%_at_88%_12%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_62%),radial-gradient(40%_38%_at_8%_70%,color-mix(in_srgb,var(--fm-lime)_4.5%,transparent),transparent_62%)]",
  container: "relative z-[1] mx-auto w-full max-w-[1240px]",
  intro: "max-w-[760px]",
  eyebrow: "font-mono text-fm-label font-semibold uppercase tracking-[.18em] text-[var(--fm-lime)]",
  heading: "mt-4 font-display text-fm-section font-extrabold leading-[var(--fm-type-section-line-height)] tracking-fm-section text-[var(--fm-text-primary)]",
  headingAccent: "text-[var(--fm-lime-bright)]",
  description: "mt-[18px] text-[17px] leading-relaxed text-[var(--fm-text-secondary)]",
  packageSection: "mt-12",
  packageHeading: "font-display text-2xl font-extrabold tracking-[-.03em] text-[var(--fm-text-primary)]",
  packageDescription: "mt-2 text-sm text-[var(--fm-text-secondary)]",
  packageGrid: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-3",
  packageCard: "relative cursor-pointer border border-[var(--fm-border)] bg-[var(--fm-surface)] p-5 text-left transition-[border-color,background-color,transform] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-0.5 hover:border-[var(--fm-border-accent)]",
  packageCardActive: "border-[var(--fm-lime)] bg-[var(--fm-surface-raised)]",
  packageName: "font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  packagePrice: "mt-2 font-display text-3xl font-extrabold tracking-[-.03em] text-[var(--fm-text-primary)]",
  packageCopy: "mt-2 text-xs leading-5 text-[var(--fm-text-secondary)]",
  packageFeatures: "mt-4 space-y-2 border-t border-[var(--fm-border)] pt-4",
  packageFeature: "flex gap-2 text-xs text-[var(--fm-text-secondary)]",
  packageCheck: "text-[var(--fm-lime)]",
  selectedPackage: "absolute right-4 top-4 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[var(--fm-graphite-deep)]",
  layout: "mt-[54px] grid grid-cols-1 items-start gap-9 lg:grid-cols-[minmax(340px,1.5fr)_minmax(330px,1fr)]",
  previewColumn: "min-w-0",
  previewCard: "relative flex min-h-[320px] flex-col items-center justify-center gap-8 overflow-hidden p-10 text-center",
  previewGrid: "pointer-events-none absolute inset-0 opacity-70 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px),linear-gradient(color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px)] [background-size:36px_36px]",
  mapMarker: "absolute z-[2] grid h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-[color-mix(in_srgb,var(--fm-border)_85%,white)] bg-gradient-to-br from-[color-mix(in_srgb,var(--fm-lime)_82%,#3c2e59)] to-[color-mix(in_srgb,var(--fm-lime)_52%,#261d36)] shadow-[0_12px_24px_color-mix(in_srgb,var(--fm-lime)_18%,transparent)]",
  mapIcon: "h-7 w-7 text-[var(--fm-graphite-deep)]",
  selectedState: "absolute bottom-7 left-7 z-[1] text-left",
  selectedLabel: "font-mono text-[11px] font-bold uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  selectedCode: "font-bold text-[var(--fm-lime-bright)]",
  selectedName: "mt-1 font-display text-[clamp(2rem,2.8vw,3.2rem)] font-extrabold leading-none text-[var(--fm-text-primary)]",
  popular: "mt-[22px] flex flex-wrap items-center gap-2.5",
  popularLabel: "font-mono text-[11px] uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  stateButton: "rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-[18px] py-[9px] text-[13px] font-bold text-[var(--fm-lime-bright)] transition-[background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)] hover:text-black",
  stateButtonActive: "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:border-[var(--fm-lime)] hover:bg-[var(--fm-lime)] hover:text-[var(--fm-graphite-deep)]",
  sourceNote: "mt-[18px] font-mono text-[11px] leading-relaxed text-[var(--fm-text-secondary)]",
  detailCard: "p-8",
  detailHeader: "flex items-start justify-between gap-3.5",
  detailCode: "font-mono text-[11px] uppercase tracking-[.16em] text-[var(--fm-text-secondary)]",
  detailName: "mt-1.5 font-display text-[34px] font-extrabold leading-[1.1] tracking-[-.02em] text-[var(--fm-text-primary)]",
  tag: "mt-1 flex-shrink-0 whitespace-nowrap rounded-[var(--fm-radius-pill)] border border-[color-mix(in_srgb,var(--fm-lime)_30%,transparent)] bg-[var(--fm-lime-soft)] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase text-[var(--fm-lime-bright)]",
  note: "mt-2.5 text-[13.5px] font-semibold text-[var(--fm-lime-bright)]",
  metrics: "mt-6 grid grid-cols-2 gap-3",
  metric: "rounded-[var(--fm-radius-md)] border border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] p-4",
  metricLabel: "font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--fm-text-secondary)]",
  metricValue: "mt-[5px] font-display text-2xl font-extrabold text-[var(--fm-text-primary)]",
  metricNote: "mt-0.5 text-[11.5px] text-[var(--fm-text-secondary)]",
  renewal: "mt-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] p-4",
  renewalLabel: "font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--fm-text-secondary)]",
  renewalValue: "mt-[5px] text-[15px] font-bold text-[var(--fm-text-primary)]",
  investment: "mt-6 flex items-baseline justify-between gap-3.5 border-t border-[var(--fm-border)] pt-5",
  investmentTitle: "text-sm font-bold text-[var(--fm-text-primary)]",
  investmentBreakdown: "mt-[3px] font-mono text-[11px] text-[var(--fm-text-secondary)]",
  total: "flex-shrink-0 font-display text-[38px] font-extrabold tracking-[-.02em] text-[var(--fm-lime-bright)]",
  renewalSummary: "mt-1.5 flex items-baseline justify-between gap-3.5",
  renewalSummaryLabel: "text-[13px] font-semibold text-[var(--fm-text-secondary)]",
  renewalSummaryValue: "font-display text-xl font-extrabold text-[var(--fm-text-primary)]",
  cta: "mt-6 w-full",
} as const;

const stateMapFocus = {
  wyoming: { x: 310, y: 180 },
  "new-mexico": { x: 430, y: 285 },
  delaware: { x: 635, y: 220 },
  texas: { x: 510, y: 330 },
  florida: { x: 725, y: 380 },
} as const;

export default function StateExplorerSection() {
  const [selected, setSelected] = useState<StateInfo>(formationStates[0]);
  const [packageSlug, setPackageSlug] = useState(PACKAGES[0]?.slug ?? "basic");
  const selectedPackage = PACKAGES.find((item) => item.slug === packageSlug) ?? PACKAGES[0];
  const total = useMemo(() => selected.filingFee + (selectedPackage?.price ?? 0), [selected, selectedPackage]);
  const selectedFocus = stateMapFocus[selected.slug as keyof typeof stateMapFocus] ?? { x: 500, y: 280 };

  return (
    <section id="states" aria-labelledby="states-heading" className={styles.section}>
      <div className={styles.background} />
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>USA LLC Formation</span>
          <h2 id="states-heading" className={styles.heading}>Choose your package. Choose your state. <span className={styles.headingAccent}>Know your total.</span></h2>
          <p className={styles.description}>Start by choosing the level of support you need. Then select your state to see the filing fee, renewal cost and your exact first-year investment.</p>
        </div>

        <div className={styles.packageSection}>
          <h3 className={styles.packageHeading}>1. Choose your package</h3>
          <p className={styles.packageDescription}>Your package covers Audvertax services. State filing fees are shown separately.</p>
          <div className={styles.packageGrid}>
            {PACKAGES.map((pkg) => {
              const active = pkg.slug === selectedPackage?.slug;
              return (
                <button key={pkg.slug} type="button" onClick={() => setPackageSlug(pkg.slug)} aria-pressed={active} className={`${styles.packageCard} ${active ? styles.packageCardActive : ""}`}>
                  {active && <span className={styles.selectedPackage}>Selected</span>}
                  <p className={styles.packageName}>{pkg.name}</p>
                  <p className={styles.packagePrice}>${pkg.price}</p>
                  <p className={styles.packageCopy}>{pkg.description}</p>
                  <ul className={styles.packageFeatures}>
                    {pkg.features.map((feature) => <li key={feature} className={styles.packageFeature}><span className={styles.packageCheck}>✓</span><span>{feature}</span></li>)}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.previewColumn}>
            <p className={styles.packageHeading}>2. Choose your state</p>
            <p className={styles.packageDescription}>Compare the state costs before starting your application.</p>
            <Card variant="elevated" tone="dark" className={`${styles.previewCard} mt-5`}>
              <div className={styles.previewGrid} />
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <UsaGlowMap color="var(--fm-lime)" focus={selectedFocus} />
              </div>
              <div className={styles.mapMarker} style={{ left: `${(selectedFocus.x / 1000) * 100}%`, top: `${(selectedFocus.y / 560) * 100}%` }}><MapPin className={styles.mapIcon} /></div>
              <div className={styles.selectedState}><p className={styles.selectedLabel}>Selected state · <span className={styles.selectedCode}>{selected.abbreviation}</span></p><p className={styles.selectedName}>{selected.name}</p></div>
            </Card>
            <div className={styles.popular}><span className={styles.popularLabel}>States:</span>{formationStates.map((state) => <button key={state.slug} type="button" onClick={() => setSelected(state)} className={`${styles.stateButton} ${selected.slug === state.slug ? styles.stateButtonActive : ""}`}>{state.name}</button>)}</div>
            <p className={styles.sourceNote}>Fees compiled from state Secretary of State schedules, June 2026.<br />State fees are paid to the state, not to Audvertax.</p>
          </div>

          <Card variant="elevated" tone="dark" className={styles.detailCard}>
            <div className={styles.detailHeader}><div><p className={styles.detailCode}>{selected.abbreviation}</p><p className={styles.detailName}>{selected.name}</p></div><span className={styles.tag}>{selectedPackage?.name ?? "USA LLC"}</span></div>
            <p className={styles.note}>{selected.description}</p>
            <div className={styles.metrics}><Metric label="State filing fee" value={`$${selected.filingFee}`} note="one-time" /><Metric label="Renewal fee" value={`$${selected.renewalFee}`} note="every year" /></div>
            <div className={styles.renewal}><p className={styles.renewalLabel}>Renewal due</p><p className={styles.renewalValue}>{selected.renewalDue}</p></div>
            <div className={styles.investment}><div><p className={styles.investmentTitle}>First-year investment</p><p className={styles.investmentBreakdown}>${selected.filingFee} state fee + {selectedPackage?.name ?? "Package"} ${selectedPackage?.price ?? 0}</p></div><p className={styles.total}>${total}</p></div>
            <div className={styles.renewalSummary}><p className={styles.renewalSummaryLabel}>From year 2, state renewal</p><p className={styles.renewalSummaryValue}>${selected.renewalFee} / yr</p></div>
            <StartApplicationButton serviceSlug="usa-llc" packageSlug={selectedPackage?.slug} formationState={selected.slug} variant="default" size="lg" className={styles.cta}>Form my {selected.name} LLC</StartApplicationButton>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className={styles.metric}><p className={styles.metricLabel}>{label}</p><p className={styles.metricValue}>{value}</p><p className={styles.metricNote}>{note}</p></div>;
}
