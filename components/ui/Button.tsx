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
  tiny: "text-label-l",
  sm: "text-label-l",
  md: "text-body-l",
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
        visualState === "default" && "bg-primary-500 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        visualState === "hovered" && "bg-primary-600 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        visualState === "pressed" && "bg-primary-700 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        visualState === "disabled" && "bg-gray-700 text-gray-300"
      )
    : cn(
        "border bg-gray-900",
        visualState === "default" && "border-primary-500 text-gray-50",
        visualState === "hovered" && "border-primary-600 bg-gray-900 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        visualState === "pressed" && "border-primary-700 bg-gray-900 text-gray-50 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        isError && "border-error-500 text-error-500"
      );

  const hasIcons = Boolean(iconBefore || iconAfter);
  const iconTone = cn(
    "size-6",
    isFilled && visualState !== "disabled" && "text-gray-50",
    isFilled && visualState === "disabled" && "text-gray-300",
    !isFilled && !isError && "text-gray-50",
    isError && "text-error-500"
  );

  const textTone = cn(
    textClasses[size],
    "whitespace-nowrap",
    isFilled && visualState !== "disabled" && "text-gray-50",
    isFilled && visualState === "disabled" && "text-gray-300",
    !isFilled && !isError && "text-gray-50",
    isError && "text-error-500"
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
