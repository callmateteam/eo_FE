/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { NetworkError } from "@/lib/api/client";
import { Icon } from "@/components/ui/Icon";
import { ScriptInputField } from "@/components/ui/ScriptInputField";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { editorFontIconAssets } from "@/lib/assets";
import { getProject, updateProject } from "@/lib/api/projects";
import {
  getStoryboard,
  getVideoEdit,
  startStoryboardRender,
  undoVideoEdit,
  updateVideoEdit,
  type EditData,
  type EditSceneItem,
  type StoryboardScene,
  type SubtitleItem,
  type SubtitleStyle,
} from "@/lib/api/storyboards";
import { updateProjectDraft } from "@/lib/project-draft";

type ProjectEditPageProps = {
  projectId: string;
  storyboardId?: string;
};

const transitionOptions = [
  { label: "없음", value: "none" },
  { label: "페이드", value: "fade" },
  { label: "디졸브", value: "dissolve" },
  { label: "슬라이드 좌", value: "slide_left" },
  { label: "슬라이드 업", value: "slide_up" },
  { label: "와이프", value: "wipe" },
] as const;

const defaultSubtitleStyle: SubtitleStyle = {
  animation: "none",
  background: {
    color: "#6A57FF",
    enabled: true,
    opacity: 0.11,
  },
  color: "#FFFFFF",
  font: "Pretendard",
  font_size: 24,
  position: "bottom",
  shadow: {
    color: "#FFFFFF",
    enabled: false,
    offset: 2,
  },
};

function getSceneDuration(scene: StoryboardScene) {
  return Number.isFinite(scene.duration) && scene.duration > 0 ? scene.duration : 5;
}

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function createDefaultSubtitle(scene: StoryboardScene) {
  return {
    end: getSceneDuration(scene),
    scene_id: scene.id,
    start: 0,
    style: defaultSubtitleStyle,
    text: scene.content,
  } satisfies SubtitleItem;
}

function getSceneSubtitleEntries(editData: EditData, scene: StoryboardScene) {
  return (editData.subtitles ?? [])
    .map((subtitle, index) => ({
      index,
      subtitle,
    }))
    .filter((entry) => entry.subtitle.scene_id === scene.id)
    .sort((left, right) => left.subtitle.start - right.subtitle.start);
}

function getSceneEditItem(editData: EditData, scene: StoryboardScene) {
  return editData.scenes?.find((entry) => entry.scene_id === scene.id) ?? null;
}

function createDefaultSceneEdit(scene: StoryboardScene): EditSceneItem {
  return {
    order: scene.scene_order,
    scene_id: scene.id,
    speed: 1,
    transition: "none",
    trim_end: getSceneDuration(scene),
    trim_start: 0,
  };
}

function previewSubtitleStyle(style?: SubtitleStyle) {
  return {
    backgroundColor: style?.background?.enabled
      ? `rgba(19,19,24,${style.background.opacity ?? 0.7})`
      : "transparent",
    color: style?.color ?? "#FFFFFF",
    fontFamily: style?.font ?? "Pretendard",
    fontSize: `${style?.font_size ?? 24}px`,
    justifyContent:
      style?.position === "top"
        ? "flex-start"
        : style?.position === "center"
          ? "center"
          : "flex-end",
  };
}

