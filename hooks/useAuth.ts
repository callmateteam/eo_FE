import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as authApi from "@/lib/api/auth";
import { queryKeys } from "@/hooks/query-keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authApi.signup,
  });
}

export function useValidateUsername() {
  return useMutation({
    mutationFn: authApi.validateUsername,
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
