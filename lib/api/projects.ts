import { apiFetch } from "./client";
import type {
  CreateProjectPayload,
  CreateProjectResponse,
  ProjectDetail,
  ProjectListResponse,
  UpdateProjectPayload,
} from "./types";

export function createProject(payload: CreateProjectPayload) {
  return apiFetch<CreateProjectResponse>("POST", "/api/projects", payload);
}

export function getProjects() {
  return apiFetch<ProjectListResponse>("GET", "/api/projects");
}

export function getProject(projectId: string) {
  return apiFetch<ProjectDetail>("GET", `/api/projects/${projectId}`);
}

export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiFetch<ProjectDetail>("PATCH", `/api/projects/${projectId}`, payload);
}

export function deleteProject(projectId: string) {
  return apiFetch<null>("DELETE", `/api/projects/${projectId}`);
}
