"use client";

import { useRouter } from "next/navigation";

import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";

export function CharacterCreateCard() {
  const router = useRouter();

  return (
    <ProjectCreateCard
      label="새 캐릭터 생성"
      onClick={() => router.push("/character")}
      size="default"
    />
  );
}
