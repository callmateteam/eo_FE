"use client";

import { useRef, useState } from "react";

import { CharacterCard } from "@/components/dashboard/CharacterCard";
import { CharacterCreateCard } from "@/components/dashboard/CharacterCreateCard";
import { CharacterEditModal } from "@/components/character/CharacterEditModal";
import { Icon } from "@/components/ui/Icon";
import { useDeleteCustomCharacter } from "@/hooks/useCharacters";

type DashboardCharacter = {
  id: string;
  name: string;
  type?: string;
  thumbnail_url?: string;
  image_url?: string;
};

type CharacterCarouselProps = {
  characters: DashboardCharacter[];
};

type EditTarget = {
  id: string;
  isCustom: boolean;
  imageSrc: string;
};

export function CharacterCarousel({ characters }: CharacterCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const deleteCustomCharacterMutation = useDeleteCustomCharacter();
  const hasCharacters = characters.length > 0;

  function scrollByOffset(direction: "left" | "right") {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -320 : 320,
    });
  }

  return (
    <>
    {editTarget && (
      <CharacterEditModal
        characterId={editTarget.id}
        imageSrc={editTarget.imageSrc}
        isCustom={editTarget.isCustom}
        onClose={() => setEditTarget(null)}
      />
    )}
    <div className="relative">
      {hasCharacters ? (
        <>
          <button
            aria-label="이전 캐릭터"
            className="absolute left-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
            onClick={() => scrollByOffset("left")}
            type="button"
          >
            <Icon className="size-4" name="left" />
          </button>
          <button
            aria-label="다음 캐릭터"
            className="absolute right-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
            onClick={() => scrollByOffset("right")}
            type="button"
          >
            <Icon className="size-4" name="right" />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className={[
          "flex snap-x snap-mandatory gap-[10px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          hasCharacters ? "pr-10" : "",
        ].join(" ")}
      >
        <div className="snap-start">
          <CharacterCreateCard />
        </div>
        {characters.map((character, index) => {
          const isCustom = character.type?.toLowerCase() !== "preset";
          const imageSrc = character.thumbnail_url || character.image_url || "";
          return (
            <div key={character.id} className="snap-start">
              <CharacterCard
                character={character}
                index={index}
                onDelete={isCustom ? () => deleteCustomCharacterMutation.mutate(character.id) : undefined}
                onEdit={() =>
                  setEditTarget({ id: character.id, isCustom, imageSrc })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
