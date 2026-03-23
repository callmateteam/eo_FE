import { LandingCTAButton } from "@/components/landing/LandingCTAButton";
import { LandingFeatureShowcase } from "@/components/landing/LandingFeatureShowcase";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeroVideo } from "@/components/landing/LandingHeroVideo";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <main className="bg-gray-900 text-gray-50">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="absolute inset-x-0 top-0 h-[802px] bg-[radial-gradient(circle_at_24%_30%,rgba(186,78,255,0.24)_0%,rgba(186,78,255,0.11)_22%,rgba(18,18,20,0)_52%),radial-gradient(circle_at_59%_42%,rgba(105,84,249,0.18)_0%,rgba(105,84,249,0.1)_28%,rgba(18,18,20,0)_58%),linear-gradient(180deg,rgba(63,44,86,0.28)_0%,rgba(18,18,20,0.06)_58%,rgba(18,18,20,0)_100%)]" />
        <div className="relative mx-auto grid min-h-[802px] w-full max-w-[1440px] items-start gap-16 px-10 pb-24 pt-[120px] md:grid-cols-[620px_1fr] md:px-[77px]">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-3">
              <p className="text-display-sm m-0 bg-[linear-gradient(90deg,#ba4eff_0%,#6754f9_100%)] bg-clip-text text-transparent">
                Easy &amp; Only
              </p>
              <h1 className="text-display-lg m-0 text-white max-md:text-[46px] max-md:leading-[1.12]">
                <span className="block">입문자부터</span>
                <span className="block">전문가까지</span>
                <span className="block">쉽게 영상을 제작하세요</span>
              </h1>
            </div>

            <LandingCTAButton className="w-fit" />
          </div>

          <LandingHeroVideo />
        </div>
      </section>

      <LandingFeatureShowcase />

      <section className="relative flex min-h-[328px] items-start justify-center bg-gray-900 px-8 pb-[60px] pt-20 text-center">
        <div className="flex flex-col items-center gap-[60px]">
          <h2 className="text-heading-xl m-0 text-white max-md:text-[28px] max-md:leading-10">
            지금 시작하고, 첫 영상을 무료로 만들어보세요
          </h2>
          <LandingCTAButton className="w-fit" />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
