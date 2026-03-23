"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCreateProject } from "@/hooks/useProjects";
import { useCustomCharacter, useUpdateCustomCharacter } from "@/hooks/useCharacters";
import { queryKeys } from "@/hooks/query-keys";
import * as charactersApi from "@/lib/api/characters";
import type { CharacterItem, CharacterStyle, CustomCharacterItem, VoiceId } from "@/lib/api/types";
import { clearProjectDraft, updateProjectDraft } from "@/lib/project-draft";

type CharacterEditModalProps = {
  characterId: string;
  isCustom: boolean;
  imageSrc: string;
  onClose: () => void;
};

const STYLE_OPTIONS: { label: string; value: CharacterStyle }[] = [
  { label: "실사", value: "REALISTIC" },
  { label: "애니메이션", value: "ANIME" },
  { label: "3D 카툰", value: "CARTOON_3D" },
  { label: "2D 일러스트", value: "ILLUSTRATION_2D" },
  { label: "클레이", value: "CLAY" },
  { label: "수채화", value: "WATERCOLOR" },
];

const VOICE_OPTIONS: { label: string; value: VoiceId }[] = [
  { label: "alloy", value: "alloy" },
  { label: "ash", value: "ash" },
  { label: "ballad", value: "ballad" },
  { label: "coral", value: "coral" },
  { label: "echo", value: "echo" },
  { label: "fable", value: "fable" },
  { label: "onyx", value: "onyx" },
  { label: "nova", value: "nova" },
  { label: "sage", value: "sage" },
  { label: "shimmer", value: "shimmer" },
];

