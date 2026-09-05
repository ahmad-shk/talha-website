"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/design-system";

type StateInfo = {
  code: string;
  name: string;
  tag: string;
  note: string;
  filingFee: number;
  renewalFee: number;
  renewalDue: string;
};

const STATES: StateInfo[] = [
  { code: "WY", name: "Wyoming", tag: "Non-resident favourite", note: "#1 for non-residents · privacy · no state income tax", filingFee: 100, renewalFee: 60, renewalDue: "1st day of anniversary month" },
  { code: "DE", name: "Delaware", tag: "Investor favourite", note: "Preferred by VCs · strong corporate law · no sales tax", filingFee: 110, renewalFee: 300, renewalDue: "June 1st every year" },
  { code: "NM", name: "New Mexico", tag: "Lowest ongoing cost", note: "No annual report · no state income tax on foreign LLCs", filingFee: 50, renewalFee: 0, renewalDue: "No annual report required" },
  { code: "TX", name: "Texas", tag: "Large domestic market", note: "No state income tax · big consumer & B2B market", filingFee: 300, renewalFee: 0, renewalDue: "Franchise report, no fee under threshold" },
  { code: "FL", name: "Florida", tag: "Popular for e-commerce", note: "No state income tax · fast processing times", filingFee: 125, renewalFee: 139, renewalDue: "May 1st every year" },
];

const PACKAGES = { Standard: 119, Advanced: 179 } as const;
type Package = keyof typeof PACKAGES;

const styles = {
  section: "relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-[clamp(72px,10vh,110px)] text-[var(--fm-text-primary)]",
  background: "pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(46%_40%_at_88%_12%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_62%),radial-gradient(40%_38%_at_8%_70%,color-mix(in_srgb,var(--fm-lime)_4.5%,transparent),transparent_62%)]",
  container: "relative z-[1] mx-auto w-full max-w-[1240px]",
  intro: "max-w-[680px]",
  eyebrow: "font-mono text-fm-label font-semibold uppercase tracking-[.18em] text-[var(--fm-lime)]",
  heading: "mt-4 font-display text-fm-section font-extrabold leading-[var(--fm-type-section-line-height)] tracking-fm-section text-[var(--fm-text-primary)]",
  headingAccent: "text-[var(--fm-lime-bright)]",
  description: "mt-[18px] text-[17px] leading-relaxed text-[var(--fm-text-secondary)]",
  layout: "mt-[54px] grid grid-cols-1 items-start gap-9 lg:grid-cols-[minmax(340px,1.5fr)_minmax(330px,1fr)]",
  previewColumn: "min-w-0",
  previewCard: "relative flex min-h-[320px] flex-col items-center justify-center gap-8 overflow-hidden p-10 text-center",
  previewGrid: "pointer-events-none absolute inset-0 opacity-70 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px),linear-gradient(color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px)] [background-size:36px_36px]",
  mapMarker: "relative z-[1] grid h-[140px] w-[140px] place-items-center rounded-full border-4 border-[var(--fm-border)] bg-gradient-to-br from-[var(--fm-lime)] to-[#863691] shadow-[0_20px_50px_color-mix(in_srgb,var(--fm-lime)_18%,transparent)]",
  mapIcon: "h-14 w-14 text-[var(--fm-graphite-deep)]",
  selectedState: "relative z-[1]",
  selectedLabel: "font-mono text-fm-label uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  selectedCode: "font-bold text-[var(--fm-lime-bright)]",
  selectedName: "mt-1 font-display text-3xl font-extrabold text-[var(--fm-text-primary)]",
  popular: "mt-[22px] flex flex-wrap items-center gap-2.5",
  popularLabel: "font-mono text-[11px] uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  stateButton: "rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-[18px] py-[9px] text-[13px] font-bold text-[var(--fm-lime-bright)] transition-[background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]",
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
  package: "mt-6",
  packageTitle: "text-sm font-semibold text-[var(--fm-text-primary)]",
  packageToggle: "mt-2.5 flex gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-graphite-deep)] p-[5px]",
  packageButton: "flex-1 rounded-[var(--fm-radius-pill)] py-[11px] text-[13.5px] font-bold text-[var(--fm-lime-bright)] transition-[background-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-raised)]",
  packageButtonActive: "bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime)] hover:text-[var(--fm-graphite-deep)]",
  investment: "mt-6 flex items-baseline justify-between gap-3.5 border-t border-[var(--fm-border)] pt-5",
  investmentTitle: "text-sm font-bold text-[var(--fm-text-primary)]",
  investmentBreakdown: "mt-[3px] font-mono text-[11px] text-[var(--fm-text-secondary)]",
  total: "flex-shrink-0 font-display text-[38px] font-extrabold tracking-[-.02em] text-[var(--fm-lime-bright)]",
  renewalSummary: "mt-1.5 flex items-baseline justify-between gap-3.5",
  renewalSummaryLabel: "text-[13px] font-semibold text-[var(--fm-text-secondary)]",
  renewalSummaryValue: "font-display text-xl font-extrabold text-[var(--fm-text-primary)]",
  cta: "mt-6 w-full",
} as const;

