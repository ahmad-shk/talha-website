import { notFound } from "next/navigation";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export default function InternationalEINApplyPage() {
  const service = getServiceBySlug("ein-without-ssn");
  if (!service) notFound();
  return <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-6 py-20 text-[var(--fm-text-primary)] md:py-28"><div className="mx-auto max-w-4xl"><SectionLabel>USA taxation</SectionLabel><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Apply for an International EIN.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--fm-text-secondary)]">Choose Resident or Non-Resident during the application. The service fee is $10 for Resident and $25 for Non-Resident.</p><div className="mt-10 grid gap-5 md:grid-cols-2"><Card className="p-6 md:p-7"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">Resident</p><p className="mt-3 text-4xl font-semibold">$10</p><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">For the resident service pathway, where applicable.</p></Card><Card className="p-6 md:p-7"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">Non-Resident</p><p className="mt-3 text-4xl font-semibold">$25</p><p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">For the non-resident service pathway, where applicable.</p></Card></div><div className="mt-8"><StartApplicationButton serviceSlug="ein-without-ssn" size="lg">Start International EIN application →</StartApplicationButton></div></div></main>;
}
