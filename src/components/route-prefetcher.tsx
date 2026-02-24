"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUserRole } from "@/contexts/user-role-context";
import { ROLE_SIDEBAR_CONFIG } from "@/types/roles";

/**
 * Prefetches all dashboard routes for the current user role (and other roles for fast role switch)
 * when the dashboard mounts. This loads route chunks in the background so navigation feels instant.
 */
export function RoutePrefetcher() {
  const router = useRouter();
  const { role } = useUserRole();
  const didPrefetch = useRef(false);

  useEffect(() => {
    if (didPrefetch.current) return;
    didPrefetch.current = true;

    const hrefs = new Set<string>();
    (Object.keys(ROLE_SIDEBAR_CONFIG) as Array<keyof typeof ROLE_SIDEBAR_CONFIG>).forEach((r) => {
      const { main, helpCenter } = ROLE_SIDEBAR_CONFIG[r];
      main.forEach((item) => hrefs.add(item.href));
      hrefs.add(helpCenter.href);
    });

    // Prefetch after a short delay so initial paint isn't blocked
    const t = setTimeout(() => {
      hrefs.forEach((href) => {
        try {
          router.prefetch(href);
        } catch {
          // ignore prefetch errors
        }
      });
    }, 500);

    return () => clearTimeout(t);
  }, [router, role]);

  return null;
}
