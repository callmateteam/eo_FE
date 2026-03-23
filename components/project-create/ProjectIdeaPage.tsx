"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useCreateStoryboard } from "@/hooks/useStoryboard";
import { useUpdateProject, useEnrichIdea, useConfirmEnrichedIdea } from "@/hooks/useProjects";
import { getProject } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import type { EnrichedIdeaData } from "@/lib/api/types";
import {
  getProjectDraft,
  updateProjectDraft,
} from "@/lib/project-draft";
import { useProjectToast } from "@/components/providers/ProjectToastProvider";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type Step = "INPUT" | "ENRICHING" | "REVIEWING";

type ProjectIdeaPageProps = {
  projectId?: string;
};

export function ProjectIdeaPage({ projectId }: ProjectIdeaPageProps) {
  const router = useRouter();
  const { startStoryboardTracking } = useProjectToast();
  const draft = getProjectDraft();
  const resolvedProjectId = projectId ?? draft?.projectId ?? "";
  const [projectTitle, setProjectTitle] = useState(draft?.title ?? "프로젝트명");
  const [idea, setIdea] = useState(draft?.idea ?? "");
  const [step, setStep] = useState<Step>("INPUT");
  const [enriched, setEnriched] = useState<EnrichedIdeaData | null>(null);
  const [editedEnriched, setEditedEnriched] = useState<EnrichedIdeaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateProjectMutation = useUpdateProject();
  const enrichIdeaMutation = useEnrichIdea();
  const confirmEnrichedIdeaMutation = useConfirmEnrichedIdea();
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

  async function handleEnrichIdea() {
    if (!resolvedProjectId) {
      setErrorMessage("프로젝트 정보가 없습니다. 다시 시작해주세요.");
      return;
    }

    setErrorMessage(null);
    setStep("ENRICHING");

    try {
      await updateProjectMutation.mutateAsync({
        projectId: resolvedProjectId,
        payload: { current_stage: 2, idea: idea.trim() },
      });

      const result = await enrichIdeaMutation.mutateAsync({
        projectId: resolvedProjectId,
        idea: idea.trim(),
      });

      setEnriched(result.enriched);
      setEditedEnriched(result.enriched);
      setStep("REVIEWING");
    } catch (error) {
      setStep("INPUT");
      setErrorMessage(
        error instanceof Error ? error.message : "아이디어 구체화에 실패했습니다.",
      );
    }
  }

  async function handleConfirmAndCreateStoryboard() {
    const draft = getProjectDraft();

    if (!resolvedProjectId || !draft?.characterId || !draft.characterSource || !editedEnriched) {
      setErrorMessage("프로젝트 정보가 없습니다. 다시 시작해주세요.");
      return;
    }

    setErrorMessage(null);

    try {
      await confirmEnrichedIdeaMutation.mutateAsync({
        projectId: resolvedProjectId,
        payload: {
          background: editedEnriched.background,
          mood: editedEnriched.mood,
          main_character: editedEnriched.main_character,
          supporting_characters: editedEnriched.supporting_characters ?? [],
          story: enriched?.story ?? editedEnriched.story,
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

      startStoryboardTracking({ projectId: resolvedProjectId, storyboardId: storyboard.id });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("[project-create] api error", error);
      }
      setErrorMessage(
        error instanceof Error ? error.message : "스토리보드 생성에 실패했습니다.",
      );
    }
  }

  const isIdeaValid = idea.trim().length > 0;
  const isPendingConfirm =
    confirmEnrichedIdeaMutation.isPending ||
    storyboardMutation.isPending;

  async function handleTitleSave(newTitle: string) {
    setProjectTitle(newTitle);
    updateProjectDraft({ title: newTitle });
    await updateProjectMutation.mutateAsync({
      projectId: resolvedProjectId,
      payload: { title: newTitle },
    });
  }

  // ── ENRICHING (loading) ──────────────────────────────────────────────────
  if (step === "ENRICHING") {
    return (
      <ProjectCreateShell
        currentStep={1}
        description="간단한 아이디어를 입력하면 콘티를 생성해요"
        onTitleSave={(t) => void handleTitleSave(t)}
        projectTitle={projectTitle}
        title="아이디어 기획"
        actions={
          <>
            <Button className="min-w-[108px]" size="tiny" variant="outlined" disabled>
              이전
            </Button>
            <Button className="min-w-[112px]" size="tiny" disabled>
              스토리보드 생성
            </Button>
          </>
        }
      >
        <section className="w-[570px] ml-auto rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[16px] py-[28px]">
          {/* 입력한 아이디어 읽기 전용 표시 */}
          <div className="rounded-[18px] border border-[#42424c] bg-[#313137] px-[18px] py-[16px]">
            <p className="text-body-lg font-medium text-[#f1f1f4]">
              {idea}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-[28px] text-[#d7d7dc]">
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span className="text-[14px] font-medium">스토리보드를 스케치 중입니다 ...</span>
          </div>
        </section>
      </ProjectCreateShell>
    );
  }

  // ── REVIEWING (enriched result cards) ───────────────────────────────────
  if (step === "REVIEWING" && editedEnriched) {
    const supportingText = (editedEnriched.supporting_characters ?? []).join("\n");

    return (
      <ProjectCreateShell
        currentStep={1}
        description="간단한 아이디어를 입력하면 콘티를 생성해요"
        onTitleSave={(t) => void handleTitleSave(t)}
        projectTitle={projectTitle}
        title="아이디어 기획"
        actions={
          <>
            <Button
              className="min-w-[108px]"
              size="tiny"
              variant="outlined"
              onClick={() => {
                setStep("INPUT");
                setErrorMessage(null);
              }}
            >
              이전
            </Button>
            <Button
              className="min-w-[148px]"
              size="tiny"
              disabled={isPendingConfirm}
              onClick={() => void handleConfirmAndCreateStoryboard()}
            >
              {isPendingConfirm ? (
                <span className="flex items-center gap-2">
                  <span className="inline-flex size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  생성 중
                </span>
              ) : (
                "스토리보드 생성"
              )}
            </Button>
          </>
        }
      >
        <div className="mx-auto w-full max-w-[1162px] space-y-[18px]">
          {/* 원본 아이디어 읽기 전용 */}
          <div className="w-[570px] ml-auto rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[18px] py-[16px]">
            <p className="text-body-lg font-medium text-[#f1f1f4]">
              {idea}
            </p>
          </div>

          {errorMessage ? (
            <p className="text-[13px] font-medium text-[#ffb8bf]">{errorMessage}</p>
          ) : null}

          {/* 배경 / 분위기 / 캐릭터 카드 */}
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {/* 배경 */}
            <EnrichCard
              label="배경"
              value={editedEnriched.background}
              onChange={(v) =>
                setEditedEnriched((prev) => prev ? { ...prev, background: v } : prev)
              }
            />
            {/* 분위기 */}
            <EnrichCard
              label="분위기"
              value={editedEnriched.mood}
              onChange={(v) =>
                setEditedEnriched((prev) => prev ? { ...prev, mood: v } : prev)
              }
            />
            {/* 캐릭터 */}
            <EnrichCharacterCard
              mainCharacter={editedEnriched.main_character}
              supportingText={supportingText}
              onChangeMain={(v) =>
                setEditedEnriched((prev) =>
                  prev ? { ...prev, main_character: v } : prev,
                )
              }
              onChangeSupporting={(v) =>
                setEditedEnriched((prev) =>
                  prev
                    ? {
                        ...prev,
                        supporting_characters: v
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }
                    : prev,
                )
              }
            />
          </div>

        </div>
      </ProjectCreateShell>
    );
  }

  // ── INPUT ────────────────────────────────────────────────────────────────
  return (
    <ProjectCreateShell
      currentStep={1}
      description="간단한 아이디어를 입력하면 콘티를 생성해요"
      onTitleSave={(t) => void handleTitleSave(t)}
      projectTitle={projectTitle}
      title="아이디어 기획"
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
            className="min-h-[100px] w-full resize-none border-0 bg-transparent text-body-lg font-medium text-[#f1f1f4] outline-none placeholder:text-[#8f8f98]"
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
            disabled={!isIdeaValid || enrichIdeaMutation.isPending}
            onClick={() => void handleEnrichIdea()}
          >
            다음
          </Button>
        </div>
      </section>
    </ProjectCreateShell>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

type EnrichCardProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function EnrichCard({ label, value, onChange }: EnrichCardProps) {
  const [editing, setEditing] = useState(false);
  const wasEditingRef = useRef(false);

  return (
    <div
      className="cursor-pointer rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[18px] py-[20px]"
      onMouseDown={() => { wasEditingRef.current = editing; }}
      onClick={() => { if (!wasEditingRef.current) setEditing(true); }}
    >
      <div className="mb-[12px] flex items-center justify-between">
        <p className="text-[16px] font-semibold text-white">{label}</p>
        <button
          type="button"
          className="cursor-pointer text-[#8f8f98] transition-colors hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setEditing((prev) => !prev);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
      {editing ? (
        <textarea
          className="h-[160px] w-full cursor-text resize-none rounded-[12px] border border-[#42424c] bg-[#313137] px-[14px] py-[12px] text-[14px] leading-[1.6] text-[#f1f1f4] outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <p className="text-[14px] leading-[1.6] text-[#d7d7dc]">{value}</p>
      )}
    </div>
  );
}

type EnrichCharacterCardProps = {
  mainCharacter: string;
  supportingText: string;
  onChangeMain: (value: string) => void;
  onChangeSupporting: (value: string) => void;
};

function EnrichCharacterCard({
  mainCharacter,
  supportingText,
  onChangeMain,
  onChangeSupporting,
}: EnrichCharacterCardProps) {
  const [editingMain, setEditingMain] = useState(false);
  const [editingSupporting, setEditingSupporting] = useState(false);
  const wasEditingRef = useRef(false);

  function toggleAll() {
    const next = !(editingMain || editingSupporting);
    setEditingMain(next);
    setEditingSupporting(next);
  }

  return (
    <div
      className="cursor-pointer rounded-[24px] border border-[#60606e] bg-[#1f1f24] px-[18px] py-[20px]"
      onMouseDown={() => { wasEditingRef.current = editingMain || editingSupporting; }}
      onClick={() => { if (!wasEditingRef.current) toggleAll(); }}
    >
      <div className="mb-[12px] flex items-center justify-between">
        <p className="text-[16px] font-semibold text-white">캐릭터</p>
        <button
          type="button"
          className="cursor-pointer text-[#8f8f98] transition-colors hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleAll();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      <p className="mb-[6px] text-[12px] font-semibold text-[#8f8f98]">메인 캐릭터</p>
      {editingMain ? (
        <textarea
          className="mb-[12px] h-[80px] w-full cursor-text resize-none rounded-[12px] border border-[#42424c] bg-[#313137] px-[14px] py-[10px] text-[14px] leading-[1.6] text-[#f1f1f4] outline-none"
          value={mainCharacter}
          onChange={(e) => onChangeMain(e.target.value)}
          onBlur={() => setEditingMain(false)}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <p className="mb-[12px] text-[14px] leading-[1.6] text-[#d7d7dc]">{mainCharacter}</p>
      )}

      <p className="mb-[6px] text-[12px] font-semibold text-[#8f8f98]">보조 캐릭터</p>
      {editingSupporting ? (
        <textarea
          className="h-[80px] w-full cursor-text resize-none rounded-[12px] border border-[#42424c] bg-[#313137] px-[14px] py-[10px] text-[14px] leading-[1.6] text-[#f1f1f4] outline-none"
          value={supportingText}
          onChange={(e) => onChangeSupporting(e.target.value)}
          onBlur={() => setEditingSupporting(false)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p className="text-[14px] leading-[1.6] text-[#d7d7dc]">{supportingText}</p>
      )}
    </div>
  );
}
