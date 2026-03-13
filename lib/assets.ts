export const iconAssets = {
  avatar: "/assets/icons/avatar.svg",
  close: "/assets/icons/close.svg",
  dashboard: "/assets/icons/dashboard.svg",
  download: "/assets/icons/download.svg",
  down: "/assets/icons/down.svg",
  left: "/assets/icons/left.svg",
  line: "/assets/icons/line.svg",
  pause: "/assets/icons/pause.svg",
  "pause-line": "/assets/icons/pause-line.svg",
  play: "/assets/icons/play.svg",
  "play-line": "/assets/icons/play-line.svg",
  plus: "/assets/icons/plus.svg",
  redo: "/assets/icons/redo.svg",
  reset: "/assets/icons/reset.svg",
  right: "/assets/icons/right.svg",
  sound: "/assets/icons/sound.svg",
  sparkles: "/assets/icons/sparkles.svg",
  up: "/assets/icons/up.svg",
  upload: "/assets/icons/upload.svg",
  video: "/assets/icons/video.svg",
  "view-off": "/assets/icons/view-off.svg",
  "view-on": "/assets/icons/view-on.svg",
  wand: "/assets/icons/wand.svg",
} as const;

export const socialAssets = {
  instagram: "/assets/social/instagram.png",
  tiktok: "/assets/social/tiktok.png",
  youtube: "/assets/social/youtube.png",
} as const;

export const editorFontIconAssets = {
  alignCenter: "/assets/editor/font-icons/align-center.png",
  alignLeft: "/assets/editor/font-icons/align-left.png",
  alignRight: "/assets/editor/font-icons/align-right.png",
  textBold: "/assets/editor/font-icons/text-bold.png",
  textItalic: "/assets/editor/font-icons/text-italic.png",
  textUnderline: "/assets/editor/font-icons/text-underline.png",
} as const;

export const landingAssets = {
  cards: {
    aiStoryboard1: "/assets/landing/cards/ai-storyboard-1.png",
    aiStoryboard2: "/assets/landing/cards/ai-storyboard-2.png",
    aiStoryboard3: "/assets/landing/cards/ai-storyboard-3.png",
    characterGeneration1: "/assets/landing/cards/character-generation-1.png",
    characterGeneration2: "/assets/landing/cards/character-generation-2.png",
    characterGeneration3: "/assets/landing/cards/character-generation-3.png",
    characterChef: "/assets/landing/cards/character-chef.png",
    sceneGeneration: "/assets/landing/cards/scene-generation.png",
    scenePreview1: "/assets/landing/cards/scene-preview-1.png",
    scenePreview2: "/assets/landing/cards/scene-preview-2.png",
    storyboardCover1: "/assets/landing/cards/storyboard-cover-1.png",
    storyboardPan: "/assets/landing/cards/storyboard-pan.png",
    storyboardSauce: "/assets/landing/cards/storyboard-sauce.png",
  },
  screens: {
    aiStoryboardSection: "/assets/landing/screens/ai-storyboard-section.png",
    mainLoggedOut: "/assets/landing/screens/main-logged-out.png",
    sceneGenerationSection: "/assets/landing/screens/scene-generation-section.png",
  },
} as const;

export const commonAssets = {
  logoMark: "/assets/common/logo-mark.png",
} as const;

export const referenceAssets = {
  button: "/assets/references/button-reference.png",
  chips: "/assets/references/chips-reference.png",
  color: "/assets/references/color-reference.png",
  dragDropCard: "/assets/references/drag-drop-card-reference.png",
  font: "/assets/references/font-reference.png",
  icon: "/assets/references/icon-reference.png",
  inputField: "/assets/references/input-field-reference.png",
  interactionIllustration: "/assets/references/interaction-illustration.png",
  navi: "/assets/references/navi-reference.png",
  navigationRail: "/assets/references/navigation-rail-reference.png",
  spinnerDots: "/assets/references/spinner-dots-reference.png",
  stepbar: "/assets/references/stepbar-reference.png",
} as const;

export type IconAssetName = keyof typeof iconAssets;
export type SocialAssetName = keyof typeof socialAssets;
