import Image from "next/image";

import type { DashboardCharacter } from "@/lib/api/dashboard";

const placeholderImages = [
  "/assets/landing/cards/character-generation-1.png",
  "/assets/landing/cards/character-generation-2.png",
  "/assets/landing/cards/character-generation-3.png",
  "/assets/landing/cards/storyboard-cover-1.png",
];

type CharacterCardProps = {
  character: DashboardCharacter;
  index: number;
};

function resolveBadgeLabel(type?: string) {
  if (!type) {
    return null;
  }

  const normalizedType = type.toLowerCase();

  if (normalizedType === "basic") {
    return "Basic";
  }

  return "My";
}

export function CharacterCard({ character, index }: CharacterCardProps) {
  const imageSrc =
    character.thumbnail_url ||
    character.image_url ||
    placeholderImages[index % placeholderImages.length] ||
    "/assets/landing/cards/scene-generation.png";
  const badgeLabel = resolveBadgeLabel(character.type);

  return (
    <article className="relative h-[184px] w-[146px] shrink-0 overflow-hidden rounded-[16px] bg-[#292930]">
      <div className="absolute inset-0">
        <Image
          alt={character.name}
          className="h-full w-full object-cover"
          fill
          sizes="146px"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.04)_0%,rgba(8,8,10,0.18)_48%,rgba(20,20,23,0.88)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-[10px]">
        <div className="flex justify-end">
          {badgeLabel ? (
            <span className="rounded-full bg-[#6656ff] px-[8px] py-[5px] text-[9px] font-semibold leading-none tracking-[-0.02em] text-white">
              {badgeLabel}
            </span>
          ) : null}
        </div>

        <div className="space-y-[3px]">
          <h3 className="truncate text-[12px] font-semibold leading-none tracking-[-0.02em] text-white">
            {character.name}
          </h3>
        </div>
      </div>
    </article>
  );
}
