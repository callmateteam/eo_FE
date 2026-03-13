import { InputField } from "@/components/ui/InputField";

type AuthFieldProps = {
  label: string;
  placeholder: string;
  type?: "text" | "password";
};

export function AuthField({ label, placeholder, type = "text" }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="m-0 text-[14px] leading-none font-semibold tracking-[-0.01em] text-[#f1eefc]">
        {label}
      </p>
      <InputField
        className="h-[58px] rounded-[7px] border-transparent bg-[#05060c] px-[14px] shadow-none"
        defaultValue=""
        fieldState="default"
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
