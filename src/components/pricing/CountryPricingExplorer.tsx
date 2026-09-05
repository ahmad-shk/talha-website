"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Buildings, CaretDown, Check, FileText, MapPin, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug, getServiceHref } from "@/lib/services/catalog";
import type { ServiceConfig } from "@/lib/services/catalog";

type PricingNode = { title: string; serviceSlug?: string; children?: PricingNode[] };
type Country = { key: string; name: string; code: string; description: string; nodes: PricingNode[] };

const countries: Country[] = [
  { key: "usa", name: "USA", code: "US", description: "U.S. formation, taxation and business infrastructure services.", nodes: [
    { title: "Company Reg", serviceSlug: "usa-llc" },
    { title: "Taxation", serviceSlug: "usa-taxation" },
  ] },
  { key: "uk", name: "UK", code: "GB", description: "UK company formation, compliance, VAT, tax and payroll services.", nodes: [
    { title: "Ltd Reg", serviceSlug: "uk-ltd" },
    { title: "Ltd Compts", children: [
      { title: "Confirmation Statement", serviceSlug: "uk-confirmation-statement" },
      { title: "Accounts Preparation", serviceSlug: "uk-accounts-preparation" },
      { title: "HMRC & Company House Submission", serviceSlug: "uk-hmrc-companies-house-submission" },
    ] },
    { title: "Taxation", children: [
      { title: "VAT Reg", serviceSlug: "uk-vat-registration" },
      { title: "VAT Filing", serviceSlug: "uk-vat-filing" },
      { title: "Self Assessment Registration", serviceSlug: "uk-self-assessment-registration" },
      { title: "Self Assessment Filing", serviceSlug: "uk-self-assessment-filing" },
      { title: "Corporate Tax", serviceSlug: "uk-corporate-tax" },
      { title: "PAYEE Reg", serviceSlug: "uk-payee-registration" },
      { title: "Payroll Filing", serviceSlug: "uk-payroll-filing" },
    ] },
    { title: "Ltd Name matters", children: [
      { title: "Ltd Name", serviceSlug: "uk-ltd-name" },
      { title: "Ltd Address Change", serviceSlug: "uk-ltd-address-change" },
      { title: "Add director", serviceSlug: "uk-add-director" },
      { title: "Change director Address", serviceSlug: "uk-change-director-address" },
    ] },
    { title: "Ltd name Change", serviceSlug: "uk-ltd-name-change" },
  ] },
  { key: "uae", name: "UAE", code: "AE", description: "UAE company registration, tax, VAT, excise and bookkeeping services.", nodes: [
    { title: "Company Regist.", serviceSlug: "uae-company-registration" },
    { title: "Corporate Tax Registration", serviceSlug: "uae-corporate-tax-registration" },
    { title: "Corporate Tax Filling", serviceSlug: "uae-corporate-tax-filing" },
    { title: "VAT Registration", serviceSlug: "uae-vat-registration" },
    { title: "VAT Filing", serviceSlug: "uae-vat-filing" },
    { title: "Exise Tax Reg", serviceSlug: "uae-excise-tax-registration" },
    { title: "Exise Tax Filling", serviceSlug: "uae-excise-tax-filing" },
    { title: "Book Keeping", serviceSlug: "uae-bookkeeping" },
  ] },
  { key: "pak", name: "PAK", code: "PK", description: "Pakistan taxation, company and business registration services.", nodes: [
    { title: "Taxation", serviceSlug: "pak-taxation" },
    { title: "Business Reg", children: [
      { title: "Pvt Reg", serviceSlug: "pak-private-company-registration" },
      { title: "LLP Reg", serviceSlug: "pak-llp-registration" },
    ] },
    { title: "Other Business Matters", serviceSlug: "pak-other-business-matters" },
  ] },
];

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Custom";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

