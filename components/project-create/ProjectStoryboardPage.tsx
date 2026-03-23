/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useProjectToast } from "@/components/providers/ProjectToastProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getProjectDraft, updateProjectDraft } from "@/lib/project-draft";
import { ApiError } from "@/lib/api/client";
import { getProject } from "@/lib/api/projects";
import {
  useStoryboard,
  useUpdateScene,
  useRegenerateSceneImage,
  useRegenerateSceneVideo,
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

function isFailedVideoStatus(scene: SceneItem) {
  const status = scene.video_status?.toUpperCase();
  return status === "FAILED" || status === "ERROR";
}

function isPendingVideoStatus(scene: SceneItem) {
  if (scene.video_url) return false;
  const status = scene.video_status?.toUpperCase();
  if (!status) return false;
  return !isFailedVideoStatus(scene);
}

export function ProjectStoryboardPage({
  projectId,
  storyboardId,
}: ProjectStoryboardPageProps) {
  const router = useRouter();
  const { startVideoGenerationTracking, stopVideoGenerationTracking } = useProjectToast();
  const draft = getProjectDraft();
  const resolvedProjectId = projectId ?? draft?.projectId ?? "";
  const resolvedStoryboardId = storyboardId ?? draft?.storyboardId ?? "";
  const [projectTitle, setProjectTitle] = useState(draft?.title ?? "프로젝트명");
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [sceneDrafts, setSceneDrafts] = useState<
    Record<string, { content: string; title: string }>
  >({});
  const [regeneratingSceneId, setRegeneratingSceneId] = useState<string | null>(null);
  const [regeneratingVideoSceneId, setRegeneratingVideoSceneId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldPoll, setShouldPoll] = useState(true);
  const [showStoryboardToast, setShowStoryboardToast] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const prevShouldPollRef = useRef(true);
  const hasNavigatedRef = useRef(false);

  // Storyboard data with polling: refetch every 3s while any scene has a pending image or video
  const { data: storyboardData, isLoading: isLoadingStoryboard } = useStoryboard(
    resolvedStoryboardId,
    { refetchInterval: shouldPoll ? 3000 : false },
  );

  const scenes: SceneItem[] = storyboardData?.scenes ?? [];

  // Update polling state
  useEffect(() => {
    if (!storyboardData) return;

    const status = storyboardData.status?.toUpperCase();
    const hasScenes = storyboardData.scenes.length > 0;
    const hasPendingImages = storyboardData.scenes.some((scene) => isPendingImageStatus(scene));
    const hasPendingVideos = isVideoGenerating && storyboardData.scenes.some((scene) => isPendingVideoStatus(scene));

    const nextShouldPoll = !hasScenes || hasPendingImages || hasPendingVideos || status === "GENERATING";
    setShouldPoll(nextShouldPoll);

    if (prevShouldPollRef.current && !nextShouldPoll && hasScenes && !isVideoGenerating) {
      setShowStoryboardToast(true);
    }
    prevShouldPollRef.current = nextShouldPoll;
  }, [storyboardData, isVideoGenerating]);

  // Auto-navigate to edit page when all scene videos are ready
  useEffect(() => {
    if (!isVideoGenerating || hasNavigatedRef.current) return;
    if (scenes.length === 0) return;

    const allVideosReady = scenes.every((scene) => scene.video_url);
    if (allVideosReady) {
      hasNavigatedRef.current = true;
      router.push(
        `/project/${resolvedProjectId}/edit?storyboardId=${encodeURIComponent(resolvedStoryboardId)}`,
      );
    }
  }, [scenes, isVideoGenerating, resolvedProjectId, resolvedStoryboardId, router]);

  // Stop toast when all scenes fail (no hope of completion)
  useEffect(() => {
    if (!isVideoGenerating) return;
    if (scenes.length === 0) return;

    const allFailed = scenes.every((scene) => isFailedVideoStatus(scene) || scene.video_url);
    const anyFailed = scenes.some((scene) => isFailedVideoStatus(scene));
    const anySuccess = scenes.some((scene) => scene.video_url);

    if (allFailed && anyFailed && !anySuccess) {
      // All scenes failed — stop toast
      stopVideoGenerationTracking();
    }
  }, [scenes, isVideoGenerating, stopVideoGenerationTracking]);

  const updateSceneMutation = useUpdateScene();
  const regenerateSceneImageMutation = useRegenerateSceneImage();
  const regenerateSceneVideoMutation = useRegenerateSceneVideo();
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

  // Auto-dismiss storyboard completion toast after 5 seconds
  useEffect(() => {
    if (!showStoryboardToast) return;
    const timer = setTimeout(() => setShowStoryboardToast(false), 5000);
    return () => clearTimeout(timer);
  }, [showStoryboardToast]);

  // Clear regeneratingSceneId when the scene image is no longer pending
  useEffect(() => {
    if (regeneratingSceneId && storyboardData) {
      const scene = storyboardData.scenes.find((s) => s.id === regeneratingSceneId);
      if (scene && !isPendingImageStatus(scene)) {
        setRegeneratingSceneId(null);
      }
    }
  }, [regeneratingSceneId, storyboardData]);

  // Clear regeneratingVideoSceneId when the scene video is no longer pending
  useEffect(() => {
    if (regeneratingVideoSceneId && storyboardData) {
      const scene = storyboardData.scenes.find((s) => s.id === regeneratingVideoSceneId);
      if (scene && (scene.video_url || isFailedVideoStatus(scene))) {
        setRegeneratingVideoSceneId(null);
      }
    }
  }, [regeneratingVideoSceneId, storyboardData]);

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

  async function handleRegenerateVideo(sceneId: string) {
    setRegeneratingVideoSceneId(sceneId);
    setShouldPoll(true);
    try {
      await regenerateSceneVideoMutation.mutateAsync({
        storyboardId: resolvedStoryboardId,
        sceneId,
      });
    } catch (error) {
      setRegeneratingVideoSceneId(null);
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("영상 재생성에 실패했습니다. 다시 시도해주세요.");
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
          payload: { current_stage: 4 },
        });
      }

      // Start video generation tracking toast
      startVideoGenerationTracking({
        projectId: resolvedProjectId,
        storyboardId: resolvedStoryboardId,
      });

      // Enable polling and mark video generation as in progress
      hasNavigatedRef.current = false;
      setShouldPoll(true);
      setIsVideoGenerating(true);
      setShowVideoModal(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("영상 생성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  async function handleTitleSave(newTitle: string) {
    setProjectTitle(newTitle);
    updateProjectDraft({ title: newTitle });
    await updateProjectMutation.mutateAsync({
      projectId: resolvedProjectId,
      payload: { title: newTitle },
    });
  }

  return (
    <>
    <ProjectCreateShell
      currentStep={2}
      description="AI가 생성한 스토리보드를 검토하고 편집하세요"
      onTitleSave={(t) => void handleTitleSave(t)}
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
              hasFailedScenes ||
              isVideoGenerating
            }
            onClick={() => {
              setErrorMessage(null);
              void handleGenerateVideos();
            }}
          >
            {isVideoGenerating ? "영상 생성 중..." : "영상 생성"}
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
        <div className="mx-auto grid w-full max-w-[1162px] grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_424px]">
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
              {scenes.map((scene, index) => {
                const isSelected = scene.id === selectedScene?.id;
                const videoFailed = isVideoGenerating && isFailedVideoStatus(scene);

                return (
                  <button
                    key={scene.id}
                    className={`flex h-[280px] flex-col overflow-hidden rounded-[18px] border bg-[#202026] text-left transition-colors ${
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
                    <div className="relative flex-1 overflow-hidden bg-[#18181d]">
                      {scene.image_url ? (
                        <img
                          alt={scene.title}
                          className="h-full w-full object-contain"
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

                      {/* Video generation status overlays */}
                      {videoFailed && regeneratingVideoSceneId !== scene.id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(26,14,16,0.72)]">
                          <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full border border-[#6b2e37] bg-[rgba(60,20,27,0.92)] px-[12px] py-[8px] text-[12px] font-medium text-[#ffb8bf]">
                              영상 생성 실패
                            </div>
                            <button
                              className="rounded-full border border-[#4a3a60] bg-[rgba(40,20,60,0.9)] px-[12px] py-[6px] text-[11px] font-semibold text-[#c084fc] transition-colors hover:bg-[rgba(60,30,80,0.9)]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setErrorMessage(null);
                                void handleRegenerateVideo(scene.id);
                              }}
                              type="button"
                            >
                              재생성
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="h-[104px] overflow-hidden bg-[linear-gradient(180deg,#313137_0%,#2a2a31_100%)] px-[12px] py-[14px]">
                      <p className="truncate text-body-lg font-semibold text-white">
                        #{index + 1} {scene.title}
                      </p>
                      <p className="mt-[8px] line-clamp-2 text-body-md font-medium tracking-[-0.02em] text-[#8f8f98]">
                        {scene.content}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="top-[124px] flex min-h-[644px] flex-col rounded-[24px] border border-[#60606e] bg-[#202026] p-[20px] xl:sticky">
            <p className="text-heading-md font-semibold text-white">
              {selectedScene?.title ?? "#1 씬 제목"}
            </p>

            <div className="mt-[18px] h-[200px] overflow-hidden rounded-[18px] bg-[#18181d]">
              {selectedScene ? (
                <div className="relative h-full w-full">
                  {selectedScene.image_url ? (
                    <img
                      alt={selectedScene.title}
                      className="h-full w-full object-contain"
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

            <div className="pt-[28px]">
              <p className="text-heading-md font-semibold text-white">내용</p>

              <div className="mt-[12px]">
                <input
                  className="mb-[10px] h-[44px] w-full rounded-[12px] border border-[#2d2d34] bg-[#121214] px-[14px] text-body-lg text-white outline-none"
                  disabled={isVideoGenerating}
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
                    className="h-[122px] w-full resize-none border-0 bg-transparent text-body-lg leading-[1.6] text-[#f1f1f4] outline-none placeholder:text-[#6d6d76] disabled:opacity-50"
                    disabled={isVideoGenerating}
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
              disabled={!selectedScene || isVideoGenerating}
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

      {showStoryboardToast ? (
        <div className="pointer-events-none fixed bottom-[28px] left-[107px] z-[90]">
          <div className="flex min-w-[398px] items-center gap-4 rounded-[20px] bg-[linear-gradient(90deg,#9747ff_0%,#d456ff_100%)] px-[22px] py-[14px] shadow-[0_12px_30px_rgba(151,71,255,0.3)]">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#1f1f24] text-white">
              <Icon className="size-4" name="check" />
            </div>
            <span className="text-[14px] font-semibold text-white">
              스토리보드 생성이 완료되었어요
            </span>
          </div>
        </div>
      ) : null}
    </ProjectCreateShell>

      {showVideoModal ? (
        <VideoGenerateProgressModal
          onGoDashboard={() => {
            setShowVideoModal(false);
            router.push("/dashboard");
          }}
          onGoNext={() => {
            setShowVideoModal(false);
            router.push("/project/create");
          }}
        />
      ) : null}
    </>
  );
}
