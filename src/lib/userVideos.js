export const USER_VIDEOS_STORAGE_KEY = 'timaoflix:userVideos';

// Bump when the stored shape changes; loaders migrate or discard older ones.
export const USER_VIDEOS_STORAGE_VERSION = 1;

function isStoredVideo(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.url === 'string',
  );
}

// Reads the persisted user videos. Accepts the current versioned envelope,
// migrates the legacy bare-array shape, and degrades to an empty list for
// corrupt JSON or unknown future shapes instead of crashing the page.
export function loadUserVideos(storage = localStorage) {
  try {
    const raw = storage.getItem(USER_VIDEOS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.filter(isStoredVideo);
    }

    if (
      parsed &&
      parsed.version === USER_VIDEOS_STORAGE_VERSION &&
      Array.isArray(parsed.videos)
    ) {
      return parsed.videos.filter(isStoredVideo);
    }

    return [];
  } catch {
    return [];
  }
}

// Writes the list wrapped in a versioned envelope so future migrations can
// detect and transform older shapes.
export function saveUserVideos(list, storage = localStorage) {
  storage.setItem(
    USER_VIDEOS_STORAGE_KEY,
    JSON.stringify({
      version: USER_VIDEOS_STORAGE_VERSION,
      videos: list,
    }),
  );
}
