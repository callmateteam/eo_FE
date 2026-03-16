import { ProjectIdeaPage } from "@/components/project-create/ProjectIdeaPage";

type ProjectCreateIdeaRoutePageProps = {
  searchParams?: Promise<{
    characterId?: string;
  }>;
};

export default async function ProjectCreateIdeaRoutePage({
  searchParams,
}: ProjectCreateIdeaRoutePageProps) {
  const resolvedSearchParams = await searchParams;

  return <ProjectIdeaPage characterId={resolvedSearchParams?.characterId} />;
}
