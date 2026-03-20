import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as videoEditApi from "@/lib/api/video-edit";
import { queryKeys } from "@/hooks/query-keys";
import type { EditData } from "@/lib/api/types";

export function useVideoEdit(storyboardId: string) {
  return useQuery({
    queryKey: queryKeys.videoEdit(storyboardId),
    queryFn: () => videoEditApi.getVideoEdit(storyboardId),
    enabled: Boolean(storyboardId),
  });
}

export function useSaveVideoEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storyboardId,
      editData,
    }: {
      storyboardId: string;
      editData: EditData;
    }) => videoEditApi.updateVideoEdit(storyboardId, editData),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.videoEdit(variables.storyboardId),
      });
    },
  });
}

export function useUndoVideoEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoEditApi.undoVideoEdit,
    onSuccess: (_data, storyboardId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.videoEdit(storyboardId),
      });
    },
  });
}

export function useStartRender() {
  return useMutation({
    mutationFn: videoEditApi.startRender,
  });
}

export function useFinalizeVideo() {
  return useMutation({
    mutationFn: ({
      storyboardId,
      title,
    }: {
      storyboardId: string;
      title: string;
    }) => videoEditApi.finalizeVideo(storyboardId, title),
  });
}

export function useVideoInfo(
  storyboardId: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: queryKeys.videoInfo(storyboardId),
    queryFn: () => videoEditApi.getVideoInfo(storyboardId),
    enabled: options?.enabled ?? Boolean(storyboardId),
    refetchInterval: options?.refetchInterval,
  });
}
