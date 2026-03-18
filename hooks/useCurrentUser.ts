import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/lib/api/auth";
import { queryKeys } from "@/hooks/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
