"use client";

import type { ButtonHTMLAttributes } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

export type PlusButtonState = "default" | "hovered" | "pressed";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  state?: PlusButtonState;
};

export function PlusButton({
  className,
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border transition-colors",
        state === "default" && "border-primary-500 text-primary-500",
        state === "hovered" && "border-primary-500 bg-primary-500/10 text-primary-500",
        state === "pressed" && "border-primary-700 bg-primary-700/20 text-primary-500",
        className
      )}
      type={type}
    >
      <Icon className="size-6" name="plus" />
    </button>
  );
}
