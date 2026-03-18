"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { socialAssets } from "@/lib/assets";
import { getDownloadUrl } from "@/lib/api/video-edit";
import { getStoryboard } from "@/lib/api/storyboards";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useVideoInfo, useFinalizeVideo } from "@/hooks/useVideoEdit";

import { Button } from "@/components/ui/Button";
import { ProjectCreateShell } from "@/components/project-create/ProjectCreateShell";

type ProjectSavePageProps = {
  projectId: string;
  storyboardId?: string;
};

type SocialTarget = "instagram" | "tiktok" | "youtube";

export function ProjectSavePage({
  projectId,
  storyboardId,
}: ProjectSavePageProps) {
  const [projectTitle, setProjectTitle] = useState("프로젝트명");
  const [resolvedStoryboardId, setResolvedStoryboardId] = useState(
    storyboardId ?? "",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialTarget, setSocialTarget] = useState<SocialTarget>("youtube");
  const hasFinalized = useRef(false);

  const { data: project } = useProject(projectId);
  const updateProject = useUpdateProject();
  const finalizeVideo = useFinalizeVideo();

  // Populate title and storyboard_id from project data
  useEffect(() => {
    if (!project) return;

    setProjectTitle(project.title);

    if (!storyboardId && project.storyboard_id) {
      setResolvedStoryboardId(project.storyboard_id);
    }
  }, [project, storyboardId]);

  // If still no storyboardId from project, try fetching storyboard directly
  useEffect(() => {
    if (resolvedStoryboardId) return;
    if (!project?.storyboard_id) return;

    let cancelled = false;

    getStoryboard(project.storyboard_id)
      .then(() => {
        if (!cancelled) {
          setResolvedStoryboardId(project.storyboard_id!);
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedStoryboardId, project?.storyboard_id]);

  // Poll video info every 5 seconds while status is not complete
  const [isVideoComplete, setIsVideoComplete] = useState(false);

  const {
    data: videoInfo,
    isLoading: isVideoInfoLoading,
  } = useVideoInfo(resolvedStoryboardId, {
    enabled: Boolean(resolvedStoryboardId),
    refetchInterval: isVideoComplete ? false : 5000,
  });

  useEffect(() => {
    if (videoInfo && videoInfo.status === "complete") {
      setIsVideoComplete(true);
    }
  }, [videoInfo]);

  const isLoading = Boolean(resolvedStoryboardId) && isVideoInfoLoading;

  // Finalize video when info becomes available
  useEffect(() => {
    if (!videoInfo) return;
    if (hasFinalized.current) return;
    if (!resolvedStoryboardId) return;

    hasFinalized.current = true;
    finalizeVideo.mutate(
      { storyboardId: resolvedStoryboardId, title: projectTitle },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "영상 최종 처리 중 오류가 발생했습니다.",
          );
        },
      },
    );
  }, [videoInfo, resolvedStoryboardId]);

  const videoDurationLabel = useMemo(() => {
    const duration = videoInfo?.duration ?? 0;
    const minute = Math.floor(duration / 60);
    const second = Math.floor(duration % 60);

    return `${minute}분 ${second.toString().padStart(2, "0")}초`;
  }, [videoInfo?.duration]);

  return (
    <ProjectCreateShell
      currentStep={4}
      description="만든 영상을 저장하고, 공유해보세요"
      projectTitle={projectTitle}
      title="영상이 성공적으로 만들어졌어요"
    >
      {errorMessage ? (
        <p className="mx-auto mb-[18px] max-w-[1162px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
          {errorMessage}
        </p>
      ) : null}

      <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-[28px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[22px] bg-[#f5f2e9]">
          {videoInfo?.video_url ? (
            <video
              className="h-[520px] w-full object-cover"
              controls
              poster={videoInfo.thumbnail_url ?? undefined}
              src={videoInfo.video_url}
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center bg-[#1f1f24] text-[#d7d7dc]">
              {isLoading ? "영상 렌더링 중입니다." : "영상이 준비되면 여기에서 볼 수 있습니다."}
            </div>
          )}
          <div className="absolute bottom-[14px] left-[16px] right-[16px] rounded-[8px] bg-[#1f1f24] px-[12px] py-[8px] text-center text-[14px] font-semibold text-white">
            자막 나오는 공간
          </div>
        </div>

        <section className="rounded-[24px] border border-[#60606e] bg-[#202026] px-[18px] py-[22px]">
          <div className="flex flex-col gap-[22px]">
            <label className="flex flex-col gap-3">
              <span className="text-[18px] font-semibold text-white">제목</span>
              <input
                className="h-[44px] rounded-[10px] border border-[#2d2d34] bg-[#121214] px-[14px] text-[14px] font-medium text-white outline-none"
                onBlur={() => {
                  updateProject.mutate({
                    projectId,
                    payload: { title: projectTitle },
                  });
                }}
                onChange={(event) => setProjectTitle(event.target.value)}
                value={projectTitle}
              />
            </label>

            <div className="flex flex-col gap-3">
              <span className="text-[18px] font-semibold text-white">영상 시간</span>
              <div className="flex h-[44px] items-center rounded-[10px] border border-[#2d2d34] bg-[#232329] px-[14px] text-[14px] font-medium text-[#8f8f98]">
                {isLoading ? "렌더링 중..." : videoDurationLabel}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[18px] font-semibold text-white">영상 다운로드</span>
              <Button
                className="w-fit min-w-[106px]"
                size="tiny"
                disabled={!resolvedStoryboardId || isLoading}
                onClick={() => {
                  window.open(getDownloadUrl(resolvedStoryboardId));
                }}
              >
                다운로드
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[18px] font-semibold text-white">
                연동된 SNS에 업로드
              </span>
              <div className="flex items-center gap-[12px]">
                {(["youtube", "tiktok", "instagram"] as const).map((target) => (
                  <button
                    key={target}
                    className="flex size-[38px] items-center justify-center rounded-full border border-[#3a3a43] bg-[#1f1f24]"
                    onClick={() => {
                      setSocialTarget(target);
                      setIsSocialModalOpen(true);
                    }}
                    type="button"
                  >
                    <Image
                      alt={target}
                      height={20}
                      src={socialAssets[target]}
                      width={20}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isSocialModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4">
          <div className="w-full max-w-[430px] rounded-[28px] bg-[#1f1f24] px-[28px] py-[30px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex justify-center">
              <Image
                alt={socialTarget}
                height={38}
                src={socialAssets[socialTarget]}
                width={38}
              />
            </div>
            <p className="pt-[22px] text-[24px] font-semibold text-white">
              @연동된 계정
            </p>
            <p className="pt-[12px] text-[18px] font-semibold text-[#d7d7dc]">
              {socialTarget === "youtube"
                ? "유튜브에 업로드하시겠어요?"
                : socialTarget === "tiktok"
                  ? "틱톡에 업로드하시겠어요?"
                  : "인스타그램에 업로드하시겠어요?"}
            </p>

            <div className="flex items-center justify-center gap-3 pt-[28px]">
              <Button
                className="min-w-[148px]"
                size="tiny"
                variant="outlined"
                onClick={() => setIsSocialModalOpen(false)}
              >
                취소
              </Button>
              <Button
                className="min-w-[148px]"
                size="tiny"
                onClick={() => setIsSocialModalOpen(false)}
              >
                업로드
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ProjectCreateShell>
  );
}
