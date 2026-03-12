import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const featureCards = [
  {
    alt: "농구 유니폼을 입은 캐릭터 이미지",
    className: "self-start",
    src: "/landing/card-1.png",
  },
  {
    alt: "만화 콘티 이미지",
    className: "mt-[clamp(36px,4.2vw,76px)] self-end",
    src: "/landing/card-2.png",
  },
  {
    alt: "안경을 쓴 캐릭터 이미지",
    className: "self-start",
    src: "/landing/card-3.png",
  },
];

const timelineItems = [
  { active: true, label: "나만의 캐릭터 생성" },
  { active: false, label: "AI 스토리보드" },
  { active: false, label: "씬별 영상 생성" },
];

function LandingButton({
  children,
  className,
  outlined = false,
}: {
  children: React.ReactNode;
  className?: string;
  outlined?: boolean;
}) {
  return (
    <Button
      className={[
        "min-w-0 rounded-full px-4 shadow-[0_1px_8px_4px_rgba(186,78,255,0.13)]",
        outlined
          ? "h-12 border border-primary-500 bg-gray-800 text-sm leading-3.5 font-semibold tracking-[0.01em] text-text-inverse"
          : "h-13 bg-primary-500 text-base leading-7 font-medium text-text-inverse",
        className,
      ].join(" ")}
      iconAfter={undefined}
      iconBefore={undefined}
      size={outlined ? "sm" : "md"}
      variant={outlined ? "outlined" : "filled"}
    >
      {children}
    </Button>
  );
}

