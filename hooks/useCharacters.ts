import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as charactersApi from "@/lib/api/characters";
import { queryKeys } from "@/hooks/query-keys";
import type { UpdateCustomCharacterPayload } from "@/lib/api/types";

export function useCharacters() {
  return useQuery({
    queryKey: queryKeys.characters.preset,
    queryFn: () => charactersApi.getCharacters(),
    staleTime: 60 * 1000,
  });
}

export function useCustomCharacters() {
  return useQuery({
    queryKey: queryKeys.characters.custom,
    queryFn: () => charactersApi.getCustomCharacters(),
    staleTime: 60 * 1000,
  });
}

export function useCreateCustomCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: charactersApi.createCustomCharacter,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.characters.custom });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteCustomCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: charactersApi.deleteCustomCharacter,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.characters.custom });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useCustomCharacter(characterId: string) {
  return useQuery({
    queryKey: queryKeys.characters.customSingle(characterId),
    queryFn: () => charactersApi.getCustomCharacter(characterId),
    enabled: !!characterId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateCustomCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomCharacterPayload }) =>
      charactersApi.updateCustomCharacter(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.characters.custom });
      void queryClient.invalidateQueries({ queryKey: queryKeys.characters.customSingle(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
