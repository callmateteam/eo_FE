export const projectCardPlaceholderImages = [
  "/assets/landing/cards/character-generation-1.png",
  "/assets/landing/cards/character-generation-2.png",
  "/assets/landing/cards/character-generation-3.png",
  "/assets/landing/cards/storyboard-cover-1.png",
];

export function getProjectCardImageSrc(imageSrc: string, index: number) {
  return (
    imageSrc ||
    projectCardPlaceholderImages[index % projectCardPlaceholderImages.length] ||
    "/assets/landing/cards/scene-generation.png"
  );
}
