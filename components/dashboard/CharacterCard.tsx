import type { DashboardCharacter } from "@/lib/api/dashboard";
import { getProjectCardImageSrc } from "@/lib/project-card";

import { CharacterCard as SharedCharacterCard } from "@/components/ui/CharacterCard";

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
  const badgeLabel = resolveBadgeLabel(character.type);

  return (
    <SharedCharacterCard
      badgeLabel={badgeLabel}
      imageSrc={getProjectCardImageSrc(character.thumbnail_url || character.image_url, index)}
      title={character.name}
    />
  );
}
