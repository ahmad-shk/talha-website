"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createApplication, getApplication, getApplications, updateApplication as updateApplicationApi, type Application, type ApplicationDocumentReference, type ApplicationMember, type ApplicationStatus } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { createApplicationSelection, selectionToApplicationInput, validateApplicationSelection } from "@/lib/services";

export type { ApplicationStatus };
export type ApplicationState = Omit<Application, "userId">;

type ApplicationStateContextValue = {
  application: ApplicationState | null;
  applications: ApplicationState[];
  hydrated: boolean;
  startApplication: (input: { serviceSlug: string; packageSlug?: string; formationState?: string; variantSlug?: string; addOnSlugs?: string[]; members?: ApplicationMember[]; documents?: ApplicationDocumentReference[] }) => Promise<string>;
  updateApplication: (input: { currentStep?: number; answers?: Record<string, unknown>; packageSlug?: string; formationState?: string; variantSlug?: string; addOnSlugs?: string[]; members?: ApplicationMember[]; documents?: ApplicationDocumentReference[]; status?: ApplicationStatus }) => Promise<void>;
  setApplicationStatus: (status: ApplicationStatus) => Promise<void>;
  refreshApplication: (id?: string) => Promise<ApplicationState | null>;
  clearApplication: () => void;
  selectApplication: (id: string) => Promise<void>;
};

const ApplicationStateContext = createContext<ApplicationStateContextValue | null>(null);

function toApplicationState(application: Application): ApplicationState {
  const { userId: _userId, ...state } = application;
  return state;
}

