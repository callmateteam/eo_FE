import { getProject } from "@/lib/api/projects";
import { getStoryboard } from "@/lib/api/storyboards";

export async function resolveProjectResumePath(projectId: string) {
  const project = await getProject(projectId);
  const storyboardId = project.storyboard_id;

  if (project.current_stage <= 1) {
    return "/project/create";
  }

  if (project.current_stage === 2 || !storyboardId) {
    return `/project/create/idea?projectId=${encodeURIComponent(projectId)}`;
  }

  if (project.current_stage === 3) {
    return `/project/create/storyboard?projectId=${encodeURIComponent(
      projectId
    )}&storyboardId=${encodeURIComponent(storyboardId)}`;
  }

  const storyboard = await getStoryboard(storyboardId);
  const storyboardStatus = storyboard.status.toUpperCase();
  const hasReadyVideos =
    storyboard.final_video_url ||
    storyboardStatus === "VIDEO_READY" ||
    storyboard.scenes.some((scene) => scene.video_status?.toUpperCase() === "COMPLETED");

  if (!hasReadyVideos) {
    return `/project/create/storyboard?projectId=${encodeURIComponent(
      projectId
    )}&storyboardId=${encodeURIComponent(storyboardId)}`;
  }

  return `/project/${projectId}/edit?storyboardId=${encodeURIComponent(storyboardId)}`;
}
