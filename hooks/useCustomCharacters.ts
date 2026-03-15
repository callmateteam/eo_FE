"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomCharacters } from "@/lib/api/characters";

export function useCustomCharacters() {
  return useQuery({
    queryFn: getCustomCharacters,
    queryKey: ["characters", "custom"],
    staleTime: 60_000,
  });
}
