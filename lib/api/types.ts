// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export type User = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  profile_image: string | null;
  social: {
    youtube: boolean;
    tiktok: boolean;
    instagram: boolean;
  };
  created_at: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  username: string;
  password: string;
  verification_token: string;
};

export type ValidateUsernameResponse = {
  available: boolean;
  username: string;
  verification_token: string | null;
  message: string;
};

export type AuthResponse = {
  user_id: string;
  username: string;
  message: string;
};

export type GoogleAuthResponse = AuthResponse & {
  email: string | null;
  is_new_user: boolean;
};

// ---------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------

export type CharacterItem = {
  id: string;
  name: string;
  name_en?: string;
  series?: string;
  category?: string;
  category_label?: string;
  image_url?: string;
  thumbnail_url?: string;
  description?: string;
  prompt_features?: string;
  height_cm?: number;
  body_build?: string;
  face_features?: string;
  costume_desc?: string;
  distinct_marks?: string;
  veo_prompt?: string;
  body_type?: string;
  primary_color?: string;
};

export type CharacterListResponse = {
  characters: CharacterItem[];
  total: number;
};

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

export type CustomCharacterItem = {
  id: string;
  name: string;
  description: string;
  style: string;
  style_label?: string;
  image_url_1?: string;
  image_url_2?: string;
  veo_prompt?: string | null;
  voice_id?: string;
  voice_style?: string;
  status: string;
  error_msg?: string | null;
  created_at: string;
};

export type CustomCharacterListResponse = {
  characters: CustomCharacterItem[];
  total: number;
};