export default function Home() {
  return (
    <main className="bg-gray-900 text-text-inverse">
      <header className="relative z-20 h-20 bg-[rgba(44,44,49,0.88)]">
        <div className="mx-auto flex h-full max-w-360 items-center justify-between px-[clamp(32px,5.56vw,80px)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(220.79deg,#ba4eff_7.66%,#6954f9_64.14%)]">
            <Image
              alt="Easy & Only 로고"
              height={36.48}
              priority
              src="/landing/logo.png"
              width={35.52}
            />
          </div>
          <LandingButton className="w-auto" outlined>
            회원가입 / 로그인
          </LandingButton>
        </div>
      </header>

      <section className="relative isolate min-h-200.5 overflow-hidden bg-gray-900">
        <div className="absolute left-[-15.39%] top-[-43.7%] h-325.5 w-325.5 rounded-full bg-[radial-gradient(circle,rgba(186,78,255,0.22)_0%,rgba(186,78,255,0.12)_26%,rgba(186,78,255,0.05)_46%,rgba(18,18,20,0)_72%)] blur-2.5" />
        <div className="absolute left-[25%] top-[-23.45%] h-325.5 w-325.5 rounded-full bg-[radial-gradient(circle,rgba(105,84,249,0.18)_0%,rgba(105,84,249,0.11)_26%,rgba(105,84,249,0.04)_48%,rgba(18,18,20,0)_74%)] blur-4.5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_86%,rgba(186,78,255,0.12),transparent_24%),radial-gradient(circle_at_74%_72%,rgba(105,84,249,0.16),transparent_19%),linear-gradient(180deg,rgba(30,30,34,0.28)_0%,rgba(18,18,20,0)_16%,rgba(18,18,20,0.08)_100%)]" />

        <div className="relative mx-auto max-w-360 overflow-hidden">
          <div className="relative mx-auto flex min-h-200.5 max-w-360 items-start justify-between gap-10 px-[clamp(32px,5.35vw,77px)] pb-20 pt-30">
            <div className="flex w-[min(100%,620px)] flex-col gap-16">
              <div className="flex flex-col gap-3">
                <p className="m-0 bg-[linear-gradient(90deg,#ba4eff_0%,#6954f9_100%)] bg-clip-text text-[clamp(32px,2.78vw,40px)] leading-[1.2] font-semibold text-transparent">
                  Easy &amp; Only
                </p>
                <h1 className="m-0 text-display-lg  tracking-[-0.01em] text-text-inverse">
                  <span className="block">입문자부터</span>
                  <span className="block">전문가까지</span>
                  <span className="block">쉽게 영상을 제작하세요</span>
                </h1>
              </div>
              <LandingButton className="w-fit">지금 바로 만들기</LandingButton>
            </div>

            <div className="relative h-[min(602px,41.8vw)] min-h-107.5 w-[min(397px,27.57vw)] min-w-75 rounded-8 border border-gray-700 bg-gray-800 shadow-[0_1px_36px_8px_rgba(186,78,255,0.08)]">
              <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(18,18,20,0.7)]">
                <Icon className="size-9 text-text-inverse" name="play-line" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate min-h-216.5 overflow-hidden bg-gray-900 pb-20 pt-20">
        <div className="absolute left-[-13.4%] -top-3 h-228.25 w-228.25 rounded-full bg-[radial-gradient(circle,rgba(105,84,249,0.12)_0%,rgba(105,84,249,0.06)_24%,rgba(18,18,20,0)_65%)] blur-4.5" />

        <div className="relative mx-auto max-w-360 px-[clamp(32px,5.56vw,80px)]">
          <div className="mx-auto flex max-w-207.25 flex-col items-center gap-3 text-center">
            <h2 className="m-0 text-[clamp(36px,3.33vw,48px)] leading-[1.25] font-bold text-text-inverse">
              <span>AI가 만드는 </span>
              <span className="bg-[linear-gradient(90deg,#6954f9_0%,#ba4eff_100%)] bg-clip-text text-transparent">
                새로운 영상 제작
              </span>
            </h2>
            <p className="m-0 text-[clamp(20px,2.22vw,32px)] leading-[1.5] font-bold tracking-[-0.02em] text-text-inverse">
              복잡한 영상 편집 없이, AI와 함께 빠르고 트렌디한 영상을 제작하세요
            </p>
          </div>

          <div className="mt-22 grid grid-cols-[280px_minmax(0,1fr)] items-start gap-[clamp(42px,6.9vw,100px)]">
            <div className="relative min-h-105 pl-11 pt-7">
              <div className="absolute left-0 top-0 h-105 w-0.75 bg-[linear-gradient(180deg,rgba(44,44,49,0.6)_0%,rgba(142,142,147,0.85)_50%,rgba(44,44,49,0.6)_100%)]" />
              <div className="flex flex-col gap-30">
                {timelineItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative flex items-center gap-6"
                  >
                    <div
                      className={`absolute -left-9.75 top-1/2 size-14.25 -translate-y-1/2 rounded-full ${
                        item.active
                          ? "bg-[radial-gradient(circle,rgba(186,78,255,0.95)_0%,rgba(186,78,255,0.45)_34%,rgba(186,78,255,0.18)_58%,rgba(18,18,20,0)_88%)]"
                          : "bg-[radial-gradient(circle,rgba(142,142,147,0.55)_0%,rgba(142,142,147,0.18)_42%,rgba(18,18,20,0)_82%)]"
                      }`}
                    >
                      <span
                        className={`absolute left-1/2 top-1/2 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          item.active
                            ? "bg-primary-500 shadow-[0_0_14px_rgba(186,78,255,0.72)]"
                            : "bg-[rgba(142,142,147,0.35)]"
                        }`}
                      />
                    </div>
                    <p
                      className={`m-0 text-2xl leading-9 font-medium tracking-[-0.01em] ${
                        item.active ? "text-text-inverse" : "text-text-tertiary"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1.5">
              <div className="flex items-start justify-center gap-3.5">
                {featureCards.map((card) => (
                  <div
                    key={card.src}
                    className={`${card.className} h-65.25 w-52.5 overflow-hidden rounded-5 bg-gray-700 shadow-[0_8px_24px_rgba(0,0,0,0.2)]`}
                  >
                    <Image
                      alt={card.alt}
                      className="h-full w-full rounded-4.5 object-cover"
                      height={261}
                      src={card.src}
                      width={210}
                    />
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-10 flex max-w-108.75 flex-col items-center gap-4 text-center text-text-inverse">
                <h3 className="m-0 text-8 leading-12 font-bold tracking-[-0.02em]">
                  나만의 캐릭터 생성
                </h3>
                <p className="m-0 text-lg leading-7 font-semibold tracking-[-0.01em]">
                  원하는 캐릭터를 스타일화하거나 나만의 AI 캐릭터를 생성해요.
                  <br />
                  일관된 스타일의 캐릭터가 영상 전체에 등장합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-82 items-start justify-center bg-gray-900 px-8 pb-22 pt-20 text-center">
        <div className="flex flex-col items-center gap-15">
          <h2 className="m-0 text-8 leading-12 font-bold tracking-[-0.02em] text-text-inverse">
            지금 시작하고, 첫 영상을 무료로 만들어보세요
          </h2>
          <LandingButton className="w-fit">지금 바로 만들기</LandingButton>
        </div>
      </section>
    </main>
  );
}
