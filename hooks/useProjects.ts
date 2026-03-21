import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as projectsApi from "@/lib/api/projects";
import type { ConfirmEnrichedIdeaPayload } from "@/lib/api/types";
import { queryKeys } from "@/hooks/query-keys";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: () => projectsApi.getProjects(),
    staleTime: 60 * 1000,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectsApi.getProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: Parameters<typeof projectsApi.updateProject>[1];
    }) => projectsApi.updateProject(projectId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useEnrichIdea() {
  return useMutation({
    mutationFn: ({ projectId, idea }: { projectId: string; idea: string }) =>
      projectsApi.enrichIdea(projectId, { idea }),
  });
}

export function useConfirmEnrichedIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: ConfirmEnrichedIdeaPayload;
    }) => projectsApi.confirmEnrichedIdea(projectId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
    },
  });
}
