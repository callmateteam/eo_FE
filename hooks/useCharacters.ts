"use client";

import { useQuery } from "@tanstack/react-query";

import { getCharacters } from "@/lib/api/characters";

export function useCharacters() {
  return useQuery({
    queryFn: getCharacters,
    queryKey: ["characters", "preset"],
    staleTime: 60_000,
  });
}
