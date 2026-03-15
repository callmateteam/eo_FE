"use client";

import { cn } from "@/components/ui/utils";

export type BadgeColor = "blue" | "pink" | "gray";

type Props = {
  className?: string;
  color?: BadgeColor;
  text?: string;
};

export function Badge({ className, color = "blue", text = "text" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 text-[14px] font-medium leading-[14px] tracking-[0.14px] text-white",
        color === "blue" && "bg-secondary-500",
        color === "pink" && "bg-primary-500",
        color === "gray" && "bg-gray-700",
        className
      )}
    >
      {text}
    </span>
  );
}
