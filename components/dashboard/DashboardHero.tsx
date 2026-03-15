type DashboardHeroProps = {
  hasProjects: boolean;
};

export function DashboardHero({ hasProjects }: DashboardHeroProps) {
  return (
    <section className="relative flex h-[136px] items-center justify-center overflow-hidden">
      <div className="absolute left-1/2 top-[-112px] h-[336px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#5c30b1_0%,#352a76_36%,rgba(18,18,25,0)_76%)] opacity-95 blur-[18px]" />
      <div className="relative z-10 flex flex-col items-center gap-[2px] text-center">
        <p className="text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-white">
          안녕하세요
        </p>
        <h2 className="text-[15px] font-semibold leading-[1.45] tracking-[-0.03em] text-white">
          {hasProjects
            ? "오늘도 나만의 AI 영상을 만들어볼까요?"
            : "첫 AI 영상을 만들어보세요!"}
        </h2>
      </div>
    </section>
  );
}
