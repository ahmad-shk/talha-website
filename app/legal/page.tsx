import Link from "next/link";
import { ArrowRight, BookText, FileText, LockKeyhole, ShieldCheck } from "lucide-react";

const legalDocs = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    badge: "Information handling",
    description:
      "How Audvertax collects, uses, stores, and protects personal and business information across the platform.",
  },
  {
    slug: "terms",
    title: "Terms of Service",
    badge: "Platform rules",
    description:
      "The core terms that govern platform access, service delivery, payments, and use of Audvertax products.",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    badge: "Payments",
    description:
      "How refund requests are reviewed, what is refundable, and how timelines are handled for paid services.",
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    badge: "Service changes",
    description:
      "When you may cancel, how work already performed is handled, and how changes affect third-party fees.",
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    badge: "Website data",
    description:
      "What cookies we use on the site, why they are needed, and how you can manage your preferences.",
  },
  {
    slug: "cookie-settings",
    title: "Cookie Settings",
    badge: "Preferences",
    description:
      "The place to review and update your website cookie preferences for essential and analytics-related settings.",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <section className="border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_top,rgba(146,128,255,0.16),transparent_32%),linear-gradient(135deg,var(--fm-graphite-deep),var(--fm-graphite))] px-5 pb-20 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pb-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fm-lime)]">Audvertax legal</p>
          <h1 className="mt-5 max-w-[860px] font-display text-[clamp(2.8rem,6vw,5.6rem)] font-extrabold leading-[0.96] tracking-[-0.065em] text-[var(--fm-text-primary)]">
            Legal information for founders and customers.
          </h1>
          <p className="mt-6 max-w-[760px] text-base leading-8 text-[var(--fm-text-secondary)] sm:text-lg">
            This page brings together the core legal and policy documents for Audvertax, including privacy,
            terms, refunds, cookies, and service-specific policies. Use the links below to jump to the section
            you need or open the full document.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {legalDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="group rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-6 transition duration-[var(--fm-motion-component)] hover:-translate-y-0.5 hover:border-[var(--fm-lime)]/50 hover:bg-[var(--fm-surface)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]">
                    {doc.slug.includes("cookie") ? <LockKeyhole className="h-5 w-5" /> : doc.slug.includes("refund") || doc.slug.includes("cancellation") ? <ShieldCheck className="h-5 w-5" /> : doc.slug.includes("terms") ? <BookText className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                    {doc.badge}
                  </span>
                </div>

                <h2 className="mt-6 font-display text-2xl font-extrabold tracking-[-0.04em] text-[var(--fm-text-primary)]">
                  {doc.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">{doc.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-lime-bright)]">
                  Open document
                  <ArrowRight className="h-4 w-4 transition-transform duration-[var(--fm-motion-component)] group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 max-w-[700px]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fm-lime)]">Overview</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.05em] text-[var(--fm-text-primary)] sm:text-5xl">
              What these documents cover.
            </h2>
          </div>

          <div className="space-y-6">
            {legalDocs.map((doc, index) => (
              <div id={doc.slug} key={doc.slug} className="rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-graphite)] p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fm-text-tertiary)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-[var(--fm-text-primary)]">
                      {doc.title}
                    </h3>
                  </div>
                  <Link
                    href={`/legal/${doc.slug}`}
                    className="inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 py-2 text-sm font-semibold text-[var(--fm-text-primary)] transition hover:border-[var(--fm-lime)] hover:text-[var(--fm-lime)]"
                  >
                    View full document
                  </Link>
                </div>

                <p className="mt-4 text-sm leading-7 text-[var(--fm-text-secondary)]">
                  {doc.description} This summary is meant to help you quickly identify the document you need,
                  and the full policy page contains the complete version for reference.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
