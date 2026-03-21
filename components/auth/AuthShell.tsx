import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-900 text-gray-50">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_24%_41%,rgba(173,75,255,0.3)_0%,rgba(107,67,193,0.18)_19%,rgba(18,18,20,0)_55%),radial-gradient(circle_at_81%_53%,rgba(62,86,255,0.22)_0%,rgba(35,42,102,0.12)_28%,rgba(18,18,20,0)_62%),linear-gradient(90deg,#090a12_0%,#29173d_35%,#1f214d_67%,#0b0d18_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_27%_76%,rgba(128,58,255,0.12)_0%,rgba(18,18,20,0)_28%),radial-gradient(circle_at_73%_76%,rgba(65,92,255,0.11)_0%,rgba(18,18,20,0)_27%)]" />
        <SiteHeader ctaHref={mode === "login" ? "/signup" : "/login"} />

        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1440px] items-center px-[54px] py-0">
          {children}
        </div>
      </div>
    </main>
  );
}
