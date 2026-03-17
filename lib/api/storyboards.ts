import { apiFetch } from "@/lib/api/client";

export type StoryboardScene = {
  content: string;
  duration: number;
  has_character?: boolean;
  id: string;
  image_prompt: string;
  image_status?: string;
  image_url?: string | null;
  narration?: string | null;
  narration_style?: string;
  narration_url?: string | null;
  scene_order: number;
  title: string;
  video_error?: string | null;
  video_status?: string;
  video_url?: string | null;
};

export type StoryboardCreateRequest = {
  character_id?: string | null;
  custom_character_id?: string | null;
  idea: string;
  project_id?: string | null;
};

export type StoryboardCreateResponse = {
  id: string;
  message?: string;
  project_id?: string | null;
  status?: string;
};

export type StoryboardDetailResponse = {
  bgm_mood?: string | null;
  character_id?: string | null;
  created_at: string;
  custom_character_id?: string | null;
  error_msg?: string | null;
  final_video_url?: string | null;
  id: string;
  idea: string;
  project_id?: string | null;
  scenes: StoryboardScene[];
  status: string;
  total_duration: number;
};

export type StoryboardSceneUpdateRequest = {
  content?: string | null;
  title?: string | null;
};

export type StoryboardSceneImageRegenerateResponse = {
  message?: string;
  scene_id: string;
  status?: string;
};

export type SubtitleStyle = {
  animation?: "none" | "typing" | "popup" | "fadein";
  background?: {
    color?: string;
    enabled?: boolean;
    opacity?: number;
  };
  color?: string;
  font?:
    | "NanumGothic"
    | "NanumMyeongjo"
    | "NanumSquareRound"
    | "NanumBarunGothic"
    | "MapoFlowerIsland"
    | "GmarketSans"
    | "Pretendard"
    | "DoHyeon";
  font_size?: number;
  per_char_sizes?: number[] | null;
  position?: "top" | "center" | "bottom";
  position_y?: number | null;
  shadow?: {
    color?: string;
    enabled?: boolean;
    offset?: number;
  };
};

export type SubtitleItem = {
  end: number;
  scene_id: string;
  start: number;
  style?: SubtitleStyle;
  text: string;
};

export type TtsOverlayItem = {
  audio_url?: string | null;
  id?: string | null;
  scene_id: string;
  start: number;
  text: string;
  voice_id?: string;
  voice_style?: string;
};

export type EditSceneItem = {
  audio?: {
    end?: number | null;
    start?: number;
    type?: string;
    url?: string | null;
    volume?: number;
  };
  order: number;
  scene_id: string;
  speed?: number;
  transition?: string;
  trim_end?: number | null;
  trim_start?: number;
};

export type EditData = {
  bgm?: {
    genre?: string;
    url?: string | null;
    volume?: number;
  };
  scenes?: EditSceneItem[];
  subtitles?: SubtitleItem[];
  thumbnail_time?: number;
  tts_overlays?: TtsOverlayItem[];
};

export type VideoEditResponse = {
  created_at: string;
  edit_data: EditData;
  id: string;
  storyboard_id: string;
  updated_at: string;
  version: number;
};

export type VideoGenerationStartResponse = {
  message?: string;
  status?: string;
  storyboard_id: string;
};

export type RenderStartResponse = {
  message?: string;
  status?: string;
  storyboard_id: string;
};

export type UndoResponse = {
  edit_data: EditData;
  id: string;
  message?: string;
  version: number;
};

export type TtsCreateRequest = {
  text: string;
  voice_id?: string;
  voice_style?: string;
};

export type TtsCreateResponse = {
  audio_url: string;
  duration?: number;
  message?: string;
};

export type FinalizeRequest = {
  title: string;
};

export type FinalizeResponse = {
  duration: number;
  message?: string;
  project_id: string;
  thumbnail_url?: string | null;
  title: string;
  video_url: string;
};

