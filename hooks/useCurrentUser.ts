"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserOrNull } from "@/lib/api/auth";

export function useCurrentUser() {
  return useQuery({
    queryFn: getCurrentUserOrNull,
    queryKey: ["auth", "me"],
    staleTime: 60_000,
  });
}
