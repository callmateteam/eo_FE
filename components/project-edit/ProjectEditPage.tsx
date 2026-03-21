/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { editorFontIconAssets } from "@/lib/assets";
import { updateProjectDraft } from "@/lib/project-draft";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useStoryboard } from "@/hooks/useStoryboard";
import {
  useVideoEdit,
  useSaveVideoEdit,
  useStartRender,
} from "@/hooks/useVideoEdit";
import { NetworkError } from "@/lib/api/client";
import type {
  EditData,
  EditSceneItem,
  SubtitleItem,
  SubtitleStyle,
  SceneItem,
} from "@/lib/api/types";

type ProjectEditPageProps = {
  projectId: string;
  storyboardId?: string;
};


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

function getSceneDuration(scene: SceneItem) {
  return Number.isFinite(scene.duration) && scene.duration > 0 ? scene.duration : 5;
}

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function createDefaultSubtitle(scene: SceneItem): SubtitleItem {
  return {
    end: getSceneDuration(scene),
    scene_id: scene.id,
    start: 0,
    style: defaultSubtitleStyle,
    text: scene.content,
  };
}

function getSceneSubtitleEntries(editData: EditData, scene: SceneItem) {
  return (editData.subtitles ?? [])
    .map((subtitle, index) => ({ index, subtitle }))
    .filter((entry) => entry.subtitle.scene_id === scene.id)
    .sort((left, right) => left.subtitle.start - right.subtitle.start);
}

function getSceneEditItem(editData: EditData, scene: SceneItem) {
  return editData.scenes?.find((entry) => entry.scene_id === scene.id) ?? null;
}

