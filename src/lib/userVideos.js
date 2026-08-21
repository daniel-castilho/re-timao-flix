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

// Shared shape rules for storage reads and import files: accepts the current
// versioned envelope and the legacy bare-array shape; anything else is not
// recognisable user-video data.
function extractVideos(parsed) {
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
  return null;
}

// Reads the persisted user videos. Migrates the legacy bare-array shape and
// degrades to an empty list for corrupt JSON or unknown future shapes instead
// of crashing the page.
export function loadUserVideos(storage = localStorage) {
  try {
    const raw = storage.getItem(USER_VIDEOS_STORAGE_KEY);
    if (!raw) return [];

    return extractVideos(JSON.parse(raw)) ?? [];
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

// Builds the portable export payload — the same envelope used in storage,
// pretty-printed so the file stays human-readable.
export function buildUserVideosExport(list) {
  return JSON.stringify(
    { version: USER_VIDEOS_STORAGE_VERSION, videos: list },
    null,
    2,
  );
}

// Parses the JSON text of an export/import file into a validated video list.
// Returns null when nothing importable remains (corrupt JSON, unknown shape
// or zero well-formed entries).
export function parseUserVideosJson(text) {
  try {
    const videos = extractVideos(JSON.parse(text));
    return videos && videos.length > 0 ? videos : null;
  } catch {
    return null;
  }
}

// Merges two lists by id, keeping every entry of `current` (order preserved)
// and appending only the `incoming` videos whose ids are not present yet.
export function mergeUserVideos(current, incoming) {
  const knownIds = new Set(current.map((video) => video.id));
  return [...current, ...incoming.filter((video) => !knownIds.has(video.id))];
}
