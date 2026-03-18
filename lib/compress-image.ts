const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.8;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB target

/**
 * Compress an image file using canvas.
 * - Resizes to max 2048px on longest side
 * - Converts to JPEG at 0.8 quality
 * - If still too large, reduces quality further
 */
export async function compressImage(file: File): Promise<File> {
  // Skip if already small enough and is JPEG
  if (file.size <= MAX_FILE_SIZE && file.type === "image/jpeg") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetWidth = width;
  let targetHeight = height;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    targetWidth = Math.round(width * ratio);
    targetHeight = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  // Try compressing with decreasing quality
  let quality = JPEG_QUALITY;
  let blob: Blob;

  do {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
    quality -= 0.1;
  } while (blob.size > MAX_FILE_SIZE && quality > 0.3);

  const compressedName = file.name.replace(/\.[^.]+$/, ".jpg");

  return new File([blob], compressedName, { type: "image/jpeg" });
}
