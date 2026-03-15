"use client";

import type { ButtonHTMLAttributes } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

export type ResetButtonState = "default" | "hovered" | "clicked";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  state?: ResetButtonState;
};

export function ResetButton({
  className,
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg p-2 transition-colors",
        state === "default" && "bg-transparent text-gray-300",
        state === "hovered" && "bg-gray-900 text-gray-50",
        state === "clicked" && "bg-gray-900 text-primary-500",
        className
      )}
      type={type}
    >
      <Icon className="size-6" name="reset" />
    </button>
  );
}
