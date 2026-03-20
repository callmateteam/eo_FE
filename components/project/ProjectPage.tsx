"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError, NetworkError } from "@/lib/api/client";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectCreateCard } from "@/components/ui/ProjectCreateCard";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import { getProjectCardImageSrc } from "@/lib/project-card";
import { resolveProjectResumePath } from "@/lib/project-resume";

export function ProjectPage() {
  const router = useRouter();
  const projectsQuery = useProjects();
  const deleteProjectMutation = useDeleteProject();
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const projects = useMemo(
    () => projectsQuery.data?.projects ?? [],
    [projectsQuery.data]
  );

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
        error instanceof ApiError || error instanceof NetworkError || error instanceof Error
          ? error.message
          : "프로젝트 수정 화면으로 이동하지 못했습니다."
      );
      setPendingProjectId(null);
    }
  }

  return (
    <div className="px-[34px] pb-[38px] pt-[24px]">
      <h1 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
        프로젝트
      </h1>

      <section className="pt-[40px]">
        {errorMessage ? (
          <p className="mb-4 max-w-[720px] rounded-[14px] border border-[#5b2c32] bg-[rgba(91,44,50,0.18)] px-[18px] py-[14px] text-[14px] text-[#ffb8bf]">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <ProjectCreateCard onClick={() => router.push("/project/create")} />
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              characterName={project.character_name}
              className={pendingProjectId === project.id ? "opacity-70" : undefined}
              imageSrc={getProjectCardImageSrc(project.character_image, index)}
              onDelete={() => deleteProjectMutation.mutate(project.id)}
              onEdit={() => {
                void handleEdit(project.id);
              }}
              title={project.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
