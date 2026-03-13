import Image from "next/image";

import { socialAssets } from "@/lib/assets";

export function GoogleLoginButton() {
  return (
    <button
      className="flex h-[43px] w-full items-center justify-center gap-[8px] rounded-full border border-[rgba(255,255,255,0.72)] bg-[#f1f1f1] px-[24px] text-[#4f4b57] shadow-none"
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="size-[18px]"
        height={18}
        src={socialAssets.google}
        width={18}
      />
      <span className="text-[15px] leading-none font-medium tracking-[-0.01em] text-[#4f4b57]">
        구글계정으로 로그인
      </span>
    </button>
  );
}
