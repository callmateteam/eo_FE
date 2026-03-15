"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/components/ui/utils";

export type ScriptInputFieldState = "default" | "selected";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  state?: ScriptInputFieldState;
};

export function ScriptInputField({
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
        "inline-flex h-[31px] min-w-[120px] items-center rounded-md px-3 text-[12px] font-medium leading-[16px] tracking-[0.12px] transition-colors",
        state === "default" && "bg-transparent text-gray-300",
        state === "selected" && "bg-primary-500 text-gray-50",
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}
