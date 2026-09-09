"use client";

import { notFound, useParams } from "next/navigation";
import ApplicationShell from "@/components/application/ApplicationShell";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getApplicationConfig, getServiceBySlug } from "@/lib/services";
import { LoadingState } from "@/components/ui/interaction-controls";

export default function UKLTDApplicationPage() {
  const params = useParams<{ applicationId: string }>();
  const { application, hydrated } = useApplicationState();

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6 text-[var(--fm-text-primary)]">
        <LoadingState label="Loading your application..." />
      </main>
    );
  }

  if (!application || application.id !== params.applicationId || application.serviceSlug !== "uk-ltd") {
    notFound();
  }

  const config = getApplicationConfig("uk-ltd");
  const service = getServiceBySlug("uk-ltd");

  if (!config || !service) notFound();

  return (
    <ApplicationShell
      config={config}
      serviceName={service.name}
      applicationId={application.id}
      initialAnswers={application.answers}
      initialStep={application.currentStep}
    />
  );
}
