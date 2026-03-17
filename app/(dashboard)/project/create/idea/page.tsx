import { ProjectIdeaPage } from "@/components/project-create/ProjectIdeaPage";

type ProjectCreateIdeaRoutePageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

export default async function ProjectCreateIdeaRoutePage({
  searchParams,
}: ProjectCreateIdeaRoutePageProps) {
  const resolvedSearchParams = await searchParams;

  return <ProjectIdeaPage projectId={resolvedSearchParams?.projectId} />;
}
