// Helpers for YouTube URLs: id extraction and embed URLs.

// Extracts the video id from a YouTube watch or short link, or null.
export function extractYouTubeId(url) {
  const match = String(url).match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  return match ? match[1] : null;
}

// Builds a privacy-enhanced embed URL (youtube-nocookie) from a watch URL.
export function toEmbedUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
