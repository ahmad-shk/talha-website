import Link from "next/link";
import { ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/design-system";
import { getMarketHref, markets } from "@/lib/markets";

export default function PricingSection() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-24 text-[var(--fm-text-primary)] sm:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_65%)]" />
      <div className="relative z-[1] mx-auto max-w-[1400px]">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-[18px] inline-block font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">Choose a market</span>
          <h2 id="services-heading" className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-text-primary)] sm:text-5xl">Pricing is organized by where your business is being built.</h2>
          <p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">Explore the services available in each market, then choose the service that fits your business.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((market, index) => (
            <Card key={market.slug} variant="interactive" tone="dark" className="group flex min-h-[280px] flex-col justify-between p-7">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]"><MapPin className="h-5 w-5" /></span>
                  <span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--fm-text-tertiary)]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)]">{market.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{market.description}</p>
              </div>
              <Link href={getMarketHref(market.slug)} className="mt-8 inline-flex items-center justify-between rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-component)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]">Explore <ArrowRight weight="bold" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
