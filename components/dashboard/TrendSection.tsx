import { Icon } from "@/components/ui/Icon";

type DashboardCreationTrend = {
  keyword: string;
  rank: number;
  count: number;
};

type DashboardTrendKeyword = {
  keyword: string;
  rank: number;
  avg_views: number;
};

type TrendSectionProps = {
  creationTrends: DashboardCreationTrend[];
  trendingKeywords: DashboardTrendKeyword[];
  isLoading?: boolean;
};

type TrendItem = {
  label: string;
  rank: number;
  subtitle?: string | number | null;
};

function getIndicator(rank: number) {
  if (rank === 1) {
    return { color: "text-[#ff5e61]", icon: "up" as const };
  }

  if (rank === 3) {
    return { color: "text-[#5f61ff]", icon: "down" as const };
  }

  if (rank === 2 || rank === 5) {
    return { color: "text-[#ff5e61]", label: "new" };
  }

  return { color: "text-[#8a8a96]", icon: "line" as const };
}

function TrendColumn({
  items,
  title,
}: {
  items: TrendItem[];
  title: string;
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <h3 className="mb-[18px] text-[14px] font-semibold leading-none tracking-[-0.02em] text-white">
        {title}
      </h3>
      <ol className="space-y-[2px]">
        {items.slice(0, 5).map((item) => {
          const indicator = getIndicator(item.rank);

          return (
            <li
              key={`${title}-${item.rank}`}
              className="grid grid-cols-[24px_minmax(0,1fr)_28px] items-center gap-[18px] border-b border-[#23232a] py-[13px]"
            >
              <span className="text-[15px] font-semibold leading-none tracking-[-0.03em] text-white">
                {item.rank}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold leading-none tracking-[-0.02em] text-white">
                  {item.label}
                </p>
                <p className="mt-[7px] min-h-[10px] text-[10px] font-medium leading-none text-[#8d8d96]">
                  {item.subtitle === null ||
                  item.subtitle === undefined ||
                  item.subtitle === ""
                    ? "\u00A0"
                    : item.subtitle}
                </p>
              </div>
              <div className="flex justify-end">
                {"label" in indicator ? (
                  <span
                    className={`text-[10px] font-medium leading-none ${indicator.color}`}
                  >
                    {indicator.label}
                  </span>
                ) : (
                  <Icon className={`size-4 ${indicator.color}`} name={indicator.icon} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TrendColumnSkeleton({ title }: { title: string }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <h3 className="mb-[18px] text-[14px] font-semibold leading-none tracking-[-0.02em] text-white">
        {title}
      </h3>
      <ol className="space-y-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[24px_minmax(0,1fr)_28px] items-center gap-[18px] border-b border-[#23232a] py-[13px]"
          >
            <div className="h-4 w-4 animate-pulse rounded bg-[#2a2a35]" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-[#2a2a35]" />
              <div className="h-2 w-1/2 animate-pulse rounded bg-[#2a2a35]" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-[#2a2a35]" />
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrendEmpty() {
  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <p className="text-[14px] text-[#8d8d96]">아직 트렌드 데이터가 없습니다</p>
    </div>
  );
}

export function TrendSection({
  creationTrends,
  trendingKeywords,
  isLoading,
}: TrendSectionProps) {
  if (isLoading) {
    return (
      <section className="pt-[33px]">
        <h2 className="mb-[21px] text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
          실시간 영상 제작 트렌드
        </h2>
        <div className="grid grid-cols-2 gap-[40px]">
          <div className="pr-[40px]">
            <TrendColumnSkeleton title="유튜브 인기 키워드" />
          </div>
          <div className="border-l border-[#23232a] pl-[40px]">
            <TrendColumnSkeleton title="플랫폼 제작 급상승" />
          </div>
        </div>
      </section>
    );
  }

  const isEmpty = trendingKeywords.length === 0 && creationTrends.length === 0;

  if (isEmpty) {
    return (
      <section className="pt-[33px]">
        <h2 className="mb-[21px] text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
          실시간 영상 제작 트렌드
        </h2>
        <TrendEmpty />
      </section>
    );
  }

  const trendingItems: TrendItem[] = trendingKeywords.map((item) => ({
    label: item.keyword,
    rank: item.rank,
    subtitle: `${item.avg_views.toLocaleString()} Views`,
  }));

  const creationItems: TrendItem[] = creationTrends.map((item) => ({
    label: item.keyword,
    rank: item.rank,
    subtitle: `${item.count.toLocaleString()} Created`,
  }));

  return (
    <section className="pt-[33px]">
      <h2 className="mb-[21px] text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
        실시간 영상 제작 트렌드
      </h2>
      <div className="grid grid-cols-2 gap-[40px]">
        <div className="pr-[40px]">
          <TrendColumn items={trendingItems} title="유튜브 인기 키워드" />
        </div>
        <div className="border-l border-[#23232a] pl-[40px]">
          <TrendColumn items={creationItems} title="플랫폼 제작 급상승" />
        </div>
      </div>
    </section>
  );
}
