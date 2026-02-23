import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderUserSwitcher } from "@/components/header-user-switcher";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardContentWrapper } from "@/components/dashboard-content-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <HeaderUserSwitcher />
          <div className="flex flex-1 flex-col p-4">
            <DashboardContentWrapper>{children}</DashboardContentWrapper>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
