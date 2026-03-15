"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type ProjectCreateCardProps = {
  className?: string;
  label?: string;
  onClick?: () => void;
  size?: "default" | "compact";
};

export function ProjectCreateCard({
  className,
  label = "새 프로젝트 생성",
  onClick,
  size = "default",
}: ProjectCreateCardProps) {
  return (
    <button
      className={cn(
        "flex shrink-0 flex-col items-center justify-center border bg-[#1e1e22] text-white transition-colors hover:cursor-pointer hover:border-[#8a3ed9] hover:bg-[#121214] active:border-[#ba4eff] active:bg-[#121214]",
        size === "default" &&
          "h-[280px] w-[224px] gap-2 rounded-[20px] border-[#8e8e93] active:border-2",
        size === "compact" &&
          "h-[184px] w-[148px] gap-[14px] rounded-[16px] border-[#60606e]",
        className
      )}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full text-[#ba4eff]",
          size === "default" && "h-12 w-12 border-[1.5px] border-[#ba4eff]",
          size === "compact" && "h-8 w-8 border border-[#8b45ff]"
        )}
      >
        <Icon className={cn(size === "default" ? "size-6" : "size-4")} name="plus" />
      </span>
      <span
        className={cn(
          "text-center text-[#e5e5ea]",
          size === "default" &&
            "text-[14px] font-medium leading-[14px] tracking-[0.14px]",
          size === "compact" &&
            "text-[12px] font-semibold leading-none tracking-[-0.02em] text-[#d7d7dc]"
        )}
      >
        {label}
      </span>
    </button>
  );
}
