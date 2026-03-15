import { apiFetch } from "@/lib/api/client";

export type PresetCharacter = {
  category: string;
  id: string;
  image_url: string;
  name: string;
  name_en?: string;
  thumbnail_url: string;
};

export type PresetCharacterListResponse = {
  characters: PresetCharacter[];
  total: number;
};

export type CustomCharacter = {
  created_at: string;
  description: string;
  id: string;
  image_url_1: string;
  image_url_2: string;
  name: string;
  status: string;
  style: string;
  style_label: string;
};

export type CustomCharacterListResponse = {
  characters: CustomCharacter[];
  total: number;
};

export async function getCharacters() {
  return apiFetch<PresetCharacterListResponse>("/api/characters", {
    method: "GET",
  });
}

export async function getCustomCharacters() {
  return apiFetch<CustomCharacterListResponse>("/api/characters/custom", {
    method: "GET",
  });
}
