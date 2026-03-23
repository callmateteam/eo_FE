"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/utils";
import { landingAssets } from "@/lib/assets";

type CharacterCard = {
  image: string;
  alt: string;
};

type StoryboardCard = {
  description: string;
  id: string;
  image: string;
};

const steps = [
  "나만의 캐릭터 생성",
  "AI 스토리보드",
  "씬별 영상 생성",
] as const;

const characterCards: CharacterCard[] = [
  {
    image: landingAssets.cards.characterGeneration1,
    alt: "나만의 캐릭터 생성 1",
  },
  {
    image: landingAssets.cards.characterGeneration2,
    alt: "나만의 캐릭터 생성 2",
  },
  {
    image: landingAssets.cards.characterGeneration3,
    alt: "나만의 캐릭터 생성 3",
  },
];

const storyboardCards: StoryboardCard[] = [
  {
    id: "#1",
    image: landingAssets.cards.aiStoryboard1,
    description:
      "캐릭터가 비장한 표정으로 주방에 서 있는 바스트 샷. 오늘의 요리를 소개하는 오프닝.",
  },
  {
    id: "#2",
    image: landingAssets.cards.aiStoryboard2,
    description:
      "프라이팬 위에서 식재료들이 공중으로 솟아오르며 볶아지는 장면을 빠르게 구성.",
  },
  {
    id: "#3",
    image: landingAssets.cards.aiStoryboard3,
    description:
      "소스를 뿌리는 손동작을 강조하고, 슬로우 모션처럼 떨어지는 디테일을 잡아냅니다.",
  },
];

function FeatureDot({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "relative size-[57px] shrink-0 rounded-full",
        active
          ? "bg-[radial-gradient(circle,rgba(186,78,255,0.92)_0%,rgba(186,78,255,0.42)_34%,rgba(186,78,255,0.14)_62%,rgba(18,18,20,0)_90%)]"
          : "bg-[radial-gradient(circle,rgba(142,142,147,0.45)_0%,rgba(142,142,147,0.16)_42%,rgba(18,18,20,0)_84%)]"
      )}
    >
      <span
        className={cn(
          "absolute left-1/2 top-1/2 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full",
          active
            ? "bg-primary-500 shadow-[0_0_14px_rgba(186,78,255,0.72)]"
            : "bg-[rgba(142,142,147,0.28)]"
        )}
      />
    </div>
  );
}

function CharacterSlide() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-0.5">
      <div className="h-[420px] w-full overflow-hidden">
        <div className="flex items-start justify-center gap-[14px] px-10 pt-[41px]">
          {characterCards.map((card, index) => (
            <div
              key={card.image}
              className={cn(
                "relative h-[261px] w-[210px] overflow-hidden rounded-[20px] bg-gray-700 shadow-[0_8px_24px_rgba(0,0,0,0.22)]",
                index === 1 ? "mt-[76px]" : "mt-0"
              )}
            >
              <Image
                alt={card.alt}
                className="absolute inset-0 h-full w-full object-cover"
                height={261}
                src={card.image}
                width={210}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-[435px] flex-col items-center gap-4 text-center text-white">
        <h3 className="text-heading-xl m-0">나만의 캐릭터 생성</h3>
        <p className="text-heading-md m-0 text-gray-50">
          원하는 캐릭터를 스타일화하거나 나만의 AI 캐릭터를 생성해요. 일관된
          스타일의 캐릭터가 영상 전체에 등장합니다.
        </p>
      </div>
    </div>
  );
}

function StoryboardSlide() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-0.5">
      <div className="relative h-[420px] w-full overflow-hidden">
        <div className="absolute left-0 top-[41px] flex gap-3">
          {storyboardCards.map((card) => (
            <article
              key={card.id}
              className="relative h-[315px] w-[253px] overflow-hidden rounded-[20px] border border-gray-700 bg-gray-700"
            >
              <Image
                alt={`${card.id} 스토리보드 이미지`}
                className="absolute inset-0 h-full w-full object-cover"
                height={315}
                src={card.image}
                width={253}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.2)_58%,rgba(44,44,49,0.94)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 rounded-b-[20px] bg-gray-700/95 px-[13px] pb-[16px] pt-[14px]">
                <p className="m-0 text-[18px] leading-8 font-medium text-gray-50">{card.id}</p>
                <p className="m-0 line-clamp-2 text-[15px] leading-[27px] text-gray-300">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex w-[435px] flex-col items-center gap-4 text-center text-white">
        <h3 className="text-heading-xl m-0">AI 스토리보드</h3>
        <p className="text-heading-md m-0 text-gray-50">
          아이디어 기획 2-3줄만 입력하면 AI가 자동으로 씬을 분석하고 시각적
          스토리보드를 생성합니다.
        </p>
      </div>
    </div>
  );
}

function SceneSlide() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-0.5">
      <div className="flex h-[420px] w-full items-center justify-center">
        <div className="relative h-[409px] w-[230px] overflow-hidden rounded-[12px] border border-gray-700 bg-gray-700">
          <div className="absolute inset-0 bg-gray-700" />
          <div className="absolute inset-x-0 top-[47px] text-center">
            <p className="text-body-lg m-0 text-white">이제 이미지만 넣으면</p>
            <p className="text-body-lg m-0 text-[#8f7ffc]">
              AI가 쇼츠도 만들어준다?
            </p>
          </div>
          <div className="absolute left-1/2 top-[139px] h-[161px] w-full -translate-x-1/2 overflow-hidden">
            <Image
              alt="씬별 영상 생성 미리보기"
              className="h-full w-full object-cover"
              height={161}
              src={landingAssets.cards.sceneGeneration}
              width={230}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.18)_100%)]" />
          </div>
          <div className="absolute left-1/2 top-[219px] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(18,18,20,0.7)]">
            <Icon className="size-9 text-gray-50" name="play-line" />
          </div>
        </div>
      </div>

      <div className="flex w-[435px] flex-col items-center gap-4 text-center text-white">
        <h3 className="text-heading-xl m-0">씬별 영상 생성</h3>
        <p className="text-heading-md m-0 text-gray-50">
          각 씬마다 개별적으로 영상을 생성하고 수정할 수 있습니다.
          <br />
          원하는 결과물이 나올 때까지 반복 조정하세요.
        </p>
      </div>
    </div>
  );
}

