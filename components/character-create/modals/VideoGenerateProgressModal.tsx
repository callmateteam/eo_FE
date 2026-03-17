import { Button } from "@/components/ui/Button";
import { SpinnerDots } from "@/components/ui/SpinnerDots";

type VideoGenerateProgressModalProps = {
  onGoDashboard: () => void;
  onGoNext: () => void;
};

export function VideoGenerateProgressModal({
  onGoDashboard,
  onGoNext,
}: VideoGenerateProgressModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4">
      <div className="w-full max-w-[470px] rounded-[28px] border border-[#2f2f35] bg-[#1f1f24] px-[28px] py-[30px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex size-[40px] items-center justify-center rounded-full border border-[#33333b] text-primary-500">
          <SpinnerDots className="scale-[0.52]" />
        </div>
        <p className="pt-[22px] text-[30px] font-semibold tracking-[-0.03em] text-white">
          영상 생성을 시작했어요
        </p>
        <p className="pt-[16px] text-[24px] font-semibold leading-[1.45] text-[#d7d7dc]">
          영상 생성에는 약 3~5분 정도 걸립니다.
          <br />
          기다리는 동안 다른 작업을 진행해보세요.
        </p>
        <p className="pt-[14px] text-[14px] font-medium leading-[1.5] text-[#7c7c86]">
          이 화면을 닫아도 영상 생성은 계속 진행됩니다.
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
            새 영상 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
