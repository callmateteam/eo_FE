import Image from "next/image";

import { Badge } from "@/components/ui/Badge";

import type { DashboardProject } from "@/lib/api/dashboard";

const placeholderImages = [
  "/assets/landing/cards/character-generation-1.png",
  "/assets/landing/cards/character-generation-2.png",
  "/assets/landing/cards/character-generation-3.png",
  "/assets/landing/cards/storyboard-cover-1.png",
];

type ProjectCardProps = {
  index: number;
  project: DashboardProject;
};

export function ProjectCard({ index, project }: ProjectCardProps) {
  const imageSrc =
    project.character_image ||
    placeholderImages[index % placeholderImages.length] ||
    "/assets/landing/cards/scene-generation.png";
  const progressLabel =
    typeof project.progress === "number" && Number.isFinite(project.progress)
      ? `${project.progress}%`
      : null;

  return (
    <article className="relative h-[280px] w-[225px] shrink-0 overflow-hidden rounded-[20px] bg-[#2c2c31]">
      <div className="absolute inset-0">
        <Image
          alt={project.title}
          className="h-full w-full object-cover"
          fill
          sizes="225px"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
      </div>

      <div className="relative flex items-start justify-end gap-1 p-3">
        {progressLabel ? <Badge color="gray" text={progressLabel} /> : null}
        {project.status_label ? <Badge color="blue" text={project.status_label} /> : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-14 rounded-b-[20px] bg-[#2c2c31] px-3 py-[14px]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[18px] font-semibold leading-[28px] tracking-[-0.18px] text-[#f5f5f5]">
            {project.title}
          </h3>
          <span className="shrink-0 truncate text-[14px] font-normal leading-6 text-[#e5e5ea]">
            {project.character_name}
          </span>
        </div>
      </div>
    </article>
  );
}
