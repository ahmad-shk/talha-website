"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bank, Briefcase, Buildings, FileText, List, SignOut, User, X, CaretDown } from "@phosphor-icons/react";
import MegaMenuItem from "@/components/navigation/MegaMenu/MegaMenuItem";
import { MegaMenuMobile } from "@/components/navigation/MegaMenu/MegaMenu";
import type { MegaMenuConfig } from "@/components/navigation/MegaMenu/MegaMenu.types";
import { getServiceHref } from "@/lib/services";
import StartApplicationButton from "./services/StartApplicationButton";
import { useAuth } from "@/components/auth/AuthProvider";

type NavItem = { label: string; href?: string; megaMenu?: MegaMenuConfig };

const servicesMenu: MegaMenuConfig = {
  label: "Services",
  href: "/services",
  groups: [
    { title: "USA", items: [
      { title: "Company Registration", href: "/usa-llc", icon: <Buildings className="h-4 w-4" /> },
      { title: "Taxation", href: getServiceHref("usa-taxation"), icon: <FileText className="h-4 w-4" /> },
    ]},
    { title: "UK", items: [
      { title: "LTD Registration", href: getServiceHref("uk-ltd"), icon: <Buildings className="h-4 w-4" /> },
      { title: "LTD Compliance", icon: <FileText className="h-4 w-4" />, children: [
        { title: "Confirmation Statement", href: getServiceHref("uk-confirmation-statement") },
        { title: "Accounts Preparation", href: getServiceHref("uk-accounts-preparation") },
        { title: "HMRC & Companies House Submission", href: getServiceHref("uk-hmrc-companies-house-submission") },
      ]},
      { title: "Taxation", icon: <FileText className="h-4 w-4" />, children: [
        { title: "VAT Registration", href: getServiceHref("uk-vat-registration") },
        { title: "VAT Filing", href: getServiceHref("uk-vat-filing") },
        { title: "Self Assessment Registration", href: getServiceHref("uk-self-assessment-registration") },
        { title: "Self Assessment Filing", href: getServiceHref("uk-self-assessment-filing") },
        { title: "Corporate Tax", href: getServiceHref("uk-corporate-tax") },
        { title: "PAYE Registration", href: getServiceHref("uk-payee-registration") },
        { title: "Payroll Filing", href: getServiceHref("uk-payroll-filing") },
      ]},
      { title: "LTD Company Matters", icon: <Buildings className="h-4 w-4" />, children: [
        { title: "LTD Name", href: getServiceHref("uk-ltd-name") },
        { title: "LTD Address Change", href: getServiceHref("uk-ltd-address-change") },
        { title: "Add Director", href: getServiceHref("uk-add-director") },
        { title: "Change Director Address", href: getServiceHref("uk-change-director-address") },
        { title: "LTD Name Change", href: getServiceHref("uk-ltd-name-change") },
      ]},
    ]},
    { title: "UAE", items: [
      { title: "Company Registration", href: getServiceHref("uae-company-registration"), icon: <Buildings className="h-4 w-4" /> },
      { title: "Corporate Tax Registration", href: getServiceHref("uae-corporate-tax-registration"), icon: <FileText className="h-4 w-4" /> },
      { title: "Corporate Tax Filing", href: getServiceHref("uae-corporate-tax-filing"), icon: <FileText className="h-4 w-4" /> },
      { title: "VAT Registration", href: getServiceHref("uae-vat-registration"), icon: <FileText className="h-4 w-4" /> },
      { title: "VAT Filing", href: getServiceHref("uae-vat-filing"), icon: <FileText className="h-4 w-4" /> },
      { title: "Excise Tax Registration", href: getServiceHref("uae-excise-tax-registration"), icon: <FileText className="h-4 w-4" /> },
      { title: "Excise Tax Filing", href: getServiceHref("uae-excise-tax-filing"), icon: <FileText className="h-4 w-4" /> },
      { title: "Bookkeeping", href: getServiceHref("uae-bookkeeping"), icon: <Bank className="h-4 w-4" /> },
    ]},
    { title: "Pakistan", items: [
      { title: "Taxation", href: getServiceHref("pak-taxation"), icon: <FileText className="h-4 w-4" /> },
      { title: "Business Registration", icon: <Buildings className="h-4 w-4" />, children: [
        { title: "Private Company Registration", href: getServiceHref("pak-private-company-registration") },
        { title: "LLP Registration", href: getServiceHref("pak-llp-registration") },
      ]},
      { title: "Other Business Matters", href: getServiceHref("pak-other-business-matters"), icon: <Briefcase className="h-4 w-4" /> },
    ]},
  ],
};

