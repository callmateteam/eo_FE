"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { SpinnerDots } from "@/components/ui/SpinnerDots";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type AuthRouteGateProps = {
  children: ReactNode;
};

export function AuthRouteGate({ children }: AuthRouteGateProps) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (user) {
      router.replace("/recentProject");
    }
  }, [router, user]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-50">
        <SpinnerDots />
      </div>
    );
  }

  return <>{children}</>;
}