function createDefaultSceneEdit(scene: SceneItem): EditSceneItem {
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
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border transition-colors ${
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

  const projectQuery = useProject(projectId);
  const [shouldPollStoryboard, setShouldPollStoryboard] = useState(true);
  const storyboardQuery = useStoryboard(storyboardId ?? "", {
    refetchInterval: shouldPollStoryboard ? 5000 : false,
  });
  const editQuery = useVideoEdit(storyboardId ?? "");

  const saveVideoEdit = useSaveVideoEdit();
  const startRender = useStartRender();
  const updateProject = useUpdateProject();

  const projectTitle = projectQuery.data?.title ?? "프로젝트명";
  const scenes: SceneItem[] = storyboardQuery.data?.scenes ?? [];
  const isLoading = projectQuery.isLoading || storyboardQuery.isLoading || editQuery.isLoading;
  const isError = projectQuery.isError || editQuery.isError;

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
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [applyToAll, setApplyToAll] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Stop polling storyboard once all scenes have video_url
  useEffect(() => {
    if (!storyboardQuery.data) return;
    const allReady = storyboardQuery.data.scenes.length > 0 &&
      storyboardQuery.data.scenes.every((scene) => scene.video_url);
    if (allReady) setShouldPollStoryboard(false);
  }, [storyboardQuery.data]);

  // Initialize localEditData from server, or use empty object as fallback
  useEffect(() => {
    if (localEditData) return;
    if (editQuery.data?.edit_data) {
      setLocalEditData(editQuery.data.edit_data);
    } else if (!editQuery.isLoading && !editQuery.isError) {
      // edit_data not available yet but query finished — use empty EditData
      setLocalEditData({});
    }
  }, [editQuery.data, editQuery.isLoading, editQuery.isError, localEditData]);

  const editData = localEditData;
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId]
  );

  const selectedSceneSubtitleEntries =
    selectedScene ? getSceneSubtitleEntries(localEditData ?? {}, selectedScene) : [];
  const selectedSubtitle =
    selectedSceneSubtitleEntries[0]?.subtitle ??
    (selectedScene ? createDefaultSubtitle(selectedScene) : null);
  const selectedSceneEdit =
    selectedScene && editData
      ? getSceneEditItem(editData, selectedScene) ?? createDefaultSceneEdit(selectedScene)
      : null;

  function handleFullscreen() {
    const container = videoContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      void container.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }

  async function handleSave() {
    if (!storyboardId || !localEditData) return;
    try {
      const result = await saveVideoEdit.mutateAsync({
        storyboardId,
        editData: localEditData,
      });
      setLocalEditData(result.edit_data);
      setSaveMessage("저장되었습니다.");
    } catch (error) {
      if (error instanceof NetworkError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("저장에 실패했습니다.");
      }
    }
  }

  async function handleRender() {
    if (!storyboardId || !localEditData) return;
    try {
      const saveResult = await saveVideoEdit.mutateAsync({
        storyboardId,
        editData: localEditData,
      });
      setLocalEditData(saveResult.edit_data);

      await updateProject.mutateAsync({
        projectId,
        payload: { current_stage: 4, storyboard_id: storyboardId },
      });

      await startRender.mutateAsync(storyboardId);

      updateProjectDraft({
        projectId,
        storyboardId,
        title: projectTitle,
      });
      router.push(
        `/project/${projectId}/save?storyboardId=${encodeURIComponent(storyboardId)}`
      );
    } catch (error) {
      if (error instanceof NetworkError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("렌더링 요청에 실패했습니다.");
      }
    }
  }

  const openScriptPanel = (subtitleIndex?: number) => {
    if (!selectedScene) return;

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
    if (!selectedScene) return;

    const currentEditData = localEditData ?? {};
    const sceneDuration = getSceneDuration(selectedScene);
    const normalizedStart = Math.max(0, Math.min(sceneDuration, Number(panelStart) || 0));
    const normalizedEnd = Math.max(normalizedStart, Math.min(sceneDuration, Number(panelEnd) || sceneDuration));
    const nextSubtitles = [...(currentEditData.subtitles ?? [])];
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

    let finalSubtitles = nextSubtitles;
    if (applyToAll) {
      finalSubtitles = nextSubtitles.map((sub) => ({ ...sub, style: panelStyle }));
    }

    setLocalEditData({ ...currentEditData, subtitles: finalSubtitles });
    setSaveMessage(null);
    setEditingSubtitleIndex(null);
    setApplyToAll(false);
    setIsScriptPanelOpen(false);
  };

  function handleDeleteSubtitle(index: number) {
    const currentEditData = localEditData ?? {};
    setLocalEditData({
      ...currentEditData,
      subtitles: (currentEditData.subtitles ?? []).filter((_, subtitleIndex) => subtitleIndex !== index),
    });
    setSaveMessage(null);
    setEditingSubtitleIndex(null);
    setIsScriptPanelOpen(false);
  }

  function updateSelectedSceneEdit(updater: (current: EditSceneItem) => EditSceneItem) {
    if (!selectedScene) return;

    const currentEditData = localEditData ?? {};
    const currentSceneEdit = getSceneEditItem(currentEditData, selectedScene) ?? createDefaultSceneEdit(selectedScene);
    const nextSceneEdit = updater(currentSceneEdit);
    const nextScenes = [...(currentEditData.scenes ?? [])];
    const targetIndex = nextScenes.findIndex((entry) => entry.scene_id === selectedScene.id);

    if (targetIndex >= 0) {
      nextScenes[targetIndex] = nextSceneEdit;
    } else {
      nextScenes.push(nextSceneEdit);
    }

    setLocalEditData({ ...currentEditData, scenes: nextScenes });
    setSaveMessage(null);
  }

  async function handlePlayToggle() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  if (isLoading) {
    return (
      <ProjectCreateShell currentStep={3} projectTitle={projectTitle} title="영상 생성 및 편집">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7d7dc]">
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span className="text-[14px] font-medium">편집 화면을 준비하고 있습니다.</span>
          </div>
        </div>
      </ProjectCreateShell>
    );
  }

  if (isError) {
    return (
      <ProjectCreateShell currentStep={3} projectTitle={projectTitle} title="영상 생성 및 편집">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex w-full max-w-[520px] flex-col items-center rounded-[22px] border border-[#2b2b31] bg-[#121214] px-6 py-7 text-center">
            <p className="text-[16px] font-semibold text-white">편집 화면을 준비하지 못했습니다.</p>
            <p className="pt-3 text-[14px] leading-[1.6] text-[#b7b7bf]">
              편집 데이터를 불러오지 못했습니다.
            </p>
          </div>
        </div>
      </ProjectCreateShell>
    );
  }

  return (
    <ProjectCreateShell
      currentStep={3}
      projectTitle={projectTitle}
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
            disabled={!editData}
            onClick={() => {
              setErrorMessage(null);
              setSaveMessage(null);
              void handleSave();
            }}
          >
            저장
          </Button>
          <Button
            size="tiny"
            disabled={!editData}
            onClick={() => {
              setErrorMessage(null);
              void handleRender();
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
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden rounded-[18px] bg-[#f5f2e9] transition-[width,height]"
            style={{ height: `${Math.round(404 * timelineZoom)}px`, width: `${Math.round(226 * timelineZoom)}px` }}
          >
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
                className="cursor-pointer text-white disabled:cursor-default"
                disabled={!selectedScene?.video_url}
                onClick={() => { void handlePlayToggle(); }}
                type="button"
              >
                <Icon className="size-5" name={isPlaying ? "pause" : "play"} />
              </button>
              <span className="text-[13px] font-medium">
                {formatTime(currentTime)} /{" "}
                {formatTime(playerDuration || (selectedScene ? getSceneDuration(selectedScene) : 0))}
              </span>
              <button
                className="cursor-pointer rounded-full border border-[#2f2f35] px-[8px] py-[2px] text-[12px] font-medium text-[#a8a8b1]"
                onClick={() => {
                  const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
                  setPlaybackRate(nextRate);
                  if (selectedScene) {
                    updateSelectedSceneEdit((current) => ({ ...current, speed: nextRate }));
                  }
                }}
                type="button"
              >
                {playbackRate}x
              </button>
              <button
                className="cursor-pointer text-[#a8a8b1]"
                onClick={() => setIsMuted((current) => !current)}
                type="button"
              >
                <Icon className="size-4" name="sound" />
              </button>
            </div>

            <div className="flex items-center gap-[10px] text-[#d7d7dc]">
              <button
                className="cursor-pointer text-[#cfcfd5] disabled:cursor-default disabled:opacity-40"
                disabled={scenes.findIndex((s) => s.id === selectedScene?.id) <= 0}
                onClick={() => {
                  const idx = scenes.findIndex((s) => s.id === selectedScene?.id);
                  if (idx > 0) setSelectedSceneId(scenes[idx - 1].id);
                }}
                type="button"
              >
                <Icon className="size-5" name="left" />
              </button>
              <button
                className="cursor-pointer text-[#cfcfd5] disabled:cursor-default disabled:opacity-40"
                disabled={scenes.findIndex((s) => s.id === selectedScene?.id) >= scenes.length - 1}
                onClick={() => {
                  const idx = scenes.findIndex((s) => s.id === selectedScene?.id);
                  if (idx < scenes.length - 1) setSelectedSceneId(scenes[idx + 1].id);
                }}
                type="button"
              >
                <Icon className="size-5" name="right" />
              </button>
            </div>

            <div className="flex items-center gap-[8px] text-[#d7d7dc]">
              <button
                className="cursor-pointer text-[#cfcfd5]"
                onClick={() => setTimelineZoom((z) => Math.max(0.7, Math.round((z - 0.15) * 100) / 100))}
                type="button"
              >
                <Icon className="size-4" name="line" />
              </button>
              <input
                className="w-[80px] accent-[#d7d7dc]"
                max={1.5}
                min={0.7}
                onChange={(event) => setTimelineZoom(Number(event.target.value))}
                step="0.05"
                type="range"
                value={timelineZoom}
              />
              <button
                className="cursor-pointer text-[#cfcfd5]"
                onClick={() => setTimelineZoom((z) => Math.min(1.5, Math.round((z + 0.15) * 100) / 100))}
                type="button"
              >
                <Icon className="size-4" name="plus" />
              </button>
              <button className="ml-[4px] cursor-pointer text-[#cfcfd5]" onClick={handleFullscreen} type="button">
                <Icon className="size-5" name="fullscreen" />
              </button>
            </div>
          </div>

          <div className="mt-[16px] flex gap-[10px] overflow-x-auto pb-[8px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {scenes.map((scene) => {
              const subtitleEntries = getSceneSubtitleEntries(localEditData ?? {}, scene);
              const subtitle = subtitleEntries[0]?.subtitle ?? createDefaultSubtitle(scene);
              const isSelected = scene.id === selectedScene?.id;

              return (
                <div
                  key={scene.id}
                  className={`flex h-[144px] w-[161px] shrink-0 flex-col overflow-hidden rounded-[16px] border bg-[#16161a] ${
                    isSelected
                      ? "border-[#8b45ff] shadow-[0_0_0_1px_rgba(139,69,255,0.16)]"
                      : "border-[#23232a]"
                  }`}
                >
                  <button
                    className="w-full flex-1 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedSceneId(scene.id)}
                    type="button"
                  >
                    <img
                      alt={scene.title}
                      className="h-full w-full object-cover"
                      src={scene.image_url || "/assets/landing/cards/storyboard-cover-1.png"}
                    />
                  </button>
                  <button
                    className="w-full shrink-0 cursor-pointer bg-[#1e1e23] px-[10px] py-[7px] text-left"
                    onClick={() => { setSelectedSceneId(scene.id); openScriptPanel(); }}
                    type="button"
                  >
                    <p className="text-[10px] font-semibold text-[#8f8f98]">#{scene.scene_order}</p>
                    <p className="truncate text-[11px] font-medium text-[#d7d7dc]">
                      {subtitle?.text || scene.narration || "스크립트"}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {isScriptPanelOpen && selectedScene ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(0,0,0,0.45)] px-4">
          <div className="w-full max-w-[360px] rounded-[24px] bg-[#1f1f24] px-[20px] py-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-white">스크립트</h2>
              <button className="cursor-pointer text-white" onClick={() => setIsScriptPanelOpen(false)} type="button">
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
                onChange={(event) => setPanelStyle((current) => ({ ...current, font: event.target.value }))}
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
                onChange={(event) => setPanelStyle((current) => ({ ...current, font_size: Number(event.target.value) }))}
                value={panelStyle.font_size ?? 24}
              >
                {[16, 18, 20, 24, 28, 32].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-[14px]">
              <ScriptStyleButton alt="align left" isActive={panelStyle.position === "top"} onClick={() => setPanelStyle((current) => ({ ...current, position: "top" }))} src={editorFontIconAssets.alignLeft} />
              <ScriptStyleButton alt="align center" isActive={panelStyle.position === "center"} onClick={() => setPanelStyle((current) => ({ ...current, position: "center" }))} src={editorFontIconAssets.alignCenter} />
              <ScriptStyleButton alt="align right" isActive={panelStyle.position === "bottom"} onClick={() => setPanelStyle((current) => ({ ...current, position: "bottom" }))} src={editorFontIconAssets.alignRight} />
            </div>

            <div className="mt-[16px] border-t border-[#303038] pt-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-semibold text-white">스타일</p>
                <button className="cursor-pointer text-white" onClick={() => setPanelStyle(defaultSubtitleStyle)} type="button">
                  <Icon className="size-5" name="reset" />
                </button>
              </div>

              <div className="space-y-[14px] pt-[16px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-white">글 색상</span>
                  <div className="flex items-center gap-[8px]">
                    {(["#FFFFFF", "#8B45FF"] as const).map((color) => (
                      <button
                        key={color}
                        className={`size-6 cursor-pointer rounded-full border-2 transition-all ${
                          panelStyle.color === color ? "border-white scale-110" : "border-[#3b3b43]"
                        }`}
                        onClick={() => setPanelStyle((current) => ({ ...current, color }))}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white">선</span>
                  <div
                    className="size-5 shrink-0 rounded-full border border-[#3b3b43]"
                    style={{ backgroundColor: panelStyle.shadow?.color ?? "#FFFFFF" }}
                  />
                  <input
                    className="flex-1 accent-[#8b45ff]"
                    max={5}
                    min={1}
                    onChange={(event) => setPanelStyle((current) => ({ ...current, shadow: { color: current.shadow?.color ?? "#FFFFFF", enabled: true, offset: Number(event.target.value) } }))}
                    type="range"
                    value={panelStyle.shadow?.offset ?? 2}
                  />
                  <span className="rounded-[8px] bg-[#2a2a31] px-[8px] py-[4px] text-[12px] font-medium text-white">
                    {panelStyle.shadow?.offset ?? 2}px
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white">배경</span>
                  <div
                    className="size-5 shrink-0 rounded-full border border-[#3b3b43]"
                    style={{ backgroundColor: panelStyle.background?.color ?? "#6A57FF" }}
                  />
                  <input
                    className="flex-1 accent-[#8b45ff]"
                    max={100}
                    min={0}
                    onChange={(event) => setPanelStyle((current) => ({ ...current, background: { color: current.background?.color ?? "#6A57FF", enabled: true, opacity: Number(event.target.value) / 100 } }))}
                    type="range"
                    value={Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}
                  />
                  <span className="rounded-[8px] bg-[#2a2a31] px-[8px] py-[4px] text-[12px] font-medium text-white">
                    {Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`mt-[16px] flex w-full cursor-pointer items-center gap-[10px] rounded-[12px] border px-[14px] py-[11px] transition-colors ${
                applyToAll
                  ? "border-[#8b45ff] bg-[rgba(139,69,255,0.08)]"
                  : "border-[#303038] bg-transparent"
              }`}
              onClick={() => setApplyToAll((v) => !v)}
              type="button"
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
                  applyToAll ? "border-[#8b45ff] bg-[#8b45ff]" : "border-[#555560]"
                }`}
              >
                {applyToAll ? <Icon className="size-3 text-white" name="check" /> : null}
              </div>
              <span className="text-[14px] font-medium text-[#d7d7dc]">전체 적용</span>
            </button>

            <div className="flex gap-3 pt-[12px]">
              {editingSubtitleIndex !== null ? (
                <Button className="min-w-0 flex-1" size="tiny" variant="outlined" onClick={() => handleDeleteSubtitle(editingSubtitleIndex)}>
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
