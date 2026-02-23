"use client";

import * as React from "react";

const AUTH_STORAGE_KEY = "app-auth";

export type AuthUser = {
  email: string;
  role: "user" | "admin" | "system-admin" | "authorizer";
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed?.email) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const login = React.useCallback(
    async (email: string, _password: string): Promise<{ ok: boolean; error?: string }> => {
      // Mock: accept any non-empty email. Backend will replace this.
      const trimmed = email.trim();
      if (!trimmed) {
        return { ok: false, error: "Email is required" };
      }
      const mockUser: AuthUser = {
        email: trimmed,
        role: "user",
      };
      setUser(mockUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      } catch {
        // ignore
      }
      return { ok: true };
    },
    []
  );

  const signOut = React.useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signOut,
    }),
    [user, login, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
