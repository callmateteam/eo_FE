"use client";

import { useMemo } from "react";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";
import { useProjects } from "@/hooks/useProjects";
import { getProjectCardImageSrc } from "@/lib/project-card";

export function ProjectPage() {
  const projectsQuery = useProjects();
  const projects = useMemo(
    () => projectsQuery.data?.projects ?? [],
    [projectsQuery.data]
  );

  return (
    <div className="px-[34px] pb-[38px] pt-[24px]">
      <h1 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
        프로젝트
      </h1>

      <section className="pt-[40px]">
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ProjectCreateCard />
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              characterName={project.character_name}
              imageSrc={getProjectCardImageSrc(project.character_image, index)}
              onDelete={() => undefined}
              onEdit={() => undefined}
              title={project.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
