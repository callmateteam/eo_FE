"use client";

import type { HTMLAttributes } from "react";

import { MenuButton } from "@/components/ui/MenuButton";
import { cn } from "@/components/ui/utils";

type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  className?: string;
  editLabel?: string;
  deleteLabel?: string;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function Menu({
  className,
  deleteLabel = "삭제",
  editLabel = "수정",
  onDelete,
  onEdit,
  ...props
}: MenuProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-[105px] flex-col rounded-[12px] bg-[#121214]",
        className
      )}
    >
      <div className="flex w-full items-center justify-center px-3 py-2">
        <MenuButton onClick={onEdit} state="hovered">
          {editLabel}
        </MenuButton>
      </div>
      <div className="flex w-full items-center justify-center px-3 py-2">
        <MenuButton onClick={onDelete}>{deleteLabel}</MenuButton>
      </div>
    </div>
  );
}
