import { apiFetch } from "./client";
import type {
  CharacterItem,
  CharacterListResponse,
  CreateCustomCharacterResponse,
  CustomCharacterItem,
  CustomCharacterListResponse,
  UpdateCustomCharacterPayload,
} from "./types";

export function getCharacters() {
  return apiFetch<CharacterListResponse>("GET", "/api/characters");
}

export function getCharacter(characterId: string) {
  return apiFetch<CharacterItem>("GET", `/api/characters/${characterId}`);
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

export function updateCustomCharacter(
  characterId: string,
  payload: UpdateCustomCharacterPayload,
) {
  return apiFetch<CustomCharacterItem>(
    "PATCH",
    `/api/characters/custom/${characterId}`,
    payload,
  );
}
