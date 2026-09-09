"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Compass, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

const principles = [
  { icon: Globe2, code: "01", title: "Built for international founders", text: "A clearer path for founders who want to establish and operate a company across borders." },
  { icon: FileCheck2, code: "02", title: "One connected workflow", text: "Formation, tax IDs, payments, documents, and compliance are designed to work together." },
  { icon: ShieldCheck, code: "03", title: "Clarity over complexity", text: "We turn unfamiliar business processes into guided steps with clear expectations." },
];

const focusItems = ["Guided applications", "Centralized documents", "Payment readiness", "Compliance visibility", "Human support"];

export default function About() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="relative isolate border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-5 pb-20 pt-24 text-[var(--fm-text-primary)] sm:px-8 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--fm-hero-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--fm-hero-grid-line)_1px,transparent_1px)] [background-size:var(--fm-hero-grid-size)_var(--fm-hero-grid-size)] [mask-image:var(--fm-hero-grid-mask)]" />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="max-w-[900px]">
            <SectionLabel>About Audvertax</SectionLabel>
            <h1 className="mt-7 font-display text-[clamp(3rem,6vw,5.9rem)] font-extrabold leading-[.94] tracking-[-.065em]">
              Business setup.<br />Connected <span className="text-[var(--fm-lime)]">to progress.</span>
            </h1>
            <p className="mt-7 max-w-[680px] text-[17px] leading-8 text-[var(--fm-text-secondary)] sm:text-[19px]">
              Audvertax brings the practical pieces of starting and operating a business into <b className="text-[var(--fm-text-primary)]">one coordinated experience</b> for international founders.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button render={<Link href="/services" />}>Explore services <ArrowUpRight className="h-4 w-4" /></Button>
              <Button render={<Link href="/how-it-works" />} variant="outline">How it works</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 text-[var(--fm-text-primary)] sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionLabel>Our mission</SectionLabel>
              <h2 className="mt-3 max-w-[620px] font-display text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">Reduce the friction between starting a company and operating it.</h2>
            </div>
            <Card variant="elevated" className="p-7 sm:p-9">
              <Compass className="h-7 w-7 text-[var(--fm-lime)]" />
              <p className="mt-6 max-w-[650px] text-lg leading-8 text-[var(--fm-card-muted)]">The goal is simple: give founders a clear route through the decisions, applications, documents, and services that sit between an idea and a functioning business.</p>
            </Card>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, code, title, text }) => (
              <Card key={title} variant="interactive" className="p-6">
                <div className="flex items-center justify-between">
                  <IconContainer aria-hidden="true"><Icon className="h-5 w-5" /></IconContainer>
                  <span className="font-mono text-[10px] tracking-[.16em] text-[var(--fm-card-muted)]">{code}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-[-.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--fm-graphite-deep)] px-5 py-20 text-[var(--fm-text-primary)] sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12">
          <div>
            <SectionLabel>What Audvertax emphasizes</SectionLabel>
            <h2 className="mt-4 max-w-[720px] font-display text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">Clear onboarding. Centralized information. A business that can keep moving.</h2>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {focusItems.map((item) => (
                <div key={item} className="flex items-center gap-3 border-t border-[var(--fm-border)] py-4 text-sm text-[var(--fm-text-secondary)]">
                  <span className="grid size-5 place-items-center rounded-full bg-[var(--fm-lime)]/15 text-[var(--fm-lime)]"><Check className="h-3 w-3" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card variant="feature" tone="dark" className="relative flex min-h-[320px] items-end overflow-hidden p-8 sm:p-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-[var(--fm-lime)]/20 shadow-[0_0_0_24px_color-mix(in_srgb,var(--fm-lime)_3%,transparent),0_0_0_48px_color-mix(in_srgb,var(--fm-lime)_2%,transparent)]" />
            <div className="relative">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-card-muted)]">Ready to begin?</div>
              <div className="mt-3 font-display text-3xl font-bold tracking-[-.045em]">Start with the service that matches your goal.</div>
              <Button render={<Link href="/services" />} className="mt-7 font-bold">Explore services <ArrowUpRight className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
