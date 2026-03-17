import { ProjectSavePage } from "@/components/project-save/ProjectSavePage";

type ProjectSaveRoutePageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    storyboardId?: string;
  }>;
};

export default async function ProjectSaveRoutePage({
  params,
  searchParams,
}: ProjectSaveRoutePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <ProjectSavePage
      projectId={resolvedParams.projectId}
      storyboardId={resolvedSearchParams?.storyboardId}
    />
  );
}
