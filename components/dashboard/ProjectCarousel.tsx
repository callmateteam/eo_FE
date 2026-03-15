"use client";

import { useRef } from "react";

import type { DashboardProject } from "@/lib/api/dashboard";

import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ProjectCreateCard } from "@/components/dashboard/ProjectCreateCard";
import { Icon } from "@/components/ui/Icon";

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
            <ProjectCard index={index} project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
