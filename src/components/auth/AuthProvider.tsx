"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getCurrentUser, logout as logoutApi, type AuthUser } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setAuthenticatedUser: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_STORAGE_KEY = "audvertax.auth.session";

type PersistedAuthSession = {
  user: AuthUser | null;
  token?: string | null;
  updatedAt?: number;
};

function readPersistedAuthSession(): PersistedAuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAuthSession;
    if (!parsed?.user) return null;

    return parsed;
  } catch {
    return null;
  }
}

function persistAuthSession(nextUser: AuthUser | null, token?: string | null) {
  if (typeof window === "undefined") return;

  const session: PersistedAuthSession = {
    user: nextUser,
    token: token ?? readPersistedAuthSession()?.token ?? null,
    updatedAt: Date.now(),
  };

  if (!nextUser || nextUser.emailVerified === false) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearUserScopedStorage() {
  window.localStorage.removeItem("audvertax.settings");
  window.localStorage.removeItem("audvertax.application");
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const setAuthenticatedUser = (nextUser: AuthUser) => {
    ++requestId.current;
    if (nextUser.emailVerified === false) {
      setUser(null);
      setLoading(false);
      clearUserScopedStorage();
      return;
    }

    setUser((currentUser) => {
      if (currentUser && currentUser.email !== nextUser.email) clearUserScopedStorage();
      return nextUser;
    });
    persistAuthSession(nextUser, null);
    setLoading(false);
  };

  const refreshUser = async () => {
    const id = ++requestId.current;

    try {
      const response = await getCurrentUser();
      const nextUser = response.data.user;
      if (id !== requestId.current) return;

      if (nextUser.emailVerified === false) {
        setUser(null);
        clearUserScopedStorage();
        setLoading(false);
        return;
      }

      setUser((currentUser) => {
        const changedAccount = currentUser && nextUser && currentUser.email !== nextUser.email;
        if (changedAccount) clearUserScopedStorage();
        return nextUser;
      });
      persistAuthSession(nextUser, null);
      setLoading(false);
    } catch {
      if (id === requestId.current) {
        setUser(null);
        clearUserScopedStorage();
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const id = requestId.current + 1;
    requestId.current = id;

    const persisted = readPersistedAuthSession();
    if (persisted?.user && persisted.user.emailVerified !== false) {
      setUser(persisted.user);
    }

    getCurrentUser()
      .then((response) => {
        if (id !== requestId.current) return;
        const nextUser = response.data.user;
        if (nextUser.emailVerified === false) {
          setUser(null);
          clearUserScopedStorage();
          return;
        }
        setUser(nextUser);
        persistAuthSession(nextUser, null);
      })
      .catch(() => {
        if (id === requestId.current) {
          const storedUser = readPersistedAuthSession()?.user;
          if (storedUser && storedUser.emailVerified !== false) {
            setUser(storedUser);
          } else {
            setUser(null);
            clearUserScopedStorage();
          }
        }
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, []);

  const logout = async () => {
    ++requestId.current;
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setLoading(false);
      clearUserScopedStorage();
    }
  };

  return <AuthContext.Provider value={{ user, loading, setAuthenticatedUser, refreshUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
