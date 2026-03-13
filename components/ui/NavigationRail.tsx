"use client";

import type { ButtonHTMLAttributes } from "react";

import { type IconName } from "@/components/ui/Icon";
import { Navi } from "@/components/ui/Navi";
import { cn } from "@/components/ui/utils";

type NavigationRailState = "default" | "hovered" | "clicked";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon?: IconName;
  label?: string;
  state?: NavigationRailState;
};

export function NavigationRail({
  className,
  icon = "dashboard",
  label = "nav",
  state = "default",
  ...props
}: Props) {
  return (
    <div className={cn("inline-flex w-[49px] flex-col items-center gap-2", className)}>
      <Navi
        {...props}
        icon={icon}
        state={state === "clicked" ? "clicked" : state}
      />
      <span
        className={cn(
          "text-caption-md min-w-full text-center",
          state === "default" && "text-gray-50",
          state === "hovered" && "text-gray-50",
          state === "clicked" && "text-primary-500"
        )}
      >
        {label}
      </span>
    </div>
  );
}
