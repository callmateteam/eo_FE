type DashboardHeroProps = {
  hasProjects: boolean;
};

export function DashboardHero({ hasProjects }: DashboardHeroProps) {
  return (
    <section className="relative flex h-[136px] items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-[2px] text-center">
        <p className="text-heading-lg text-white">
          안녕하세요
        </p>
        <h2 className="text-heading-lg text-white">
          {hasProjects
            ? "오늘도 나만의 AI 영상을 만들어볼까요?"
            : "첫 AI 영상을 만들어보세요!"}
        </h2>
      </div>
    </section>
  );
}
