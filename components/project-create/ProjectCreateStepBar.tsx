import { StepBar } from "@/components/ui/StepBar";

const steps = [
  { label: "캐릭터 생성", state: "now" as const },
  { label: "아이디어 입력" },
  { label: "스토리보드 생성" },
  { label: "영상 생성 및 편집" },
  { label: "영상 저장" },
];

export function ProjectCreateStepBar() {
  return <StepBar className="w-full gap-[6px]" steps={steps} />;
}