export type VideoInfoResponse = {
  created_at: string;
  duration: number;
  project_id: string;
  thumbnail_url?: string | null;
  title: string;
  video_url: string;
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isFailureStatus(status?: string | null) {
  const normalizedStatus = status?.toUpperCase();

  return normalizedStatus === "FAILED" || normalizedStatus === "ERROR";
}

function isCompletedImageStatus(scene: StoryboardScene) {
  const normalizedStatus = scene.image_status?.toUpperCase();

  if (scene.image_url && normalizedStatus !== "STALE") {
    return true;
  }

  return (
    normalizedStatus === "COMPLETED" ||
    normalizedStatus === "READY" ||
    normalizedStatus === "SUCCESS" ||
    normalizedStatus === "DONE" ||
    normalizedStatus === "GENERATED"
  );
}

export function isStoryboardReady(storyboard: StoryboardDetailResponse) {
  const normalizedStatus = storyboard.status.toUpperCase();

  if (isFailureStatus(normalizedStatus)) {
    return false;
  }

  if (storyboard.scenes.length === 0) {
    return false;
  }

  return storyboard.scenes.every((scene) => isCompletedImageStatus(scene));
}

export async function waitForStoryboardReady(
  storyboardId: string,
  options?: {
    intervalMs?: number;
    maxAttempts?: number;
  }
) {
  const intervalMs = options?.intervalMs ?? 2000;
  const maxAttempts = options?.maxAttempts ?? 60;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const storyboard = await getStoryboard(storyboardId);
    const normalizedStatus = storyboard.status.toUpperCase();

    if (isFailureStatus(normalizedStatus)) {
      throw new Error(storyboard.error_msg ?? "스토리보드 생성에 실패했습니다.");
    }

    if (isStoryboardReady(storyboard)) {
      return storyboard;
    }

    await wait(intervalMs);
  }

  throw new Error("스토리보드 생성이 예상보다 오래 걸리고 있습니다.");
}

export async function waitForSceneImageReady(
  storyboardId: string,
  sceneId: string,
  options?: {
    intervalMs?: number;
    maxAttempts?: number;
  }
) {
  const intervalMs = options?.intervalMs ?? 2000;
  const maxAttempts = options?.maxAttempts ?? 45;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const storyboard = await getStoryboard(storyboardId);
    const scene = storyboard.scenes.find((item) => item.id === sceneId);

    if (!scene) {
      throw new Error("재생성한 씬을 찾을 수 없습니다.");
    }

    if (isFailureStatus(scene.image_status)) {
      throw new Error("이미지 재생성에 실패했습니다.");
    }

    if (isCompletedImageStatus(scene)) {
      return scene;
    }

    await wait(intervalMs);
  }

  throw new Error("이미지 재생성이 예상보다 오래 걸리고 있습니다.");
}

export async function createStoryboard(payload: StoryboardCreateRequest) {
  return apiFetch<StoryboardCreateResponse>("/api/storyboards", {
    body: payload,
    method: "POST",
  });
}

export async function getStoryboard(storyboardId: string) {
  return apiFetch<StoryboardDetailResponse>(`/api/storyboards/${storyboardId}`, {
    method: "GET",
  });
}

export async function updateStoryboardScene(
  storyboardId: string,
  sceneId: string,
  payload: StoryboardSceneUpdateRequest
) {
  return apiFetch<StoryboardScene>(
    `/api/storyboards/${storyboardId}/scenes/${sceneId}`,
    {
      body: payload,
      method: "PATCH",
    }
  );
}

export async function regenerateStoryboardSceneImage(
  storyboardId: string,
  sceneId: string
) {
  return apiFetch<StoryboardSceneImageRegenerateResponse>(
    `/api/storyboards/${storyboardId}/scenes/${sceneId}/regenerate-image`,
    {
      method: "POST",
    }
  );
}

export async function getVideoEdit(storyboardId: string) {
  return apiFetch<VideoEditResponse>(`/api/storyboards/${storyboardId}/edit`, {
    method: "GET",
  });
}

export async function updateVideoEdit(storyboardId: string, editData: EditData) {
  return apiFetch<VideoEditResponse>(`/api/storyboards/${storyboardId}/edit`, {
    body: { edit_data: editData },
    method: "PATCH",
  });
}

export async function undoVideoEdit(storyboardId: string) {
  return apiFetch<UndoResponse>(`/api/storyboards/${storyboardId}/edit/undo`, {
    method: "POST",
  });
}

export async function createStoryboardTts(
  storyboardId: string,
  payload: TtsCreateRequest
) {
  return apiFetch<TtsCreateResponse>(
    `/api/storyboards/${storyboardId}/edit/tts`,
    {
      body: payload,
      method: "POST",
    }
  );
}

export async function generateStoryboardVideos(storyboardId: string) {
  return apiFetch<VideoGenerationStartResponse>(
    `/api/storyboards/${storyboardId}/generate-videos`,
    {
      method: "POST",
    }
  );
}

export async function startStoryboardRender(storyboardId: string) {
  return apiFetch<RenderStartResponse>(
    `/api/storyboards/${storyboardId}/render`,
    {
      method: "POST",
    }
  );
}

export async function finalizeStoryboardVideo(
  storyboardId: string,
  payload: FinalizeRequest
) {
  return apiFetch<FinalizeResponse>(
    `/api/storyboards/${storyboardId}/finalize`,
    {
      body: payload,
      method: "POST",
    }
  );
}

export async function getStoryboardVideoInfo(storyboardId: string) {
  return apiFetch<VideoInfoResponse>(
    `/api/storyboards/${storyboardId}/video-info`,
    {
      method: "GET",
    }
  );
}
