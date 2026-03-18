"use client";

import { startTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteProject } from "@/hooks/useProjects";
import { getProjectCardImageSrc } from "@/lib/project-card";
import { resolveProjectResumePath } from "@/lib/project-resume";

import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";

type DashboardProject = {
  id: string;
  title: string;
  character_name: string;
  character_image: string;
  progress?: number;
};

type ProjectCarouselProps = {
  projects: DashboardProject[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const deleteProjectMutation = useDeleteProject();
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasProjects = projects.length > 0;

  function scrollByOffset(direction: "left" | "right") {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -320 : 320,
    });
  }

  async function handleEdit(projectId: string) {
    setPendingProjectId(projectId);
    setErrorMessage(null);

    try {
      const nextPath = await resolveProjectResumePath(projectId);

      startTransition(() => {
        router.push(nextPath);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "프로젝트 수정 화면으로 이동하지 못했습니다."
      );
      setPendingProjectId(null);
    }
  }

  return (
    <div className="relative">
      {errorMessage ? (
        <p className="mb-4 max-w-[720px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] pr-10 text-[14px] text-[#ffb8bf]">
          {errorMessage}
        </p>
      ) : null}

      {hasProjects ? (
        <>
          <button
            aria-label="이전 프로젝트"
            className="absolute left-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
            onClick={() => scrollByOffset("left")}
            type="button"
          >
            <Icon className="size-4" name="left" />
          </button>
          <button
            aria-label="다음 프로젝트"
            className="absolute right-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
            onClick={() => scrollByOffset("right")}
            type="button"
          >
            <Icon className="size-4" name="right" />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        className={[
          "flex snap-x snap-mandatory gap-[10px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          hasProjects ? "pr-10" : "",
        ].join(" ")}
      >
        <div className="snap-start">
          <ProjectCreateCard onClick={() => router.push("/project/create")} />
        </div>
        {projects.map((project, index) => (
          <div key={project.id} className="snap-start">
            <ProjectCard
              characterName={project.character_name}
              className={pendingProjectId === project.id ? "opacity-70" : undefined}
              imageSrc={getProjectCardImageSrc(project.character_image, index)}
              onDelete={() => deleteProjectMutation.mutate(project.id)}
              onEdit={() => {
                void handleEdit(project.id);
              }}
              progressLabel={
                typeof project.progress === "number" && Number.isFinite(project.progress)
                  ? `${project.progress}%`
                  : null
              }
              statusLabel={project.progress === 100 ? "진행 완료" : "진행 중"}
              title={project.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
