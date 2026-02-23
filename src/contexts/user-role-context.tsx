"use client";

import * as React from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/roles";

const STORAGE_KEY = "app-current-role";
const ROLE_SEGMENTS: UserRole[] = ["user", "admin", "system-admin", "authorizer"];

function pathnameToRole(pathname: string | null): UserRole | null {
  if (!pathname) return null;
  const segment = pathname.split("/")[1];
  if (ROLE_SEGMENTS.includes(segment as UserRole)) return segment as UserRole;
  return null;
}

type UserRoleContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const UserRoleContext = React.createContext<UserRoleContextValue | null>(null);

function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "user";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ROLE_SEGMENTS.includes(stored as UserRole)) {
      return stored as UserRole;
    }
  } catch {
    // ignore
  }
  return "user";
}

/** Syncs role from URL into context. Isolated so usePathname runs inside Suspense (avoids hooks order issues in Next.js 16). */
function UserRolePathnameSync() {
  const pathname = usePathname();
  const { setRole } = useUserRole();

  React.useEffect(() => {
    const urlRole = pathnameToRole(pathname);
    if (urlRole) setRole(urlRole);
    else setRole(getStoredRole());
  }, [pathname, setRole]);

  return null;
}

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<UserRole>(getStoredRole);

  const setRole = React.useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <UserRoleContext.Provider value={value}>
      <Suspense fallback={null}>
        <UserRolePathnameSync />
      </Suspense>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const ctx = React.useContext(UserRoleContext);
  if (!ctx) {
    throw new Error("useUserRole must be used within UserRoleProvider");
  }
  return ctx;
}
