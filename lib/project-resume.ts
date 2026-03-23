import { getProject } from "@/lib/api/projects";
import { getStoryboard } from "@/lib/api/storyboards";

export async function resolveProjectResumePath(projectId: string) {
  const project = await getProject(projectId);
  const storyboardId = project.storyboard_id;

  // Stage 1: 캐릭터 선택
  if (project.current_stage <= 1) {
    return "/project/create";
  }

  // Stage 2: 아이디어 입력
  if (project.current_stage === 2) {
    return `/project/create/idea?projectId=${encodeURIComponent(projectId)}`;
  }

  // Stage 3: 아이디어 구체화 확정 대기 (idea 페이지에서 처리)
  if (project.current_stage === 3 || !storyboardId) {
    return `/project/create/idea?projectId=${encodeURIComponent(projectId)}`;
  }

  // Stage 4+: 영상 생성 요청됨 — 완료 여부 확인 후 분기
  const storyboard = await getStoryboard(storyboardId);
  const storyboardStatus = storyboard.status.toUpperCase();
  const hasReadyVideos =
    storyboard.final_video_url ||
    storyboardStatus === "VIDEO_READY" ||
    storyboard.scenes.some((scene) => scene.video_status?.toUpperCase() === "COMPLETED");

  if (hasReadyVideos) {
    return `/project/${projectId}/edit?storyboardId=${encodeURIComponent(storyboardId)}`;
  }

  const hasPendingVideos =
    project.current_stage >= 4 &&
    storyboard.scenes.some((scene) => {
      const status = scene.video_status?.toUpperCase();
      return status && status !== "COMPLETED" && status !== "FAILED" && status !== "ERROR";
    });

  if (hasPendingVideos) {
    return `/project/create/storyboard?projectId=${encodeURIComponent(projectId)}&storyboardId=${encodeURIComponent(storyboardId)}&resumeGeneration=true`;
  }

  return `/project/create/storyboard?projectId=${encodeURIComponent(projectId)}&storyboardId=${encodeURIComponent(storyboardId)}`;
}
