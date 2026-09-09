import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";
import GlobalCursorGlow from "../src/components/GlobalCursorGlow";
import Preloader from "../src/components/Preloader";
import SiteChrome from "../src/components/SiteChrome";
import ApplicationStateProvider from "../src/components/application/ApplicationStateProvider";
import AuthProvider from "../src/components/auth/AuthProvider";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-unbounded", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Audvertax, Get a U.S. Company and Finally Get Paid",
  description: "We handle your U.S. LLC, UK Ltd, ITIN & Taxation, then set up Stripe, PayPal, Payoneer & Zelle so global clients pay you instantly.",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`bg-[var(--fm-graphite)] ${unbounded.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ApplicationStateProvider>
            <Preloader />
            <GlobalCursorGlow />
            <SiteChrome>{children}</SiteChrome>
          </ApplicationStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
