export type UserRole = "user" | "admin" | "system-admin" | "authorizer";

export interface SidebarNavItem {
  title: string;
  href: string;
}

/** Main nav items (before separator). Help center is always last, after a separator. */
export const ROLE_SIDEBAR_CONFIG: Record<
  UserRole,
  { main: SidebarNavItem[]; helpCenter: SidebarNavItem }
> = {
  user: {
    main: [
      { title: "Financial view", href: "/user/financial-view" },
      { title: "Scenario Analysis", href: "/user/scenario-analysis" },
      { title: "Scenario Management", href: "/user/scenario-management" },
      { title: "Report management", href: "/user/report-management" },
      { title: "Market", href: "/user/market" },
      { title: "Task Management", href: "/user/task-management" },
      { title: "Notifications", href: "/user/notifications" },
      { title: "Account", href: "/user/account" },
      { title: "Security", href: "/user/security" },
    ],
    helpCenter: { title: "Help center", href: "/user/help-center" },
  },
  admin: {
    main: [
      { title: "Task Management", href: "/admin/task-management" },
      { title: "Account", href: "/admin/account" },
      { title: "Settings", href: "/admin/settings" },
      { title: "Notifications", href: "/admin/notifications" },
      { title: "Security", href: "/admin/security" },
    ],
    helpCenter: { title: "Help center", href: "/admin/help-center" },
  },
  "system-admin": {
    main: [
      { title: "User List", href: "/system-admin/user-list" },
      { title: "Application Integration", href: "/system-admin/application-integration" },
      { title: "Notification", href: "/system-admin/notification" },
      { title: "Account", href: "/system-admin/account" },
      { title: "Security", href: "/system-admin/security" },
    ],
    helpCenter: { title: "Help center", href: "/system-admin/help-center" },
  },
  authorizer: {
    main: [
      { title: "Task Management", href: "/authorizer/task-management" },
      { title: "Account", href: "/authorizer/account" },
      { title: "Settings", href: "/authorizer/settings" },
      { title: "Notification", href: "/authorizer/notification" },
      { title: "Security", href: "/authorizer/security" },
    ],
    helpCenter: { title: "Help center", href: "/authorizer/help-center" },
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  admin: "Admin",
  "system-admin": "System Admin",
  authorizer: "Authorizer",
};

export const ROLE_BASE_PATH: Record<UserRole, string> = {
  user: "/user",
  admin: "/admin",
  "system-admin": "/system-admin",
  authorizer: "/authorizer",
};

/** First sidebar option for each role — used as the default/landing page when loading the app. */
export const ROLE_DEFAULT_HREF: Record<UserRole, string> = {
  user: ROLE_SIDEBAR_CONFIG.user.main[0].href,
  admin: ROLE_SIDEBAR_CONFIG.admin.main[0].href,
  "system-admin": ROLE_SIDEBAR_CONFIG["system-admin"].main[0].href,
  authorizer: ROLE_SIDEBAR_CONFIG.authorizer.main[0].href,
};