function sortApplications(applications: ApplicationState[]) {
  return [...applications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

const lockedStatuses: ApplicationStatus[] = ["paid", "processing", "completed", "cancelled"];

export default function ApplicationStateProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<ApplicationState | null>(null);
  const [applications, setApplications] = useState<ApplicationState[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const requestId = useRef(0);
  const hydratedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    const currentUserId = user?.id ?? null;
    const id = ++requestId.current;
    let cancelled = false;
    setApplications([]);
    setApplication(null);
    setHydrated(false);
    hydratedUserId.current = null;

    if (!currentUserId) {
      window.sessionStorage.removeItem("audvertax.currentApplicationId");
      setHydrated(true);
      return () => { cancelled = true; };
    }

    const storageKey = `audvertax.currentApplicationId:${currentUserId}`;
    async function restoreApplications() {
      try {
        const storedId = window.sessionStorage.getItem(storageKey);
        let selected: ApplicationState | null = null;
        if (storedId) {
          try {
            const response = await getApplication(storedId);
            if (cancelled || id !== requestId.current) return;
            selected = toApplicationState(response.data.application);
          } catch {
            window.sessionStorage.removeItem(storageKey);
          }
        }
        const response = await getApplications();
        if (cancelled || id !== requestId.current) return;
        const nextApplications = sortApplications(response.data.applications.map(toApplicationState));
        if (!selected && nextApplications.length > 0) {
          selected = nextApplications[0];
          window.sessionStorage.setItem(storageKey, selected.id);
        }
        if (selected) {
          const authoritative = nextApplications.find((item) => item.id === selected?.id);
          if (authoritative) selected = authoritative;
        }
        setApplications(nextApplications);
        setApplication(selected);
        hydratedUserId.current = currentUserId;
      } catch {
        if (!cancelled && id === requestId.current) {
          setApplications([]);
          setApplication(null);
          hydratedUserId.current = currentUserId;
        }
      } finally {
        if (!cancelled && id === requestId.current) setHydrated(true);
      }
    }
    void restoreApplications();
    return () => { cancelled = true; };
  }, [user?.id, authLoading]);

  const value = useMemo<ApplicationStateContextValue>(() => ({
    application,
    applications,
    hydrated,
    startApplication: async ({ serviceSlug, packageSlug, formationState, variantSlug, addOnSlugs, members, documents }) => {
      if (!user?.id || authLoading || !hydrated || hydratedUserId.current !== user.id) throw new Error("Please wait for your applications to finish loading.");
      const selection = createApplicationSelection({ serviceSlug, packageSlug, jurisdictionSlug: formationState, variantSlug, addOnSlugs });
      const validation = validateApplicationSelection(selection);
      if (!validation.valid) throw new Error(validation.errors.join(" "));
      const response = await createApplication({ ...selectionToApplicationInput(selection), members, documents, currentStep: 0, answers: {} });
      const next = toApplicationState(response.data.application);
      setApplication(next);
      setApplications((current) => sortApplications([next, ...current.filter((item) => item.id !== next.id)]));
      window.sessionStorage.setItem(`audvertax.currentApplicationId:${user.id}`, next.id);
      return next.id;
    },
    updateApplication: async ({ currentStep, answers, packageSlug, formationState, variantSlug, addOnSlugs, members, documents, status }) => {
      if (!application) return;
      if (lockedStatuses.includes(application.status)) throw new Error("This application is locked and cannot be edited.");
      const nextAnswers = answers ?? application.answers;
      const nextPackageSlug = packageSlug ?? application.packageSlug;
      const nextFormationState = formationState ?? application.formationState;
      const nextVariantSlug = variantSlug ?? application.variantSlug;
      const nextAddOnSlugs = addOnSlugs ?? (
        application.serviceSlug === "usa-llc" && Array.isArray(nextAnswers.selected_add_ons)
          ? nextAnswers.selected_add_ons.map(String)
          : application.addOnSlugs
      );
      let nextMembers = members ?? application.members;
      if (application.serviceSlug === "usa-llc" && nextAnswers.company_type === "single_member_llc") {
        nextMembers = nextMembers.slice(0, 1);
      }
      const response = await updateApplicationApi(application.id, {
        ...(currentStep !== undefined ? { currentStep } : {}),
        ...(answers !== undefined ? { answers: nextAnswers } : {}),
        ...(packageSlug !== undefined ? { packageSlug: nextPackageSlug } : {}),
        ...(formationState !== undefined ? { formationState: nextFormationState } : {}),
        ...(variantSlug !== undefined ? { variantSlug: nextVariantSlug } : {}),
        ...(addOnSlugs !== undefined || (application.serviceSlug === "usa-llc" && Array.isArray(nextAnswers.selected_add_ons)) ? { addOnSlugs: nextAddOnSlugs } : {}),
        ...(members !== undefined || application.serviceSlug === "usa-llc" ? { members: nextMembers } : {}),
        ...(documents !== undefined ? { documents } : {}),
        ...(status !== undefined ? { status } : {}),
      });
      const next = toApplicationState(response.data.application);
      setApplication(next);
      setApplications((current) => sortApplications([next, ...current.filter((item) => item.id !== next.id)]));
    },
    setApplicationStatus: async (status) => {
      if (!application) return;
      if (lockedStatuses.includes(application.status)) throw new Error("This application is locked and cannot be changed.");
      const response = await updateApplicationApi(application.id, { status });
      const next = toApplicationState(response.data.application);
      setApplication(next);
      setApplications((current) => sortApplications([next, ...current.filter((item) => item.id !== next.id)]));
    },
    refreshApplication: async (id) => {
      const applicationId = id ?? application?.id;
      if (!applicationId || !user?.id) return null;
      const response = await getApplication(applicationId);
      const next = toApplicationState(response.data.application);
      setApplication(next);
      setApplications((current) => sortApplications([next, ...current.filter((item) => item.id !== next.id)]));
      window.sessionStorage.setItem(`audvertax.currentApplicationId:${user.id}`, next.id);
      return next;
    },
    clearApplication: () => {
      setApplication(null);
      if (user?.id) window.sessionStorage.removeItem(`audvertax.currentApplicationId:${user.id}`);
    },
    selectApplication: async (id) => {
      if (!user?.id || authLoading || !hydrated || hydratedUserId.current !== user.id) throw new Error("Please wait for your applications to finish loading.");
      const response = await getApplication(id);
      const next = toApplicationState(response.data.application);
      setApplication(next);
      setApplications((current) => sortApplications([next, ...current.filter((item) => item.id !== next.id)]));
      window.sessionStorage.setItem(`audvertax.currentApplicationId:${user.id}`, next.id);
    },
  }), [application, applications, hydrated, user?.id, authLoading]);

  return <ApplicationStateContext.Provider value={value}>{children}</ApplicationStateContext.Provider>;
}

export function useApplicationState() {
  const context = useContext(ApplicationStateContext);
  if (!context) throw new Error("useApplicationState must be used inside ApplicationStateProvider.");
  return context;
}
