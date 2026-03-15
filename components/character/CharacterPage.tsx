"use client";

import { useState } from "react";

import { CharacterTabs } from "@/components/character/CharacterTabs";

type CharacterTab = "all" | "default" | "mine";

export function CharacterPage() {
  const [activeTab, setActiveTab] = useState<CharacterTab>("all");

  return (
    <div className="px-[28px] pb-[38px] pt-[24px]">
      <h1 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
        캐릭터
      </h1>

      <CharacterTabs onChange={setActiveTab} value={activeTab} />
    </div>
  );
}
