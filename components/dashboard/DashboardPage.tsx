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
        recent_characters: [],
        recent_projects: [],
        trending_keywords: [],
      };
    }

    return {
      creation_trends: dashboardQuery.data.creation_trends ?? [],
      recent_characters: dashboardQuery.data.recent_characters ?? [],
      recent_projects: dashboardQuery.data.recent_projects ?? [],
      trending_keywords: dashboardQuery.data.trending_keywords,
    };
  }, [dashboardQuery.data]);

  const hasProjects = dashboard.recent_projects.length > 0;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_52%_34%,rgba(112,69,255,0.3)_0%,rgba(112,69,255,0.22)_18%,rgba(84,56,182,0.16)_34%,rgba(17,17,21,0)_72%),radial-gradient(circle_at_50%_16%,rgba(211,119,255,0.12)_0%,rgba(211,119,255,0.08)_18%,rgba(17,17,21,0)_54%),linear-gradient(180deg,rgba(43,28,77,0.28)_0%,rgba(17,17,21,0.12)_48%,rgba(17,17,21,0)_100%)]" />

      <div className="relative px-[28px] pb-[38px] pt-[24px]">
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
              <CharacterCarousel characters={dashboard.recent_characters} />
            )}
          </div>
        </section>

        <TrendSection
          creationTrends={dashboard.creation_trends}
          trendingKeywords={dashboard.trending_keywords}
          isLoading={dashboardQuery.isLoading}
        />
      </div>
    </div>
  );
}