function NodeList({ nodes, depth = 0, selectedSlug, onSelect }: { nodes: PricingNode[]; depth?: number; selectedSlug: string | null; onSelect: (slug: string) => void }) {
  return <div className={depth > 0 ? "mt-2 space-y-2 border-l border-[var(--fm-border)] pl-3" : "space-y-2"}>
    {nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const selected = node.serviceSlug === selectedSlug;
      return <div key={node.title}>
        {node.serviceSlug ? <button type="button" onClick={() => onSelect(node.serviceSlug!)} className={["group flex w-full items-center justify-between gap-3 rounded-[var(--fm-radius-md)] border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]", selected ? "border-[var(--fm-lime)]/45 bg-[var(--fm-lime)]/[.10]" : "border-[var(--fm-border)] bg-[var(--fm-surface)] hover:-translate-y-px hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"].join(" ")}>
          <span className="flex min-w-0 items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[var(--fm-lime-bright)]"><FileText className="h-4 w-4" /></span><span className="truncate text-sm font-semibold text-[var(--fm-text-primary)]">{node.title}</span></span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--fm-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
        </button> : <div className="flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--fm-graphite-deep)] text-[var(--fm-lime-bright)]">{hasChildren && <CaretDown className="h-4 w-4" weight="bold" />}</span><span className="text-sm font-bold text-[var(--fm-text-primary)]">{node.title}</span></div>}
        {hasChildren && <NodeList nodes={node.children!} depth={depth + 1} selectedSlug={selectedSlug} onSelect={onSelect} />}
      </div>;
    })}
  </div>;
}

function PricingDetail({ service }: { service: ServiceConfig }) {
  const packages = service.packages ?? [];
  return <Card variant="elevated" className="h-fit overflow-hidden">
    <div className="border-b border-[var(--fm-card-divider)] p-6 sm:p-8"><SectionLabel>Selected service</SectionLabel><h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)]">{service.name}</h2><p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{service.shortDescription}</p></div>
    {packages.length > 0 ? <div className="divide-y divide-[var(--fm-card-divider)]">{packages.map((item, index) => <div key={item.slug} className="p-6 sm:p-8"><div className="flex items-start justify-between gap-5"><div><div className="flex items-center gap-2"><h3 className="font-display text-xl font-extrabold tracking-[-.03em] text-[var(--fm-card-text)]">{item.name}</h3>{index === 0 && packages.length > 1 && <span className="inline-flex items-center gap-1 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)]/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[var(--fm-lime)]"><Sparkle weight="fill" className="h-3 w-3" /> Starting option</span>}</div><p className="mt-2 max-w-[470px] text-sm leading-6 text-[var(--fm-card-muted)]">{item.description}</p></div><div className="shrink-0 text-right"><div className="font-display text-2xl font-extrabold tracking-[-.04em] text-[var(--fm-card-text)]">{formatPrice(item.price, item.currency)}</div>{item.price > 0 && <div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-[var(--fm-card-muted)]">One-time</div>}</div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{item.features.map((feature) => <div key={feature} className="flex items-start gap-2 text-xs leading-5 text-[var(--fm-card-muted)]"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--fm-card-action-bg)]/15 text-[var(--fm-card-action-bg)]"><Check weight="bold" className="h-2.5 w-2.5" /></span>{feature}</div>)}</div><Link href={getServiceHref(service.slug)} className="mt-6 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-micro)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]">Continue with {service.name} <ArrowRight weight="bold" className="h-4 w-4" /></Link></div>)}</div> : <div className="p-6 sm:p-8"><div className="rounded-[var(--fm-radius-lg)] border border-dashed border-[var(--fm-border-accent)] bg-[var(--fm-lime)]/[.05] p-5"><p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-lime)]">Pricing status</p><p className="mt-2 text-sm leading-6 text-[var(--fm-card-muted)]">This service is in the catalog, but a public package price has not been configured yet. No price has been invented here.</p></div><Link href={getServiceHref(service.slug)} className="mt-6 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 py-3 text-sm font-bold text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]">View service <ArrowRight weight="bold" className="h-4 w-4" /></Link></div>}
  </Card>;
}

