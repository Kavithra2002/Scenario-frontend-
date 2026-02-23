import { redirect } from "next/navigation";
import { ROLE_DEFAULT_HREF } from "@/types/roles";

export default function SystemAdminDashboardPage() {
  redirect(ROLE_DEFAULT_HREF["system-admin"]);
}
