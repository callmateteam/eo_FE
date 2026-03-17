/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
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
  type StoryboardScene,
  type SubtitleItem,
  type SubtitleStyle,
} from "@/lib/api/storyboards";
import { updateProjectDraft } from "@/lib/project-draft";

type ProjectEditPageProps = {
  projectId: string;
  storyboardId?: string;
};

type SceneEditorUiState = {
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
  underline: boolean;
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

function getSceneDuration(scene: StoryboardScene) {
  return Number.isFinite(scene.duration) && scene.duration > 0 ? scene.duration : 5;
}

function ensureSceneSubtitle(editData: EditData, scene: StoryboardScene) {
  const existingSubtitle = editData.subtitles?.find(
    (subtitle) => subtitle.scene_id === scene.id
  );

  if (existingSubtitle) {
    return existingSubtitle;
  }

  return {
    end: getSceneDuration(scene),
    scene_id: scene.id,
    start: 0,
    style: defaultSubtitleStyle,
    text: scene.content,
  } satisfies SubtitleItem;
}

function previewSubtitleStyle(style?: SubtitleStyle) {
  return {
    backgroundColor: style?.background?.enabled
      ? `rgba(19,19,24,${style.background.opacity ?? 0.7})`
      : "transparent",
    color: style?.color ?? "#FFFFFF",
    fontFamily: style?.font ?? "Pretendard",
    fontSize: `${style?.font_size ?? 24}px`,
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
  const [panelText, setPanelText] = useState("");
  const [panelStyle, setPanelStyle] = useState<SubtitleStyle>(defaultSubtitleStyle);
  const [applyAllScenes, setApplyAllScenes] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sceneEditorUiState, setSceneEditorUiState] = useState<
    Record<string, SceneEditorUiState>
  >({});

  const editData = localEditData ?? editQuery.data?.edit_data ?? null;
  const scenes = useMemo(() => storyboardQuery.data?.scenes ?? [], [storyboardQuery.data?.scenes]);
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId]
  );

  const selectedSubtitle =
    selectedScene && editData
      ? ensureSceneSubtitle(editData, selectedScene)
      : null;

  const editorUiState = selectedScene
    ? sceneEditorUiState[selectedScene.id] ?? {
        align: "center",
        bold: false,
        italic: false,
        underline: false,
      }
    : {
        align: "center" as const,
        bold: false,
        italic: false,
        underline: false,
      };

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

      await updateVideoEdit(resolvedStoryboardId, editData);
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

  const openScriptPanel = () => {
    if (!selectedScene || !selectedSubtitle) {
      return;
    }

    setPanelText(selectedSubtitle.text);
    setPanelStyle(selectedSubtitle.style ?? defaultSubtitleStyle);
    setApplyAllScenes(false);
    setIsScriptPanelOpen(true);
  };

  const applyScriptPanelChanges = () => {
    if (!selectedScene || !editData) {
      return;
    }

    const nextSubtitles = [...(editData.subtitles ?? [])];
    const targetScenes = applyAllScenes ? scenes : [selectedScene];

    targetScenes.forEach((scene) => {
      const currentIndex = nextSubtitles.findIndex((item) => item.scene_id === scene.id);
      const baseSubtitle = ensureSceneSubtitle(editData, scene);
      const nextSubtitle: SubtitleItem = {
        ...baseSubtitle,
        scene_id: scene.id,
        style: panelStyle,
        text: applyAllScenes ? baseSubtitle.text : panelText,
      };

      if (currentIndex >= 0) {
        nextSubtitles[currentIndex] = nextSubtitle;
      } else {
        nextSubtitles.push(nextSubtitle);
      }
    });

    setLocalEditData({
      ...editData,
      subtitles: nextSubtitles,
    });
    setIsScriptPanelOpen(false);
  };

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

      <div className="mx-auto w-full max-w-[1162px]">
        <div className="flex justify-center">
          <div className="relative h-[404px] w-[226px] overflow-hidden rounded-[18px] bg-[#f5f2e9]">
            <img
              alt={selectedScene?.title ?? "scene"}
              className="h-full w-full object-cover"
              src={
                selectedScene?.image_url ||
                "/assets/landing/cards/storyboard-cover-1.png"
              }
            />
            <div
              className="absolute bottom-[14px] left-[16px] right-[16px] rounded-[8px] px-[12px] py-[6px] text-center font-semibold"
              style={previewSubtitleStyle(selectedSubtitle?.style)}
            >
              {selectedSubtitle?.text ?? "script"}
            </div>
          </div>
        </div>

        <div className="mt-[38px] rounded-[22px] border border-[#25252b] bg-[#121214] px-[16px] py-[14px]">
          <div className="flex items-center justify-between border-b border-[#222228] pb-[12px]">
            <div className="flex items-center gap-[14px] text-[#d7d7dc]">
              <button className="text-white" type="button">
                <Icon className="size-5" name="play" />
              </button>
              <span className="text-[13px] font-medium">00:18 / 01:38</span>
              <button
                className="rounded-full border border-[#2f2f35] px-[8px] py-[2px] text-[12px] font-medium text-[#a8a8b1]"
                type="button"
              >
                1x
              </button>
              <button className="text-[#a8a8b1]" type="button">
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
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-[18px] bg-[#d7d7dc]" />
                <span className="h-[4px] w-[36px] rounded-full bg-[#d7d7dc]" />
                <span className="inline-flex size-[10px] rounded-full bg-[#d7d7dc]" />
              </div>
            </div>
          </div>

          <div className="mt-[16px] flex gap-[10px] overflow-x-auto pb-[8px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {scenes.map((scene) => {
              const subtitle = editData ? ensureSceneSubtitle(editData, scene) : null;
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
                  <ScriptInputField
                    className="mt-[6px] w-full truncate rounded-full bg-[#2b2b31] text-left text-[#d7d7dc]"
                    state={isSelected ? "selected" : "default"}
                    onClick={() => {
                      setSelectedSceneId(scene.id);
                      setTimeout(() => {
                        openScriptPanel();
                      }, 0);
                    }}
                  >
                    {subtitle?.text || "스크립트"}
                  </ScriptInputField>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isScriptPanelOpen && selectedScene ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(0,0,0,0.45)] px-4">
          <div className="w-full max-w-[320px] rounded-[24px] bg-[#1f1f24] px-[20px] py-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
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
                className="h-[80px] w-full resize-none rounded-[14px] border border-[#303038] bg-[#121214] px-[14px] py-[12px] text-[14px] font-medium text-[#f1f1f4] outline-none placeholder:text-[#6d6d76]"
                onChange={(event) => setPanelText(event.target.value)}
                value={panelText}
              />
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
                alt="bold"
                isActive={editorUiState.bold}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      bold: !editorUiState.bold,
                    },
                  }))
                }
                src={editorFontIconAssets.textBold}
              />
              <ScriptStyleButton
                alt="italic"
                isActive={editorUiState.italic}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      italic: !editorUiState.italic,
                    },
                  }))
                }
                src={editorFontIconAssets.textItalic}
              />
              <ScriptStyleButton
                alt="underline"
                isActive={editorUiState.underline}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      underline: !editorUiState.underline,
                    },
                  }))
                }
                src={editorFontIconAssets.textUnderline}
              />
              <ScriptStyleButton
                alt="align left"
                isActive={editorUiState.align === "left"}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      align: "left",
                    },
                  }))
                }
                src={editorFontIconAssets.alignLeft}
              />
              <ScriptStyleButton
                alt="align center"
                isActive={editorUiState.align === "center"}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      align: "center",
                    },
                  }))
                }
                src={editorFontIconAssets.alignCenter}
              />
              <ScriptStyleButton
                alt="align right"
                isActive={editorUiState.align === "right"}
                onClick={() =>
                  setSceneEditorUiState((current) => ({
                    ...current,
                    [selectedScene.id]: {
                      ...editorUiState,
                      align: "right",
                    },
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

            <label className="mt-[18px] flex items-center gap-3">
              <button
                className={`flex size-8 items-center justify-center rounded-[10px] border ${
                  applyAllScenes ? "border-[#8b45ff] bg-[rgba(139,69,255,0.12)]" : "border-[#8b45ff]"
                }`}
                onClick={() => setApplyAllScenes((current) => !current)}
                type="button"
              >
                {applyAllScenes ? <Icon className="size-4 text-white" name="check" /> : null}
              </button>
              <span className="text-[16px] font-medium text-white">전체 적용</span>
            </label>

            <div className="pt-[18px]">
              <Button className="w-full" size="tiny" onClick={applyScriptPanelChanges}>
                적용하기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ProjectCreateShell>
  );
}
