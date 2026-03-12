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
  const containerTone = cn(
    fieldState === "default" &&
      "border-border-subtle bg-[linear-gradient(90deg,_rgb(from_var(--color-gray-900)_r_g_b_/_1)_0%,_rgb(from_var(--color-gray-800)_r_g_b_/_1)_100%)]",
    fieldState === "hovered" &&
      "border-border-strong bg-[linear-gradient(90deg,_rgb(from_var(--color-gray-900)_r_g_b_/_1)_0%,_rgb(from_var(--color-gray-800)_r_g_b_/_1)_100%)]",
    fieldState === "pressed" && "border-action-primary bg-[var(--color-gray-700)]",
    fieldState === "error" && "border-feedback-error bg-[var(--color-gray-700)]"
  );

  const inputTone = cn(
    "text-body-lg w-full border-0 bg-transparent outline-none",
    fieldState === "default" && "text-text-tertiary placeholder:text-text-tertiary",
    fieldState === "hovered" && "text-text-inverse placeholder:text-text-tertiary",
    fieldState === "pressed" && "text-text-inverse placeholder:text-text-tertiary",
    fieldState === "error" && "text-text-inverse placeholder:text-text-tertiary"
  );

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? <span className="text-label-sm text-text-secondary">{label}</span> : null}
      <span
        className={cn(
          "flex h-[60px] w-full items-center gap-3 rounded-xl border px-5 transition-colors",
          containerTone,
          className
        )}
      >
        {leadingIcon ? (
          <Icon
            className={cn(
              "size-5",
              fieldState === "default" ? "text-text-tertiary" : "text-text-inverse"
            )}
            name={leadingIcon}
          />
        ) : null}
        <input
          {...props}
          className={inputTone}
        />
      </span>
      {fieldState === "error" && errorMessage ? (
        <span className="text-caption-sm text-feedback-error">{errorMessage}</span>
      ) : null}
    </label>
  );
}
