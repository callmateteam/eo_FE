"use client";

import { useRef } from "react";

import type { DashboardProject } from "@/lib/api/dashboard";
import { getProjectCardImageSrc } from "@/lib/project-card";

import { Icon } from "@/components/ui/Icon";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";

type ProjectCarouselProps = {
  projects: DashboardProject[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="relative">
      {hasProjects ? (
        <>
          <button
            aria-label="이전 프로젝트"
            className="absolute left-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
            onClick={() => scrollByOffset("left")}
            type="button"
          >
            <Icon className="size-4" name="left" />
          </button>
          <button
            aria-label="다음 프로젝트"
            className="absolute right-[-2px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#8b45ff] bg-[#26262d] text-[#c98fff]"
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
          <ProjectCreateCard />
        </div>
        {projects.map((project, index) => (
          <div key={project.id} className="snap-start">
            <ProjectCard
              characterName={project.character_name}
              imageSrc={getProjectCardImageSrc(project.character_image, index)}
              onDelete={() => undefined}
              onEdit={() => undefined}
              progressLabel={
                typeof project.progress === "number" && Number.isFinite(project.progress)
                  ? `${project.progress}%`
                  : null
              }
              statusLabel={project.status_label}
              title={project.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
