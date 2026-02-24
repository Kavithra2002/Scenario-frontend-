import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderUserSwitcher } from "@/components/header-user-switcher";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardContentWrapper } from "@/components/dashboard-content-wrapper";
import { RoutePrefetcher } from "@/components/route-prefetcher";
import { DataPreloader } from "@/components/data-preloader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoutePrefetcher />
      <DataPreloader />
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
