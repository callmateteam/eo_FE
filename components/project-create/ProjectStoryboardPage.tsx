/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useProjectToast } from "@/components/providers/ProjectToastProvider";
import { Button } from "@/components/ui/Button";
import { getProjectDraft } from "@/lib/project-draft";
import { ApiError } from "@/lib/api/client";
import { getProject } from "@/lib/api/projects";
import { getVideoEdit } from "@/lib/api/video-edit";
import {
  useStoryboard,
  useUpdateScene,
  useRegenerateSceneImage,
  useGenerateVideos,
} from "@/hooks/useStoryboard";
import { useUpdateProject } from "@/hooks/useProjects";
import type { SceneItem } from "@/lib/api/types";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { VideoGenerateProgressModal } from "@/components/character-create/modals/VideoGenerateProgressModal";

type ProjectStoryboardPageProps = {
  projectId?: string;
  storyboardId?: string;
};

function isFailedImageStatus(scene: SceneItem) {
  const imageStatus = scene.image_status?.toUpperCase();
  return imageStatus === "FAILED" || imageStatus === "ERROR";
}

function isPendingImageStatus(scene: SceneItem) {
  const imageStatus = scene.image_status?.toUpperCase();
  if (!imageStatus) return !scene.image_url;
  return !isFailedImageStatus(scene) && imageStatus !== "COMPLETED";
}

