import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  return (
    <AuthCard className="ml-auto w-[492px] px-[30px] pb-[44px] pt-[44px]">
      <div className="flex flex-col gap-[31px]">
        <AuthField label="아이디" placeholder="아이디를 입력하세요" />
        <AuthField label="비밀번호" placeholder="비밀번호를 입력하세요" type="password" />

        <div className="flex flex-col gap-[7px] pt-[1px]">
          <Button className="h-[58px] w-full rounded-full bg-[linear-gradient(90deg,#b04bff_0%,#d45bff_100%)] shadow-none" size="sm">
            로그인
          </Button>
          <p className="m-0 text-center text-[12px] leading-none text-[#8e869f]">
            아직 계정이 없으신가요?{" "}
            <Link className="font-medium text-[#b04bff]" href="/signup">
              회원가입
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-[11px] pt-[15px]">
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.24)]" />
          <span className="text-[13px] leading-none font-medium text-[#8e869f]">또는</span>
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.24)]" />
        </div>

        <GoogleLoginButton />
      </div>
    </AuthCard>
  );
}
