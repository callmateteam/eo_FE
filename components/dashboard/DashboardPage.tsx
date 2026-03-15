"use client";

import { useMemo, useState } from "react";

import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProjectCarousel } from "@/components/dashboard/ProjectCarousel";
import { TrendSection } from "@/components/dashboard/TrendSection";
import { useDashboard } from "@/hooks/useDashboard";

type DashboardTab = "projects" | "characters";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("projects");
  const dashboardQuery = useDashboard();

  const dashboard = useMemo(() => {
    if (!dashboardQuery.data) {
      return {
        creation_trends: [],
        recent_characters: null,
        recent_projects: [],
        trending_keywords: [],
      };
    }

    return dashboardQuery.data;
  }, [dashboardQuery.data]);

  const hasProjects = dashboard.recent_projects.length > 0;

  return (
    <DashboardShell>
      <div className="px-[28px] pb-[38px] pt-[24px]">
        <h1 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
          대시보드
        </h1>

        <DashboardHero hasProjects={hasProjects} />

        <section className="pt-[15px]">
          <DashboardTabs onChange={setActiveTab} value={activeTab} />

          <div className="pt-[18px]">
            {activeTab === "projects" ? (
              <ProjectCarousel projects={dashboard.recent_projects} />
            ) : (
              <div className="flex h-[184px] w-full items-center justify-center rounded-[16px] border border-dashed border-[#3a3a43] bg-[#18181d] text-[13px] font-medium text-[#8c8c95]">
                최근 캐릭터 영역은 다음 단계에서 연결됩니다.
              </div>
            )}
          </div>
        </section>

        <TrendSection
          creationTrends={dashboard.creation_trends}
          trendingKeywords={dashboard.trending_keywords}
        />
      </div>
    </DashboardShell>
  );
}
