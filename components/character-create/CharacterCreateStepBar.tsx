import { ProjectCreateStepBar } from "@/components/project-create/ProjectCreateStepBar";

type CharacterCreateStepBarProps = {
  currentStep?: number;
};

export function CharacterCreateStepBar({
  currentStep = 0,
}: CharacterCreateStepBarProps) {
  return <ProjectCreateStepBar currentStep={currentStep} />;
}
