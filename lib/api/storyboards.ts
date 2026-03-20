import { apiFetch } from "./client";
import type {
  CreateStoryboardPayload,
  CreateStoryboardResponse,
  SceneItem,
  StoryboardDetail,
} from "./types";

export function createStoryboard(payload: CreateStoryboardPayload) {
  return apiFetch<CreateStoryboardResponse>("POST", "/api/storyboards", payload);
}

export function getStoryboard(storyboardId: string) {
  return apiFetch<StoryboardDetail>("GET", `/api/storyboards/${storyboardId}`);
}

export function updateScene(
  storyboardId: string,
  sceneId: string,
  payload: { title?: string; content?: string },
) {
  return apiFetch<SceneItem>(
    "PATCH",
    `/api/storyboards/${storyboardId}/scenes/${sceneId}`,
    payload,
  );
}

export function regenerateSceneImage(storyboardId: string, sceneId: string) {
  return apiFetch<{ scene_id: string; status: string; message: string }>(
    "POST",
    `/api/storyboards/${storyboardId}/scenes/${sceneId}/regenerate-image`,
  );
}

export function generateVideos(storyboardId: string) {
  return apiFetch<{ storyboard_id: string; status: string; message: string }>(
    "POST",
    `/api/storyboards/${storyboardId}/generate-videos`,
  );
}

// Helper: check if all scenes are ready
export function isStoryboardReady(storyboard: StoryboardDetail) {
  if (storyboard.scenes.length === 0) return false;
  return storyboard.scenes.every(
    (scene) => scene.image_status?.toUpperCase() === "COMPLETED",
  );
}
