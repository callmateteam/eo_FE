"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCharacters, useCustomCharacters } from "@/hooks/useCharacters";
import { useCreateProject } from "@/hooks/useProjects";
import {
  clearProjectDraft,
  getProjectDraft,
  setProjectDraft,
  type DraftCharacterSource,
} from "@/lib/project-draft";

import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type CharacterOption = {
  badgeLabels: string[];
  id: string;
  imageUrl: string;
  name: string;
  source: DraftCharacterSource;
};

function CharacterSelectionCard({
  character,
  isSelected,
  onSelect,
}: {
  character: CharacterOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`relative cursor-pointer overflow-hidden rounded-[20px] border bg-[#2a2a31] text-left transition-all ${
        isSelected
          ? "border-[#b347ff] shadow-[0_0_0_1px_rgba(179,71,255,0.24)]"
          : "border-[#60606e]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="relative h-[204px] overflow-hidden bg-[#1b1b20]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={character.name}
          className="h-full w-full object-cover"
          src={character.imageUrl}
        />
      </div>

      <div className="pointer-events-none absolute right-[10px] top-[10px] flex items-center gap-[6px]">
        {character.badgeLabels.map((label) => (
          <Badge
            key={`${character.id}-${label}`}
            className={`px-[9px] py-[6px] text-[10px] font-semibold leading-none ${
              label === "HOT" ? "bg-[#222228] text-[#ff9e4f]" : ""
            }`}
            color={label === "My" ? "blue" : label === "HOT" ? "gray" : "pink"}
            text={label === "HOT" ? "🔥HOT" : label}
          />
        ))}
      </div>

      <div className="flex items-center rounded-b-[20px] bg-[#2a2a31] px-[10px] py-[12px]">
        <span className="truncate text-[13px] font-semibold text-white">
          {character.name}
        </span>
      </div>
    </button>
  );
}

export function ProjectCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialDraft = getProjectDraft();
  const presetCharactersQuery = useCharacters();
  const customCharactersQuery = useCustomCharacters();
  const createProjectMutation = useCreateProject();
  const [selectedCharacterKey, setSelectedCharacterKey] = useState<string | null>(
    initialDraft?.characterId && initialDraft.characterSource
      ? `${initialDraft.characterSource}:${initialDraft.characterId}`
      : null
  );
  const [createError, setCreateError] = useState<string | null>(null);

  const characters = useMemo<CharacterOption[]>(() => {
    const presetCharacters =
      presetCharactersQuery.data?.characters.map((character, index) => ({
        badgeLabels: index < 2 ? ["HOT", "Basic"] : ["Basic"],
        id: character.id,
        imageUrl:
          character.thumbnail_url || character.image_url || "/assets/common/logo-mark.png",
        name: character.name,
        source: "preset" as const,
      })) ?? [];

    const customCharacters =
      customCharactersQuery.data?.characters.map((character) => ({
        badgeLabels: ["My"],
        id: character.id,
        imageUrl:
          character.image_url_1 ||
          character.image_url_2 ||
          "/assets/common/logo-mark.png",
        name: character.name,
        source: "custom" as const,
      })) ?? [];

    return [...customCharacters, ...presetCharacters];
  }, [customCharactersQuery.data?.characters, presetCharactersQuery.data?.characters]);

  const selectedCharacter =
    characters.find(
      (character) => `${character.source}:${character.id}` === selectedCharacterKey
    ) ?? null;

  async function handleCreateProject() {
    if (!selectedCharacter) {
      setCreateError("캐릭터를 먼저 선택해주세요.");
      return;
    }

    setCreateError(null);

    try {
      const project = await createProjectMutation.mutateAsync({
        character_id:
          selectedCharacter.source === "preset" ? selectedCharacter.id : null,
        custom_character_id:
          selectedCharacter.source === "custom" ? selectedCharacter.id : null,
        title: "프로젝트명",
      });

      clearProjectDraft();
      setProjectDraft({
        characterId: selectedCharacter.id,
        characterImage: selectedCharacter.imageUrl,
        characterName: selectedCharacter.name,
        characterSource: selectedCharacter.source,
        projectId: project.id,
        title: project.title,
      });
      router.push(`/project/create/idea?projectId=${encodeURIComponent(project.id)}`);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다."
      );
    }
  }

  return (
    <ProjectCreateShell
      currentStep={0}
      description="영상을 만들 캐릭터를 선택해주세요"
      projectTitle="프로젝트명"
      title="캐릭터 설정"
      actions={
        <Button
          size="tiny"
          disabled={!selectedCharacter || createProjectMutation.isPending}
          onClick={() => void handleCreateProject()}
        >
          캐릭터 선택
        </Button>
      }
    >
      {createError ? (
        <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
          {createError}
        </p>
      ) : null}

      {presetCharactersQuery.isLoading || customCharactersQuery.isLoading ? (
        <div className="flex min-h-[340px] items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7d7dc]">
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span className="text-[14px] font-medium">캐릭터 목록을 불러오는 중입니다.</span>
          </div>
        </div>
      ) : null}

      {!presetCharactersQuery.isLoading && !customCharactersQuery.isLoading ? (
        <section className="mx-auto w-full max-w-[1162px]">
          <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {characters.map((character) => (
              <CharacterSelectionCard
                key={`${character.source}-${character.id}`}
                character={character}
                isSelected={
                  selectedCharacterKey === `${character.source}:${character.id}`
                }
                onSelect={() =>
                  setSelectedCharacterKey(`${character.source}:${character.id}`)
                }
              />
            ))}
          </div>
        </section>
      ) : null}
    </ProjectCreateShell>
  );
}
