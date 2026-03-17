/* eslint-disable @next/next/no-img-element */

import { Icon } from "@/components/ui/Icon";

type VideoClip = {
  id: string;
  imageSrc: string;
  script: string;
  title: string;
};

type CharacterVideoEditStepProps = {
  clips: VideoClip[];
  onBack: () => void;
  onComplete: () => void;
  onSelectClip: (clipId: string) => void;
  selectedClipId: string;
};

export function CharacterVideoEditStep({
  clips,
  onBack,
  onComplete,
  onSelectClip,
  selectedClipId,
}: CharacterVideoEditStepProps) {
  const selectedClip = clips.find((clip) => clip.id === selectedClipId) ?? clips[0];

  return (
    <div className="mx-auto w-full max-w-[1162px]">
      <div className="rounded-[28px] bg-[#111115] px-[6px] pb-[30px]">
        <div className="flex justify-center">
          <div className="relative h-[406px] w-[228px] overflow-hidden rounded-[16px] border border-[#4f4f58] bg-white">
            <img
              alt={selectedClip?.title ?? "영상 프레임"}
              className="h-full w-full object-cover"
              src={selectedClip?.imageSrc}
            />
            <div className="absolute bottom-[18px] left-1/2 w-[164px] -translate-x-1/2 rounded-[6px] bg-[rgba(22,22,28,0.94)] px-[12px] py-[7px] text-center text-[12px] font-semibold text-white">
              script
            </div>
          </div>
        </div>

        <section className="mt-[38px] rounded-[24px] border border-[#25252c] bg-[#121216] px-[18px] py-[14px]">
          <div className="flex items-center justify-between border-b border-[#26262d] pb-[14px]">
            <div className="flex items-center gap-[16px] text-[#d8d8df]">
              <button className="text-white" type="button">
                <Icon className="size-4" name="play" />
              </button>
              <span className="text-[12px] font-medium">00:18</span>
              <span className="text-[12px] font-medium text-[#7c7c86]">/ 01:38</span>
              <span className="rounded-full border border-[#3f3f46] px-[8px] py-[2px] text-[11px] font-semibold text-[#a5a5ad]">
                1x
              </span>
              <button className="text-[#b1b1b9]" type="button">
                <Icon className="size-4" name="sound" />
              </button>
            </div>

            <div className="flex items-center gap-[14px] text-[#e5e5ea]">
              <button type="button">
                <Icon className="size-4" name="reset" />
              </button>
              <button type="button">
                <Icon className="size-4" name="redo" />
              </button>
              <div className="ml-[10px] flex items-center gap-[10px]">
                <button className="text-[20px]" type="button">
                  -
                </button>
                <div className="h-[2px] w-[68px] rounded-full bg-[#46464f]">
                  <div className="h-full w-[28px] rounded-full bg-[#c6c6cd]" />
                </div>
                <button className="text-[20px]" type="button">
                  +
                </button>
              </div>
              <button className="text-[18px]" type="button">
                □
              </button>
            </div>
          </div>

          <div className="mt-[16px] overflow-x-auto pb-[6px]">
            <div className="flex min-w-max gap-[12px]">
              {clips.map((clip) => {
                const isSelected = clip.id === selectedClip?.id;

                return (
                  <button
                    key={clip.id}
                    className="w-[112px] text-left"
                    onClick={() => onSelectClip(clip.id)}
                    type="button"
                  >
                    <div
                      className={`overflow-hidden rounded-[12px] border ${
                        isSelected ? "border-[#b347ff]" : "border-[#3d3d44]"
                      }`}
                    >
                      <div className="h-[74px] bg-white">
                        <img
                          alt={clip.title}
                          className="h-full w-full object-cover"
                          src={clip.imageSrc}
                        />
                      </div>
                    </div>
                    <p className="pt-[8px] text-[13px] font-semibold text-white">
                      {clip.title}
                    </p>
                    <div
                      className={`mt-[6px] rounded-[10px] px-[10px] py-[8px] text-[12px] leading-[1.4] ${
                        isSelected
                          ? "border border-[#9d4bff] text-white"
                          : "bg-[#35353d] text-[#c0c0c8]"
                      }`}
                    >
                      {clip.script}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-[12px] pt-[20px]">
        <button
          className="h-[48px] min-w-[108px] rounded-full border border-[#8b45ff] px-[24px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          onClick={onBack}
          type="button"
        >
          취소
        </button>
        <button
          className="h-[48px] min-w-[124px] rounded-full bg-[linear-gradient(90deg,#8b45ff_0%,#ba4eff_100%)] px-[24px] text-[14px] font-semibold text-white shadow-[0_0_18px_rgba(186,78,255,0.28)] transition-opacity hover:opacity-90"
          onClick={onComplete}
          type="button"
        >
          편집 완료
        </button>
      </div>
    </div>
  );
}
