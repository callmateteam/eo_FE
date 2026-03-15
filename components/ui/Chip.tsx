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
        "text-heading-md inline-flex h-11 min-w-[57px] items-center justify-center rounded-full px-3 py-2 tracking-[-0.18px] transition-colors",
        state === "default" && "bg-transparent text-gray-300",
        state === "hovered" && "bg-transparent text-gray-50",
        state === "clicked" && "bg-gray-700 text-gray-50",
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}
