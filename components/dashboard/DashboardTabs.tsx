"use client";

type DashboardTab = "projects" | "characters";

type DashboardTabsProps = {
  onChange: (tab: DashboardTab) => void;
  value: DashboardTab;
};

export function DashboardTabs({ onChange, value }: DashboardTabsProps) {
  return (
    <div className="flex items-center gap-[18px]">
      <button
        className={[
          "text-heading-md cursor-pointer rounded-full px-[13px] py-[7px] transition-colors",
          value === "projects" ? "bg-[#3c3c45] text-white" : "bg-transparent text-[#8f8f98]",
        ].join(" ")}
        onClick={() => onChange("projects")}
        type="button"
      >
        최근 프로젝트
      </button>
      <button
        className={[
          "text-heading-md cursor-pointer rounded-full px-[13px] py-[7px] transition-colors",
          value === "characters"
            ? "bg-[#3c3c45] text-white"
            : "bg-transparent text-[#8f8f98]",
        ].join(" ")}
        onClick={() => onChange("characters")}
        type="button"
      >
        최근 캐릭터
      </button>
    </div>
  );
}
