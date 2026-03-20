export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  characters: {
    preset: ["characters", "preset"] as const,
    custom: ["characters", "custom"] as const,
  },
  projects: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  storyboard: (id: string) => ["storyboard", id] as const,
  videoEdit: (id: string) => ["video-edit", id] as const,
  videoInfo: (id: string) => ["video-info", id] as const,
  dashboard: ["dashboard"] as const,
};
