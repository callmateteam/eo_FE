/* eslint-disable @next/next/no-img-element */

import { Button } from "@/components/ui/Button";

type CharacterRegisteredModalProps = {
  imageSrc: string;
  isSubmitting?: boolean;
  onGoDashboard: () => void;
  onGoNext: () => void;
};

export function CharacterRegisteredModal({
  imageSrc,
  isSubmitting = false,
  onGoDashboard,
  onGoNext,
}: CharacterRegisteredModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4">
      <div className="w-full max-w-[470px] rounded-[28px] border border-[#2f2f35] bg-[#1f1f24] px-[28px] py-[30px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto size-[140px] overflow-hidden rounded-[18px] border border-[#3a3a42] bg-[#16161a]">
          <img alt="등록된 캐릭터" className="h-full w-full object-cover" src={imageSrc} />
        </div>
        <p className="pt-[22px] text-[30px] font-semibold tracking-[-0.03em] text-white">
          캐릭터가 준비되었어요
        </p>
        <p className="pt-[16px] text-[24px] font-semibold leading-[1.45] text-[#d7d7dc]">
          이 캐릭터로 바로 다음 단계를
          <br />
          이어서 진행할 수 있어요.
        </p>
        <p className="pt-[14px] text-[14px] font-medium leading-[1.5] text-[#7c7c86]">
          다음으로 이동하면 프로젝트가 자동으로 만들어지고
          <br />
          아이디어 입력 단계로 이어집니다.
        </p>

        <div className="flex items-center justify-center gap-3 pt-[28px]">
          <Button
            className="min-w-[148px]"
            size="tiny"
            variant="outlined"
            onClick={onGoDashboard}
          >
            대시보드로 가기
          </Button>
          <Button
            className="min-w-[148px]"
            size="tiny"
            disabled={isSubmitting}
            onClick={onGoNext}
          >
            {isSubmitting ? "이동 중" : "다음으로 이동"}
          </Button>
        </div>
      </div>
    </div>
  );
}
