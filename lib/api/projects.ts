import { apiFetch } from "@/lib/api/client";

export type ProjectListItem = {
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

export type ProjectListResponse = {
  projects: ProjectListItem[];
  total: number;
};

export async function getProjects() {
  return apiFetch<ProjectListResponse>("/api/projects", {
    method: "GET",
  });
}
