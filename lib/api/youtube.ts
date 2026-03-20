import { apiFetch } from "./client";
import type {
  YouTubeConnectPayload,
  YouTubeConnectResponse,
  YouTubeDisconnectResponse,
  YouTubeStatusResponse,
  YouTubeUploadPayload,
  YouTubeUploadResponse,
} from "./types";

export function connectYouTube(payload: YouTubeConnectPayload) {
  return apiFetch<YouTubeConnectResponse>("POST", "/api/youtube/connect", payload);
}

export function disconnectYouTube() {
  return apiFetch<YouTubeDisconnectResponse>("DELETE", "/api/youtube/disconnect");
}

export function uploadToYouTube(projectId: string, payload: YouTubeUploadPayload) {
  return apiFetch<YouTubeUploadResponse>("POST", `/api/youtube/upload/${projectId}`, payload);
}

export function getUploadStatus(projectId: string) {
  return apiFetch<YouTubeStatusResponse>("GET", `/api/youtube/upload/${projectId}/status`);
}
