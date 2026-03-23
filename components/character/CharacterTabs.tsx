"use client";

type CharacterTab = "all" | "default" | "mine";

type CharacterTabsProps = {
  onChange: (tab: CharacterTab) => void;
  value: CharacterTab;
};

const tabs: Array<{ label: string; value: CharacterTab }> = [
  { label: "전체", value: "all" },
  { label: "기본 캐릭터", value: "default" },
  { label: "내 캐릭터", value: "mine" },
];

export function CharacterTabs({ onChange, value }: CharacterTabsProps) {
  return (
    <div className="flex items-center gap-[10px] pt-[18px]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={[
            "text-heading-md cursor-pointer rounded-full px-[13px] py-[7px] transition-colors",
            value === tab.value
              ? "bg-[#3c3c45] text-white"
              : "bg-transparent text-[#8f8f98]",
          ].join(" ")}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
