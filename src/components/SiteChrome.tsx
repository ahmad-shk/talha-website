"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const MARKETING_PREFIXES = [
  "/services",
  "/how-it-works",
  "/pricing",
  "/resources",
  "/blog",
  "/about",
  "/get-started",
  "/usa-llc",
  "/uk-ltd",
  "/state-explorer",
  "/testimonials",
  "/contact",
  "/cancellation-policy",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/cookie-policy",
  "/cookie-settings",
];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMarketingPage =
    pathname === "/" ||
    MARKETING_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  return (
    <>
      {isMarketingPage && <NavBar />}
      {children}
      {isMarketingPage && <Footer />}
    </>
  );
}
