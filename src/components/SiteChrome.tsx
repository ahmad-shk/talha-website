"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <>
      {!isDashboard && <NavBar />}
      {children}
    </>
  );
}
