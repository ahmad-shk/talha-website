"use client";

import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";
import { useApplicationState, type ApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug } from "@/lib/services";
import { StatusBadge } from "@/components/ui/design-system";
import { ApplicationCard } from "@/components/ui/composite";
import { EmptyState, SectionHeader } from "@/components/ui/interaction-controls";
import { buttonVariants } from "@/components/ui/button";

function getProgress(application: ApplicationState) {
  if (["paid", "processing", "completed"].includes(application.status)) return 100;
  if (["in_review", "ready_for_payment"].includes(application.status)) return 90;
  const step = Math.max(application.currentStep, 0);
  return Math.min(Math.max(Math.round((step / 5) * 100), 0), 100);
}

function getStatusTone(status: ApplicationState["status"]): "success" | "info" | "warning" | "danger" | "neutral" {
  if (status === "completed") return "success";
  if (["paid", "processing"].includes(status)) return "info";
  if (["in_review", "ready_for_payment"].includes(status)) return "warning";
  if (status === "cancelled") return "danger";
  return "neutral";
}

function getStatusLabel(status: ApplicationState["status"]) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function MyApplications() {
  const { applications, hydrated } = useApplicationState();

  if (!hydrated) {
    return <div className="rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 text-sm text-[var(--fm-text-secondary)]">Loading your applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={28} />}
        title="No applications yet"
        description="Start a service application and it will appear here."
        action={<Link className={buttonVariants()} href="/services">Explore services</Link>}
      />
    );
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Portfolio"
        title="My Applications"
        description="Continue or review your saved applications."
        action={<span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">{applications.length} total</span>}
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {applications.map((application) => {
          const service = getServiceBySlug(application.serviceSlug);
          const progress = getProgress(application);
          const paid = ["paid", "processing", "completed"].includes(application.status);
          return (
            <ApplicationCard
              key={application.id}
              title={service?.name ?? application.serviceSlug}
              subtitle="Service application"
              status={<StatusBadge status={getStatusTone(application.status)}><span className="h-1.5 w-1.5 rounded-full bg-current" />{getStatusLabel(application.status)}</StatusBadge>}
              progress={progress}
              meta={<>Updated {new Date(application.updatedAt).toLocaleDateString()}</>}
              action={
                <Link
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                  href={paid ? `/dashboard/application?id=${encodeURIComponent(application.id)}` : `/apply/${application.id}`}
                >
                  {paid ? "View application" : "Resume"}
                  {paid && <CheckCircle2 size={15} />}
                </Link>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
