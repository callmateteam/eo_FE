import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { commonAssets } from "@/lib/assets";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "signup";
};

function HeaderAction({ mode }: { mode: "login" | "signup" }) {
  return (
    <Link
      className="inline-flex h-[43px] items-center justify-center rounded-full border border-[#b04bff] bg-[rgba(18,18,20,0.28)] px-[19px] text-[15px] leading-none font-medium tracking-[-0.01em] text-[#f2efff] shadow-[0_0_10px_rgba(176,75,255,0.3)] backdrop-blur-[10px]"
      href={mode === "login" ? "/signup" : "/login"}
    >
      회원가입 / 로그인
    </Link>
  );
}

export function AuthShell({ children, mode }: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-900 text-gray-50">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_24%_41%,rgba(173,75,255,0.3)_0%,rgba(107,67,193,0.18)_19%,rgba(18,18,20,0)_55%),radial-gradient(circle_at_81%_53%,rgba(62,86,255,0.22)_0%,rgba(35,42,102,0.12)_28%,rgba(18,18,20,0)_62%),linear-gradient(90deg,#090a12_0%,#29173d_35%,#1f214d_67%,#0b0d18_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_27%_76%,rgba(128,58,255,0.12)_0%,rgba(18,18,20,0)_28%),radial-gradient(circle_at_73%_76%,rgba(65,92,255,0.11)_0%,rgba(18,18,20,0)_27%)]" />
        <header className="relative z-20 h-[80px] border-b border-[rgba(255,255,255,0.02)] bg-[rgba(43,41,52,0.88)] backdrop-blur-[10px]">
          <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-[60px]">
            <Link
              className="flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(220.79deg,#ba4eff_7.66%,#6954f9_64.14%)]"
              href="/"
            >
              <Image
                alt="Easy & Only 로고"
                height={36.48}
                priority
                src={commonAssets.logoMark}
                width={35.52}
              />
            </Link>
            <HeaderAction mode={mode} />
          </div>
        </header>

        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1440px] items-center px-[54px] py-0">
          {children}
        </div>
      </div>
    </main>
  );
}
