import type { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

import { ProjectCreateHeader } from "@/components/project-create/ProjectCreateHeader";
import { ProjectCreateStepBar } from "@/components/project-create/ProjectCreateStepBar";

type ProjectCreateShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  currentStep?: number;
  description?: string;
  title?: string;
};

export function ProjectCreateShell({
  actions,
  children,
  className,
  currentStep = 0,
  description = "캐릭터의 이미지나 동영상을 업로드해주세요",
  title = "새 캐릭터 생성",
}: ProjectCreateShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[#111115]", className)}>
      <ProjectCreateHeader />
      <main className="flex-1 px-[48px] pt-[28px] pb-[37px]">
        <ProjectCreateStepBar currentStep={currentStep} />

        <div className="pt-[36px] text-center">
          <h1 className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-white">
            {title}
          </h1>
          {description ? (
            <p className="text-heading-md mt-[14px] text-[#d7d7dc]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="pt-[40px]">{children}</div>
      </main>

      {actions ? (
        <div className="flex h-[80px] items-center justify-end border-t border-[#2a2a30] bg-[#1f1f24] px-[34px]">
          <div className="flex items-center gap-[10px]">{actions}</div>
        </div>
      ) : null}
    </div>
  );
}
