"use client";

import { useEffect, useRef } from "react";
import { useUserRole } from "@/contexts/user-role-context";
import { preloadUserList } from "@/lib/system-admin-api";

/**
 * Preloads page data in the background when the dashboard loads.
 * For system-admin: preloads user list so the User List page opens instantly.
 * Add more role-specific preloads here as needed.
 */
export function DataPreloader() {
  const { role } = useUserRole();
  const didPreload = useRef(false);

  useEffect(() => {
    if (didPreload.current) return;
    didPreload.current = true;

    if (role === "system-admin") {
      preloadUserList();
    }
    // Add more role-specific preloads, e.g.:
    // if (role === "admin") preloadTaskList();
  }, [role]);

  return null;
}
