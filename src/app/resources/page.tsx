import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Question, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

const resources = [
  { href: "/blog", icon: BookOpen, index: "01", label: "Knowledge", title: "Guides & Blog", description: "Practical guidance on formation, banking, payments, compliance, and running your business.", action: "Read the blog" },
  { href: "/faq", icon: Question, index: "02", label: "Answers", title: "FAQs", description: "Find concise answers to the questions founders ask before starting and operating a business.", action: "Browse FAQs" },
  { href: "/legal", icon: FileText, index: "03", label: "Reference", title: "Documents & Legal", description: "Review important legal, policy, and business information before you make a decision.", action: "View information" },
];

export default function ResourcesPage() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="relative isolate border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-surface)_100%)] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--fm-hero-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--fm-hero-grid-line)_1px,transparent_1px)] [background-size:var(--fm-hero-grid-size)_var(--fm-hero-grid-size)] [mask-image:var(--fm-hero-grid-mask)]" />
        <div className="relative mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
          <div className="max-w-[900px]">
            <SectionLabel>Resources</SectionLabel>
            <h1 className="mt-5 font-display text-[clamp(3rem,6vw,5.8rem)] font-extrabold leading-[.94] tracking-[-.065em] text-[var(--fm-text-primary)]">Useful answers before your next business move.</h1>
            <p className="mt-7 max-w-[680px] text-[17px] leading-8 text-[var(--fm-text-secondary)] sm:text-[19px]">Explore practical guides, frequently asked questions, and business information designed to help you make informed decisions.</p>
          </div>
          <div className="hidden lg:block"><div className="border-l border-[var(--fm-border)] pl-8"><div className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-text-tertiary)]">Resource index</div><div className="mt-4 font-display text-5xl font-extrabold tracking-[-.06em] text-[var(--fm-lime-bright)]">03</div><div className="mt-2 text-sm text-[var(--fm-text-secondary)]">core knowledge areas</div></div></div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 max-w-[650px]"><SectionLabel>Explore the library</SectionLabel><h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-text-primary)] sm:text-5xl">Information that helps you move with confidence.</h2><p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">Start with the resource that answers the question in front of you.</p></div>
          <div className="grid gap-fm-5 lg:grid-cols-3">
            {resources.map(({ href, icon: Icon, index, label, title, description, action }) => (
              <Card key={href} variant="interactive" tone="default" className="group relative overflow-hidden p-7 sm:p-8">
                <Link href={href} aria-label={title} className="absolute inset-0 z-10 rounded-[inherit]" />
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[70px] bg-[var(--fm-lime)]/[.035] transition duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:bg-[var(--fm-lime)]/[.08]" />
                <div className="relative flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]"><Icon className="h-5 w-5" /></div><span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--fm-card-muted)]">{index}</span></div>
                <div className="relative mt-8 fm-label text-[10px]">{label}</div><h2 className="relative mt-2 font-display text-2xl font-extrabold tracking-[-.035em] text-[var(--fm-card-text)]">{title}</h2><p className="relative mt-3 min-h-[72px] text-sm leading-6 text-[var(--fm-card-muted)]">{description}</p><span className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-lime-bright)]">{action}<ArrowRight weight="bold" className="h-4 w-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1" /></span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:pb-28">
        <Card variant="elevated" tone="default" className="mx-auto grid max-w-[1400px] overflow-hidden p-0 lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative min-h-[280px] overflow-hidden bg-[var(--fm-lime)] p-8 text-[var(--fm-graphite-deep)] sm:p-10 lg:p-14"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[var(--fm-graphite-deep)]/15 shadow-[0_0_0_28px_rgba(16,19,16,.04),0_0_0_56px_rgba(16,19,16,.025)]" /><Sparkle className="relative h-7 w-7" weight="duotone" /><div className="relative mt-12 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-graphite-deep)]/60">Need a starting point?</div><h2 className="relative mt-3 font-display text-3xl font-extrabold tracking-[-.045em]">Find the service that fits your goal.</h2></div>
          <div className="flex items-center p-8 sm:p-10 lg:p-14"><div><SectionLabel>Next step</SectionLabel><p className="mt-4 max-w-[600px] text-fm-body text-[var(--fm-text-secondary)]">If you already know what you want to accomplish, explore Audvertax's services and choose the path that matches your business.</p><Button render={<Link href="/services" />} className="mt-7">Explore services <ArrowRight weight="bold" className="h-4 w-4" /></Button></div></div>
        </Card>
      </section>
    </main>
  );
}
