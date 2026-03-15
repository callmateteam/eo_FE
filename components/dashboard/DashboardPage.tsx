"use client";

import { useMemo, useState } from "react";

import { CharacterCarousel } from "@/components/dashboard/CharacterCarousel";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
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
            <CharacterCarousel characters={dashboard.recent_characters ?? []} />
          )}
        </div>
      </section>

      <TrendSection
        creationTrends={dashboard.creation_trends}
        trendingKeywords={dashboard.trending_keywords}
      />
    </div>
  );
}
