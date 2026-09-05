import Image from "next/image";
import { Card, SectionLabel } from "@/components/ui/design-system";

type CardData = {
  title: string;
  quote: string;
  solution: string;
  rotate: number;
};

const CARDS: CardData[] = [
  { title: "Stripe & PayPal Won't Work Here", quote: "“Stripe and PayPal don't work for me here.”", solution: "We activate Stripe, PayPal, Payoneer, Wise & Zelle under your U.S. entity, built for non-residents from day one.", rotate: -3 },
  { title: "Bank Application Rejected", quote: "“My bank application got rejected and they wouldn't say why.”", solution: "We document your business model the way underwriters want it. As Pakistan's only official Sunrate & Airwallex partner, we know what gets approved.", rotate: 2 },
  { title: "Can't Send a Real Invoice", quote: "“I lose deals because I can't send a real invoice.”", solution: "A real U.S. LLC, EIN, and business bank account, so you invoice clients as a registered entity, not a freelancer.", rotate: -2 },
  { title: "No SSN, No Way In", quote: "“I don't have an SSN, every guide assumes I do.”", solution: "No SSN, no ITIN, no U.S. trip required. We file your EIN directly with the IRS, and handle ITIN only if you truly need it.", rotate: 3 },
  { title: "It Could All Disappear", quote: "“Everything I set up could just disappear.”", solution: "Compliance & renewals tracking, plus a dashboard that flags every deadline before the state or IRS does, closing the gaps that trigger reviews.", rotate: -3 },
  { title: "Too Many Agents to Trust", quote: "“I'm juggling five different agents and trust none of them.”", solution: "One dashboard, LLC, EIN, documents, payments, renewals, with a real human on WhatsApp support, not a black box.", rotate: 2 },
];

export default function ProblemsSolutions() {
  return (
    <section aria-labelledby="ps-heading" className="relative flex w-full flex-col items-center overflow-hidden bg-[var(--fm-graphite)] px-4 py-24 text-[var(--fm-text-primary)]">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(60% 45% at 50% -6%, color-mix(in srgb, var(--fm-lime) 10%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 88% 6%, color-mix(in srgb, var(--fm-lime) 6%, transparent) 0%, transparent 65%), radial-gradient(45% 45% at 8% 18%, color-mix(in srgb, var(--fm-lime) 4%, transparent) 0%, transparent 65%), radial-gradient(50% 40% at 50% 104%, color-mix(in srgb, var(--fm-lime) 5%, transparent) 0%, transparent 62%)", maskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)", WebkitMaskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)" }} />
      <div className="relative z-[2] flex w-full flex-col items-center text-center">
        <SectionLabel>Problems &amp; Solutions</SectionLabel>
        <h2 id="ps-heading" className="mx-auto mt-4 max-w-3xl font-display text-fm-section font-extrabold tracking-[-.025em] text-[var(--fm-text-primary)]">Real Problems.<br />Real Audvertax Solutions.</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--fm-text-secondary)]" style={{ fontSize: "clamp(15px, 2.4vw, 18px)" }}>What founders actually tell us, and exactly how we fix it, end to end.</p>
      </div>
      <div className="relative z-[2] mx-auto mt-16 grid w-full max-w-[1180px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.title} variant="interactive" tone="dark" className="group relative mt-5 min-h-[280px] p-[26px] pt-[30px]" style={{ transform: `rotate(${card.rotate}deg)` }}>
            <span className="absolute -top-[19px] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border border-[var(--fm-border-accent)] bg-[var(--fm-lime)] shadow-[var(--fm-shadow-subtle)] transition-transform duration-[var(--fm-motion-component)] group-hover:-translate-y-1 group-hover:scale-110" />
            <h3 className="font-display text-[22px] font-bold leading-tight text-[var(--fm-text-primary)]" style={{ letterSpacing: "-0.3px" }}>{card.title}</h3>
            <p className="mt-2 font-sans text-[13.5px] font-semibold italic leading-snug text-[var(--fm-lime)]">{card.quote}</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--fm-text-secondary)]">{card.solution}</p>
          </Card>
        ))}
      </div>
      <div className="relative z-[2] mt-16 flex items-center gap-3">
        <Image src="/avatar_abd.svg" alt="Audvertax founder" width={46} height={46} className="h-[46px] w-[46px] rounded-full border-2 border-[var(--fm-border)] object-cover shadow-[var(--fm-shadow-subtle)]" />
        <p className="text-left font-sans text-[15px] leading-snug text-[var(--fm-text-secondary)]">Your <span className="text-[21px] font-bold text-[var(--fm-lime)]" style={{ fontFamily: "var(--font-caveat), cursive" }}>all-in-one</span><br />U.S. setup partner.</p>
      </div>
    </section>
  );
}