const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services", megaMenu: servicesMenu },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

const navLink = "inline-flex items-center justify-center gap-1 rounded-[var(--fm-radius-md)] px-3 py-2 font-sans text-[14px] font-medium text-[var(--fm-text-secondary)] transition-[background-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime)]/[.08] hover:text-[var(--fm-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const dropdown = document.getElementById("services-navbar-dropdown");
      if (servicesRef.current?.contains(target) || dropdown?.contains(target)) return;
      setServicesOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout() {
    try { await logout(); } finally { setMobileOpen(false); window.location.href = "/"; }
  }

  return (
    <header className="sticky top-0 z-[100] w-full px-4 pt-4 sm:px-8">
      <nav className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between gap-fm-5 rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]/[.90] py-[10px] px-5 shadow-[var(--fm-shadow-elevated)] backdrop-blur-xl">
        <Link href="/" className="flex flex-shrink-0 items-center gap-1.5" aria-label="Audvertax home"><Image src="/audvertax_logo.png" alt="Audvertax" width={130} height={35} className="h-5 w-auto" priority /></Link>
        <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} ref={item.megaMenu ? servicesRef : undefined}>
              {item.megaMenu ? (
                <button type="button" className={navLink} aria-expanded={servicesOpen} aria-controls="services-navbar-dropdown" onClick={() => setServicesOpen((value) => !value)}>
                  {item.label}<CaretDown className={`h-3.5 w-3.5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              ) : (
                <Link href={item.href!} className={navLink}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>

        {servicesOpen && (
          <div id="services-navbar-dropdown" role="menu" aria-label="Services menu" className="absolute inset-x-0 left-[50%] top-[calc(100%+8px)] z-[120] mx-auto flex w-[min(1180px,calc(100vw-32px))] flex-col justify-center overflow-scroll rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] shadow-[var(--fm-shadow-elevated)] backdrop-blur-xl animate-[megaMenuCurtainDrop_320ms_var(--fm-motion-ease)_both]">
            <div className="flex items-end justify-between gap-fm-6 border-b border-[var(--fm-border-soft)] px-fm-6 py-fm-5">
              <div>
                <div className="font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">Service</div>
                <h2 className="mt-1 font-sans text-xl font-bold tracking-[-0.035em] text-[var(--fm-text-primary)]">{servicesMenu.label}</h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--fm-text-secondary)]">Business registration, taxation, compliance and operational support across key markets.</p>
            </div>
            <div className="grid grid-cols-1 gap-0 p-fm-3 sm:grid-cols-2 lg:grid-cols-4">
              {servicesMenu.groups.map((group) => (
                <section key={group.title} className="min-w-0 px-fm-3 py-fm-3 lg:border-r lg:border-[var(--fm-border-soft)] lg:last:border-r-0">
                  <h3 className="mb-fm-4 flex items-center gap-2.5 rounded-[var(--fm-radius-md)] border border-[var(--fm-border-soft)] bg-[var(--fm-surface-raised)] px-fm-3 py-fm-2.5 font-sans text-base font-bold tracking-[-0.015em] text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)]"><span aria-hidden="true" className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--fm-lime)] shadow-[0_0_0_3px_var(--fm-lime-soft)]" />{group.title}</h3>
                  <div className="space-y-fm-1">
                    {group.items.map((item) => <MegaMenuItem key={`${item.title}-${item.href ?? "group"}`} item={item} onNavigate={() => setServicesOpen(false)} />)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-shrink-0 items-center gap-2.5">
          {user ? <div className="group relative"><Link href="/dashboard" aria-label="Open account" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--fm-lime)]/30 bg-[var(--fm-surface)] text-[var(--fm-lime-bright)] transition-[transform,border-color,background-color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:border-[var(--fm-lime)]/60 hover:bg-[var(--fm-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"><span className="text-sm font-bold">{user.firstName.charAt(0).toUpperCase()}</span></Link><div className="invisible absolute right-0 top-11 w-52 translate-y-1 rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-2 opacity-0 shadow-[var(--fm-shadow-elevated)] transition-[transform,opacity,visibility] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"><div className="px-3 py-2"><p className="truncate text-sm font-semibold text-[var(--fm-text-primary)]">{user.firstName} {user.lastName}</p><p className="truncate text-xs text-[var(--fm-text-tertiary)]">{user.email}</p></div><Link href="/dashboard" className="block rounded-[var(--fm-radius-md)] px-3 py-2 text-sm font-medium text-[var(--fm-text-secondary)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime)]/[.08] hover:text-[var(--fm-text-primary)] focus-visible:bg-[var(--fm-lime)]/[.08] focus-visible:text-[var(--fm-text-primary)]">Dashboard</Link><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[var(--fm-radius-md)] px-3 py-2 text-left text-sm font-medium text-[var(--fm-danger)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-danger)]/10 focus-visible:bg-[var(--fm-danger)]/10"><SignOut className="h-4 w-4" /> Sign out</button></div></div> : <Link href="/login" aria-label="Sign in or create account" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-secondary)] transition-[transform,border-color,background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:border-[var(--fm-lime)]/50 hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-lime-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"><User className="h-4 w-4" /></Link>}
          {/* <StartApplicationButton serviceSlug="usa-llc" className="hidden items-center gap-2 whitespace-nowrap rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)] bg-[var(--fm-lime)] px-5 py-[10px] font-sans text-[13.5px] font-semibold text-[var(--fm-graphite-deep)] shadow-[var(--fm-shadow-glow)] transition-[transform,background-color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-px hover:bg-[var(--fm-lime-bright)] hover:shadow-[var(--fm-shadow-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40 sm:inline-flex hidden">START MY LLC <ArrowRight weight="bold" className="h-[13px] w-[13px]" /></StartApplicationButton> */}
          <button type="button" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-secondary)] transition-[border-color,background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-lime)]/50 hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-lime-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40 lg:hidden"><List className="h-5 w-5" /></button>
        </div>
      </nav>
      {mobileOpen && <div className="lg:hidden"><div className="fixed inset-0 z-[140] bg-[var(--fm-graphite-deep)]/[.75] backdrop-blur-sm" onClick={() => setMobileOpen(false)} /><div role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-y-0 right-0 z-[160] flex w-[min(380px,100vw)] flex-col overflow-y-auto border-l border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]/[.98] px-5 pb-10 pt-5 shadow-[var(--fm-shadow-modal)]"><div className="mb-7 flex flex-shrink-0 items-center justify-between"><Image src="/audvertax_logo.png" alt="Audvertax" width={110} height={30} className="h-5 w-auto" /><button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] text-[var(--fm-text-secondary)] transition-[background-color,color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-lime-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)]/40"><X className="h-5 w-5" /></button></div><ul className="flex-1"><li className="border-b border-[var(--fm-border)]">{user ? <><Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-1 py-[15px] font-sans text-[17px] font-semibold text-[var(--fm-lime-bright)]">{user.firstName} {user.lastName}</Link><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-[var(--fm-border)] px-1 py-[15px] text-left font-sans text-[17px] font-semibold text-[var(--fm-danger)]"><SignOut className="h-4 w-4" /> Sign out</button></> : <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-1 py-[15px] font-sans text-[17px] font-semibold text-[var(--fm-lime-bright)]"><User className="h-4 w-4" /> Sign in</Link>}</li>{NAV_ITEMS.map((item) => item.megaMenu ? <MegaMenuMobile key={item.label} config={item.megaMenu} /> : <li key={item.label} className="border-b border-[var(--fm-border)]"><Link href={item.href!} onClick={() => setMobileOpen(false)} className="block px-1 py-[15px] font-sans text-[17px] font-semibold text-[var(--fm-text-primary)] transition-[color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:text-[var(--fm-lime-bright)]">{item.label}</Link></li>)}</ul><div className="mt-7 flex flex-shrink-0 flex-col gap-2.5"><Link href="/get-started" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] py-[15px] font-sans text-[15.5px] font-semibold text-[var(--fm-graphite-deep)] transition-[transform,background-color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-lime-bright)]">Get started <ArrowRight weight="bold" className="h-4 w-4" /></Link></div></div></div>}
    </header>
  );
}
