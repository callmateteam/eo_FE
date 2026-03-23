/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";
import { updateProjectDraft } from "@/lib/project-draft";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useStoryboard } from "@/hooks/useStoryboard";
import {
  useVideoEdit,
  useSaveVideoEdit,
  useStartRender,
  useUndoVideoEdit,
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
  align: "center",
  animation: "popup",
  background: { color: "#6A57FF", enabled: true, opacity: 0.11 },
  bold: true,
  color: "#FFFFFF",
  font: "Pretendard",
  font_size: 36,
  italic: false,
  outline_color: "#000000",
  outline_size: 0,
  position: "bottom",
  shadow: { color: "#FFFFFF", enabled: false, offset: 2 },
  underline: false,
};

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

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

function previewSubtitleStyle(style?: SubtitleStyle): React.CSSProperties {
  return {
    backgroundColor: style?.background?.enabled
      ? `rgba(19,19,24,${style.background.opacity ?? 0.7})`
      : "transparent",
    color: style?.color ?? "#FFFFFF",
    fontFamily: style?.font ?? "Pretendard",
    fontSize: `${style?.font_size ?? 36}px`,
    fontWeight: style?.bold ? "bold" : "normal",
    fontStyle: style?.italic ? "italic" : "normal",
    textDecoration: style?.underline ? "underline" : "none",
    textAlign: style?.align ?? "center",
    WebkitTextStroke:
      (style?.outline_size ?? 0) > 0
        ? `${style!.outline_size}px ${style?.outline_color ?? "#000000"}`
        : undefined,
    justifyContent:
      style?.position === "top"
        ? "flex-start"
        : style?.position === "center"
          ? "center"
          : "flex-end",
  };
}

