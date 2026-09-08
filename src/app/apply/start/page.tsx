import { Suspense } from "react";
import ApplicationStartClient from "./ApplicationStartClient";

export default function ApplicationStartPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--fm-graphite-deep)]" />}>
      <ApplicationStartClient />
    </Suspense>
  );
}
