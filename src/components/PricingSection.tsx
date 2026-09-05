import { Card, CardAction } from "@/components/ui/design-system";

const STANDARD_FEATURES = ["LLC formation in any state", "Business Tax ID (EIN)", "Registered agent, 1st year", "Articles of Incorporation", "One Business Account Setup", "Audvertax dashboard access"];
const ADVANCED_FEATURES = ["Everything in Standard", "U.S. business bank account setup", "Payment gateway approval support", "Unique Business Address", "USA Phone Number - 3 Months", "Compliance calendar & renewal filing", "Priority WhatsApp support"];
const CUSTOM_FEATURES = ["Multi-member & holding structures", "ITIN application support", "Bookkeeping & tax filing referrals", "Dedicated account manager"];

const pricingCards = [
  { name: "Standard", price: "$119", subtitle: "Everything to make your LLC real.", features: STANDARD_FEATURES, variant: "feature" as const, featured: false, cta: "Choose Standard", href: "/get-started", tone: "dark" as const },
  { name: "Advanced", price: "$179", subtitle: "Formation plus the payment rails.", features: ADVANCED_FEATURES, variant: "elevated" as const, featured: true, cta: "Choose Advanced", href: "/get-started", tone: "lime" as const },
  { name: "Custom", price: "Let's talk", subtitle: "For teams and complex structures.", features: CUSTOM_FEATURES, variant: "feature" as const, featured: false, cta: "Talk to us", href: "https://calendly.com/foremint-pk/lets-have-a-consultation-call", tone: "dark" as const },
];

export default function PricingSection() {
  return (
    <div id="services" aria-labelledby="services-heading" className="relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] py-24 text-[var(--fm-text-primary)]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(181,205,83,.08),transparent_65%)]" />
      <div className="relative z-[1] mx-auto mb-16 max-w-2xl px-6 text-center">
        <span className="mb-[18px] inline-block font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">Services</span>
        <h2 id="services-heading" className="mb-[18px] font-display text-fm-section font-extrabold tracking-fm-section text-[var(--fm-text-primary)]">
          Everything between you and your <span className="text-[var(--fm-lime)]">first U.S. payment.</span>
        </h2>
      </div>
      <div id="pricing" className="relative z-[1] mx-auto grid max-w-[1160px] grid-cols-1 items-stretch gap-6 px-6 lg:grid-cols-[1fr_1.06fr_1fr] lg:px-8">
        {pricingCards.map((card) => {
          const priceSize = card.name === "Custom" ? "text-[clamp(38px,4vw,52px)]" : "text-[clamp(48px,5.5vw,68px)]";
          return (
            <Card key={card.name} variant={card.variant} tone={card.tone} className="relative flex flex-col overflow-hidden p-9 pb-8">
              {card.featured && <span className="absolute right-5 top-5 rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)]/40 bg-[var(--fm-lime-soft)] px-3 py-[5px] font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--fm-lime)]">Most Popular</span>}
              <span className="mb-3.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-(--fm-card-text)">{card.name}</span>
              <div className="mb-1.5 flex items-baseline gap-1.5"><span className={`font-display font-extrabold leading-none tracking-[-0.04em] text-(--fm-card-text) ${priceSize}`}>{card.price}</span>{card.name !== "Custom" && <span className="text-sm font-medium text-(--fm-card-muted)">+ state fee</span>}</div>
              <p className="mb-6 text-[14.5px] font-medium leading-relaxed text-(--fm-card-muted)">{card.subtitle}</p>
              <div className="mb-[22px] h-px bg-(--fm-card-divider)" />
              <ul className="mb-8 flex flex-1 flex-col gap-[11px]">{card.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm font-semibold leading-snug text-(--fm-card-text)"><span className="flex-shrink-0 text-[15px] font-bold leading-snug text-(--fm-card-muted)">●</span>{feature}</li>)}</ul>
              <CardAction href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}>{card.cta}</CardAction>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
