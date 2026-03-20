import { getProjectCardImageSrc } from "@/lib/project-card";

import { CharacterCard as SharedCharacterCard } from "@/components/ui/CharacterCard";

type DashboardCharacter = {
  id: string;
  name: string;
  type?: string;
  thumbnail_url?: string;
  image_url?: string;
};

type CharacterCardProps = {
  character: DashboardCharacter;
  index: number;
  onDelete?: () => void;
  onEdit?: () => void;
};

function resolveBadgeLabel(type?: string) {
  if (!type) {
    return null;
  }

  const normalizedType = type.toLowerCase();

  if (normalizedType === "basic" || normalizedType === "preset") {
    return "Basic";
  }

  return "My";
}

export function CharacterCard({ character, index, onDelete, onEdit }: CharacterCardProps) {
  const badgeLabel = resolveBadgeLabel(character.type);

  return (
    <SharedCharacterCard
      badgeLabel={badgeLabel}
      imageSrc={getProjectCardImageSrc(character.thumbnail_url || character.image_url || "", index)}
      onDelete={onDelete}
      onEdit={onEdit}
      size="large"
      title={character.name}
    />
  );
}
