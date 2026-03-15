import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/AppSidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#111115] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
