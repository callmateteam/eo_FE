"use client";

import { useEffect, useRef, type RefObject } from "react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useAuth";
import { useYouTubeConnect, useYouTubeDisconnect } from "@/hooks/useYouTube";
import { socialAssets } from "@/lib/assets";
import { openYouTubeOAuthPopup } from "@/lib/youtubeOAuth";

type SidebarProfilePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

type SocialRowProps = {
  accountText: string;
  connected: boolean;
  iconSrc: string;
  label: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isPending?: boolean;
};

function SocialRow({
  accountText,
  connected,
  iconSrc,
  label,
  onConnect,
  onDisconnect,
  isPending,
}: SocialRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          alt=""
          aria-hidden
          className={["shrink-0", connected ? "" : "grayscale opacity-50"].join(" ")}
          height={24}
          src={iconSrc}
          width={24}
        />
        <div className="min-w-0">
          <p className={["text-[14px] leading-[1.2] font-medium", connected ? "text-white" : "text-gray-300"].join(" ")}>{label}</p>
          <p
            className={[
              "mt-1 text-[12px] leading-none",
              connected ? "text-[#c9c9d1]" : "text-gray-300",
            ].join(" ")}
          >
            {accountText}
          </p>
        </div>
      </div>

      <button
        className={[
          "inline-flex h-9 min-w-[58px] cursor-pointer items-center justify-center rounded-full px-4 text-[14px] leading-none font-medium disabled:cursor-not-allowed disabled:opacity-50",
          connected
            ? "border border-error-500 bg-transparent text-error-500"
            : "bg-[#3b3b43] text-[#c7c7cf]",
        ].join(" ")}
        disabled={isPending || (!onConnect && !onDisconnect)}
        onClick={connected ? onDisconnect : onConnect}
        type="button"
      >
        {connected ? "해제" : "연동"}
      </button>
    </div>
  );
}

export function SidebarProfilePanel({
  isOpen,
  onClose,
  triggerRef,
}: SidebarProfilePanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousPathnameRef = useRef(pathname);
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const youtubeConnect = useYouTubeConnect();
  const youtubeDisconnect = useYouTubeDisconnect();

  function handleYouTubeConnect() {
    openYouTubeOAuthPopup((code, redirectUri) => {
      youtubeConnect.mutate({ code, redirect_uri: redirectUri });
    });
  }

  function handleYouTubeDisconnect() {
    youtubeDisconnect.mutate();
  }

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && isOpen) {
      onClose();
    }

    previousPathnameRef.current = pathname;
  }, [isOpen, onClose, pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      if (!panelRef.current?.contains(target)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  const initials = user?.name?.trim().charAt(0) || "하";

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    router.replace("/login");
  }

  return (
    <div
      className="absolute bottom-0 left-[91px] z-20"
      ref={panelRef}
    >
      <div className="w-[228px] rounded-[28px] border border-[#3b3b43] bg-[#1f1f24] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.38)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#6d5cff_0%,#4132a1_100%)] text-[20px] leading-none font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 pt-[2px]">
            <p className="truncate text-heading-md font-semibold text-white">
              {user?.name ?? "이름"}
            </p>
            <p className="mt-[9px] truncate text-body-md text-gray-300">
              {user?.username ?? "아이디"}
            </p>
          </div>
        </div>

        <div className="mt-5 h-px bg-[#34343c]" />

        <section className="pt-5">
          <p className="text-[13px] leading-none text-[#b7b7be]">연동 정보</p>
          <div className="mt-5 flex flex-col gap-4">
            <SocialRow
              accountText={user?.social.youtube ? "내 계정" : "계정 정보 없음"}
              connected={Boolean(user?.social.youtube)}
              iconSrc={socialAssets.youtube}
              isPending={youtubeConnect.isPending || youtubeDisconnect.isPending}
              label="Youtube"
              onConnect={handleYouTubeConnect}
              onDisconnect={handleYouTubeDisconnect}
            />
            <SocialRow
              accountText={user?.social.tiktok ? "내 계정" : "계정 정보 없음"}
              connected={Boolean(user?.social.tiktok)}
              iconSrc={socialAssets.tiktok}
              label="Tiktok"
            />
            <SocialRow
              accountText={user?.social.instagram ? "내 계정" : "계정 정보 없음"}
              connected={Boolean(user?.social.instagram)}
              iconSrc={socialAssets.instagram}
              label="Instagram"
            />
          </div>
        </section>

        <div className="mt-5 h-px bg-[#34343c]" />

        <button
          className="mt-4 flex w-full cursor-pointer items-center gap-3 text-left text-body-md font-medium text-white disabled:cursor-not-allowed"
          disabled={logoutMutation.isPending}
          onClick={() => void handleLogout()}
          type="button"
        >
          <svg
            aria-hidden
            className="shrink-0 text-white"
            fill="none"
            height="22"
            viewBox="0 0 24 24"
            width="22"
          >
            <path
              d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="m13 16 4-4-4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M8 12h9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  );
}
