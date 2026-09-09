import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalCursorGlow from "@/components/GlobalCursorGlow";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Preloader from "@/components/Preloader";
import SiteChrome from "@/components/SiteChrome";
import ApplicationStateProvider from "@/components/application/ApplicationStateProvider";
import AuthProvider from "@/components/auth/AuthProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Audvertax, Get a U.S. Company and Finally Get Paid",
  description: "We handle your U.S. LLC, UK Ltd, ITIN & Taxation, then set up Stripe, PayPal, Payoneer & Zelle so global clients pay you instantly.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`bg-[var(--fm-graphite)] ${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ApplicationStateProvider>
            <Preloader />
            <GlobalCursorGlow />
            <SiteChrome>{children}</SiteChrome>
            {/* <WhatsAppWidget /> */}
          </ApplicationStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
