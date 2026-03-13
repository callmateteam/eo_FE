import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";

function IdCheckRow() {
  return (
    <div className="flex items-end gap-[12px]">
      <div className="min-w-0 flex-1">
        <AuthField label="아이디" placeholder="아이디 (영문 5자 이상)" />
      </div>
      <Button
        className="h-[43px] min-w-[74px] rounded-full border-[#b04bff] bg-[rgba(17,18,23,0.46)] px-[14px] shadow-[0_0_10px_rgba(176,75,255,0.22)]"
        size="tiny"
        variant="outlined"
      >
        중복확인
      </Button>
    </div>
  );
}

export function SignupForm() {
  return (
    <div className="flex w-full flex-col items-center pt-[7px]">
      <h1 className="mb-[29px] text-[43px] leading-none font-bold tracking-[-0.03em] text-white">
        회원가입
      </h1>
      <AuthCard className="w-[491px] px-[29px] pb-[44px] pt-[43px]">
        <div className="flex flex-col gap-[26px]">
          <AuthField label="이름" placeholder="이름" />
          <IdCheckRow />
          <AuthField
            label="비밀번호"
            placeholder="비밀번호 (영문, 특수문자 포함 8자 이상)"
            type="password"
          />
          <AuthField
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            type="password"
          />
          <Button className="mt-[3px] h-[58px] w-full rounded-full bg-[linear-gradient(90deg,#b04bff_0%,#d45bff_100%)] shadow-none" size="sm">
            회원가입
          </Button>
        </div>
      </AuthCard>
    </div>
  );
}