export default function CountryPricingExplorer() {
  const [selectedCountryKey, setSelectedCountryKey] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const selectedCountry = useMemo(() => countries.find((country) => country.key === selectedCountryKey) ?? null, [selectedCountryKey]);
  const selectedService = selectedServiceSlug ? getServiceBySlug(selectedServiceSlug) : undefined;

  function selectCountry(key: string) { setSelectedCountryKey(key); setSelectedServiceSlug(null); window.history.replaceState(null, "", `/pricing?country=${key}`); }
  function resetCountry() { setSelectedCountryKey(null); setSelectedServiceSlug(null); window.history.replaceState(null, "", "/pricing"); }

  return <main className="fm-page overflow-hidden">
    <section className="relative isolate border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-fm-5 pb-fm-20 pt-fm-20 text-[var(--fm-text-primary)] sm:px-fm-8 sm:pb-fm-24 sm:pt-fm-24 lg:pb-28 lg:pt-fm-32"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(181,205,83,.14),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-graphite)_100%)]" /><div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(181,205,83,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(181,205,83,.045)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" /><div className="relative mx-auto max-w-[1400px]"><SectionLabel>Pricing</SectionLabel><h1 className="mt-5 max-w-[980px] font-display text-[clamp(3rem,6vw,5.9rem)] font-extrabold leading-[.94] tracking-[-.065em]">Choose your country. Explore the services. See the price.</h1><p className="mt-7 max-w-[720px] text-[17px] leading-8 text-[var(--fm-text-secondary)] sm:text-[19px]">Pricing follows the same service hierarchy used across Audvertax, so you can move from a country to a main service, then into its sub-services and final service pricing.</p></div></section>
    <section className="px-fm-5 py-fm-20 sm:px-fm-8 sm:py-fm-24 lg:py-28"><div className="mx-auto max-w-[1400px]">{!selectedCountry ? <><div className="mb-12 max-w-[760px]"><SectionLabel>Choose a market</SectionLabel><h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-text-primary)] sm:text-5xl">Pricing is organized by where your business is being built.</h2><p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">Select Explore to open this same pricing page for the country you want to review.</p></div><div className="grid gap-fm-5 sm:grid-cols-2 lg:grid-cols-4">{countries.map((country, index) => <Card key={country.key} variant="interactive" tone="dark" className="group flex min-h-[280px] flex-col justify-between p-7"><div><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]"><MapPin className="h-5 w-5" /></span><span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--fm-text-tertiary)]">0{index + 1}</span></div><h2 className="mt-8 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-card-text)]">{country.name}</h2><p className="mt-3 text-sm leading-6 text-[var(--fm-card-muted)]">{country.description}</p></div><button type="button" onClick={() => selectCountry(country.key)} className="mt-8 inline-flex items-center justify-between rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition-transform duration-[var(--fm-motion-component)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)]">Explore <ArrowRight weight="bold" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button></Card>)}</div></> : <><div className="mb-10 flex flex-col justify-between gap-5 border-b border-[var(--fm-border)] pb-8 sm:flex-row sm:items-end"><div><button type="button" onClick={resetCountry} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-lime-bright)]"><ArrowLeft className="h-4 w-4" /> All countries</button><SectionLabel>{selectedCountry.name} pricing</SectionLabel><h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-.055em] text-[var(--fm-text-primary)] sm:text-5xl">Explore the {selectedCountry.name} service stack.</h2></div><div className="rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[.13em] text-[var(--fm-text-tertiary)]">Market / {selectedCountry.code}</div></div><div className="grid gap-fm-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start"><Card variant="standard" className="p-5 sm:p-6"><div className="mb-5"><div className="font-mono text-[9px] font-bold uppercase tracking-[.15em] text-[var(--fm-text-tertiary)]">Service hierarchy</div><p className="mt-1 text-xs text-[var(--fm-text-secondary)]">Select a final service to view its configured pricing.</p></div><NodeList nodes={selectedCountry.nodes} selectedSlug={selectedServiceSlug} onSelect={setSelectedServiceSlug} /></Card>{selectedService ? <PricingDetail service={selectedService} /> : <Card variant="elevated" className="min-h-[360px] p-7 sm:p-9"><div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><span className="grid h-14 w-14 place-items-center rounded-full border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]"><Buildings className="h-6 w-6" /></span><h3 className="mt-6 font-display text-2xl font-extrabold tracking-[-.035em] text-[var(--fm-card-text)]">Select a service</h3><p className="mt-3 max-w-[440px] text-sm leading-6 text-[var(--fm-card-muted)]">Choose a final service from the hierarchy. Its configured package pricing will appear here without leaving the pricing page.</p></div></Card>}</div></>}</div></section>
  </main>;
}
