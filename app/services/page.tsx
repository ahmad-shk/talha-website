"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/design-system";

const rails = ["FORMATION", "TAX", "BANKING", "PAYMENTS", "COMPLIANCE", "GLOBAL RAILS"];

const markets = [
  {
    id: "01",
    country: "USA",
    description: "U.S. formation and taxation services.",
    href: "/usa-llc",
    icon: <MapPin className="h-5 w-5" weight="fill" />,
  },
  {
    id: "02",
    country: "UK",
    description: "UK company formation, compliance, VAT, tax and payroll services.",
    href: "/uk-ltd",
    icon: <MapPin className="h-5 w-5" weight="fill" />,
  },
  {
    id: "03",
    country: "UAE",
    description: "UAE company registration, tax, VAT, excise and bookkeeping services.",
    href: "/markets/uae",
    icon: <MapPin className="h-5 w-5" weight="fill" />,
  },
  {
    id: "04",
    country: "PAK",
    description: "Pakistani taxation, company and business registration services.",
    href: "/markets/pak",
    icon: <MapPin className="h-5 w-5" weight="fill" />,
  },
] as const;

export default function Services() {
  return (
    <main className="fm-page overflow-hidden bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
      <section className="relative isolate min-h-[82dvh] overflow-hidden bg-[var(--fm-graphite-deep)] px-fm-6 pb-fm-20 pt-28 sm:px-fm-10 lg:px-fm-14 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,var(--fm-hero-glow),transparent_31%),linear-gradient(110deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_55%,var(--fm-graphite-deep)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative z-[2] mx-auto grid min-h-[62dvh] w-full max-w-[1400px] items-center gap-fm-12 lg:grid-cols-[1fr_.85fr]">
          <div className="min-w-0 max-w-[800px]">
            <div className="mb-7 inline-flex items-center gap-3 rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/[.07] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]"><span className="h-2 w-2 rounded-full bg-[var(--fm-lime)]" />Business infrastructure / services</div>
            <h1 className="max-w-full break-all font-display font-bold tracking-[-.065em] sm:max-w-[10ch] sm:break-words" style={{ fontSize: "clamp(48px,7vw,94px)", lineHeight: .94 }}>Build the <span className="text-[var(--fm-lime)]">infrastructure</span> behind your business.</h1>
            <p className="mt-7 max-w-full text-[16px] leading-[1.65] text-[var(--fm-text-secondary)] sm:max-w-[650px] sm:text-[18px]">Formation, tax, banking and payment infrastructure—connected into one guided path for founders building across borders.</p>
            <div className="mt-9 flex flex-wrap gap-fm-3" />
          </div>
          <div className="relative hidden min-h-[480px] items-center justify-center lg:flex"><div className="absolute h-[420px] w-[420px] rounded-full bg-[var(--fm-hero-glow-soft)] blur-[var(--fm-hero-glow-blur)]" /><div className="relative h-[390px] w-[390px] rounded-full border border-[var(--fm-lime)]/15"><div className="absolute inset-[12%] rounded-full border border-dashed border-[var(--fm-lime)]/25" /><div className="absolute inset-[24%] rounded-full border border-[var(--fm-lime)]/20" /><div className="absolute left-1/2 top-[4%] h-[92%] w-px -translate-x-1/2 bg-[var(--fm-lime)]/10" /><div className="absolute left-[4%] top-1/2 h-px w-[92%] -translate-y-1/2 bg-[var(--fm-lime)]/10" />{[["50%","7%"],["84%","50%"],["50%","91%"],["16%","50%"]].map(([left, top], i) => <span key={i} className="absolute h-2.5 w-2.5 rounded-full bg-[var(--fm-lime)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--fm-lime)_8%,transparent)]" style={{ left, top }} />)}<div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--fm-lime)]/30 bg-[var(--fm-graphite)]/90 text-center shadow-[var(--fm-shadow-elevated)] backdrop-blur-md"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-[var(--fm-text-tertiary)]">Audvertax</span><strong className="mt-2 text-2xl font-bold text-[var(--fm-lime-bright)]">RAILS</strong><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--fm-lime)]" /></div></div><div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 overflow-hidden border-y border-[var(--fm-border)] py-3 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--fm-text-tertiary)]"><div className="services-ticker-track gap-fm-12">{[...rails, ...rails, ...rails].map((item, i) => <span key={`${item}-${i}`} className="mr-fm-12">{item}</span>)}</div></div></div>
        </div>
      </section>

      <section className="bg-[var(--fm-graphite-deep)] px-fm-6 py-fm-8 text-[var(--fm-text-primary)] sm:px-fm-10 lg:px-fm-14 lg:py-fm-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-fm-5 xl:grid-cols-4 lg:grid-cols-2">
            {markets.map((item) => (
              <Card key={item.country} variant="interactive" tone="dark" className="group flex min-h-[280px] flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/[.06] text-[var(--fm-lime-bright)]">
                      {item.icon}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-text-tertiary)]">{item.id} / 04</span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-text-primary)]">{item.country}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">{item.description}</p>
                </div>

                <Link href={item.href} className="mt-8 inline-flex items-center justify-between rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-component)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]">
                  <span>Explore</span>
                  <ArrowRight weight="bold" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