export function CharacterEditModal({
  characterId,
  isCustom,
  imageSrc,
  onClose,
}: CharacterEditModalProps) {
  const router = useRouter();
  const backdropRef = useRef<HTMLDivElement>(null);

  const customQuery = useCustomCharacter(characterId);
  const presetQuery = useQuery({
    queryKey: queryKeys.characters.presetSingle(characterId),
    queryFn: () => charactersApi.getCharacter(characterId),
    enabled: !isCustom && !!characterId,
    staleTime: 60 * 1000,
  });

  const characterData = isCustom ? customQuery.data : presetQuery.data;
  const isLoading = isCustom ? customQuery.isLoading : presetQuery.isLoading;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<CharacterStyle>("ANIME");
  const [voiceId, setVoiceId] = useState<VoiceId>("alloy");
  const [originalName, setOriginalName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalStyle, setOriginalStyle] = useState<CharacterStyle>("ANIME");
  const [originalVoiceId, setOriginalVoiceId] = useState<VoiceId>("alloy");
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useUpdateCustomCharacter();
  const createProjectMutation = useCreateProject();

  useEffect(() => {
    if (initialized || !characterData) return;
    const n = characterData.name ?? "";
    const d = characterData.description ?? "";
    const customData = isCustom ? (characterData as CustomCharacterItem) : null;
    const s = (customData?.style as CharacterStyle) ?? "ANIME";
    const v = (customData?.voice_id as VoiceId) ?? "alloy";
    setName(n);
    setOriginalName(n);
    setDescription(d);
    setOriginalDescription(d);
    setStyle(s);
    setOriginalStyle(s);
    setVoiceId(v);
    setOriginalVoiceId(v);
    setInitialized(true);
  }, [characterData, initialized, isCustom]);

  const isDirty =
    isCustom &&
    initialized &&
    (name !== originalName ||
      description !== originalDescription ||
      style !== originalStyle ||
      voiceId !== originalVoiceId);

  async function saveIfDirty() {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: characterId,
        payload: { name, description, style, voice_id: voiceId },
      });
    } catch {
      // silent — don't block close
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClose() {
    await saveIfDirty();
    onClose();
  }

  async function handleCreateVideo() {
    await saveIfDirty();

    const characterName = name || characterData?.name || "";

    try {
      const project = await createProjectMutation.mutateAsync({
        title: `${characterName} 프로젝트`,
        ...(isCustom
          ? { custom_character_id: characterId }
          : { character_id: characterId }),
      });

      clearProjectDraft();
      updateProjectDraft({
        characterId,
        characterImage: imageSrc,
        characterName,
        characterSource: isCustom ? "custom" : "preset",
        projectId: project.id,
        title: project.title,
      });

      router.push(`/project/create/idea?projectId=${encodeURIComponent(project.id)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다.",
      );
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === backdropRef.current) {
      void handleClose();
    }
  }

  const resolvedImageSrc =
    (characterData &&
      ("image_url_1" in characterData
        ? characterData.image_url_1 || characterData.image_url_2
        : (characterData as CharacterItem).thumbnail_url || (characterData as CharacterItem).image_url)) ||
    imageSrc;

  const isPending = isSaving || updateMutation.isPending || createProjectMutation.isPending;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4"
      onClick={handleBackdropClick}
    >
      <div className="flex w-full max-w-293 max-h-181 overflow-hidden rounded-[28px] border border-[#2f2f35] bg-[#1f1f24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-10 pb-10 pt-15 gap-10">
        {/* Left: Character Image */}
        <div className="relative h-156 w-105 shrink-0 rounded-2xl overflow-hidden">
          <Image
            alt={name || "캐릭터"}
            className="object-cover"
            fill
            sizes="420px"
            src={resolvedImageSrc || "/assets/placeholder.png"}
          />
        </div>

        {/* Right: Form */}
        <div className="flex flex-1 flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3c3c45] border-t-primary-500" />
            </div>
          ) : (
            <>
              {/* 캐릭터 이름 + 캐릭터 스타일 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 캐릭터 이름 */}
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-gray-100">캐릭터 이름</span>
                  <input
                    className="h-[46px] w-full rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4 text-[14px] font-medium text-[#d7d7dc] outline-none placeholder:text-[#6d6d76] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!isCustom || isPending}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="캐릭터 이름"
                    value={name}
                  />
                </label>

                {/* 캐릭터 스타일 */}
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-medium text-gray-100">캐릭터 스타일</span>
                  {isCustom ? (
                    <span className="relative flex h-[46px] items-center rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4">
                      <select
                        className="h-full w-full appearance-none bg-transparent pr-8 text-[14px] font-medium text-[#d7d7dc] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isPending}
                        onChange={(e) => setStyle(e.target.value as CharacterStyle)}
                        value={style}
                      >
                        {STYLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Icon className="pointer-events-none absolute right-3 size-4 text-[#b6b6be]" name="down" />
                    </span>
                  ) : (
                    <input
                      className="h-[46px] w-full rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4 text-[14px] font-medium text-[#d7d7dc] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      disabled
                      value="–"
                      readOnly
                    />
                  )}
                </label>
              </div>

              {/* 설명 */}
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-gray-100">설명</span>
                <textarea
                  className="h-[116px] w-full resize-none rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4 py-3 text-[13px] font-medium leading-[1.6] tracking-[-0.02em] text-[#b6b6be] outline-none placeholder:text-[#6d6d76] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!isCustom || isPending}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isCustom ? "캐릭터 특징이나 성격을 입력해주세요" : ""}
                  value={description}
                />
              </label>

              {/* 기본 설정 성우 */}
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-gray-100">기본 설정 성우</span>
                {isCustom ? (
                  <span className="relative flex h-[46px] items-center rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4">
                    <select
                      className="h-full w-full appearance-none bg-transparent pr-8 text-[14px] font-medium text-[#d7d7dc] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isPending}
                      onChange={(e) => setVoiceId(e.target.value as VoiceId)}
                      value={voiceId}
                    >
                      {VOICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <Icon className="pointer-events-none absolute right-3 size-4 text-[#b6b6be]" name="down" />
                  </span>
                ) : (
                  <input
                    className="h-[46px] w-full rounded-[8px] border border-[#2d2d34] bg-[#121214] px-4 text-[14px] font-medium text-[#d7d7dc] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    disabled
                    value="성우 TTS"
                    readOnly
                  />
                )}
              </label>

              {errorMessage ? (
                <p className="rounded-[10px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-4 py-3 text-[13px] text-[#ffb8bf]">
                  {errorMessage}
                </p>
              ) : null}

              {/* Buttons */}
              <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                <Button
                  disabled={isPending}
                  onClick={() => void handleClose()}
                  size="sm"
                  variant="outlined"
                >
                  닫기
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#c94eff] to-[#8b45ff]"
                  disabled={isPending}
                  onClick={() => void handleCreateVideo()}
                  size="sm"
                >
                  {createProjectMutation.isPending ? "생성 중..." : "이 캐릭터로 영상 만들기"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