export type CreateCustomCharacterResponse = {
  id: string;
  status: string;
  message: string;
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type CreateProjectPayload = {
  title: string;
  keyword?: string;
  character_id?: string | null;
  custom_character_id?: string | null;
};

export type CreateProjectResponse = {
  id: string;
  title: string;
  current_stage: number;
  status: string;
  message: string;
};

export type ProjectListItem = {
  id: string;
  title: string;
  current_stage: number;
  stage_name: string;
  character_id?: string | null;
  custom_character_id?: string | null;
  character_name: string;
  character_image: string;
  thumbnail_url?: string | null;
  status: string;
  status_label: string;
  progress: number;
  created_at: string;
  updated_at: string;
};

export type ProjectListResponse = {
  projects: ProjectListItem[];
  total: number;
};

export type ProjectDetail = {
  id: string;
  title: string;
  keyword?: string;
  current_stage: number;
  stage_name: string;
  character_id?: string | null;
  custom_character_id?: string | null;
  character_name: string;
  character_image: string;
  storyboard_id?: string | null;
  idea?: string | null;
  status: string;
  status_label: string;
  progress: number;
  created_at: string;
  updated_at: string;
};

export type UpdateProjectPayload = {
  title?: string;
  keyword?: string;
  character_id?: string | null;
  custom_character_id?: string | null;
  idea?: string;
  storyboard_id?: string | null;
  current_stage?: number | null;
};

// ---------------------------------------------------------------------------
// Enrich Idea
// ---------------------------------------------------------------------------

export type EnrichedIdeaData = {
  background: string;
  mood: string;
  main_character: string;
  supporting_characters?: string[];
  story: string;
};

export type EnrichIdeaResponse = {
  enriched: EnrichedIdeaData;
  message: string;
};

export type ConfirmEnrichedIdeaPayload = {
  background?: string;
  mood?: string;
  main_character?: string;
  supporting_characters?: string[];
  story?: string;
};

export type ConfirmEnrichedIdeaResponse = {
  id: string;
  current_stage: number;
  enriched_idea: EnrichedIdeaData;
  message: string;
};

// ---------------------------------------------------------------------------
// Storyboards
// ---------------------------------------------------------------------------

export type CreateStoryboardPayload = {
  idea: string;
  character_id?: string | null;
  custom_character_id?: string | null;
  project_id?: string | null;
};

export type CreateStoryboardResponse = {
  id: string;
  project_id: string | null;
  status: string;
  message: string;
};

export type SceneItem = {
  id: string;
  scene_order: number;
  title: string;
  content: string;
  image_prompt?: string;
  image_url: string | null;
  image_status: string;
  has_character?: boolean;
  duration: number;
  narration?: string | null;
  narration_style?: string;
  narration_url?: string | null;
  video_url: string | null;
  video_status: string;
  video_error?: string | null;
};

export type StoryboardDetail = {
  id: string;
  idea: string;
  character_id?: string | null;
  custom_character_id?: string | null;
  project_id?: string | null;
  status: string;
  error_msg?: string | null;
  bgm_mood?: string | null;
  final_video_url?: string | null;
  scenes: SceneItem[];
  total_duration: number;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Video Edit
// ---------------------------------------------------------------------------

export type SubtitleStyle = {
  font?: string;
  font_size?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  shadow?: {
    enabled: boolean;
    color: string;
    offset: number;
  };
  background?: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  outline_color?: string;
  outline_size?: number;
  position?: string;
  position_y?: number | null;
  animation?: string;
  per_char_sizes?: number[] | null;
};

export type SubtitleItem = {
  scene_id: string;
  text: string;
  start: number;
  end: number;
  style?: SubtitleStyle;
};

export type EditSceneItem = {
  scene_id: string;
  order: number;
  trim_start?: number;
  trim_end?: number | null;
  speed?: number;
  transition?: string;
};

export type TtsOverlayItem = {
  id?: string | null;
  text: string;
  voice_id?: string;
  voice_style?: string;
  start: number;
  scene_id: string;
  audio_url?: string | null;
};

export type EditData = {
  scenes?: EditSceneItem[];
  bgm?: {
    preset?: string | null;
    custom_url?: string | null;
    volume?: number;
  };
  subtitles?: SubtitleItem[];
  tts_overlays?: TtsOverlayItem[];
  thumbnail_time?: number;
};

export type VideoEditResponse = {
  id: string;
  storyboard_id: string;
  version: number;
  edit_data: EditData;
  created_at: string;
  updated_at: string;
};

export type UndoVideoEditResponse = {
  id: string;
  version: number;
  edit_data: EditData;
  message: string;
};

export type TtsResponse = {
  audio_url: string;
  duration: number;
  message: string;
};

export type RenderResponse = {
  storyboard_id: string;
  status: string;
  message: string;
};

export type FinalizeResponse = {
  project_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: number;
  message: string;
};

export type VideoInfoResponse = {
  project_id: string;
  title: string;
  status: string;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: number;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type DashboardProject = {
  id: string;
  title: string;
  character_id?: string;
  character_name: string;
  character_image: string;
  status: string;
  simple_status?: string;
  status_label: string;
  progress: number;
  created_at: string;
};

export type DashboardCharacter = {
  id: string;
  name: string;
  name_en?: string;
  series?: string;
  category?: string;
  image_url?: string;
  thumbnail_url?: string;
  type: string;
  last_used_at?: string;
};

export type DashboardTrendKeyword = {
  rank: number;
  keyword: string;
  avg_views: number;
  url?: string;
};

export type DashboardCreationTrend = {
  rank: number;
  keyword: string;
  count: number;
};

export type DashboardResponse = {
  recent_projects: DashboardProject[] | null;
  recent_characters: DashboardCharacter[] | null;
  trending_keywords: DashboardTrendKeyword[];
  creation_trends: DashboardCreationTrend[] | null;
};

// ---------------------------------------------------------------------------
// YouTube
// ---------------------------------------------------------------------------

export type YouTubeConnectPayload = {
  code: string;
  redirect_uri: string;
};

export type YouTubeUploadPayload = {
  title: string;
  description?: string;
  tags?: string[];
  privacy_status?: string;
};

export type YouTubeConnectResponse = {
  channel_title: string;
  message: string;
};

export type YouTubeDisconnectResponse = {
  message: string;
};

export type YouTubeUploadResponse = {
  youtube_video_id: string;
  youtube_url: string;
  message: string;
};

export type YouTubeStatusResponse = {
  status: string;
  youtube_video_id?: string | null;
  youtube_url?: string | null;
  error?: string | null;
};
