import { notFound } from "next/navigation";

import ApplicationShell from "@/components/application/ApplicationShell";
import {
  getApplicationConfig,
  getServiceBySlug,
} from "@/lib/services";

export const metadata = {
  title: "Apply for a USA LLC | Audvertax",
  description:
    "Complete your USA LLC formation application with Audvertax.",
};

export default function USALLCApplyPage() {
  const service = getServiceBySlug(
    "usa-llc",
  );

  const config = getApplicationConfig(
    "usa-llc",
  );

  if (!service || !config) {
    notFound();
  }

  return (
    <ApplicationShell
      config={config}
      serviceName={service.name}
    />
  );
}