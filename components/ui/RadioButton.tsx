"use client";

import type { ButtonHTMLAttributes } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

export type RadioButtonState = "default" | "selected";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  state?: RadioButtonState;
};

export function RadioButton({
  className,
  state = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg border border-primary-500 p-2 transition-colors",
        className
      )}
      type={type}
    >
      {state === "selected" ? (
        <Icon className="size-6 text-gray-50" name="check" />
      ) : (
        <span className="size-6" />
      )}
    </button>
  );
}
