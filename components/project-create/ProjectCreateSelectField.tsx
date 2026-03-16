"use client";

import type { SelectHTMLAttributes } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type SelectOption = {
  label: string;
  value: string;
};

type ProjectCreateSelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  className?: string;
  label: string;
  options: SelectOption[];
};

export function ProjectCreateSelectField({
  className,
  label,
  options,
  ...props
}: ProjectCreateSelectFieldProps) {
  return (
    <label className={cn("flex w-full flex-col gap-3", className)}>
      <span className="text-[14px] font-semibold leading-none tracking-[-0.02em] text-white">
        {label}
      </span>
      <span className="relative flex h-[44px] items-center rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4">
        <select
          {...props}
          className="h-full w-full appearance-none bg-transparent pr-8 text-[14px] font-medium leading-none text-[#d7d7dc] outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon className="pointer-events-none absolute right-4 size-4 text-[#b6b6be]" name="down" />
      </span>
    </label>
  );
}
