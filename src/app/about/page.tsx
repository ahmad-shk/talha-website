"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Compass, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

const principles = [
  { icon: Globe2, code: "01", title: "Built for international founders", text: "A clearer path for founders who want to establish and operate a company across borders." },
  { icon: FileCheck2, code: "02", title: "One connected workflow", text: "Formation, tax IDs, payments, documents, and compliance are designed to work together." },
  { icon: ShieldCheck, code: "03", title: "Clarity over complexity", text: "We turn unfamiliar business processes into guided steps with clear expectations." },
];
const focusItems = ["Guided applications", "Centralized documents", "Payment readiness", "Compliance visibility", "Human support"];
const GRID_LINES = [15, 22, 12] as const;

export default function About() {
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(q("[data-about-label]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6 })
        .fromTo(q("[data-about-line]"), { opacity: 0, yPercent: 105 }, { opacity: 1, yPercent: 0, duration: .85, stagger: .1 }, "-=.3")
        .fromTo(q("[data-about-copy]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .65 }, "-=.45")
        .fromTo(q("[data-about-actions]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6 }, "-=.4")
        .fromTo(q("[data-about-visual]"), { opacity: 0, x: 28, scale: .97 }, { opacity: 1, x: 0, scale: 1, duration: .85 }, "-=.7");
      gsap.to(q("[data-orbit]"), { rotation: 360, duration: 26, repeat: -1, ease: "none" });
      gsap.to(q("[data-node]"), { opacity: .35, scale: .72, duration: 1.6, stagger: .2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo(q("[data-reveal]"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .7, stagger: .1, delay: .2, ease: "power4.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="fm-page overflow-hidden">
      <section className="relative isolate min-h-[92dvh] overflow-hidden bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_48%,var(--fm-hero-glow),transparent_34%),linear-gradient(110deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_52%,var(--fm-graphite-deep)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative z-[2] mx-auto grid min-h-[92dvh] w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-24 sm:px-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-4 lg:px-14">
          <div className="relative z-[3] max-w-[690px] lg:pb-6">
            <div data-about-label className="mb-7 inline-flex items-center gap-3 rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/[.07] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]"><span className="size-2 rounded-full bg-[var(--fm-lime)]" />About Audvertax</div>
            <h1 className="max-w-[10ch] font-display font-bold tracking-[-.065em]" style={{ fontSize: "clamp(50px,6.5vw,88px)", lineHeight: .96 }}>
              <span className="block overflow-hidden"><span data-about-line className="block">Business setup.</span></span>
              <span className="block overflow-hidden"><span data-about-line className="block">Connected</span></span>
              <span className="block overflow-hidden"><span data-about-line className="block text-[var(--fm-lime)]">to progress.</span></span>
            </h1>
            <p data-about-copy className="mt-7 max-w-[57ch] text-[16px] leading-[1.75] text-[var(--fm-text-secondary)] sm:text-[18px]">Audvertax brings the practical pieces of starting and operating a business into <b className="text-[var(--fm-text-primary)]">one coordinated experience</b> for international founders.</p>
            <div data-about-actions className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/services" />} size="lg" className="group font-bold"><span>Explore services</span><ArrowUpRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" /></Button>
              <Link href="/how-it-works" className="inline-flex h-12 items-center justify-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-accent)] bg-[var(--fm-surface)]/60 px-6 text-[15px] font-semibold text-[var(--fm-text-primary)] transition-[transform,border-color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1 hover:border-[var(--fm-lime)]"><span>How it works</span><span className="font-mono text-[10px] text-[var(--fm-text-tertiary)]">FLOW / 05</span></Link>
            </div>
          </div>
          <div data-about-visual className="relative flex min-h-[500px] items-center justify-center lg:min-h-[620px]">
            <div className="absolute inset-[10%] rounded-full bg-[var(--fm-hero-glow-soft)] blur-[var(--fm-hero-glow-blur)]" />
            <div data-orbit className="relative h-[440px] w-[440px] max-w-[88vw] max-h-[88vw] sm:h-[520px] sm:w-[520px]">
              <div className="absolute inset-0 rounded-full border border-[var(--fm-lime)]/10" />
              <div className="absolute inset-[8%] rounded-full border border-[var(--fm-lime)]/25 border-dashed [transform:rotateX(68deg)]" />
              <div className="absolute inset-[16%] rounded-full border border-[var(--fm-lime)]/20 [transform:rotateY(66deg)]" />
              <div className="absolute inset-[21%] rounded-full border border-[var(--fm-lime)]/30 shadow-[inset_0_0_80px_color-mix(in_srgb,var(--fm-lime)_5%,transparent)]">
                <div className="absolute inset-[14%] rounded-full border border-[var(--fm-lime)]/12" />
                {GRID_LINES.map((opacity, i) => <div key={`h-${i}`} className="absolute left-[12%] h-px w-[76%] bg-[var(--fm-lime)]" style={{ top: `${32 + i * 18}%`, opacity: opacity / 100 }} />)}
                {GRID_LINES.map((opacity, i) => <div key={`v-${i}`} className="absolute top-[12%] h-[76%] w-px bg-[var(--fm-lime)]" style={{ left: `${32 + i * 18}%`, opacity: opacity / 100 }} />)}
                {[[24,34],[69,28],[77,58],[31,72],[58,67],[44,46]].map(([x,y], i) => <span key={i} data-node className="absolute size-2.5 rounded-full bg-[var(--fm-lime)] shadow-[0_0_0_5px_color-mix(in_srgb,var(--fm-lime)_8%,transparent)]" style={{ left: `${x}%`, top: `${y}%` }} />)}
              </div>
              <div className="absolute left-1/2 top-1/2 flex size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--fm-lime)]/35 bg-[var(--fm-graphite)]/90 shadow-[var(--fm-shadow-elevated)] backdrop-blur-md"><div className="text-center"><Compass className="mx-auto h-7 w-7 text-[var(--fm-lime)]" /><div className="mt-3 font-mono text-[9px] uppercase tracking-[.18em] text-[var(--fm-text-tertiary)]">Our mission</div><div className="mt-2 text-xl font-bold text-[var(--fm-lime-bright)]">CONNECT</div></div></div>
            </div>
            <div className="absolute bottom-1 left-1/2 w-[min(650px,95%)] -translate-x-1/2 overflow-hidden border-y border-[var(--fm-border-accent)] py-3 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--fm-text-tertiary)]"><div className="flex w-max gap-12 whitespace-nowrap">FORMATION / TAX / BANKING / PAYMENTS / DOCUMENTS / COMPLIANCE / FORMATION / TAX / BANKING / PAYMENTS / DOCUMENTS / COMPLIANCE</div></div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--fm-graphite)] px-6 py-20 text-[var(--fm-text-primary)] sm:px-10 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div data-reveal className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div><SectionLabel>Our mission</SectionLabel><h2 className="mt-3 max-w-[620px] font-display text-4xl font-bold tracking-[-.055em] sm:text-5xl">Reduce the friction between starting a company and operating it.</h2></div>
            <Card variant="elevated" className="p-7 sm:p-9"><Compass className="h-7 w-7 text-[var(--fm-lime)]" /><p className="mt-6 max-w-[650px] text-lg leading-8 text-[var(--fm-card-muted)]">The goal is simple: give founders a clear route through the decisions, applications, documents, and services that sit between an idea and a functioning business.</p></Card>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{principles.map(({ icon: Icon, code, title, text }) => <Card key={title} variant="interactive" className="p-6" data-reveal><div className="flex items-center justify-between"><IconContainer aria-hidden="true"><Icon className="h-5 w-5" /></IconContainer><span className="font-mono text-[10px] tracking-[.16em] text-[var(--fm-card-muted)]">{code}</span></div><h3 className="mt-6 font-display text-xl font-bold tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{text}</p></Card>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-20 text-[var(--fm-text-primary)] sm:px-10 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute right-[-100px] top-[-180px] size-[520px] rounded-full border border-[var(--fm-lime)]/10 shadow-[0_0_0_34px_color-mix(in_srgb,var(--fm-lime)_2.5%,transparent),0_0_0_68px_color-mix(in_srgb,var(--fm-lime)_2%,transparent)]" />
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1fr_.75fr] lg:gap-20">
          <div data-reveal><SectionLabel>What Audvertax emphasizes</SectionLabel><h2 className="mt-4 max-w-[720px] font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">Clear onboarding. Centralized information. A business that can keep moving.</h2><div className="mt-9 grid gap-3 sm:grid-cols-2">{focusItems.map((item) => <div key={item} className="flex items-center gap-3 border-t border-[var(--fm-border)] py-4 text-sm text-[var(--fm-text-secondary)]"><span className="grid size-5 place-items-center rounded-full bg-[var(--fm-lime)]/15 text-[var(--fm-lime)]"><Check className="h-3 w-3" /></span>{item}</div>)}</div></div>
          <Card variant="feature" tone="dark" className="relative flex min-h-[320px] items-end overflow-hidden p-8 sm:p-10" data-reveal><div className="absolute -right-20 -top-20 size-64 rounded-full border border-[var(--fm-lime)]/20 shadow-[0_0_0_24px_color-mix(in_srgb,var(--fm-lime)_3%,transparent),0_0_0_48px_color-mix(in_srgb,var(--fm-lime)_2%,transparent)]" /><div className="relative"><div className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-card-muted)]">Ready to begin?</div><div className="mt-3 font-display text-3xl font-bold tracking-[-.045em]">Start with the service that matches your goal.</div><Button render={<Link href="/services" />} className="mt-7 font-bold">Explore services <ArrowUpRight className="h-4 w-4" /></Button></div></Card>
        </div>
      </section>
    </main>
  );
}
