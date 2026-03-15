"use client";

import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

export type ArrowButtonState = "default" | "hovered" | "pressed";
export type ArrowDirection = "left" | "right";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  direction?: ArrowDirection;
  state?: ArrowButtonState;
};

const directionToIcon: Record<ArrowDirection, IconName> = {
  left: "left",
  right: "right",
};

export function ArrowButton({
  className,
  direction = "right",
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border transition-colors",
        state === "default" && "border-gray-700 bg-transparent text-gray-50",
        state === "hovered" && "border-primary-500 bg-gray-900 text-gray-50",
        state === "pressed" && "border-primary-700 bg-gray-900 text-primary-500",
        className
      )}
      type={type}
    >
      <Icon className="size-6" name={directionToIcon[direction]} />
    </button>
  );
}
