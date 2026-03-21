import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as youtubeApi from "@/lib/api/youtube";
import { queryKeys } from "@/hooks/query-keys";
import type { YouTubeUploadPayload } from "@/lib/api/types";

export function useYouTubeConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: youtubeApi.connectYouTube,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useYouTubeDisconnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: youtubeApi.disconnectYouTube,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useYouTubeUpload(projectId: string) {
  return useMutation({
    mutationFn: (payload: YouTubeUploadPayload) =>
      youtubeApi.uploadToYouTube(projectId, payload),
  });
}

export function useYouTubeUploadStatus(
  projectId: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: queryKeys.youtube.uploadStatus(projectId),
    queryFn: () => youtubeApi.getUploadStatus(projectId),
    enabled: options?.enabled ?? Boolean(projectId),
    refetchInterval: options?.refetchInterval,
  });
}