function ScriptStyleButton({
  alt,
  isActive,
  onClick,
  src,
}: {
  alt: string;
  isActive?: boolean;
  onClick: () => void;
  src: string;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors ${
        isActive
          ? "border-[#8b45ff] bg-[rgba(139,69,255,0.12)]"
          : "border-transparent bg-transparent"
      }`}
      onClick={onClick}
      type="button"
    >
      <Image alt={alt} height={20} src={src} width={20} />
    </button>
  );
}

export function ProjectEditPage({
  projectId,
  storyboardId,
}: ProjectEditPageProps) {
  const router = useRouter();
  const projectQuery = useQuery({
    queryFn: () => getProject(projectId),
    queryKey: ["project", projectId],
  });

  const resolvedStoryboardId = storyboardId || projectQuery.data?.storyboard_id || "";

  const storyboardQuery = useQuery({
    enabled: Boolean(resolvedStoryboardId),
    queryFn: () => getStoryboard(resolvedStoryboardId),
    queryKey: ["storyboard", resolvedStoryboardId],
  });

  const editQuery = useQuery({
    enabled: Boolean(resolvedStoryboardId),
    queryFn: () => getVideoEdit(resolvedStoryboardId),
    queryKey: ["video-edit", resolvedStoryboardId],
  });

  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [localEditData, setLocalEditData] = useState<EditData | null>(null);
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(false);
  const [editingSubtitleIndex, setEditingSubtitleIndex] = useState<number | null>(null);
  const [panelText, setPanelText] = useState("");
  const [panelStart, setPanelStart] = useState("0");
  const [panelEnd, setPanelEnd] = useState("5");
  const [panelStyle, setPanelStyle] = useState<SubtitleStyle>(defaultSubtitleStyle);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const editData = localEditData ?? editQuery.data?.edit_data ?? null;
  const scenes = useMemo(() => storyboardQuery.data?.scenes ?? [], [storyboardQuery.data?.scenes]);
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId]
  );

  const selectedSceneSubtitleEntries =
    selectedScene && editData ? getSceneSubtitleEntries(editData, selectedScene) : [];
  const selectedSubtitle =
    selectedSceneSubtitleEntries[0]?.subtitle ??
    (selectedScene ? createDefaultSubtitle(selectedScene) : null);
  const selectedSceneEdit =
    selectedScene && editData
      ? getSceneEditItem(editData, selectedScene) ?? createDefaultSceneEdit(selectedScene)
      : null;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.playbackRate = playbackRate;
  }, [playbackRate, selectedScene?.id]);

  const undoMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedStoryboardId) {
        throw new Error("되돌릴 영상을 찾을 수 없습니다.");
      }

      return undoVideoEdit(resolvedStoryboardId);
    },
    onSuccess: (response) => {
      setLocalEditData(response.edit_data);
    },
  });

  const renderMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedStoryboardId || !editData) {
        throw new Error("렌더링할 편집 데이터가 없습니다.");
      }

      const response = await updateVideoEdit(resolvedStoryboardId, editData);
      setLocalEditData(response.edit_data);
      await updateProject(projectId, {
        current_stage: 4,
        storyboard_id: resolvedStoryboardId,
      });

      return startStoryboardRender(resolvedStoryboardId);
    },
    onSuccess: () => {
      updateProjectDraft({
        projectId,
        storyboardId: resolvedStoryboardId,
        title: projectQuery.data?.title ?? "프로젝트명",
      });
      router.push(
        `/project/${projectId}/save?storyboardId=${encodeURIComponent(
          resolvedStoryboardId
        )}`
      );
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof Error ? error.message : "렌더링 시작에 실패했습니다."
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!resolvedStoryboardId || !editData) {
        throw new Error("저장할 편집 데이터가 없습니다.");
      }

      return updateVideoEdit(resolvedStoryboardId, editData);
    },
    onSuccess: (response) => {
      setLocalEditData(response.edit_data);
      setSaveMessage("편집 내용이 저장되었습니다.");
    },
    onError: (error) => {
      setSaveMessage(null);
      setErrorMessage(error instanceof Error ? error.message : "편집 저장에 실패했습니다.");
    },
  });

  const openScriptPanel = (subtitleIndex?: number) => {
    if (!selectedScene) {
      return;
    }

    const nextSubtitle =
      subtitleIndex === undefined || subtitleIndex < 0 || !editData?.subtitles?.[subtitleIndex]
        ? createDefaultSubtitle(selectedScene)
        : editData.subtitles[subtitleIndex];

    setEditingSubtitleIndex(subtitleIndex ?? null);
    setPanelText(nextSubtitle.text);
    setPanelStart(String(nextSubtitle.start));
    setPanelEnd(String(nextSubtitle.end));
    setPanelStyle(nextSubtitle.style ?? defaultSubtitleStyle);
    setSaveMessage(null);
    setIsScriptPanelOpen(true);
  };

  const applyScriptPanelChanges = () => {
    if (!selectedScene || !editData) {
      return;
    }

    const sceneDuration = getSceneDuration(selectedScene);
    const normalizedStart = Math.max(
      0,
      Math.min(sceneDuration, Number(panelStart) || 0)
    );
    const normalizedEnd = Math.max(
      normalizedStart,
      Math.min(sceneDuration, Number(panelEnd) || sceneDuration)
    );
    const nextSubtitles = [...(editData.subtitles ?? [])];
    const nextSubtitle: SubtitleItem = {
      end: normalizedEnd,
      scene_id: selectedScene.id,
      start: normalizedStart,
      style: panelStyle,
      text: panelText.trim(),
    };

    if (editingSubtitleIndex !== null && nextSubtitles[editingSubtitleIndex]) {
      nextSubtitles[editingSubtitleIndex] = nextSubtitle;
    } else {
      nextSubtitles.push(nextSubtitle);
    }

    setLocalEditData({
      ...editData,
      subtitles: nextSubtitles,
    });
    setSaveMessage(null);
    setEditingSubtitleIndex(null);
    setIsScriptPanelOpen(false);
  };

  function handleDeleteSubtitle(index: number) {
    if (!editData) {
      return;
    }

    setLocalEditData({
      ...editData,
      subtitles: (editData.subtitles ?? []).filter((_, subtitleIndex) => subtitleIndex !== index),
    });
    setSaveMessage(null);
    setEditingSubtitleIndex(null);
    setIsScriptPanelOpen(false);
  }

  function updateSelectedSceneEdit(
    updater: (current: EditSceneItem) => EditSceneItem
  ) {
    if (!editData || !selectedScene) {
      return;
    }

    const currentSceneEdit =
      getSceneEditItem(editData, selectedScene) ?? createDefaultSceneEdit(selectedScene);
    const nextSceneEdit = updater(currentSceneEdit);
    const nextScenes = [...(editData.scenes ?? [])];
    const targetIndex = nextScenes.findIndex((entry) => entry.scene_id === selectedScene.id);

    if (targetIndex >= 0) {
      nextScenes[targetIndex] = nextSceneEdit;
    } else {
      nextScenes.push(nextSceneEdit);
    }

    setLocalEditData({
      ...editData,
      scenes: nextScenes,
    });
    setSaveMessage(null);
  }

  async function handlePlayToggle() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  if (projectQuery.isLoading || storyboardQuery.isLoading || editQuery.isLoading) {
    return (
      <ProjectCreateShell
        currentStep={3}
        projectTitle={projectQuery.data?.title ?? "프로젝트명"}
        title="영상 생성 및 편집"
      >
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7d7dc]">
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span className="text-[14px] font-medium">편집 화면을 준비하고 있습니다.</span>
          </div>
        </div>
      </ProjectCreateShell>
    );
  }

  if (editQuery.isError) {
    const editLoadMessage =
      editQuery.error instanceof NetworkError
        ? editQuery.error.message
        : editQuery.error instanceof Error
          ? editQuery.error.message
          : "편집 데이터를 불러오지 못했습니다.";

    return (
      <ProjectCreateShell
        currentStep={3}
        projectTitle={projectQuery.data?.title ?? "?꾨줈?앺듃紐?"}
        title="?곸긽 ?앹꽦 諛??몄쭛"
      >
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex w-full max-w-[520px] flex-col items-center rounded-[22px] border border-[#2b2b31] bg-[#121214] px-6 py-7 text-center">
            <p className="text-[16px] font-semibold text-white">
              편집 화면을 준비하지 못했습니다.
            </p>
            <p className="pt-3 text-[14px] leading-[1.6] text-[#b7b7bf]">
              {editLoadMessage}
            </p>
            <Button
              className="mt-6 min-w-[120px]"
              size="tiny"
              onClick={() => {
                void editQuery.refetch();
              }}
            >
              다시 시도
            </Button>
          </div>
        </div>
      </ProjectCreateShell>
    );
  }

  return (
    <ProjectCreateShell
      currentStep={3}
      projectTitle={projectQuery.data?.title ?? "프로젝트명"}
      title=""
      description=""
      actions={
        <>
          <Button size="tiny" variant="outlined" onClick={() => router.push("/dashboard")}>
            취소
          </Button>
          <Button
            size="tiny"
            variant="outlined"
            disabled={saveMutation.isPending || !editData}
            onClick={() => {
              setErrorMessage(null);
              setSaveMessage(null);
              saveMutation.mutate();
            }}
          >
            {saveMutation.isPending ? "저장 중" : "저장"}
          </Button>
          <Button
            size="tiny"
            disabled={renderMutation.isPending || !editData}
            onClick={() => {
              setErrorMessage(null);
              renderMutation.mutate();
            }}
          >
            편집 완료
          </Button>
        </>
      }
    >
      {errorMessage ? (
        <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
          {errorMessage}
        </p>
      ) : null}
      {saveMessage ? (
        <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#284638] bg-[rgba(40,70,56,0.2)] px-[18px] py-[14px] text-[14px] text-[#b8ffd7]">
          {saveMessage}
        </p>
      ) : null}

      <div className="mx-auto w-full max-w-[1162px]">
        <div className="flex justify-center">
          <div className="relative h-[404px] w-[226px] overflow-hidden rounded-[18px] bg-[#f5f2e9]">
            {selectedScene?.video_url ? (
              <video
                key={selectedScene.id}
                ref={videoRef}
                className="h-full w-full object-cover"
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => {
                  setPlayerDuration(event.currentTarget.duration || getSceneDuration(selectedScene));
                  setCurrentTime(event.currentTarget.currentTime || 0);
                  event.currentTarget.playbackRate = selectedSceneEdit?.speed ?? playbackRate;
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                playsInline
                src={selectedScene.video_url}
              />
            ) : (
              <img
                alt={selectedScene?.title ?? "scene"}
                className="h-full w-full object-cover"
                src={
                  selectedScene?.image_url ||
                  "/assets/landing/cards/storyboard-cover-1.png"
                }
              />
            )}
            <div
              className="absolute inset-x-[16px] bottom-[14px] flex rounded-[8px] px-[12px] py-[6px] font-semibold"
              style={previewSubtitleStyle(selectedSubtitle?.style)}
            >
              <span className="w-full text-center">{selectedSubtitle?.text ?? "script"}</span>
            </div>
          </div>
        </div>

        <div className="mt-[38px] rounded-[22px] border border-[#25252b] bg-[#121214] px-[16px] py-[14px]">
          <div className="flex items-center justify-between border-b border-[#222228] pb-[12px]">
            <div className="flex items-center gap-[14px] text-[#d7d7dc]">
              <button
                className="text-white"
                disabled={!selectedScene?.video_url}
                onClick={() => {
                  void handlePlayToggle();
                }}
                type="button"
              >
                <Icon className="size-5" name={isPlaying ? "pause" : "play"} />
              </button>
              <span className="text-[13px] font-medium">
                {formatTime(currentTime)} /{" "}
                {formatTime(playerDuration || (selectedScene ? getSceneDuration(selectedScene) : 0))}
              </span>
              <button
                className="rounded-full border border-[#2f2f35] px-[8px] py-[2px] text-[12px] font-medium text-[#a8a8b1]"
                onClick={() => {
                  const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
                  setPlaybackRate(nextRate);
                  if (selectedScene) {
                    updateSelectedSceneEdit((current) => ({
                      ...current,
                      speed: nextRate,
                    }));
                  }
                }}
                type="button"
              >
                {playbackRate}x
              </button>
              <button
                className="text-[#a8a8b1]"
                onClick={() => setIsMuted((current) => !current)}
                type="button"
              >
                <Icon className="size-4" name="sound" />
              </button>
            </div>

            <div className="flex items-center gap-[12px] text-[#d7d7dc]">
              <button
                className="text-[#cfcfd5]"
                onClick={() => {
                  setErrorMessage(null);
                  undoMutation.mutate();
                }}
                type="button"
              >
                <Icon className="size-5" name="reset" />
              </button>
              <button className="text-[#cfcfd5]" type="button">
                <Icon className="size-5" name="redo" />
              </button>
              <input
                className="w-[140px] accent-[#d7d7dc]"
                max={playerDuration || (selectedScene ? getSceneDuration(selectedScene) : 0)}
                min={0}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  const video = videoRef.current;

                  setCurrentTime(nextTime);

                  if (video) {
                    video.currentTime = nextTime;
                  }
                }}
                step="0.1"
                type="range"
                value={Math.min(
                  currentTime,
                  playerDuration || (selectedScene ? getSceneDuration(selectedScene) : 0)
                )}
              />
            </div>
          </div>

          <div className="mt-[16px] flex gap-[10px] overflow-x-auto pb-[8px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {scenes.map((scene) => {
              const subtitleEntries = editData ? getSceneSubtitleEntries(editData, scene) : [];
              const subtitle = subtitleEntries[0]?.subtitle ?? createDefaultSubtitle(scene);
              const isSelected = scene.id === selectedScene?.id;

              return (
                <div
                  key={scene.id}
                  className={`min-w-[112px] rounded-[16px] border bg-[#16161a] p-[8px] ${
                    isSelected
                      ? "border-[#8b45ff] shadow-[0_0_0_1px_rgba(139,69,255,0.16)]"
                      : "border-[#23232a]"
                  }`}
                >
                  <button
                    className="w-full"
                    onClick={() => setSelectedSceneId(scene.id)}
                    type="button"
                  >
                    <div className="h-[64px] overflow-hidden rounded-[10px] bg-white">
                      <img
                        alt={scene.title}
                        className="h-full w-full object-cover"
                        src={
                          scene.image_url ||
                          "/assets/landing/cards/storyboard-cover-1.png"
                        }
                      />
                    </div>
                    <p className="pt-[8px] text-left text-[12px] font-semibold text-white">
                      #{scene.scene_order}
                    </p>
                  </button>
                  <div className="mt-[6px] rounded-[12px] bg-[#2b2b31] px-[10px] py-[8px] text-left">
                    <p className="truncate text-[12px] font-medium text-[#d7d7dc]">
                      {subtitle?.text || "스크립트 없음"}
                    </p>
                    <p className="pt-[4px] text-[11px] text-[#8f8f98]">
                      {subtitleEntries.length}개
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedScene ? (
            <div className="mt-[18px] rounded-[18px] border border-[#25252b] bg-[#16161a] px-[16px] py-[14px]">
              <div className="grid gap-3 border-b border-[#25252b] pb-[16px] md:grid-cols-2">
                <label className="flex flex-col gap-2 text-[12px] font-medium text-[#b7b7bf]">
                  재생 속도
                  <select
                    className="h-[44px] rounded-[10px] border border-[#303038] bg-[#121214] px-[12px] text-[14px] text-white outline-none"
                    onChange={(event) =>
                      updateSelectedSceneEdit((current) => ({
                        ...current,
                        speed: Number(event.target.value),
                      }))
                    }
                    value={selectedSceneEdit?.speed ?? 1}
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <option key={speed} value={speed}>
                        {speed}x
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-[12px] font-medium text-[#b7b7bf]">
                  전환 효과
                  <select
                    className="h-[44px] rounded-[10px] border border-[#303038] bg-[#121214] px-[12px] text-[14px] text-white outline-none"
                    onChange={(event) =>
                      updateSelectedSceneEdit((current) => ({
                        ...current,
                        transition: event.target.value,
                      }))
                    }
                    value={selectedSceneEdit?.transition ?? "none"}
                  >
                    {transitionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="pt-[16px] text-[16px] font-semibold text-white">
                    #{selectedScene.scene_order} 씬 스크립트
                  </p>
                  <p className="pt-[4px] text-[12px] text-[#8f8f98]">
                    씬별 자막을 추가하고 타이밍을 조정할 수 있습니다.
                  </p>
                </div>
                <Button
                  className="min-w-[120px]"
                  size="tiny"
                  onClick={() => openScriptPanel()}
                >
                  스크립트 추가
                </Button>
              </div>

              <div className="mt-[14px] flex flex-wrap gap-3">
                {selectedSceneSubtitleEntries.length > 0 ? (
                  selectedSceneSubtitleEntries.map((entry) => (
                    <ScriptInputField
                      key={`${entry.subtitle.scene_id}-${entry.index}-${entry.subtitle.start}`}
                      className="h-auto min-h-[48px] min-w-[220px] max-w-[320px] rounded-[14px] bg-[#23232a] px-[14px] py-[10px] text-left"
                      state="default"
                      onClick={() => openScriptPanel(entry.index)}
                    >
                      <span className="flex flex-col">
                        <span className="truncate text-[13px] font-medium text-white">
                          {entry.subtitle.text}
                        </span>
                        <span className="pt-[4px] text-[11px] text-[#9f9faa]">
                          {entry.subtitle.start.toFixed(1)}s - {entry.subtitle.end.toFixed(1)}s
                        </span>
                      </span>
                    </ScriptInputField>
                  ))
                ) : (
                  <div className="rounded-[14px] border border-dashed border-[#31313a] px-[14px] py-[16px] text-[13px] text-[#8f8f98]">
                    아직 추가된 스크립트가 없습니다.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isScriptPanelOpen && selectedScene ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(0,0,0,0.45)] px-4">
          <div className="w-full max-w-[360px] rounded-[24px] bg-[#1f1f24] px-[20px] py-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-white">스크립트</h2>
              <button
                className="text-white"
                onClick={() => setIsScriptPanelOpen(false)}
                type="button"
              >
                <Icon className="size-5" name="close" />
              </button>
            </div>

            <div className="pt-[14px]">
              <textarea
                className="h-[96px] w-full resize-none rounded-[14px] border border-[#303038] bg-[#121214] px-[14px] py-[12px] text-[14px] font-medium text-[#f1f1f4] outline-none placeholder:text-[#6d6d76]"
                onChange={(event) => setPanelText(event.target.value)}
                placeholder="씬에 표시할 스크립트를 입력하세요"
                value={panelText}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-[12px]">
              <label className="flex flex-col gap-2 text-[12px] font-medium text-[#b7b7bf]">
                시작 시간
                <input
                  className="h-[44px] rounded-[10px] border border-[#303038] bg-[#121214] px-[12px] text-[14px] text-white outline-none"
                  max={getSceneDuration(selectedScene)}
                  min={0}
                  onChange={(event) => setPanelStart(event.target.value)}
                  step="0.1"
                  type="number"
                  value={panelStart}
                />
              </label>
              <label className="flex flex-col gap-2 text-[12px] font-medium text-[#b7b7bf]">
                종료 시간
                <input
                  className="h-[44px] rounded-[10px] border border-[#303038] bg-[#121214] px-[12px] text-[14px] text-white outline-none"
                  max={getSceneDuration(selectedScene)}
                  min={0}
                  onChange={(event) => setPanelEnd(event.target.value)}
                  step="0.1"
                  type="number"
                  value={panelEnd}
                />
              </label>
            </div>

            <div className="grid grid-cols-[1fr_90px] gap-3 pt-[12px]">
              <select
                className="h-[52px] rounded-[10px] border border-[#303038] bg-[#121214] px-[14px] text-[14px] font-medium text-white outline-none"
                onChange={(event) =>
                  setPanelStyle((current) => ({
                    ...current,
                    font: event.target.value as SubtitleStyle["font"],
                  }))
                }
                value={panelStyle.font ?? "Pretendard"}
              >
                <option value="Pretendard">Pretendard</option>
                <option value="NanumGothic">Nanum Gothic</option>
                <option value="NanumMyeongjo">Nanum Myeongjo</option>
                <option value="GmarketSans">Gmarket Sans</option>
                <option value="DoHyeon">DoHyeon</option>
              </select>
              <select
                className="h-[52px] rounded-[10px] border border-[#303038] bg-[#121214] px-[14px] text-[14px] font-medium text-white outline-none"
                onChange={(event) =>
                  setPanelStyle((current) => ({
                    ...current,
                    font_size: Number(event.target.value),
                  }))
                }
                value={panelStyle.font_size ?? 24}
              >
                {[16, 18, 20, 24, 28, 32].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-[14px]">
              <ScriptStyleButton
                alt="align left"
                isActive={panelStyle.position === "top"}
                onClick={() =>
                  setPanelStyle((current) => ({
                    ...current,
                    position: "top",
                  }))
                }
                src={editorFontIconAssets.alignLeft}
              />
              <ScriptStyleButton
                alt="align center"
                isActive={panelStyle.position === "center"}
                onClick={() =>
                  setPanelStyle((current) => ({
                    ...current,
                    position: "center",
                  }))
                }
                src={editorFontIconAssets.alignCenter}
              />
              <ScriptStyleButton
                alt="align right"
                isActive={panelStyle.position === "bottom"}
                onClick={() =>
                  setPanelStyle((current) => ({
                    ...current,
                    position: "bottom",
                  }))
                }
                src={editorFontIconAssets.alignRight}
              />
            </div>

            <div className="mt-[16px] border-t border-[#303038] pt-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-semibold text-white">스타일</p>
                <button
                  className="text-white"
                  onClick={() => setPanelStyle(defaultSubtitleStyle)}
                  type="button"
                >
                  <Icon className="size-5" name="reset" />
                </button>
              </div>

              <div className="space-y-[14px] pt-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-white">글 색상</span>
                  <button
                    className="size-6 rounded-full border border-[#3b3b43]"
                    onClick={() =>
                      setPanelStyle((current) => ({
                        ...current,
                        color: current.color === "#FFFFFF" ? "#8B45FF" : "#FFFFFF",
                      }))
                    }
                    style={{ backgroundColor: panelStyle.color ?? "#FFFFFF" }}
                    type="button"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white">선</span>
                  <input
                    className="flex-1 accent-[#8b45ff]"
                    max={5}
                    min={1}
                    onChange={(event) =>
                      setPanelStyle((current) => ({
                        ...current,
                        shadow: {
                          color: current.shadow?.color ?? "#FFFFFF",
                          enabled: true,
                          offset: Number(event.target.value),
                        },
                      }))
                    }
                    type="range"
                    value={panelStyle.shadow?.offset ?? 2}
                  />
                  <span className="rounded-[8px] bg-[#2a2a31] px-[8px] py-[4px] text-[12px] font-medium text-white">
                    {panelStyle.shadow?.offset ?? 2}px
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white">배경</span>
                  <input
                    className="flex-1 accent-[#8b45ff]"
                    max={100}
                    min={0}
                    onChange={(event) =>
                      setPanelStyle((current) => ({
                        ...current,
                        background: {
                          color: current.background?.color ?? "#6A57FF",
                          enabled: true,
                          opacity: Number(event.target.value) / 100,
                        },
                      }))
                    }
                    type="range"
                    value={Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}
                  />
                  <span className="rounded-[8px] bg-[#2a2a31] px-[8px] py-[4px] text-[12px] font-medium text-white">
                    {Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-[18px]">
              {editingSubtitleIndex !== null ? (
                <Button
                  className="min-w-0 flex-1"
                  size="tiny"
                  variant="outlined"
                  onClick={() => handleDeleteSubtitle(editingSubtitleIndex)}
                >
                  삭제
                </Button>
              ) : null}
              <Button className="min-w-0 flex-1" size="tiny" onClick={applyScriptPanelChanges}>
                적용하기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ProjectCreateShell>
  );
}
