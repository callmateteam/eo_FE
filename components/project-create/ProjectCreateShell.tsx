import type { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

import { ProjectCreateHeader } from "@/components/project-create/ProjectCreateHeader";
import { ProjectCreateStepBar } from "@/components/project-create/ProjectCreateStepBar";

type ProjectCreateShellProps = {
  actions: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function ProjectCreateShell({
  actions,
  children,
  className,
  description = "캐릭터의 이미지나 동영상을 업로드해주세요",
  title = "새 캐릭터 생성",
}: ProjectCreateShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-[#111115]", className)}>
      <ProjectCreateHeader />
      <main className="flex-1 px-[34px] pb-[32px] pt-[34px]">
        <ProjectCreateStepBar />

        <div className="pt-[34px] text-center">
          <h1 className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="mt-[14px] text-[14px] font-semibold leading-none tracking-[-0.02em] text-[#d7d7dc]">
            {description}
          </p>
        </div>

        <div className="pt-[34px]">{children}</div>
      </main>

      <div className="flex items-center justify-end border-t border-[#2a2a30] bg-[#1f1f24] px-[34px] py-[12px]">
        <div className="flex items-center gap-[10px]">{actions}</div>
      </div>
    </div>
  );
}
