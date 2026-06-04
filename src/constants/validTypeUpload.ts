export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

export const ALLOWED_VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
];

export const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
