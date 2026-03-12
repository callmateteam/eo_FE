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
        state === "default" && "bg-transparent text-text-tertiary",
        state === "hovered" &&
          "bg-[radial-gradient(circle_at_center,_rgba(138,62,217,1)_0%,_rgba(107,43,177,1)_100%)] text-text-inverse",
        state === "clicked" &&
          "bg-[radial-gradient(circle_at_center,_rgba(138,62,217,1)_0%,_rgba(186,78,255,1)_100%)] text-text-inverse",
        className
      )}
      type={type}
    >
      <Icon className="size-6" name={icon} />
    </button>
  );
}
