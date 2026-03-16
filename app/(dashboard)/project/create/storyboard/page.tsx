import { ProjectStoryboardPage } from "@/components/project-create/ProjectStoryboardPage";

type ProjectCreateStoryboardRoutePageProps = {
  searchParams?: Promise<{
    characterId?: string;
  }>;
};

export default async function ProjectCreateStoryboardRoutePage({
  searchParams,
}: ProjectCreateStoryboardRoutePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ProjectStoryboardPage characterId={resolvedSearchParams?.characterId} />
  );
}
