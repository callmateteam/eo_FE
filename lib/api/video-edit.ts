import { apiFetch, getApiBaseUrl } from "./client";
import type {
  EditData,
  FinalizeResponse,
  RenderResponse,
  TtsResponse,
  UndoVideoEditResponse,
  VideoEditResponse,
  VideoInfoResponse,
} from "./types";

export function getVideoEdit(storyboardId: string) {
  return apiFetch<VideoEditResponse>(
    "GET",
    `/api/storyboards/${storyboardId}/edit`,
  );
}

export function updateVideoEdit(storyboardId: string, editData: EditData) {
  return apiFetch<VideoEditResponse>(
    "PATCH",
    `/api/storyboards/${storyboardId}/edit`,
    { edit_data: editData },
  );
}

export function undoVideoEdit(storyboardId: string) {
  return apiFetch<UndoVideoEditResponse>(
    "POST",
    `/api/storyboards/${storyboardId}/edit/undo`,
  );
}

export function generateTts(
  storyboardId: string,
  payload: { text: string; voice_id?: string; voice_style?: string },
) {
  return apiFetch<TtsResponse>(
    "POST",
    `/api/storyboards/${storyboardId}/edit/tts`,
    payload,
  );
}

export function startRender(storyboardId: string) {
  return apiFetch<RenderResponse>(
    "POST",
    `/api/storyboards/${storyboardId}/render`,
  );
}

export function finalizeVideo(storyboardId: string, title: string) {
  return apiFetch<FinalizeResponse>(
    "POST",
    `/api/storyboards/${storyboardId}/finalize`,
    { title },
  );
}

export function getVideoInfo(storyboardId: string) {
  return apiFetch<VideoInfoResponse>(
    "GET",
    `/api/storyboards/${storyboardId}/video-info`,
  );
}

export function getDownloadUrl(storyboardId: string) {
  return `${getApiBaseUrl()}/api/storyboards/${storyboardId}/download`;
}
