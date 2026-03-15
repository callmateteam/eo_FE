"use client";

import Image from "next/image";

import { NavigationRail } from "@/components/ui/NavigationRail";
import { commonAssets } from "@/lib/assets";

const navItems = [
  { icon: "plus" as const, isActive: false, label: "새 프로젝트" },
  { icon: "dashboard" as const, isActive: true, label: "대시보드" },
  { icon: "video" as const, isActive: false, label: "프로젝트" },
  { icon: "avatar" as const, isActive: false, label: "캐릭터" },
];

export function DashboardSidebar() {
  return (
    <aside className="flex min-h-screen w-[79px] shrink-0 flex-col items-center bg-[#1e1e24] pt-[13px] pb-[20px]">
      <div className="mb-[26px] flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
        <Image
          alt="EO"
          height={40}
          priority
          src={commonAssets.logoMark}
          width={40}
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-[20px] pt-[2px]">
        {navItems.map((item) => (
          <NavigationRail
            key={item.label}
            aria-label={item.label}
            icon={item.icon}
            label={item.label}
            state={item.isActive ? "clicked" : "default"}
          />
        ))}
      </div>

      <button
        aria-label="내 정보"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#6d5cff_0%,#4132a1_100%)] text-[24px] leading-none font-semibold text-white"
        type="button"
      >
        하
      </button>
    </aside>
  );
}
