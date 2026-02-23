import { redirect } from "next/navigation";
import { ROLE_DEFAULT_HREF } from "@/types/roles";

export default function AuthorizerDashboardPage() {
  redirect(ROLE_DEFAULT_HREF.authorizer);
}
