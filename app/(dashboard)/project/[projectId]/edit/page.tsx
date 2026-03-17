import { ProjectEditPage } from "@/components/project-edit/ProjectEditPage";

type ProjectEditRoutePageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    storyboardId?: string;
  }>;
};

export default async function ProjectEditRoutePage({
  params,
  searchParams,
}: ProjectEditRoutePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <ProjectEditPage
      projectId={resolvedParams.projectId}
      storyboardId={resolvedSearchParams?.storyboardId}
    />
  );
}
