import { apiFetch } from "./client";
import type {
  CharacterListResponse,
  CreateCustomCharacterResponse,
  CustomCharacterItem,
  CustomCharacterListResponse,
} from "./types";

export function getCharacters() {
  return apiFetch<CharacterListResponse>("GET", "/api/characters");
}

export function getCustomCharacters() {
  return apiFetch<CustomCharacterListResponse>("GET", "/api/characters/custom");
}

export function getCustomCharacter(characterId: string) {
  return apiFetch<CustomCharacterItem>(
    "GET",
    `/api/characters/custom/${characterId}`,
  );
}

export function createCustomCharacter(formData: FormData) {
  return apiFetch<CreateCustomCharacterResponse>(
    "POST",
    "/api/characters/custom",
    formData,
  );
}

export function deleteCustomCharacter(characterId: string) {
  return apiFetch<null>("DELETE", `/api/characters/custom/${characterId}`);
}
