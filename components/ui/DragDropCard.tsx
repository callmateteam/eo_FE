"use client";

import type { HTMLAttributes } from "react";

import { MediaStackIllustration } from "@/components/ui/MediaStackIllustration";
import { cn } from "@/components/ui/utils";

type DragDropState = "default" | "hovered" | "pressed";

type Props = HTMLAttributes<HTMLDivElement> & {
  description?: string;
  helperText?: string;
  state?: DragDropState;
  title?: string;
};

export function DragDropCard({
  className,
  description = "생성하고 싶은 캐릭터의 여러 각도 이미지나 영상을 첨부할수록 정확한 캐릭터를 생성할 수 있어요",
  helperText = "MP4, JPG, PNG 등 (최대 10MB)",
  state = "default",
  title = "Drag & Drop",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={cn(
        "flex min-h-[640px] w-full flex-col items-center justify-center rounded-[28px] border p-8 text-center transition-colors",
        state === "default" &&
          "border-border-subtle bg-[linear-gradient(180deg,_rgba(18,18,20,1)_0%,_rgba(30,30,34,1)_100%)]",
        state === "hovered" && "border-action-primary bg-[var(--color-gray-500)]",
        state === "pressed" && "border-action-primary bg-[var(--color-gray-500)] shadow-[0_0_0_1px_var(--action-primary)]",
        className
      )}
    >
      <MediaStackIllustration className="mb-10" variant="video" />
      <h3 className="text-display-lg text-text-inverse">{title}</h3>
      <p className="mt-4 text-body-lg text-text-tertiary">{helperText}</p>
      <p className="mt-6 max-w-[520px] text-body-md text-[var(--color-gray-300)]">
        {description}
      </p>
    </div>
  );
}
