import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as storyboardsApi from "@/lib/api/storyboards";
import { queryKeys } from "@/hooks/query-keys";

export function useStoryboard(
  storyboardId: string,
  options?: { refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: queryKeys.storyboard(storyboardId),
    queryFn: () => storyboardsApi.getStoryboard(storyboardId),
    enabled: Boolean(storyboardId),
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreateStoryboard() {
  return useMutation({
    mutationFn: storyboardsApi.createStoryboard,
  });
}

export function useUpdateScene() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storyboardId,
      sceneId,
      payload,
    }: {
      storyboardId: string;
      sceneId: string;
      payload: { title?: string; content?: string };
    }) => storyboardsApi.updateScene(storyboardId, sceneId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.storyboard(variables.storyboardId),
      });
    },
  });
}

export function useRegenerateSceneImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storyboardId,
      sceneId,
    }: {
      storyboardId: string;
      sceneId: string;
    }) => storyboardsApi.regenerateSceneImage(storyboardId, sceneId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.storyboard(variables.storyboardId),
      });
    },
  });
}

export function useGenerateVideos() {
  return useMutation({
    mutationFn: storyboardsApi.generateVideos,
  });
}
