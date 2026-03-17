"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { createStoryboard } from "@/lib/api/storyboards";
import { ApiError } from "@/lib/api/client";
import { getProject, updateProject } from "@/lib/api/projects";
import {
  getProjectDraft,
  updateProjectDraft,
} from "@/lib/project-draft";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type ProjectIdeaPageProps = {
  projectId?: string;
};

export function ProjectIdeaPage({ projectId }: ProjectIdeaPageProps) {
  const router = useRouter();
  const draft = getProjectDraft();
  const resolvedProjectId = projectId ?? draft?.projectId ?? "";
  const [projectTitle, setProjectTitle] = useState(draft?.title ?? "프로젝트명");
  const [idea, setIdea] = useState(
    draft?.idea ??
      "Luna가 방에서 신비로운 빛나는 포탈을 발견한다. 호기심에 손을 뻗어 포탈을 만진다.\n포탈이 마법 에너지로 소용돌이친다."
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!resolvedProjectId) {
      router.replace("/project/create");
      return;
    }

    if (!draft?.title) {
      void getProject(resolvedProjectId)
        .then((project) => {
          setProjectTitle(project.title);
          updateProjectDraft({ projectId: resolvedProjectId, title: project.title });
        })
        .catch(() => undefined);
    }
  }, [draft?.title, resolvedProjectId, router]);

  const storyboardMutation = useMutation({
    mutationFn: async () => {
      const draft = getProjectDraft();

      if (!resolvedProjectId || !draft?.characterId || !draft.characterSource) {
        throw new Error("프로젝트 정보가 없습니다. 다시 시작해주세요.");
      }

      await updateProject(resolvedProjectId, {
        current_stage: 2,
        idea: idea.trim(),
      });

      const storyboardPayload = {
        character_id:
          draft.characterSource === "preset" ? draft.characterId : null,
        custom_character_id:
          draft.characterSource === "custom" ? draft.characterId : null,
        idea: idea.trim(),
        project_id: resolvedProjectId,
      };

      console.log("[project-create] createStoryboard payload", storyboardPayload);

      const storyboard = await createStoryboard(storyboardPayload);

      console.log("[project-create] createStoryboard response", storyboard);

      return storyboard;
    },
    onSuccess: (storyboard) => {
      updateProjectDraft({
        idea: idea.trim(),
        projectId: resolvedProjectId,
        storyboardId: storyboard.id,
        title: projectTitle,
      });
      router.push(
        `/project/create/storyboard?projectId=${encodeURIComponent(
          resolvedProjectId
        )}&storyboardId=${encodeURIComponent(storyboard.id)}`
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error("[project-create] createStoryboard api error", {
          errors: error.errors,
          message: error.message,
          status: error.status,
        });
      } else {
        console.error("[project-create] createStoryboard unknown error", error);
      }

      setErrorMessage(
        error instanceof Error ? error.message : "스토리보드 생성에 실패했습니다."
      );
    },
  });

  const isIdeaValid = idea.trim().length > 0;

  return (
    <ProjectCreateShell
      currentStep={1}
      description="간단한 아이디어를 입력하면 콘티를 생성해요"
      projectTitle={projectTitle}
      title="아이디어 입력"
    >
      <section className="mx-auto w-full max-w-[1162px] rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[16px] py-[28px]">
        <div
          className={`rounded-[18px] border bg-[#313137] px-[18px] py-[16px] transition-colors ${
            isIdeaValid
              ? "border-[#8b45ff] shadow-[inset_0_0_0_1px_rgba(139,69,255,0.16)]"
              : "border-[#42424c]"
          }`}
        >
          <textarea
            className="h-[148px] w-full resize-none border-0 bg-transparent text-[15px] font-medium leading-[1.65] text-[#f1f1f4] outline-none placeholder:text-[#8f8f98]"
            onChange={(event) => setIdea(event.target.value)}
            placeholder="아이디어를 입력해주세요"
            value={idea}
          />
        </div>

        {errorMessage ? (
          <p className="pt-[14px] text-[13px] font-medium text-[#ffb8bf]">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex justify-end gap-[12px] pt-[28px]">
          <Button
            className="min-w-[108px]"
            size="tiny"
            variant="outlined"
            onClick={() => router.push("/project/create")}
          >
            이전
          </Button>
          <Button
            className="min-w-[112px]"
            size="tiny"
            disabled={!isIdeaValid || storyboardMutation.isPending}
            onClick={() => {
              setErrorMessage(null);
              storyboardMutation.mutate();
            }}
          >
            {storyboardMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                생성 중
              </span>
            ) : (
              "스토리보드 생성"
            )}
          </Button>
        </div>
      </section>
    </ProjectCreateShell>
  );
}
