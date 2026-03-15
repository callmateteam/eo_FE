"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "@/lib/api/dashboard";

export function useDashboard() {
  return useQuery({
    queryFn: getDashboard,
    queryKey: ["dashboard"],
    staleTime: 60_000,
  });
}
