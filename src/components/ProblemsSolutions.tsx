import Image from "next/image";
import { Card, SectionLabel } from "@/components/ui/design-system";

type CardData = {
  title: string;
  quote: string;
  solution: string;
  rotate: number;
};

const CARDS: CardData[] = [
  { title: "USA", quote: "MISSING DEADLINES FEARS, FEARING IRS PENALTIES", solution: "AudVertax providing complete US corporate and non-resident filing. We handle IRS returns and state annual reports.", rotate: -3 },
  { title: "United Kingdom (HMRC)", quote: "Stuck on HMRC & Identity Verification", solution: "AudVertax providing end-to-end UK tax returns, Corporation Tax (CT600), VAT filings, and confirmation statements tailored for global directors and non-resident founders.", rotate: 2 },
  { title: "United Arab Emirates (FTA)", quote: "Confused by UAE Corporate Tax & VAT Thresholds", solution: "FTA-compliant Corporate Tax filing, registration, and VAT management for Free Zone and Mainland entities, keeping your offshore or onshore operations fully shielded.", rotate: -2 },
  { title: "Pakistan (FBR)", quote: "FBR Compliance & Cross-Border Remittances", solution: "Precision FBR income tax returns, ATL restoration, and foreign source income documentation, ensuring seamless profit repatriation and zero tax audit friction.", rotate: 3 },
  { title: "MULTI JURISDICTION", quote: "Drowning in Double Taxation Risks", solution: "Strategic international tax structuring and treaty relief application. We align your US, UK, UAE, and Pakistan filings to legally minimize global tax liabilities.", rotate: -3 },
  { title: "Fragmented Advisory", quote: "Too Many Local Tax Agents to Manage", solution: "One unified tax partner. Access direct WhatsApp communication, single-point account management, and standardized global tax filing across all your active jurisdictions.", rotate: 2 },
];

export default function ProblemsSolutions() {
  return (
    <section aria-labelledby="ps-heading" className="relative flex w-full min-w-0 flex-col items-center overflow-hidden bg-[var(--fm-graphite)] px-4 py-20 sm:py-24 text-[var(--fm-text-primary)]">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(60% 45% at 50% -6%, color-mix(in srgb, var(--fm-lime) 10%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 88% 6%, color-mix(in srgb, var(--fm-lime) 6%, transparent) 0%, transparent 65%), radial-gradient(45% 45% at 8% 18%, color-mix(in srgb, var(--fm-lime) 4%, transparent) 0%, transparent 65%), radial-gradient(50% 40% at 50% 104%, color-mix(in srgb, var(--fm-lime) 5%, transparent) 0%, transparent 62%)", maskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)", WebkitMaskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)" }} />
      <div className="relative z-[2] flex w-full flex-col items-center text-center">
        <SectionLabel>Problems &amp; Solutions</SectionLabel>
        <h2 id="ps-heading" className="mx-auto mt-4 max-w-3xl font-display text-fm-section font-extrabold tracking-[-.025em] text-[var(--fm-text-primary)]">Real Problems.<br />Real Audvertax Solutions.</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--fm-text-secondary)]" style={{ fontSize: "clamp(15px, 2.4vw, 18px)" }}>What founders actually tell us, and exactly how we fix it, end to end.</p>
      </div>
      <div className="relative z-[2] mx-auto mt-12 grid w-full max-w-[1180px] min-w-0 grid-cols-1 gap-7 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.title} variant="interactive" tone="dark" className="group relative mt-5 min-h-[280px] min-w-0 p-5 pt-[30px] sm:p-[26px] sm:pt-[30px]" style={{ transform: `rotate(${card.rotate}deg)` }}>
            <span className="absolute -top-[19px] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border border-[var(--fm-border-accent)] bg-[var(--fm-lime)] shadow-[var(--fm-shadow-subtle)] transition-transform duration-[var(--fm-motion-component)] group-hover:-translate-y-1 group-hover:scale-110" />
            <h3 className="font-display text-[22px] font-bold leading-tight text-[var(--fm-text-primary)]" style={{ letterSpacing: "-0.3px" }}>{card.title}</h3>
            <p className="mt-2 font-sans text-[13.5px] font-semibold italic leading-snug text-[var(--fm-lime)]">{card.quote}</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--fm-text-secondary)]">{card.solution}</p>
          </Card>
        ))}
      </div>
      <div className="relative z-[2] mt-16 flex items-center gap-3">
        <Image src="/avatar_abd.svg" alt="Audvertax founder" width={46} height={46} className="h-[46px] w-[46px] rounded-full border-2 border-[var(--fm-border)] object-cover shadow-[var(--fm-shadow-subtle)]" />
        <p className="text-left font-sans text-[15px] leading-snug text-[var(--fm-text-secondary)]"><span className="text-[21px] font-bold text-[var(--fm-lime)]" style={{ fontFamily: "var(--font-caveat), cursive" }}>Global</span><br /> setup partner.</p>
      </div>
    </section>
  );
}