export function LandingFeatureShowcase() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const SCROLL_PER_SLIDE = window.innerHeight * 0.5;

    function handleScroll() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrollWithin = window.scrollY - wrapper.offsetTop;
      const index = Math.floor(scrollWithin / SCROLL_PER_SLIDE);
      setActiveIndex(Math.max(0, Math.min(steps.length - 1, index)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: `${steps.length * 50 + 100}vh` }}>
      <section className="isolate sticky top-0 h-screen overflow-hidden bg-gray-900">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-10 pb-16 pt-20 md:px-[77px]">
          <div className="mx-auto flex w-full max-w-[829px] flex-col items-center gap-3 text-center">
            <h2 className="text-display-md m-0 text-white max-md:text-[38px] max-md:leading-[1.25]">
              <span>AI가 만드는 </span>
              <span className="bg-[linear-gradient(90deg,#6754f9_0%,#ba4eff_100%)] bg-clip-text text-transparent">
                새로운 영상 제작
              </span>
            </h2>
            <p className="text-heading-xl m-0 text-white max-md:text-[22px] max-md:leading-[1.5]">
              복잡한 영상 편집 없이, AI와 함께 빠르고 트렌디한 영상을 제작하세요
            </p>
          </div>

          <div className="mt-16 grid flex-1 min-h-0 grid-cols-[200px_minmax(0,1fr)] items-start gap-[68px] lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="relative flex h-full flex-col justify-between py-[8vh] lg:py-[120px]">
              <div className="absolute left-[27px] top-[10%] bottom-[10%] w-[3px] bg-[linear-gradient(180deg,rgba(44,44,49,0.6)_0%,rgba(142,142,147,1)_50%,rgba(44,44,49,0.6)_100%)]" />
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-6">
                  <FeatureDot active={activeIndex === index} />
                  <p
                    className={cn(
                      "text-heading-lg m-0 font-medium",
                      activeIndex === index ? "text-gray-50" : "text-gray-300"
                    )}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex min-h-0 items-start justify-center pt-[5vh] lg:pt-[clamp(40px,15vh,164px)]">
              <div className="w-full max-w-[743px] overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{
                    width: `${steps.length * 100}%`,
                    transform: `translateX(-${activeIndex * (100 / steps.length)}%)`,
                  }}
                >
                  <div className="shrink-0" style={{ width: `${100 / steps.length}%` }}>
                    <CharacterSlide />
                  </div>
                  <div className="shrink-0" style={{ width: `${100 / steps.length}%` }}>
                    <StoryboardSlide />
                  </div>
                  <div className="shrink-0" style={{ width: `${100 / steps.length}%` }}>
                    <SceneSlide />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
