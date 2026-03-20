import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/AppSidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#111115] text-white">
      <AppSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
    </div>
  );
}
