import { apiFetch } from "@/lib/api/client";

export type ProjectCreateRequest = {
  character_id?: string | null;
  custom_character_id?: string | null;
  keyword?: string;
  title: string;
};

export type ProjectCreateResponse = {
  current_stage?: number;
  id: string;
  message?: string;
  status?: string;
  title: string;
};

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

export type ProjectDetailResponse = {
  character_id: string | null;
  character_image: string;
  character_name: string;
  created_at: string;
  current_stage: number;
  custom_character_id: string | null;
  id: string;
  idea: string | null;
  keyword: string;
  progress: number;
  stage_name: string;
  status: string;
  status_label: string;
  storyboard_id: string | null;
  title: string;
  updated_at: string;
};

export type ProjectUpdateRequest = {
  character_id?: string | null;
  current_stage?: number | null;
  custom_character_id?: string | null;
  idea?: string | null;
  keyword?: string | null;
  storyboard_id?: string | null;
  title?: string | null;
};

export async function getProjects() {
  return apiFetch<ProjectListResponse>("/api/projects", {
    method: "GET",
  });
}

export async function createProject(payload: ProjectCreateRequest) {
  return apiFetch<ProjectCreateResponse>("/api/projects", {
    body: payload,
    method: "POST",
  });
}

export async function getProject(projectId: string) {
  return apiFetch<ProjectDetailResponse>(`/api/projects/${projectId}`, {
    method: "GET",
  });
}

export async function updateProject(
  projectId: string,
  payload: ProjectUpdateRequest
) {
  return apiFetch<ProjectDetailResponse>(`/api/projects/${projectId}`, {
    body: payload,
    method: "PATCH",
  });
}
