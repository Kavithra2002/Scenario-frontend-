"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CheckSquare,
  FileText,
  FolderGit2,
  HelpCircle,
  Layers,
  Plug,
  Settings,
  Shield,
  Store,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/contexts/user-role-context";
import { ROLE_SIDEBAR_CONFIG } from "@/types/roles";
import type { SidebarNavItem } from "@/types/roles";

const SIDEBAR_ICONS: Record<string, LucideIcon> = {
  "Financial view": Wallet,
  "Scenario Analysis": BarChart3,
  "Scenario Management": FolderGit2,
  "Report management": FileText,
  Market: Store,
  "Task Management": CheckSquare,
  Notifications: Bell,
  Notification: Bell,
  Account: User,
  Accounts: Users,
  Security: Shield,
  "Help center": HelpCircle,
  "User List": Users,
  "Application Integration": Plug,
  Settings,
};

function getSidebarIcon(item: SidebarNavItem): LucideIcon {
  return SIDEBAR_ICONS[item.title] ?? Layers;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const config = ROLE_SIDEBAR_CONFIG[role];
  const { main, helpCenter } = config;
  const HelpCenterIcon = getSidebarIcon(helpCenter);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="px-2 py-2">
          <p className="text-sm font-semibold text-sidebar-foreground">
            AMBEON
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => {
                const Icon = getSidebarIcon(item);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/")}>
                      <Link href={item.href}>
                        <Icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="my-2" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === helpCenter.href}>
                  <Link href={helpCenter.href}>
                    <HelpCenterIcon className="size-4 shrink-0" />
                    <span>{helpCenter.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
