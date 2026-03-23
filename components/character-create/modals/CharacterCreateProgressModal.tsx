import { Button } from "@/components/ui/Button";
import { SpinnerDots } from "@/components/ui/SpinnerDots";

type CharacterCreateProgressModalProps = {
  progress?: number;
  step?: string;
  onGoDashboard: () => void;
  onGoNext: () => void;
};

export function CharacterCreateProgressModal({
  progress = 0,
  step = "AI가 사진을 학습하여 캐릭터를 생성하고 있어요.",
  onGoDashboard,
  onGoNext,
}: CharacterCreateProgressModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4">
      <div className="w-full max-w-[470px] rounded-[28px] border border-[#2f2f35] bg-[#1f1f24] px-[28px] py-[30px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex size-[40px] items-center justify-center rounded-full border border-[#33333b] text-primary-500">
          <SpinnerDots size="md" />
        </div>
        <p className="pt-[22px] text-[30px] font-semibold tracking-[-0.03em] text-white">
          나만의 캐릭터를 만드는 중이에요
        </p>
        <p className="pt-[16px] text-[24px] font-semibold leading-[1.45] text-[#d7d7dc]">
          캐릭터 생성에는 약 3~5분 정도 걸립니다.
        </p>
        <p className="pt-[14px] text-[16px] font-medium leading-[1.5] text-[#b9b9c1]">
          {step}
        </p>
        <p className="pt-[10px] text-[14px] font-semibold text-primary-500">
          {progress}%
        </p>
        <p className="pt-[14px] text-[14px] font-medium leading-[1.5] text-[#7c7c86]">
          이 화면을 닫아도 캐릭터 생성은 계속 진행됩니다.
          <br />
          완성되면 알림으로 알려드릴게요.
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
          <Button className="min-w-[148px]" size="tiny" onClick={onGoNext}>
            다른 캐릭터 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
