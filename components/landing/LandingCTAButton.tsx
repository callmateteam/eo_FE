"use client";

import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";

export function LandingCTAButton({ className }: { className?: string }) {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  const handleClick = () => {
    router.push(user ? "/dashboard" : "/login");
  };

  return (
    <Button
      className={[
        "min-w-0 rounded-full px-4 h-13 bg-primary-500 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      iconAfter={undefined}
      iconBefore={undefined}
      size="md"
      variant="filled"
      onClick={handleClick}
    >
      지금 바로 만들기
    </Button>
  );
}
