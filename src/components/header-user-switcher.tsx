"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUserRole } from "@/contexts/user-role-context";
import { useAuth } from "@/contexts/auth-context";
import {
  ROLE_BASE_PATH,
  ROLE_LABELS,
  type UserRole,
} from "@/types/roles";

const ROLES: UserRole[] = ["user", "admin", "system-admin", "authorizer"];

export function HeaderUserSwitcher() {
  const router = useRouter();
  const { role, setRole } = useUserRole();
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  function handleSelect(newRole: UserRole) {
    setRole(newRole);
    router.push(ROLE_BASE_PATH[newRole]);
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <Badge variant="secondary" className="font-medium">
          {ROLE_LABELS[role]} view
        </Badge>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Switch user
                <ChevronsUpDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {ROLES.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => handleSelect(r)}
                className={r === role ? "bg-accent" : ""}
              >
                {ROLE_LABELS[r]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
