import { StepBar } from "@/components/ui/StepBar";

const stepLabels = [
  "캐릭터 설정",
  "아이디어 입력",
  "스토리보드 생성",
  "영상 생성 및 편집",
  "영상 저장",
] as const;

type ProjectCreateStepBarProps = {
  currentStep?: number;
};

export function ProjectCreateStepBar({
  currentStep = 0,
}: ProjectCreateStepBarProps) {
  const steps = stepLabels.map((label, index) => ({
    label,
    state: index === currentStep ? ("now" as const) : undefined,
  }));

  return <StepBar className="w-full gap-[6px]" steps={steps} />;
}
