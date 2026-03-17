import type { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

import { CharacterCreateStepBar } from "@/components/character-create/CharacterCreateStepBar";
import { ProjectCreateHeader } from "@/components/project-create/ProjectCreateHeader";

type CharacterCreateShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  currentStep?: number;
  description?: string;
  projectTitle?: string;
  title?: string;
};

export function CharacterCreateShell({
  actions,
  children,
  className,
  currentStep = 0,
  description = "캐릭터의 이미지나 동영상을 업로드해주세요",
  projectTitle = "프로젝트명",
  title = "새 캐릭터 생성",
}: CharacterCreateShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[#111115]", className)}>
      <ProjectCreateHeader projectTitle={projectTitle} />
      <main className="flex-1 px-[36px] pb-[37px] pt-[28px]">
        <CharacterCreateStepBar currentStep={currentStep} />

        <div className="pt-[35px] text-center">
          <h1 className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-white">
            {title}
          </h1>
          {description ? (
            <p className="text-heading-md mt-[14px] text-[#d7d7dc]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="pt-[34px]">{children}</div>
      </main>

      {actions ? (
        <div className="flex h-[80px] items-center justify-end border-t border-[#2a2a30] bg-[#1f1f24] px-[34px]">
          <div className="flex items-center gap-[10px]">{actions}</div>
        </div>
      ) : null}
    </div>
  );
}
