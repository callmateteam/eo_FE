"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";

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
  const isPasswordField = props.type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const containerTone = cn(
    fieldState === "default" &&
      "border-black/10 bg-[linear-gradient(90deg,#121214_0%,#1e1e22_100%)]",
    fieldState === "hovered" &&
      "border-black/15 bg-[linear-gradient(90deg,#121214_0%,#1e1e22_100%)]",
    fieldState === "pressed" && "border-primary-500 bg-gray-700",
    fieldState === "error" && "border-error-500 bg-gray-700",
  );

  const inputTone = cn(
    "text-body-lg w-full border-0 bg-transparent outline-none",
    fieldState === "default" && "text-gray-300 placeholder:text-gray-300",
    fieldState === "hovered" && "text-gray-50 placeholder:text-gray-300",
    fieldState === "pressed" && "text-gray-50 placeholder:text-gray-300",
    fieldState === "error" && "text-gray-50 placeholder:text-gray-300",
  );

  const resolvedType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : props.type;

  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-heading-md text-gray-100">{label}</span>
      ) : null}
      <span
        className={cn(
          "flex h-[60px] w-full items-center gap-3 rounded-xl border px-5 transition-colors",
          containerTone,
          className,
        )}
      >
        {leadingIcon ? (
          <Icon
            className={cn(
              "size-5",
              fieldState === "default" ? "text-gray-300" : "text-gray-50",
            )}
            name={leadingIcon}
          />
        ) : null}
        <input {...props} className={inputTone} type={resolvedType} />
        {isPasswordField ? (
          <button
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="inline-flex size-5 items-center justify-center text-gray-300 transition-colors hover:text-gray-50"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            <Icon
              className="size-5"
              name={showPassword ? "view-on" : "view-off"}
            />
          </button>
        ) : null}
      </span>
      {fieldState === "error" && errorMessage ? (
        <span className="text-caption-sm text-error-500">{errorMessage}</span>
      ) : null}
    </label>
  );
}
