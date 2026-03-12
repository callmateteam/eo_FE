"use client";

import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type NaviState = "default" | "hovered" | "clicked";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon?: IconName;
  state?: NaviState;
};

export function Navi({
  className,
  icon = "dashboard",
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl p-2 transition-colors",
        state === "default" && "bg-transparent text-gray-50",
        state === "hovered" &&
          "bg-[radial-gradient(circle_at_center,#8a3ed9_0%,#6b2bb1_100%)] text-gray-50",
        state === "clicked" &&
          "bg-[radial-gradient(circle_at_center,#8a3ed9_0%,#ba4eff_100%)] text-gray-50",
        className
      )}
      type={type}
    >
      <Icon className="size-6" name={icon} />
    </button>
  );
}