// Waveform decoration
function WaveformDecoration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 120 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 10 Q5 2 10 10 Q15 18 20 10 Q25 2 30 10 Q35 18 40 10 Q45 2 50 10 Q55 18 60 10 Q65 2 70 10 Q75 18 80 10 Q85 2 90 10 Q95 18 100 10 Q105 2 110 10 Q115 18 120 10"
        opacity="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Pill toggle switch (used for BGM mute)
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-[#8b45ff]" : "bg-[#3b3b43]"
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// Circle toggle (color indicator that acts as on/off button)
function CircleToggle({
  checked,
  color,
  onChange,
  onClick,
}: {
  checked: boolean;
  color: string;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      className="relative size-4 shrink-0 cursor-pointer overflow-hidden rounded-full border border-[#3b3b43] transition-all"
      onClick={onClick ?? (() => onChange(!checked))}
      style={{ backgroundColor: checked ? color : "#2a2a31" }}
      type="button"
    >
      {!checked ? (
        <svg
          className="absolute inset-0 text-[#6d6d76]"
          fill="none"
          height="14"
          viewBox="0 0 14 14"
          width="14"
        >
          <line stroke="currentColor" strokeWidth="1.5" x1="2" y1="12" x2="12" y2="2" />
        </svg>
      ) : null}
    </button>
  );
}

// Style button (B/I/U and alignment)
function StyleButton({
  isActive,
  label,
  onClick,
}: {
  isActive?: boolean;
  label: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border text-[13px] font-semibold transition-colors ${
        isActive
          ? "border-[#8b45ff] bg-[rgba(139,69,255,0.12)] text-[#8b45ff]"
          : "border-[#2d2d34] bg-transparent text-[#b6b6be]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
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
  const undoVideoEdit = useUndoVideoEdit();

  const projectTitle = projectQuery.data?.title ?? "프로젝트명";
  const scenes: SceneItem[] = storyboardQuery.data?.scenes ?? [];
  const isLoading = projectQuery.isLoading || storyboardQuery.isLoading || editQuery.isLoading;
  const isError = projectQuery.isError || editQuery.isError;

  // Subtitle panel state
  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [localEditData, setLocalEditData] = useState<EditData | null>(null);
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(false);
  const [scriptPanelSceneId, setScriptPanelSceneId] = useState<string | null>(null);
  const [editingSubtitleIndex, setEditingSubtitleIndex] = useState<number | null>(null);
  const [panelStyle, setPanelStyle] = useState<SubtitleStyle>(defaultSubtitleStyle);
  const [panelOutlineSize, setPanelOutlineSize] = useState(4);
  const [panelHexColor, setPanelHexColor] = useState("#FFFFFF");
  const [applyToAll, setApplyToAll] = useState(false);

  // Error/save message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Video player state
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineZoom, setTimelineZoom] = useState(1);

  // BGM mute state
  const [bgmMuted, setBgmMuted] = useState(false);

  // Color picker state
  type ColorPickerTarget = "text" | "shadow" | "outline" | "background" | null;
  const [colorPickerTarget, setColorPickerTarget] = useState<ColorPickerTarget>(null);
  const [colorPickerPos, setColorPickerPos] = useState({ x: 0, y: 0 });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Draggable panel state
  const [panelPos, setPanelPos] = useState({ x: 800, y: 100 });
  const panelPosRef = useRef({ x: 800, y: 100 });
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  // Keep ref in sync with state (runs every render)
  panelPosRef.current = panelPos;

  // Initialize panel position
  useEffect(() => {
    setPanelPos({ x: Math.max(0, window.innerWidth - 340), y: 100 });
  }, []);

  // Global drag event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPanelPos({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      });
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Color picker: close on outside click
  useEffect(() => {
    if (!colorPickerTarget) return;
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        closeColorPicker();
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorPickerTarget]);

  function handlePanelDragStart(e: React.MouseEvent) {
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - panelPosRef.current.x,
      y: e.clientY - panelPosRef.current.y,
    };
    e.preventDefault();
  }

  // Fix video audio: React muted prop is unreliable, use DOM property directly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Stop polling storyboard once all scenes have video_url
  useEffect(() => {
    if (!storyboardQuery.data) return;
    const allReady =
      storyboardQuery.data.scenes.length > 0 &&
      storyboardQuery.data.scenes.every((scene) => scene.video_url);
    if (allReady) setShouldPollStoryboard(false);
  }, [storyboardQuery.data]);

  // Initialize localEditData from server
  useEffect(() => {
    if (localEditData) return;
    if (editQuery.data?.edit_data) {
      setLocalEditData(editQuery.data.edit_data);
    } else if (!editQuery.isLoading && !editQuery.isError) {
      setLocalEditData({});
    }
  }, [editQuery.data, editQuery.isLoading, editQuery.isError, localEditData]);

  // Sync bgmMuted from editData
  useEffect(() => {
    const vol = localEditData?.bgm?.volume;
    if (vol !== undefined) {
      setBgmMuted(vol === 0);
    }
  }, [localEditData?.bgm]);

  const editData = localEditData;
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId],
  );

  const selectedSceneSubtitleEntries = selectedScene
    ? getSceneSubtitleEntries(localEditData ?? {}, selectedScene)
    : [];
  const selectedSubtitle =
    selectedSceneSubtitleEntries[0]?.subtitle ??
    (selectedScene ? createDefaultSubtitle(selectedScene) : null);
  const selectedSceneEdit =
    selectedScene && editData
      ? (getSceneEditItem(editData, selectedScene) ?? createDefaultSceneEdit(selectedScene))
      : null;

  const bgmName = editData?.bgm?.preset ?? storyboardQuery.data?.bgm_mood ?? null;

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
      setErrorMessage(error instanceof NetworkError ? error.message : "저장에 실패했습니다.");
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
      updateProjectDraft({ projectId, storyboardId, title: projectTitle });
      router.push(
        `/project/${projectId}/save?storyboardId=${encodeURIComponent(storyboardId)}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof NetworkError ? error.message : "렌더링 요청에 실패했습니다.",
      );
    }
  }

  async function handleUndo() {
    if (!storyboardId) return;
    try {
      const result = await undoVideoEdit.mutateAsync(storyboardId);
      setLocalEditData(result.edit_data);
      setSaveMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof NetworkError ? error.message : "실행 취소에 실패했습니다.",
      );
    }
  }

  function handleBgmMuteToggle() {
    const newMuted = !bgmMuted;
    setBgmMuted(newMuted);
    if (localEditData?.bgm) {
      setLocalEditData((prev) => ({
        ...prev,
        bgm: { ...prev!.bgm!, volume: newMuted ? 0 : 0.8 },
      }));
    }
  }

  const openScriptPanel = (sceneId: string) => {
    // stale selectedScene 대신 sceneId로 직접 씬 탐색 (React 배칭 타이밍 버그 수정)
    const targetScene = scenes.find((s) => s.id === sceneId) ?? selectedScene;
    if (!targetScene) return;

    setScriptPanelSceneId(sceneId);

    const existingEntries = getSceneSubtitleEntries(localEditData ?? {}, targetScene);
    let nextSubtitle: SubtitleItem;
    let nextEditingIndex: number | null;

    if (existingEntries.length > 0) {
      nextSubtitle = existingEntries[0].subtitle;
      nextEditingIndex = existingEntries[0].index;
    } else {
      nextSubtitle = createDefaultSubtitle(targetScene);
      nextEditingIndex = null;
    }

    const style = nextSubtitle.style ?? defaultSubtitleStyle;
    setEditingSubtitleIndex(nextEditingIndex);
    setPanelStyle(style);
    setPanelHexColor(style.color ?? "#FFFFFF");
    setPanelOutlineSize((style.outline_size ?? 0) > 0 ? (style.outline_size ?? 4) : 4);
    setSaveMessage(null);
    setIsScriptPanelOpen(true);
  };

  const applyScriptPanelChanges = () => {
    // scriptPanelSceneId로 씬 탐색 — applyScriptPanelChanges 실행 시점에 selectedScene이
    // 다른 씬으로 바뀌어있을 수 있으므로 패널을 연 시점의 sceneId를 사용 (stale 방지)
    const targetScene = scenes.find((s) => s.id === scriptPanelSceneId) ?? selectedScene;
    if (!targetScene) return;
    const currentEditData = localEditData ?? {};

    const finalStyle: SubtitleStyle = {
      ...panelStyle,
      color: panelHexColor,
      outline_size: (panelStyle.outline_size ?? 0) > 0 ? panelOutlineSize : 0,
      outline_color: panelStyle.outline_color ?? "#000000",
    };

    // 기존 자막에서 text 보존 (없으면 scene.content 기본값)
    const existingEntries = getSceneSubtitleEntries(currentEditData, targetScene);
    const baseSubtitle = existingEntries[0]?.subtitle ?? createDefaultSubtitle(targetScene);

    const nextSubtitle: SubtitleItem = {
      ...baseSubtitle,
      scene_id: targetScene.id,
      style: finalStyle,
    };

    // 다른 씬 자막은 유지, 현재 씬 자막은 1개로 교체 (중복 완전 제거)
    const otherSubtitles = (currentEditData.subtitles ?? []).filter(
      (sub) => sub.scene_id !== targetScene.id,
    );

    const finalSubtitles = applyToAll
      ? [...otherSubtitles, nextSubtitle].map((sub) => ({ ...sub, style: finalStyle }))
      : [...otherSubtitles, nextSubtitle];

    setLocalEditData({ ...currentEditData, subtitles: finalSubtitles });
    setSaveMessage(null);
    setEditingSubtitleIndex(null);
    setApplyToAll(false);
    setIsScriptPanelOpen(false);
  };

  function updateSelectedSceneEdit(updater: (current: EditSceneItem) => EditSceneItem) {
    if (!selectedScene) return;
    const currentEditData = localEditData ?? {};
    const currentSceneEdit =
      getSceneEditItem(currentEditData, selectedScene) ??
      createDefaultSceneEdit(selectedScene);
    const nextSceneEdit = updater(currentSceneEdit);
    const nextScenes = [...(currentEditData.scenes ?? [])];
    const targetIndex = nextScenes.findIndex((e) => e.scene_id === selectedScene.id);
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
    } else {
      video.pause();
    }
  }

  // Color picker: current color derived from target
  const currentPickerColor: string = (() => {
    switch (colorPickerTarget) {
      case "text": return panelHexColor;
      case "shadow": return panelStyle.shadow?.color ?? "#000000";
      case "outline": return panelStyle.outline_color ?? "#000000";
      case "background": return panelStyle.background?.color ?? "#6A57FF";
      default: return "#FFFFFF";
    }
  })();

  function addRecentColor(color: string) {
    setRecentColors((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, 5));
  }

  function closeColorPicker() {
    if (colorPickerTarget) addRecentColor(currentPickerColor);
    setColorPickerTarget(null);
  }

  function openColorPicker(target: NonNullable<typeof colorPickerTarget>, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setColorPickerPos({ x: panelPos.x - 260, y: rect.top });
    setColorPickerTarget(target);
  }

  function handlePickerColorChange(color: string) {
    switch (colorPickerTarget) {
      case "text":
        setPanelHexColor(color);
        setPanelStyle((c) => ({ ...c, color }));
        break;
      case "shadow":
        setPanelStyle((c) => ({
          ...c,
          shadow: { color, enabled: true, offset: c.shadow?.offset ?? 2 },
        }));
        break;
      case "outline":
        setPanelStyle((c) => ({ ...c, outline_color: color }));
        break;
      case "background":
        setPanelStyle((c) => ({
          ...c,
          background: { color, enabled: true, opacity: c.background?.opacity ?? 0.11 },
        }));
        break;
    }
  }

  function handlePickerToggleEnabled(checked: boolean) {
    switch (colorPickerTarget) {
      case "shadow":
        setPanelStyle((c) => ({ ...c, shadow: { ...c.shadow!, enabled: checked } }));
        break;
      case "outline":
        setPanelStyle((c) => ({ ...c, outline_size: checked ? panelOutlineSize : 0 }));
        break;
      case "background":
        setPanelStyle((c) => ({ ...c, background: { ...c.background!, enabled: checked } }));
        break;
    }
  }

  // Live preview style (merges panel state for real-time preview)
  const livePreviewStyle: SubtitleStyle = isScriptPanelOpen
    ? {
        ...panelStyle,
        color: panelHexColor,
        outline_size: (panelStyle.outline_size ?? 0) > 0 ? panelOutlineSize : 0,
        outline_color: panelStyle.outline_color ?? "#000000",
      }
    : (selectedSubtitle?.style ?? defaultSubtitleStyle);

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
            disabled={
              !editData ||
              scenes.some((s) => !s.video_url) ||
              scenes.some((s) => s.video_status?.toUpperCase() === "FAILED")
            }
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
        {/* Video player (always centered) */}
        <div className="flex justify-center">
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden rounded-[18px] bg-[#f5f2e9] transition-[width,height]"
            style={{
              height: `${Math.round(404 * timelineZoom)}px`,
              width: `${Math.round(226 * timelineZoom)}px`,
            }}
          >
            {selectedScene?.video_url ? (
              <video
                key={selectedScene.id}
                ref={videoRef}
                className="h-full w-full object-cover"
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => {
                  setPlayerDuration(
                    event.currentTarget.duration || getSceneDuration(selectedScene),
                  );
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
              className="absolute inset-x-4 bottom-3.5 flex rounded-lg px-3 py-1.5 font-semibold"
              style={previewSubtitleStyle(livePreviewStyle)}
            >
              <span className="w-full">{selectedSubtitle?.text ?? "script"}</span>
            </div>
          </div>
        </div>

        {/* Timeline panel */}
        <div className="mt-[24px] rounded-[22px] border border-[#25252b] bg-[#121214] px-[16px] py-[14px]">
          {/* Timeline controls */}
          <div className="flex items-center justify-between border-b border-[#222228] pb-[12px]">
            {/* Left: play controls */}
            <div className="flex items-center gap-[12px] text-[#d7d7dc]">
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
                {formatTime(
                  playerDuration || (selectedScene ? getSceneDuration(selectedScene) : 0),
                )}
              </span>
              <select
                className="h-[26px] rounded-full border border-[#2f2f35] bg-transparent px-[8px] text-[12px] font-medium text-[#a8a8b1] outline-none"
                onChange={(event) => {
                  const nextRate = Number(event.target.value);
                  setPlaybackRate(nextRate);
                  if (videoRef.current) videoRef.current.playbackRate = nextRate;
                  if (selectedScene) {
                    updateSelectedSceneEdit((current) => ({ ...current, speed: nextRate }));
                  }
                }}
                value={playbackRate}
              >
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <button
                className="cursor-pointer text-[#a8a8b1]"
                onClick={() => setIsMuted((v) => !v)}
                type="button"
              >
                <Icon className="size-4" name="sound" />
              </button>
            </div>

            {/* Center: undo */}
            <div className="flex items-center gap-[4px]">
              <button
                className="cursor-pointer rounded-[8px] p-[6px] text-[#cfcfd5] transition-colors hover:bg-[#1e1e23] disabled:cursor-default disabled:opacity-40"
                disabled={undoVideoEdit.isPending}
                onClick={() => { void handleUndo(); }}
                title="실행 취소"
                type="button"
              >
                <Icon className="size-4" name="reset" />
              </button>
            </div>

            {/* Right: zoom + fullscreen */}
            <div className="flex items-center gap-[8px] text-[#d7d7dc]">
              <button
                className="cursor-pointer text-[#cfcfd5]"
                onClick={() =>
                  setTimelineZoom((z) => Math.max(0.7, Math.round((z - 0.15) * 100) / 100))
                }
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
                onClick={() =>
                  setTimelineZoom((z) => Math.min(1.5, Math.round((z + 0.15) * 100) / 100))
                }
                type="button"
              >
                <Icon className="size-4" name="plus" />
              </button>
              <button
                className="ml-[4px] cursor-pointer text-[#cfcfd5]"
                onClick={handleFullscreen}
                type="button"
              >
                <Icon className="size-5" name="fullscreen" />
              </button>
            </div>
          </div>

          {/* Scene cards row */}
          <div className="mt-[14px] flex gap-[10px] overflow-x-auto pb-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    onClick={() => {
                      setSelectedSceneId(scene.id);
                      openScriptPanel(scene.id);
                    }}
                    type="button"
                  >
                    <p className="text-[10px] font-semibold text-[#8f8f98]">
                      #{scene.scene_order}
                    </p>
                    <p className="truncate text-[11px] font-medium text-[#d7d7dc]">
                      {subtitle?.text || scene.narration || "스크립트"}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-[6px] text-right text-[11px] text-[#6d6d76]">
            * 스크립트를 클릭하시면 수정 가능합니다
          </p>

          {/* TTS row */}
          {scenes.some((s) => s.narration_url) ? (
            <div className="mt-[8px] flex items-center gap-[10px]">
              <div className="flex w-[32px] shrink-0 items-center justify-center text-[#6d6d76]">
                <Icon className="size-4" name="sound" />
              </div>
              <div className="flex flex-1 gap-[10px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {scenes.map((scene) => {
                  const ttsOverlay = editData?.tts_overlays?.find(
                    (o) => o.scene_id === scene.id,
                  );
                  const hasNarration = Boolean(scene.narration_url ?? ttsOverlay?.audio_url);
                  const voiceLabel = ttsOverlay?.voice_id ?? "나레이션";

                  return (
                    <div
                      key={scene.id}
                      className="flex h-[32px] w-[161px] shrink-0 items-center overflow-hidden rounded-[6px]"
                    >
                      {hasNarration ? (
                        <div className="flex h-full w-full items-center gap-[6px] rounded-[6px] border border-[#2a2a31] bg-[#1a1a1f] px-[8px]">
                          <span className="shrink-0 text-[10px] font-medium text-[#8b8b95]">
                            TTS: {voiceLabel}
                          </span>
                          <WaveformDecoration className="flex-1 text-[#6d6d76]" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* BGM row */}
          {bgmName ? (
            <div className="mt-[4px] flex items-center gap-[10px]">
              <div className="flex w-[32px] shrink-0 flex-col items-center gap-[4px]">
                <span className="text-[9px] font-bold text-[#6d6d76]">BGM</span>
                <ToggleSwitch checked={!bgmMuted} onChange={() => handleBgmMuteToggle()} />
              </div>
              <div className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div
                  className={`flex h-[32px] shrink-0 items-center gap-[8px] rounded-[6px] border border-[#2a2a31] px-[10px] transition-opacity ${
                    bgmMuted ? "bg-[#111114] opacity-40" : "bg-[#1a1a1f]"
                  }`}
                  style={{ width: `${scenes.length * 171 - 10}px`, minWidth: "161px" }}
                >
                  <span className="shrink-0 text-[10px] font-medium text-[#8b8b95]">
                    BGM: {bgmName}
                  </span>
                  <WaveformDecoration className="flex-1 text-[#6d6d76]" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Script panel — draggable floating overlay */}
      {isScriptPanelOpen && selectedScene ? (
        <div
          className="fixed z-50 w-[300px] select-none overflow-y-auto rounded-[20px] border border-[#25252b] bg-[#1f1f24] shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px`, maxHeight: "90vh" }}
        >
          {/* Drag handle header */}
          <div
            className="flex cursor-move items-center justify-between px-[18px] pt-[18px]"
            onMouseDown={handlePanelDragStart}
          >
            <h2 className="text-[16px] font-semibold text-white">스크립트</h2>
            <button
              className="cursor-pointer text-[#b6b6be] hover:text-white"
              onClick={() => setIsScriptPanelOpen(false)}
              onMouseDown={(e) => e.stopPropagation()}
              type="button"
            >
              <Icon className="size-5" name="close" />
            </button>
          </div>

          <div className="px-[18px] pb-[18px]">
            {/* Font row */}
            <div className="mt-[14px] flex gap-[8px]">
              <select
                className="h-[38px] flex-1 rounded-[8px] border border-[#2d2d34] bg-[#121214] px-[10px] text-[13px] font-medium text-[#d7d7dc] outline-none"
                onChange={(event) =>
                  setPanelStyle((c) => ({ ...c, font: event.target.value }))
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
                className="h-[38px] w-[64px] shrink-0 rounded-[8px] border border-[#2d2d34] bg-[#121214] px-[8px] text-[13px] font-medium text-[#d7d7dc] outline-none"
                onChange={(event) =>
                  setPanelStyle((c) => ({ ...c, font_size: Number(event.target.value) }))
                }
                value={panelStyle.font_size ?? 36}
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Format & alignment buttons */}
            <div className="mt-[10px] flex items-center gap-[4px]">
              <StyleButton
                isActive={panelStyle.bold}
                label={<span className="font-bold">B</span>}
                onClick={() => setPanelStyle((c) => ({ ...c, bold: !c.bold }))}
              />
              <StyleButton
                isActive={panelStyle.italic}
                label={<span className="italic">I</span>}
                onClick={() => setPanelStyle((c) => ({ ...c, italic: !c.italic }))}
              />
              <StyleButton
                isActive={panelStyle.underline}
                label={<span className="underline">U</span>}
                onClick={() => setPanelStyle((c) => ({ ...c, underline: !c.underline }))}
              />
              <div className="mx-[4px] h-5 w-px bg-[#2d2d34]" />
              <StyleButton
                isActive={panelStyle.align === "left"}
                label={
                  <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
                    <rect height="1.5" rx="0.75" width="14" y="1" />
                    <rect height="1.5" rx="0.75" width="9" y="4.5" />
                    <rect height="1.5" rx="0.75" width="14" y="8" />
                    <rect height="1.5" rx="0.75" width="9" y="11.5" />
                  </svg>
                }
                onClick={() => setPanelStyle((c) => ({ ...c, align: "left" }))}
              />
              <StyleButton
                isActive={panelStyle.align === "center"}
                label={
                  <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
                    <rect height="1.5" rx="0.75" width="14" y="1" />
                    <rect height="1.5" rx="0.75" width="9" x="2.5" y="4.5" />
                    <rect height="1.5" rx="0.75" width="14" y="8" />
                    <rect height="1.5" rx="0.75" width="9" x="2.5" y="11.5" />
                  </svg>
                }
                onClick={() => setPanelStyle((c) => ({ ...c, align: "center" }))}
              />
              <StyleButton
                isActive={panelStyle.align === "right"}
                label={
                  <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
                    <rect height="1.5" rx="0.75" width="14" y="1" />
                    <rect height="1.5" rx="0.75" width="9" x="5" y="4.5" />
                    <rect height="1.5" rx="0.75" width="14" y="8" />
                    <rect height="1.5" rx="0.75" width="9" x="5" y="11.5" />
                  </svg>
                }
                onClick={() => setPanelStyle((c) => ({ ...c, align: "right" }))}
              />
            </div>

            {/* Style section */}
            <div className="mt-[16px] border-t border-[#2d2d34] pt-[14px]">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-white">스타일</p>
                <button
                  className="cursor-pointer text-[#b6b6be] hover:text-white"
                  onClick={() => {
                    setPanelStyle(defaultSubtitleStyle);
                    setPanelHexColor("#FFFFFF");
                    setPanelOutlineSize(4);
                  }}
                  type="button"
                >
                  <Icon className="size-4" name="reset" />
                </button>
              </div>

              <div className="mt-[14px] space-y-[14px]">
                {/* 글 색상: clickable color swatch + hex input */}
                <div className="flex items-center justify-between gap-[8px]">
                  <span className="shrink-0 text-[13px] font-medium text-[#d7d7dc]">글 색상</span>
                  <div className="flex items-center gap-[8px]">
                    <button
                      className="size-4 shrink-0 cursor-pointer rounded-full border border-[#3b3b43]"
                      onClick={(e) => openColorPicker("text", e)}
                      style={{ backgroundColor: panelHexColor }}
                      type="button"
                    />
                    <div className="flex items-center rounded-[6px] border border-[#2d2d34] bg-[#121214] px-[8px] py-[4px]">
                      <span className="text-[12px] font-medium text-[#6d6d76]">Hex</span>
                      <input
                        className="ml-[4px] w-[58px] bg-transparent text-[12px] font-medium text-[#d7d7dc] outline-none"
                        maxLength={7}
                        onChange={(event) => {
                          setPanelHexColor(event.target.value);
                          setPanelStyle((c) => ({ ...c, color: event.target.value }));
                        }}
                        placeholder="#FFFFFF"
                        value={panelHexColor}
                      />
                    </div>
                  </div>
                </div>

                {/* 그림자: circle toggle → 컬러피커 팝업 */}
                <div className="flex items-center justify-between gap-[8px]">
                  <span className="text-[13px] font-medium text-[#d7d7dc]">그림자</span>
                  <CircleToggle
                    checked={panelStyle.shadow?.enabled ?? false}
                    color={panelStyle.shadow?.color ?? "#000000"}
                    onChange={() => {}}
                    onClick={(e) => openColorPicker("shadow", e)}
                  />
                </div>

                {/* 선 (outline): circle toggle → 컬러피커 팝업 + slider */}
                <div className="flex items-center gap-[8px]">
                  <span className="shrink-0 text-[13px] font-medium text-[#d7d7dc]">선</span>
                  <div className="flex flex-1 items-center justify-end gap-[8px]">
                    <CircleToggle
                      checked={(panelStyle.outline_size ?? 0) > 0}
                      color={panelStyle.outline_color ?? "#000000"}
                      onChange={() => {}}
                      onClick={(e) => openColorPicker("outline", e)}
                    />
                    <input
                      className="flex-1 accent-[#8b45ff]"
                      max={8}
                      min={1}
                      onChange={(event) => {
                        const val = Number(event.target.value);
                        setPanelOutlineSize(val);
                        setPanelStyle((c) => ({ ...c, outline_size: val }));
                      }}
                      type="range"
                      value={panelOutlineSize}
                    />
                    <span className="w-[38px] rounded-[6px] bg-[#2a2a31] px-[6px] py-[3px] text-center text-[11px] font-medium text-white">
                      {panelOutlineSize}px
                    </span>
                  </div>
                </div>

                {/* 배경: circle toggle → 컬러피커 팝업 + slider */}
                <div className="flex items-center gap-[8px]">
                  <span className="shrink-0 text-[13px] font-medium text-[#d7d7dc]">배경</span>
                  <div className="flex flex-1 items-center justify-end gap-[8px]">
                    <CircleToggle
                      checked={panelStyle.background?.enabled ?? false}
                      color={panelStyle.background?.color ?? "#6A57FF"}
                      onChange={() => {}}
                      onClick={(e) => openColorPicker("background", e)}
                    />
                    <input
                      className="flex-1 accent-[#8b45ff]"
                      max={100}
                      min={0}
                      onChange={(event) =>
                        setPanelStyle((c) => ({
                          ...c,
                          background: {
                            color: c.background?.color ?? "#6A57FF",
                            enabled: Number(event.target.value) > 0,
                            opacity: Number(event.target.value) / 100,
                          },
                        }))
                      }
                      type="range"
                      value={Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}
                    />
                    <span className="w-[38px] rounded-[6px] bg-[#2a2a31] px-[6px] py-[3px] text-center text-[11px] font-medium text-white">
                      {Math.round((panelStyle.background?.opacity ?? 0.11) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 전체 적용: simple checkbox row */}
            <div
              className="mt-[14px] flex cursor-pointer items-center gap-[8px]"
              onClick={() => setApplyToAll((v) => !v)}
            >
              <div
                className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${
                  applyToAll ? "border-[#8b45ff] bg-[#8b45ff]" : "border-[#8b45ff]"
                }`}
              >
                {applyToAll ? <Icon className="size-2.5 text-white" name="check" /> : null}
              </div>
              <span className="text-[13px] font-medium text-[#d7d7dc]">전체 적용</span>
            </div>

            {/* Action buttons */}
            <div className="mt-[14px] flex gap-[8px]">
              <Button className="min-w-0 flex-1" size="tiny" onClick={applyScriptPanelChanges}>
                적용하기
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Color picker popup */}
      {colorPickerTarget && (
        <div
          ref={colorPickerRef}
          className="fixed z-[60] w-[220px] select-none rounded-[16px] border border-[#25252b] bg-[#1f1f24] p-[14px] shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
          style={{ left: `${colorPickerPos.x}px`, top: `${colorPickerPos.y}px` }}
        >
          {/* 헤더: 제목 + enabled 토글(글색상 제외) + 닫기 */}
          <div className="mb-[10px] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white">
              {colorPickerTarget === "text"
                ? "글 색상"
                : colorPickerTarget === "shadow"
                  ? "그림자"
                  : colorPickerTarget === "outline"
                    ? "선 색상"
                    : "배경"}
            </span>
            <div className="flex items-center gap-[8px]">
              {colorPickerTarget !== "text" && (
                <ToggleSwitch
                  checked={
                    colorPickerTarget === "shadow"
                      ? (panelStyle.shadow?.enabled ?? false)
                      : colorPickerTarget === "outline"
                        ? (panelStyle.outline_size ?? 0) > 0
                        : (panelStyle.background?.enabled ?? false)
                  }
                  onChange={handlePickerToggleEnabled}
                />
              )}
              <button
                className="cursor-pointer text-[#b6b6be] hover:text-white"
                onClick={closeColorPicker}
                type="button"
              >
                <Icon className="size-4" name="close" />
              </button>
            </div>
          </div>

          {/* 최근 색상 */}
          {recentColors.length > 0 && (
            <div className="mb-[10px] flex gap-[6px]">
              {recentColors.map((color, i) => (
                <button
                  key={i}
                  className="size-5 shrink-0 rounded-full border border-[#3b3b43]"
                  onClick={() => handlePickerColorChange(color)}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          )}

          {/* react-colorful HexColorPicker */}
          <HexColorPicker
            color={currentPickerColor}
            onChange={handlePickerColorChange}
            style={{ width: "100%" }}
          />

          {/* Hex 입력 */}
          <div className="mt-[10px] flex items-center rounded-[6px] border border-[#2d2d34] bg-[#121214] px-[8px] py-[4px]">
            <span className="text-[12px] font-medium text-[#6d6d76]">Hex</span>
            <HexColorInput
              className="ml-[4px] w-full bg-transparent text-[12px] font-medium text-[#d7d7dc] outline-none"
              color={currentPickerColor}
              onChange={handlePickerColorChange}
              prefixed
            />
          </div>
        </div>
      )}
    </ProjectCreateShell>
  );
}
