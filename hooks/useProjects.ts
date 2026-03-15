"use client";

import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/lib/api/projects";

export function useProjects() {
  return useQuery({
    queryFn: getProjects,
    queryKey: ["projects"],
    staleTime: 60_000,
  });
}
