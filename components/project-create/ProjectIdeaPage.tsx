"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type ProjectIdeaPageProps = {
  characterId?: string;
};

export function ProjectIdeaPage({ characterId }: ProjectIdeaPageProps) {
  const router = useRouter();
  const [idea, setIdea] = useState(
    "Luna가 방에서 신비로운 빛나는 포탈을 발견한다. 호기심에 손을 뻗어 포탈을 만진다.\n포탈이 마법 에너지로 소용돌이친다."
  );

  return (
    <ProjectCreateShell
      currentStep={1}
      description="간단한 아이디어를 입력하면 콘티를 생성해요"
      title="아이디어 입력"
    >
      <section className="mx-auto w-full max-w-[1162px] rounded-[24px] border border-[#60606e] bg-[#202026] px-[16px] py-[28px]">
        <div className="rounded-[18px] border border-[#7c3aed] bg-[#313137] px-[18px] py-[16px] shadow-[inset_0_0_0_1px_rgba(124,58,237,0.18)]">
          <textarea
            className="text-body-lg h-[148px] w-full resize-none border-0 bg-transparent text-[#f1f1f4] outline-none placeholder:text-[#d0d0d6]"
            onChange={(event) => setIdea(event.target.value)}
            placeholder="아이디어를 2~3줄 정도 입력해주세요"
            value={idea}
          />
        </div>

        <div className="flex justify-end gap-[12px] pt-[28px]">
          <Button
            className="min-w-[108px]"
            size="tiny"
            variant="outlined"
            onClick={() =>
              router.push(
                characterId
                  ? `/project/create?characterId=${encodeURIComponent(characterId)}`
                  : "/project/create"
              )
            }
          >
            이전
          </Button>
          <Button
            className="min-w-[112px]"
            size="tiny"
            onClick={() =>
              router.push(
                characterId
                  ? `/project/create/storyboard?characterId=${encodeURIComponent(characterId)}`
                  : "/project/create/storyboard"
              )
            }
          >
            스토리보드 생성
          </Button>
        </div>

        {characterId ? (
          <div className="pt-[18px]">
            <p className="text-caption-md text-[#8f8f98]">characterId: {characterId}</p>
          </div>
        ) : null}
      </section>
    </ProjectCreateShell>
  );
}
