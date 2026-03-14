import type { InputHTMLAttributes } from "react";

import { InputField } from "@/components/ui/InputField";

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  errorMessage?: string;
  label: string;
  placeholder: string;
  type?: "text" | "password";
};

export function AuthField({
  errorMessage,
  label,
  placeholder,
  type = "text",
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <InputField
        {...inputProps}
        className="h-[58px] rounded-[7px] bg-[#05060c] px-[14px] shadow-none"
        errorMessage={errorMessage}
        fieldState={errorMessage ? "error" : "default"}
        label={label}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