export default function StateExplorerSection() {
  const [selected, setSelected] = useState<StateInfo>(STATES[0]);
  const [pkg, setPkg] = useState<Package>("Standard");
  const total = useMemo(() => selected.filingFee + PACKAGES[pkg], [selected, pkg]);

  return (
    <section id="states" aria-labelledby="states-heading" className={styles.section}>
      <div className={styles.background} />
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>State Explorer</span>
          <h2 id="states-heading" className={styles.heading}>Choose your state. <span className={styles.headingAccent}>Know every dollar.</span></h2>
          <p className={styles.description}>Click any state to see its filing fee, renewal cost and deadlines, and your exact first-year investment with Audvertax.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.previewColumn}>
            <Card variant="elevated" tone="dark" className={styles.previewCard}>
              <div className={styles.previewGrid} />
              <div className={styles.mapMarker}><MapPin className={styles.mapIcon} /></div>
              <div className={styles.selectedState}>
                <p className={styles.selectedLabel}>Selected state · <span className={styles.selectedCode}>{selected.code}</span></p>
                <p className={styles.selectedName}>{selected.name}</p>
              </div>
            </Card>

            <div className={styles.popular}>
              <span className={styles.popularLabel}>Popular:</span>
              {STATES.map((state) => (
                <button key={state.code} type="button" onClick={() => setSelected(state)} className={`${styles.stateButton} ${selected.code === state.code ? styles.stateButtonActive : ""}`}>
                  {state.name}
                </button>
              ))}
            </div>
            <p className={styles.sourceNote}>Fees compiled from state Secretary of State schedules, June 2026.<br />State fees are paid to the state, not to Audvertax.</p>
          </div>

          <Card variant="elevated" tone="dark" className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <div><p className={styles.detailCode}>{selected.code}</p><p className={styles.detailName}>{selected.name}</p></div>
              <span className={styles.tag}>{selected.tag}</span>
            </div>
            <p className={styles.note}>{selected.note}</p>
            <div className={styles.metrics}>
              <Metric label="State filing fee" value={`$${selected.filingFee}`} note="one-time" />
              <Metric label="Renewal fee" value={`$${selected.renewalFee}`} note="every year" />
            </div>
            <div className={styles.renewal}><p className={styles.renewalLabel}>Renewal due</p><p className={styles.renewalValue}>{selected.renewalDue}</p></div>
            <div className={styles.package}>
              <p className={styles.packageTitle}>Your Audvertax package</p>
              <div className={styles.packageToggle}>
                {(Object.keys(PACKAGES) as Package[]).map((key) => (
                  <button key={key} type="button" onClick={() => setPkg(key)} className={`${styles.packageButton} ${pkg === key ? styles.packageButtonActive : ""}`}>{key}</button>
                ))}
              </div>
            </div>
            <div className={styles.investment}>
              <div><p className={styles.investmentTitle}>First-year investment</p><p className={styles.investmentBreakdown}>${selected.filingFee} state fee + {pkg} ${PACKAGES[pkg]}</p></div>
              <p className={styles.total}>${total}</p>
            </div>
            <div className={styles.renewalSummary}><p className={styles.renewalSummaryLabel}>From year 2, state renewal</p><p className={styles.renewalSummaryValue}>${selected.renewalFee} / yr</p></div>
            <Button render={<Link href="/get-started" />} className={styles.cta}>Form my {selected.name} LLC</Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className={styles.metric}><p className={styles.metricLabel}>{label}</p><p className={styles.metricValue}>{value}</p><p className={styles.metricNote}>{note}</p></div>;
}
