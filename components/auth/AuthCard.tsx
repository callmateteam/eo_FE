import type { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <section
      className={cn(
        "rounded-[29px] border border-[rgba(255,255,255,0.28)] bg-[linear-gradient(90deg,rgba(49,39,80,0.82)_0%,rgba(37,36,71,0.76)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.16)]",
        className
      )}
    >
      {children}
    </section>
  );
}
