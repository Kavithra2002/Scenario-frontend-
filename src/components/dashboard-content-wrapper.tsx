"use client";

import { usePathname } from "next/navigation";
import { useUserRole } from "@/contexts/user-role-context";
import type { UserRole } from "@/types/roles";

const ROLE_SEGMENTS: UserRole[] = ["user", "admin", "system-admin", "authorizer"];

function pathnameToRole(pathname: string | null): UserRole | null {
  if (!pathname) return null;
  const segment = pathname.split("/")[1];
  if (ROLE_SEGMENTS.includes(segment as UserRole)) return segment as UserRole;
  return null;
}

/**
 * Shows a loading state in the content area when the user has switched role
 * but the URL (and thus the page) hasn't updated yet. This avoids showing
 * stale role-specific content while Next.js is loading the new route.
 */
export function DashboardContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role } = useUserRole();
  const urlRole = pathnameToRole(pathname);

  const isNavigating = urlRole !== null && urlRole !== role;

  if (isNavigating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Loading view…</p>
      </div>
    );
  }

  return <>{children}</>;
}
