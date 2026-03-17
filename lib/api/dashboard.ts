import { apiFetch } from "@/lib/api/client";

export type DashboardProject = {
  character_id: string;
  character_image: string;
  character_name: string;
  created_at: string;
  id: string;
  progress: number;
  status: string;
  status_label: string;
  title: string;
};

export type DashboardCharacter = {
  category: string;
  id: string;
  image_url: string;
  last_used_at: string;
  name: string;
  name_en?: string;
  series?: string;
  thumbnail_url: string;
  type?: string;
};

export type DashboardTrendKeyword = {
  avg_views: number;
  keyword: string;
  rank: number;
  url?: string;
};

export type DashboardCreationTrend = {
  count: number;
  keyword: string;
  rank: number;
};

export type DashboardResponse = {
  creation_trends: DashboardCreationTrend[] | null;
  recent_characters: DashboardCharacter[] | null;
  recent_projects: DashboardProject[] | null;
  trending_keywords: DashboardTrendKeyword[];
};

export async function getDashboard() {
  return apiFetch<DashboardResponse>("/api/dashboard", {
    method: "GET",
  });
}
