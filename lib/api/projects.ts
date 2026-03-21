import { apiFetch } from "./client";
import type {
  ConfirmEnrichedIdeaPayload,
  ConfirmEnrichedIdeaResponse,
  CreateProjectPayload,
  CreateProjectResponse,
  EnrichIdeaResponse,
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

export function enrichIdea(projectId: string, payload: { idea: string }) {
  return apiFetch<EnrichIdeaResponse>(
    "POST",
    `/api/projects/${projectId}/enrich-idea`,
    payload,
  );
}

export function confirmEnrichedIdea(
  projectId: string,
  payload: ConfirmEnrichedIdeaPayload,
) {
  return apiFetch<ConfirmEnrichedIdeaResponse>(
    "POST",
    `/api/projects/${projectId}/confirm-enriched-idea`,
    payload,
  );
}
