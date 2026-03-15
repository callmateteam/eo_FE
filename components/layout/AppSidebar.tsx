"use client";

import { useCallback, useRef, useState } from "react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { Navi } from "@/components/ui/Navi";
import { cn } from "@/components/ui/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { commonAssets } from "@/lib/assets";

import { SidebarProfilePanel } from "./SidebarProfilePanel";

type NavItem = {
  href?: string;
  icon: "plus" | "dashboard" | "video" | "avatar";
  label: string;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    icon: "plus",
    label: "새 프로젝트",
    match: () => false,
  },
  {
    href: "/dashboard",
    icon: "dashboard",
    label: "대시보드",
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
  {
    href: "/project",
    icon: "video",
    label: "프로젝트",
    match: (pathname) => pathname.startsWith("/project"),
  },
  {
    href: "/character",
    icon: "avatar",
    label: "캐릭터",
    match: (pathname) => pathname.startsWith("/character"),
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const profileLabel = user?.name?.trim().charAt(0) || "하";

  return (
    <aside className="relative flex min-h-screen w-[79px] shrink-0 flex-col items-center bg-[#1e1e24] pb-[20px] pt-[13px]">
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
        {navItems.map((item) => {
          const isActive = item.match(pathname);

          if (!item.href) {
            return (
              <div
                key={item.label}
                className="inline-flex w-[49px] flex-col items-center gap-2"
              >
                <Navi aria-label={item.label} icon={item.icon} />
                <span className="text-caption-md min-w-full text-center text-gray-50">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <div
              key={item.label}
              className="inline-flex w-[49px] flex-col items-center gap-2"
            >
              <Navi
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                icon={item.icon}
                onClick={() => {
                  closeProfile();
                  router.push(item.href);
                }}
                state={isActive ? "clicked" : "default"}
              />
              <span
                className={cn(
                  "text-caption-md min-w-full text-center",
                  isActive ? "text-primary-500" : "text-gray-50"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <button
        aria-expanded={isProfileOpen}
        aria-label="내 정보"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#6d5cff_0%,#4132a1_100%)] text-[24px] leading-none font-semibold text-white"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        ref={profileButtonRef}
        type="button"
      >
        {profileLabel}
      </button>

      <SidebarProfilePanel
        isOpen={isProfileOpen}
        onClose={closeProfile}
        triggerRef={profileButtonRef}
      />
    </aside>
  );
}