export function ProjectStoryboardPage({
  projectId,
  storyboardId,
}: ProjectStoryboardPageProps) {
  const router = useRouter();
  const { startVideoGenerationTracking } = useProjectToast();
  const draft = getProjectDraft();
  const resolvedProjectId = projectId ?? draft?.projectId ?? "";
  const resolvedStoryboardId = storyboardId ?? draft?.storyboardId ?? "";
  const [projectTitle, setProjectTitle] = useState(draft?.title ?? "프로젝트명");
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [sceneDrafts, setSceneDrafts] = useState<
    Record<string, { content: string; title: string }>
  >({});
  const [regeneratingSceneId, setRegeneratingSceneId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(true);

  // Storyboard data with polling: refetch every 3s while any scene has a pending image
  const { data: storyboardData, isLoading: isLoadingStoryboard } = useStoryboard(
    resolvedStoryboardId,
    { refetchInterval: shouldPoll ? 3000 : false },
  );

  const scenes: SceneItem[] = storyboardData?.scenes ?? [];

  // Update polling state: keep polling while storyboard has no scenes yet or any scene image is pending
  useEffect(() => {
    if (!storyboardData) return;

    const status = storyboardData.status?.toUpperCase();
    const hasScenes = storyboardData.scenes.length > 0;
    const hasPending = storyboardData.scenes.some((scene) => isPendingImageStatus(scene));

    // Keep polling if: storyboard is still generating, no scenes yet, or scenes have pending images
    setShouldPoll(!hasScenes || hasPending || status === "GENERATING");
  }, [storyboardData]);

  const updateSceneMutation = useUpdateScene();
  const regenerateSceneImageMutation = useRegenerateSceneImage();
  const generateVideosMutation = useGenerateVideos();
  const updateProjectMutation = useUpdateProject();

  useEffect(() => {
    if (!resolvedProjectId || !resolvedStoryboardId) {
      router.replace("/project/create");
    }
  }, [resolvedProjectId, resolvedStoryboardId, router]);

  // Fetch project title on mount if draft has no title
  useEffect(() => {
    if (!draft?.title && resolvedProjectId) {
      getProject(resolvedProjectId)
        .then((project) => {
          setProjectTitle(project.title);
        })
        .catch(() => {
          // ignore - keep default title
        });
    }
  }, [resolvedProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear regeneratingSceneId when the scene image is no longer pending
  useEffect(() => {
    if (regeneratingSceneId && storyboardData) {
      const scene = storyboardData.scenes.find((s) => s.id === regeneratingSceneId);
      if (scene && !isPendingImageStatus(scene)) {
        setRegeneratingSceneId(null);
      }
    }
  }, [regeneratingSceneId, storyboardData]);

  const hasScenes = scenes.length > 0;
  const hasFailedScenes = scenes.some((scene) => isFailedImageStatus(scene));
  const hasPendingScenes = scenes.some((scene) => isPendingImageStatus(scene));
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId]
  );
  const selectedSceneDraft = selectedScene
    ? sceneDrafts[selectedScene.id] ?? {
        content: selectedScene.content,
        title: selectedScene.title,
      }
    : { content: "", title: "" };

  async function handleSaveScene() {
    if (!selectedScene) return;
    const draft = sceneDrafts[selectedScene.id];
    if (!draft) return;

    try {
      await updateSceneMutation.mutateAsync({
        storyboardId: resolvedStoryboardId,
        sceneId: selectedScene.id,
        payload: { title: draft.title, content: draft.content },
      });

      // 저장 후 자동으로 이미지 재생성 (STALE 상태가 되므로)
      setRegeneratingSceneId(selectedScene.id);
      setShouldPoll(true);
      await regenerateSceneImageMutation.mutateAsync({
        storyboardId: resolvedStoryboardId,
        sceneId: selectedScene.id,
      });
    } catch (error) {
      setRegeneratingSceneId(null);
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("씬 저장에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  async function handleRegenerateImage() {
    if (!selectedScene) return;

    try {
      setRegeneratingSceneId(selectedScene.id);
      await regenerateSceneImageMutation.mutateAsync({
        storyboardId: resolvedStoryboardId,
        sceneId: selectedScene.id,
      });
      // Polling will pick up the new status automatically
    } catch (error) {
      setRegeneratingSceneId(null);
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("이미지 재생성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  async function handleGenerateVideos() {
    if (!resolvedStoryboardId) return;

    try {
      await generateVideosMutation.mutateAsync(resolvedStoryboardId);

      // Update project stage
      if (resolvedProjectId) {
        await updateProjectMutation.mutateAsync({
          projectId: resolvedProjectId,
          payload: { current_stage: 3 },
        });
      }

      // Start video generation tracking toast
      startVideoGenerationTracking({
        projectId: resolvedProjectId,
        storyboardId: resolvedStoryboardId,
      });

      // Poll for video edit readiness then navigate
      setIsGenerationModalOpen(true);

      const pollVideoEdit = async () => {
        const maxAttempts = 120; // ~10 minutes at 5s intervals
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          try {
            const videoEdit = await getVideoEdit(resolvedStoryboardId);
            if (videoEdit) {
              setIsGenerationModalOpen(false);
              router.push(
                `/project/${resolvedProjectId}/edit?storyboardId=${encodeURIComponent(
                  resolvedStoryboardId
                )}`
              );
              return;
            }
          } catch {
            // Not ready yet, continue polling
          }
        }
      };

      void pollVideoEdit();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("영상 생성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  return (
    <ProjectCreateShell
      currentStep={2}
      description="AI가 생성한 스토리보드를 검토하고 편집하세요"
      projectTitle={projectTitle}
      title="스토리보드 생성"
      actions={
        <>
          <Button
            className="min-w-[108px]"
            size="tiny"
            variant="outlined"
            onClick={() =>
              router.push(
                `/project/create/idea?projectId=${encodeURIComponent(
                  resolvedProjectId
                )}`
              )
            }
          >
            이전
          </Button>
          <Button
            className="min-w-[112px]"
            size="tiny"
            disabled={
              !resolvedStoryboardId ||
              isLoadingStoryboard ||
              !hasScenes ||
              hasPendingScenes ||
              hasFailedScenes
            }
            onClick={() => {
              setErrorMessage(null);
              void handleGenerateVideos();
            }}
          >
            영상 생성
          </Button>
        </>
      }
    >
      {errorMessage ? (
        <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
          {errorMessage}
        </p>
      ) : null}

      {isLoadingStoryboard && !hasScenes ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7d7dc]">
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span className="text-[14px] font-medium">스토리보드를 불러오고 있습니다.</span>
          </div>
        </div>
      ) : null}

      {hasScenes ? (
        <div className="mx-auto grid w-full max-w-[1162px] grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            {hasPendingScenes || hasFailedScenes ? (
              <div className="mb-[14px] rounded-[14px] border border-[#3a3a43] bg-[#1b1b20] px-[16px] py-[12px]">
                <p className="text-[13px] font-medium text-[#d7d7dc]">
                  {hasFailedScenes
                    ? "일부 씬 이미지 생성이 실패했습니다. 실패한 씬을 선택한 뒤 이미지 재생성을 눌러 다시 시도해주세요."
                    : "씬 이미지를 생성하고 있습니다. 완료된 씬부터 먼저 확인할 수 있습니다."}
                </p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-[12px] pr-[10px] sm:grid-cols-2 xl:grid-cols-3">
              {scenes.map((scene) => {
                const isSelected = scene.id === selectedScene?.id;

                return (
                  <button
                    key={scene.id}
                    className={`overflow-hidden rounded-[18px] border bg-[#202026] text-left transition-colors ${
                      isSelected
                        ? "border-[#b347ff] shadow-[0_0_0_1px_rgba(179,71,255,0.22)]"
                        : "border-[#60606e]"
                    }`}
                    onClick={() => {
                      setSelectedSceneId(scene.id);
                      setSceneDrafts((current) => ({
                        ...current,
                        [scene.id]: current[scene.id] ?? {
                          content: scene.content,
                          title: scene.title,
                        },
                      }));
                    }}
                    type="button"
                  >
                    <div className="relative h-[130px] overflow-hidden bg-white">
                      {scene.image_url ? (
                        <img
                          alt={scene.title}
                          className="h-full w-full object-cover"
                          src={scene.image_url}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#18181d] text-[12px] font-medium text-[#8f8f98]">
                          이미지 준비 중
                        </div>
                      )}
                      {isFailedImageStatus(scene) ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(26,14,16,0.72)]">
                          <div className="rounded-full border border-[#6b2e37] bg-[rgba(60,20,27,0.92)] px-[12px] py-[8px] text-[12px] font-medium text-[#ffb8bf]">
                            이미지 생성 실패
                          </div>
                        </div>
                      ) : null}
                      {isPendingImageStatus(scene) && regeneratingSceneId !== scene.id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,14,0.44)]">
                          <div className="flex items-center gap-2 rounded-full bg-[rgba(20,20,24,0.9)] px-[12px] py-[8px] text-[12px] font-medium text-white">
                            <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                            생성 중
                          </div>
                        </div>
                      ) : null}
                      {regeneratingSceneId === scene.id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,14,0.52)]">
                          <div className="flex items-center gap-2 rounded-full bg-[rgba(20,20,24,0.9)] px-[12px] py-[8px] text-[12px] font-medium text-white">
                            <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                            이미지 재생성 중
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="bg-[linear-gradient(180deg,#313137_0%,#2a2a31_100%)] px-[12px] py-[14px]">
                      <p className="truncate text-[18px] font-semibold text-white">
                        {scene.title}
                      </p>
                      <p className="mt-[8px] text-[13px] font-medium leading-[1.45] tracking-[-0.02em] text-[#8f8f98]">
                        {scene.content}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="top-[124px] flex min-h-[490px] flex-col rounded-[24px] border border-[#60606e] bg-[#202026] px-[16px] py-[18px] xl:sticky">
            <p className="text-[20px] font-semibold text-white">
              {selectedScene?.title ?? "#1 씬 제목"}
            </p>

            <div className="mt-[18px] h-[164px] overflow-hidden rounded-[18px] bg-white">
              {selectedScene ? (
                <div className="relative h-full w-full">
                  {selectedScene.image_url ? (
                    <img
                      alt={selectedScene.title}
                      className="h-full w-full object-cover"
                      src={selectedScene.image_url}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#18181d] text-[12px] font-medium text-[#8f8f98]">
                      이미지 준비 중
                    </div>
                  )}
                  {isFailedImageStatus(selectedScene) ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(26,14,16,0.72)]">
                      <div className="rounded-full border border-[#6b2e37] bg-[rgba(60,20,27,0.92)] px-[12px] py-[8px] text-[12px] font-medium text-[#ffb8bf]">
                        이미지 생성 실패
                      </div>
                    </div>
                  ) : null}
                  {isPendingImageStatus(selectedScene) &&
                  regeneratingSceneId !== selectedScene.id ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,14,0.44)]">
                      <div className="flex items-center gap-2 rounded-full bg-[rgba(20,20,24,0.9)] px-[12px] py-[8px] text-[12px] font-medium text-white">
                        <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                        생성 중
                      </div>
                    </div>
                  ) : null}
                  {regeneratingSceneId === selectedScene.id ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,14,0.52)]">
                      <div className="flex items-center gap-2 rounded-full bg-[rgba(20,20,24,0.9)] px-[12px] py-[8px] text-[12px] font-medium text-white">
                        <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                        재생성 중
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Button
              className="mt-[14px] w-full"
              size="tiny"
              variant="outlined"
              disabled={!selectedScene}
              onClick={() => {
                setErrorMessage(null);
                void handleRegenerateImage();
              }}
            >
              이미지 재생성
            </Button>

            <div className="pt-[22px]">
              <p className="text-[20px] font-semibold text-white">내용</p>

              <div className="mt-[12px]">
                <input
                  className="mb-[10px] h-[44px] w-full rounded-[12px] border border-[#2d2d34] bg-[#121214] px-[14px] text-[14px] font-medium text-white outline-none"
                  onChange={(event) =>
                    setSceneDrafts((current) => ({
                      ...current,
                      [selectedScene.id]: {
                        content: current[selectedScene.id]?.content ?? selectedScene.content,
                        title: event.target.value,
                      },
                    }))
                  }
                  value={selectedSceneDraft.title}
                />
                <div className="rounded-[12px] border border-[#2d2d34] bg-[#121214] px-[16px] py-[14px]">
                  <textarea
                    className="h-[122px] w-full resize-none border-0 bg-transparent text-[15px] leading-[1.6] text-[#f1f1f4] outline-none placeholder:text-[#6d6d76]"
                    onChange={(event) =>
                      setSceneDrafts((current) => ({
                        ...current,
                        [selectedScene.id]: {
                          content: event.target.value,
                          title: current[selectedScene.id]?.title ?? selectedScene.title,
                        },
                      }))
                    }
                    value={selectedSceneDraft.content}
                  />
                </div>
              </div>
            </div>

            <Button
              className="mt-auto w-full"
              size="tiny"
              disabled={!selectedScene}
              onClick={() => {
                setErrorMessage(null);
                void handleSaveScene();
              }}
            >
              변경사항 저장
            </Button>
          </aside>
        </div>
      ) : null}

      {isGenerationModalOpen ? (
        <VideoGenerateProgressModal
          onGoDashboard={() => {
            setIsGenerationModalOpen(false);
            router.push("/dashboard");
          }}
          onGoNext={() => {
            setIsGenerationModalOpen(false);
            router.push("/project/create");
          }}
        />
      ) : null}
    </ProjectCreateShell>
  );
}
