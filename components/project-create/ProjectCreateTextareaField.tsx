"use client";

import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

type ProjectCreateTextareaFieldProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
    label: string;
  };

export function ProjectCreateTextareaField({
  className,
  label,
  ...props
}: ProjectCreateTextareaFieldProps) {
  return (
    <label className={cn("flex w-full flex-col gap-3", className)}>
      <span className="text-heading-md text-gray-100">
        {label}
      </span>
      <textarea
        {...props}
        className={cn(
          "h-[116px] w-full resize-none rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4 py-3 text-[13px] font-medium leading-[1.6] tracking-[-0.02em] text-[#b6b6be] outline-none placeholder:text-[#6d6d76]",
          className
        )}
      />
    </label>
  );
}
