"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

export type ButtonSize = "tiny" | "sm" | "md";
export type ButtonState = "default" | "hovered" | "pressed" | "disabled" | "error";
export type ButtonVariant = "filled" | "outlined";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
  iconAfter?: IconName;
  iconBefore?: IconName;
  size?: ButtonSize;
  state?: ButtonState;
  variant?: ButtonVariant;
  disabled?: boolean;
  children?: ReactNode;
};

const sizeClasses: Record<ButtonSize, string> = {
  tiny: "h-10 min-w-35 px-4",
  sm: "h-12 min-w-35 px-4",
  md: "h-13 min-w-36.25 px-4",
};

const textClasses: Record<ButtonSize, string> = {
  tiny: "text-label-md",
  sm: "text-label-md",
  md: "text-body-lg",
};

function getVisualState(disabled: boolean | undefined, state: ButtonState) {
  return disabled ? "disabled" : state;
}

export function Button({
  children = "button",
  className,
  disabled,
  iconAfter,
  iconBefore,
  size = "md",
  state = "default",
  variant = "filled",
  ...props
}: Props) {
  const visualState = getVisualState(disabled, state);
  const isFilled = variant === "filled";
  const isError = visualState === "error";

  const colorClasses = isFilled
    ? cn(
        visualState === "default" && "bg-action-primary text-text-inverse shadow-[0_1px_8px_4px_rgb(from_var(--action-primary)_r_g_b_/_0.13)]",
        visualState === "hovered" && "bg-action-primary-hover text-text-inverse shadow-[0_1px_8px_4px_rgb(from_var(--action-primary)_r_g_b_/_0.13)]",
        visualState === "pressed" && "bg-action-primary-pressed text-text-inverse shadow-[0_1px_8px_4px_rgb(from_var(--action-primary)_r_g_b_/_0.13)]",
        visualState === "disabled" && "bg-gray-700 text-text-tertiary"
      )
    : cn(
        "border bg-gray-900",
        visualState === "default" && "border-action-primary text-text-inverse",
        visualState === "hovered" && "border-action-primary-hover bg-gray-900 text-text-inverse shadow-[0_1px_8px_4px_rgb(from_var(--action-primary)_r_g_b_/_0.13)]",
        visualState === "pressed" && "border-action-primary-pressed bg-gray-900 text-text-inverse shadow-[0_1px_8px_4px_rgb(from_var(--action-primary)_r_g_b_/_0.13)]",
        isError && "border-feedback-error text-feedback-error"
      );

  const hasIcons = Boolean(iconBefore || iconAfter);
  const iconTone = cn(
    "size-6",
    isFilled && visualState !== "disabled" && "text-text-inverse",
    isFilled && visualState === "disabled" && "text-text-tertiary",
    !isFilled && !isError && "text-text-inverse",
    isError && "text-feedback-error"
  );

  const textTone = cn(
    textClasses[size],
    "whitespace-nowrap",
    isFilled && visualState !== "disabled" && "text-text-inverse",
    isFilled && visualState === "disabled" && "text-text-tertiary",
    !isFilled && !isError && "text-text-inverse",
    isError && "text-feedback-error"
  );

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        hasIcons ? "gap-2" : "gap-0",
        sizeClasses[size],
        colorClasses,
        disabled && "cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      disabled={disabled}
      type={props.type ?? "button"}
    >
      {iconBefore ? <Icon className={iconTone} name={iconBefore} /> : null}
      <span className={textTone}>{children}</span>
      {iconAfter ? <Icon className={iconTone} name={iconAfter} /> : null}
    </button>
  );
}
