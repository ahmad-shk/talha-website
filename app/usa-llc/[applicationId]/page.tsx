"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import ApplicationShell from "@/components/application/ApplicationShell";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import {
  getApplicationConfig,
  getServiceBySlug,
} from "@/lib/services";

export default function ApplicationPage() {
  const params = useParams<{ applicationId: string }>();
  const { application } = useApplicationState();

  useEffect(() => {
    if (application && application.id !== params.applicationId) {
      // The route must refer to the active client-side application.
      // No database lookup is performed while persistence is disabled.
    }
  }, [application, params.applicationId]);

  if (!application || application.id !== params.applicationId) {
    notFound();
  }

  const config = getApplicationConfig(application.serviceSlug);
  const service = getServiceBySlug(application.serviceSlug);

  if (!config || !service) {
    notFound();
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
