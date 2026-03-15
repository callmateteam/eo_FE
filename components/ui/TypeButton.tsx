"use client";

import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

import { editorFontIconAssets } from "@/lib/assets";
import { cn } from "@/components/ui/utils";

export type TypeButtonState = "default" | "hovered" | "clicked";
export type TypeButtonIcon =
  | "textBold"
  | "textItalic"
  | "textUnderline"
  | "alignLeft"
  | "alignCenter"
  | "alignRight";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon?: TypeButtonIcon;
  state?: TypeButtonState;
};

export function TypeButton({
  className,
  icon = "textBold",
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg p-2 transition-colors",
        state === "default" && "bg-transparent",
        state === "hovered" && "bg-gray-900",
        state === "clicked" && "bg-primary-700",
        className
      )}
      type={type}
    >
      <Image
        alt={icon}
        height={24}
        src={editorFontIconAssets[icon]}
        width={24}
      />
    </button>
  );
}
