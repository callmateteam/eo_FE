"use client";

import type { InputHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type FieldState = "default" | "hovered" | "pressed" | "error";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  errorMessage?: string;
  fieldState?: FieldState;
  label?: string;
  leadingIcon?: IconName;
};

export function InputField({
  className,
  errorMessage,
  fieldState = "default",
  label,
  leadingIcon,
  ...props
}: Props) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? <span className="text-label-sm text-text-secondary">{label}</span> : null}
      <span
        className={cn(
          "flex h-[60px] w-full items-center gap-3 rounded-xl border px-5 transition-colors",
          fieldState === "default" && "border-border-subtle bg-[linear-gradient(90deg,_rgba(18,18,20,1)_0%,_rgba(30,30,34,1)_100%)]",
          fieldState === "hovered" && "border-border-subtle bg-[linear-gradient(90deg,_rgba(18,18,20,1)_0%,_rgba(30,30,34,1)_100%)]",
          fieldState === "pressed" && "border-action-primary bg-[var(--color-gray-500)]",
          fieldState === "error" && "border-feedback-error bg-[var(--color-gray-500)]",
          className
        )}
      >
        {leadingIcon ? <Icon className="size-5 text-text-tertiary" name={leadingIcon} /> : null}
        <input
          {...props}
          className="text-display-md w-full border-0 bg-transparent text-text-inverse outline-none placeholder:text-text-tertiary"
        />
      </span>
      {fieldState === "error" && errorMessage ? (
        <span className="text-caption-sm text-feedback-error">{errorMessage}</span>
      ) : null}
    </label>
  );
}
