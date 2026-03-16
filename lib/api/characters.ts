import { apiFetch } from "@/lib/api/client";

export type CharacterStyle =
  | "REALISTIC"
  | "ANIME"
  | "CARTOON_3D"
  | "ILLUSTRATION_2D"
  | "CLAY"
  | "WATERCOLOR";

export type VoiceId =
  | "alloy"
  | "ash"
  | "ballad"
  | "coral"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "sage"
  | "shimmer";

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
  error_msg?: string | null;
  id: string;
  image_url_1: string;
  image_url_2: string;
  name: string;
  status: string;
  style: CharacterStyle;
  style_label: string;
  veo_prompt?: string | null;
  voice_id?: VoiceId;
  voice_style?: string;
};

export type CustomCharacterListResponse = {
  characters: CustomCharacter[];
  total: number;
};

export type CustomCharacterCreateResponse = {
  id: string;
  message?: string;
  status?: string;
};

export type CreateCustomCharacterPayload = {
  description: string;
  image1: File;
  image2: File;
  name: string;
  style: CharacterStyle;
  voiceId?: VoiceId;
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

export async function createCustomCharacter({
  description,
  image1,
  image2,
  name,
  style,
  voiceId = "alloy",
}: CreateCustomCharacterPayload) {
  const body = new FormData();

  body.append("name", name);
  body.append("description", description);
  body.append("style", style);
  body.append("voice_id", voiceId);
  body.append("image1", image1);
  body.append("image2", image2);

  return apiFetch<CustomCharacterCreateResponse>("/api/characters/custom", {
    body,
    method: "POST",
  });
}

export async function getCustomCharacter(characterId: string) {
  return apiFetch<CustomCharacter>(`/api/characters/custom/${characterId}`, {
    method: "GET",
  });
}
