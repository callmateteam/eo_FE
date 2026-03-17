import { ProjectStoryboardPage } from "@/components/project-create/ProjectStoryboardPage";

type ProjectCreateStoryboardRoutePageProps = {
  searchParams?: Promise<{
    projectId?: string;
    storyboardId?: string;
  }>;
};

export default async function ProjectCreateStoryboardRoutePage({
  searchParams,
}: ProjectCreateStoryboardRoutePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <ProjectStoryboardPage
      projectId={resolvedSearchParams?.projectId}
      storyboardId={resolvedSearchParams?.storyboardId}
    />
  );
}
