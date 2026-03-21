"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CharacterTabs } from "@/components/character/CharacterTabs";
import { CharacterCard } from "@/components/ui/CharacterCard";
import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";
import { useCharacters, useCustomCharacters, useDeleteCustomCharacter } from "@/hooks/useCharacters";
import { getProjectCardImageSrc } from "@/lib/project-card";

type CharacterTab = "all" | "default" | "mine";

type CharacterCardItem = {
  badgeLabel: "Basic" | "My";
  id: string;
  imageSrc: string;
  isCustom: boolean;
  title: string;
};

export function CharacterPage() {
  const [activeTab, setActiveTab] = useState<CharacterTab>("all");
  const router = useRouter();
  const presetCharactersQuery = useCharacters();
  const customCharactersQuery = useCustomCharacters();
  const deleteCustomCharacterMutation = useDeleteCustomCharacter();

  const presetCharacters = useMemo<CharacterCardItem[]>(
    () =>
      (presetCharactersQuery.data?.characters ?? []).map((character, index) => ({
        badgeLabel: "Basic",
        id: character.id,
        imageSrc: getProjectCardImageSrc(
          character.thumbnail_url || character.image_url || "",
          index
        ),
        isCustom: false,
        title: character.name,
      })),
    [presetCharactersQuery.data]
  );

  const customCharacters = useMemo<CharacterCardItem[]>(
    () =>
      (customCharactersQuery.data?.characters ?? []).map((character, index) => ({
        badgeLabel: "My",
        id: character.id,
        imageSrc: getProjectCardImageSrc(
          character.image_url_1 || character.image_url_2 || "",
          index
        ),
        isCustom: true,
        title: character.name,
      })),
    [customCharactersQuery.data]
  );

  const visibleCharacters = useMemo(() => {
    if (activeTab === "default") return presetCharacters;
    if (activeTab === "mine") return customCharacters;
    return [...customCharacters, ...presetCharacters];
  }, [activeTab, customCharacters, presetCharacters]);

  return (
    <div className="px-[34px] pb-[38px] pt-[24px]">
      <h1 className="text-heading-lg font-semibold tracking-[-0.03em] text-white">
        캐릭터
      </h1>

      <CharacterTabs onChange={setActiveTab} value={activeTab} />

      <section className="pt-[22px]">
        <div className="flex flex-wrap gap-3">
          <ProjectCreateCard
            label="새 캐릭터 생성"
            onClick={() => router.push("/character/create")}
          />
          {visibleCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              size="large"
              badgeLabel={character.badgeLabel}
              imageSrc={character.imageSrc}
              onDelete={
                character.isCustom
                  ? () => deleteCustomCharacterMutation.mutate(character.id)
                  : () => undefined
              }
              onEdit={() => undefined}
              title={character.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
