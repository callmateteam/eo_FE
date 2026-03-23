export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  characters: {
    preset: ["characters", "preset"] as const,
    presetSingle: (id: string) => ["characters", "preset", id] as const,
    custom: ["characters", "custom"] as const,
    customSingle: (id: string) => ["characters", "custom", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  storyboard: (id: string) => ["storyboard", id] as const,
  videoEdit: (id: string) => ["video-edit", id] as const,
  videoInfo: (id: string) => ["video-info", id] as const,
  dashboard: ["dashboard"] as const,
  youtube: {
    uploadStatus: (id: string) => ["youtube-upload-status", id] as const,
  },
};
