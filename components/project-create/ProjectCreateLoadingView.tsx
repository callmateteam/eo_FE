/* eslint-disable @next/next/no-img-element */

"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";

type ProjectCreateLoadingViewProps = {
  imageUrl?: string | null;
  progress: number;
  stepMessage?: string;
};

export function ProjectCreateLoadingView({
  imageUrl,
  progress,
  stepMessage = "캐릭터를 생성하는 중입니다",
}: ProjectCreateLoadingViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-[572px] flex-col rounded-[24px] bg-[#1f1f24] px-[32px] py-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
      <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-[22px] bg-[#2f2f35]">
        {imageUrl ? (
          <img
            alt="생성 중인 캐릭터 미리보기"
            className="h-full w-full object-cover"
            src={imageUrl}
          />
        ) : (
          <div className="flex size-[96px] items-center justify-center rounded-full border border-[#3c3c45] bg-[#25252b] text-[#131316]">
            <Icon className="size-[58px]" name="avatar" />
          </div>
        )}
      </div>

      <div className="pt-[20px] text-center">
        <p className="text-heading-md text-white">{stepMessage}</p>
      </div>

      <div className="pt-[26px]">
        <div className="h-[8px] overflow-hidden rounded-full bg-[#303038]">
          <div
            aria-hidden
            className={cn(
              "h-full rounded-full bg-[linear-gradient(90deg,#7d5cff_0%,#ba4eff_100%)] transition-[width] duration-500 ease-out"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-body-lg pt-[10px] text-center text-[#d7d7dc]">
          {progress}%
        </p>
      </div>
    </div>
  );
}
