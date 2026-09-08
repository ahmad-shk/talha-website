"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ApplicationShell from "@/components/application/ApplicationShell";
import ApplicationSelectionRecovery from "@/components/application/ApplicationSelectionRecovery";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getApplicationConfig, getServiceBySlug } from "@/lib/services";
import { LoadingState } from "@/components/ui/interaction-controls";

export default function GenericApplicationPage() {
  const params = useParams<{ applicationId: string }>();
  const { application, hydrated, selectApplication } = useApplicationState();
  const [loadingSelection, setLoadingSelection] = useState(true);
  const [selectionFailed, setSelectionFailed] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    if (application?.id === params.applicationId) {
      setLoadingSelection(false);
      setSelectionFailed(false);
      return;
    }

    let cancelled = false;
    setLoadingSelection(true);
    setSelectionFailed(false);

    void selectApplication(params.applicationId)
      .catch(() => {
        if (!cancelled) setSelectionFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingSelection(false);
      });

    return () => {
      cancelled = true;
    };
  }, [application?.id, hydrated, params.applicationId, selectApplication]);

  if (!hydrated || loadingSelection) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6 text-[var(--fm-text-primary)]">
        <LoadingState label="Loading your application..." />
      </main>
    );
  }

  if (selectionFailed || !application || application.id !== params.applicationId) {
    notFound();
  }

  const config = getApplicationConfig(application.serviceSlug);
  const service = getServiceBySlug(application.serviceSlug);

  if (!config || !service) {
    notFound();
  }

  const needsPackage = Boolean(service.capabilities.requiresPackage && !application.packageSlug);
  const needsJurisdiction = Boolean(service.capabilities.requiresJurisdiction && !application.formationState);
  const needsVariant = Boolean(service.variants?.length && !application.variantSlug);

  if (needsPackage || needsJurisdiction || needsVariant) {
    return <ApplicationSelectionRecovery application={application} service={service} />;
  }

  return (
    <ApplicationShell
      config={config}
      serviceName={service.name}
      applicationId={application.id}
      initialAnswers={application.answers}
      initialStep={application.currentStep}
      packageSlug={application.packageSlug}
      formationState={application.formationState}
      variantSlug={application.variantSlug}
    />
  );
}
