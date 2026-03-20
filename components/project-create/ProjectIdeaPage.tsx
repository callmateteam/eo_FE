"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useCreateStoryboard } from "@/hooks/useStoryboard";
import { useUpdateProject } from "@/hooks/useProjects";
import { getProject } from "@/lib/api/projects";
import { getStoryboard } from "@/lib/api/storyboards";
import { ApiError } from "@/lib/api/client";
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
  const [idea, setIdea] = useState(draft?.idea ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPollingScenes, setIsPollingScenes] = useState(false);
  const updateProjectMutation = useUpdateProject();
  const storyboardMutation = useCreateStoryboard();

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

  async function handleCreateStoryboard() {
    const draft = getProjectDraft();

    if (!resolvedProjectId || !draft?.characterId || !draft.characterSource) {
      setErrorMessage("프로젝트 정보가 없습니다. 다시 시작해주세요.");
      return;
    }

    setErrorMessage(null);

    try {
      await updateProjectMutation.mutateAsync({
        projectId: resolvedProjectId,
        payload: {
          current_stage: 2,
          idea: idea.trim(),
        },
      });

      const storyboard = await storyboardMutation.mutateAsync({
        character_id:
          draft.characterSource === "preset" ? draft.characterId : null,
        custom_character_id:
          draft.characterSource === "custom" ? draft.characterId : null,
        idea: idea.trim(),
        project_id: resolvedProjectId,
      });

      updateProjectDraft({
        idea: idea.trim(),
        projectId: resolvedProjectId,
        storyboardId: storyboard.id,
        title: projectTitle,
      });

      // Poll until scenes array is populated before navigating
      setIsPollingScenes(true);
      const maxAttempts = 60; // 2 minutes at 2s intervals
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const data = await getStoryboard(storyboard.id);
          if (data.scenes.length > 0) {
            break;
          }
        } catch {
          // keep polling
        }
      }
      setIsPollingScenes(false);

      router.push(
        `/project/create/storyboard?projectId=${encodeURIComponent(
          resolvedProjectId
        )}&storyboardId=${encodeURIComponent(storyboard.id)}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("[project-create] api error", error);
      }
      setErrorMessage(
        error instanceof Error ? error.message : "스토리보드 생성에 실패했습니다."
      );
    }
  }

  const isIdeaValid = idea.trim().length > 0;
  const isPending = updateProjectMutation.isPending || storyboardMutation.isPending || isPollingScenes;

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
            disabled={!isIdeaValid || isPending}
            onClick={() => void handleCreateStoryboard()}
          >
            {isPending ? (
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
