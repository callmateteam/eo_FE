import Image from "next/image";

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

  return (
    <article className="relative h-[184px] w-[146px] shrink-0 overflow-hidden rounded-[16px] bg-[#292930]">
      <div className="absolute inset-0">
        <Image
          alt={project.title}
          className="h-full w-full object-cover"
          fill
          sizes="146px"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,0.04)_0%,rgba(8,8,10,0.18)_48%,rgba(20,20,23,0.88)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-[10px]">
        <div className="flex justify-end">
          <span className="rounded-full bg-[#6656ff] px-[8px] py-[5px] text-[9px] font-semibold leading-none tracking-[-0.02em] text-white">
            {project.status_label || "진행 중"}
          </span>
        </div>

        <div className="space-y-[3px]">
          <div className="flex items-end justify-between gap-3">
            <h3 className="truncate text-[12px] font-semibold leading-none tracking-[-0.02em] text-white">
              {project.title}
            </h3>
            <span className="truncate text-[10px] font-medium leading-none text-[#9a9aa5]">
              {project.character_name}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
