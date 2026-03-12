"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/components/ui/utils";

type ChipState = "default" | "hovered" | "clicked";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  state?: ChipState;
};

export function Chip({
  children = "text",
  className,
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "text-label-md inline-flex h-11 min-w-[57px] items-center justify-center rounded-full px-5 transition-colors",
        state === "default" && "bg-transparent text-text-inverse",
        state === "hovered" && "bg-transparent text-text-inverse",
        state === "clicked" && "bg-surface-muted text-text-inverse",
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}
