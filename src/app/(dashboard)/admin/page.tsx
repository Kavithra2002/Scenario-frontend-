import { redirect } from "next/navigation";
import { ROLE_DEFAULT_HREF } from "@/types/roles";

export default function AdminDashboardPage() {
  redirect(ROLE_DEFAULT_HREF.admin);
}
