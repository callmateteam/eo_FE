import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export default function RecentProjectPage() {
  return (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  );
}
