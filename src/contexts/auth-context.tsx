"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import {
  login as apiLogin,
  getMe,
  clearStoredToken,
  type AuthUser,
} from "@/lib/auth-api";

export type { AuthUser };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** False until we've restored session from token (or determined no token). */
  isReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: AuthUser; error?: string }>;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getMe();
      if (cancelled) return;
      if (result.ok) {
        setUser(result.user);
      } else {
        setUser(null);
      }
      setIsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; user?: AuthUser; error?: string }> => {
      const result = await apiLogin(email, password);
      if (result.ok) {
        flushSync(() => setUser(result.user));
        return { ok: true, user: result.user };
      }
      return { ok: false, error: result.error };
    },
    []
  );

  const signOut = React.useCallback(() => {
    setUser(null);
    clearStoredToken();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      login,
      signOut,
    }),
    [user, isReady, login, signOut]
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
