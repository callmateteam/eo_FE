"use client";

export type DraftCharacterSource = "preset" | "custom";

export type ProjectDraft = {
  characterId?: string;
  characterImage?: string;
  characterName?: string;
  characterSource?: DraftCharacterSource;
  idea?: string;
  projectId?: string;
  storyboardId?: string;
  title?: string;
};

const PROJECT_DRAFT_STORAGE_KEY = "project-create-draft";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getProjectDraft() {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(PROJECT_DRAFT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ProjectDraft;
  } catch {
    return null;
  }
}

export function setProjectDraft(draft: ProjectDraft) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(PROJECT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function updateProjectDraft(partialDraft: Partial<ProjectDraft>) {
  const currentDraft = getProjectDraft() ?? {};
  const nextDraft = {
    ...currentDraft,
    ...partialDraft,
  };

  setProjectDraft(nextDraft);

  return nextDraft;
}

export function clearProjectDraft() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY);
}
