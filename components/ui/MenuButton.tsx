"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/components/ui/utils";

export type MenuButtonState = "default" | "hovered" | "pressed";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  state?: MenuButtonState;
};

export function MenuButton({
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
        "inline-flex w-[81px] cursor-pointer items-center rounded-[4px] p-1 text-left text-[14px] font-semibold leading-[14px] tracking-[0.14px] text-[#f5f5f5] transition-colors hover:bg-primary-500",
        state === "default" && "bg-transparent",
        state === "hovered" && "bg-primary-500",
        state === "pressed" && "bg-primary-500",
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}
