/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";

import Image from "next/image";

import { socialAssets } from "@/lib/assets";

type CharacterVideoSaveStepProps = {
  duration: string;
  onTitleChange: (value: string) => void;
  previewImageSrc: string;
  title: string;
};

const socialItems = [
  { alt: "유튜브", src: socialAssets.youtube },
  { alt: "틱톡", src: socialAssets.tiktok },
  { alt: "인스타그램", src: socialAssets.instagram },
] as const;

export function CharacterVideoSaveStep({
  duration,
  onTitleChange,
  previewImageSrc,
  title,
}: CharacterVideoSaveStepProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1048px] grid-cols-1 gap-[30px] xl:grid-cols-[350px_minmax(0,1fr)]">
      <section className="flex justify-center">
        <div className="relative h-[558px] w-[318px] overflow-hidden rounded-[22px] border border-[#5c5c64] bg-white">
          <img
            alt="완성된 영상"
            className="h-full w-full object-cover"
            src={previewImageSrc}
          />
          <div className="absolute bottom-[22px] left-1/2 w-[258px] -translate-x-1/2 rounded-[8px] bg-[rgba(23,23,29,0.95)] px-[14px] py-[9px] text-center text-[14px] font-semibold text-white">
            자막 나오는 공간
          </div>
          <div className="absolute bottom-0 left-0 h-[6px] w-[78px] rounded-tr-full bg-[#ba4eff]" />
        </div>
      </section>

      <section className="rounded-[28px] border border-[#5f5f67] bg-[#202026] px-[22px] py-[26px]">
        <FieldBlock label="제목">
          <input
            className="h-[46px] w-full rounded-[8px] border border-[#2f2f36] bg-[#121214] px-[16px] text-[15px] font-medium text-[#e5e5ea] outline-none placeholder:text-[#6f6f78]"
            onChange={(event) => onTitleChange(event.target.value)}
            value={title}
          />
        </FieldBlock>

        <FieldBlock className="pt-[28px]" label="영상 시간">
          <div className="flex h-[46px] items-center rounded-[8px] border border-[#2f2f36] bg-[#24242a] px-[16px] text-[15px] font-medium text-[#8e8e93]">
            {duration}
          </div>
        </FieldBlock>

        <FieldBlock className="pt-[28px]" label="영상 다운로드">
          <button
            className="h-[46px] min-w-[106px] rounded-full bg-[linear-gradient(90deg,#8b45ff_0%,#ba4eff_100%)] px-[24px] text-[14px] font-semibold text-white shadow-[0_0_18px_rgba(186,78,255,0.28)] transition-opacity hover:opacity-90"
            type="button"
          >
            다운로드
          </button>
        </FieldBlock>

        <FieldBlock className="pt-[28px]" label="연동된 SNS에 업로드">
          <div className="flex items-center gap-[12px]">
            {socialItems.map((item) => (
              <button
                key={item.alt}
                className="flex size-[36px] items-center justify-center rounded-full border border-[#5b5b63] bg-[#1f1f24]"
                type="button"
              >
                <Image alt={item.alt} height={18} src={item.src} width={18} />
              </button>
            ))}
          </div>
        </FieldBlock>
      </section>
    </div>
  );
}

function FieldBlock({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div className={className}>
      <p className="pb-[12px] text-[14px] font-semibold tracking-[-0.02em] text-[#d7d7dc]">
        {label}
      </p>
      {children}
    </div>
  );
}
