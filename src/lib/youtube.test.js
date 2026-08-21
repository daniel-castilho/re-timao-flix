import { describe, expect, test } from 'vitest';
import { extractYouTubeId, toEmbedUrl } from './youtube';

describe('extractYouTubeId', () => {
  test('extracts the id from a watch URL', () => {
    expect(
      extractYouTubeId('https://www.youtube.com/watch?v=Bui2mO6AbxA'),
    ).toBe('Bui2mO6AbxA');
  });

  test('extracts the id from a youtu.be short URL', () => {
    expect(extractYouTubeId('https://youtu.be/Bui2mO6AbxA')).toBe(
      'Bui2mO6AbxA',
    );
  });

  test('returns null for a non-YouTube URL', () => {
    expect(extractYouTubeId('https://example.com/video')).toBeNull();
  });
});

describe('toEmbedUrl', () => {
  test('builds a youtube-nocookie embed URL', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=Bui2mO6AbxA')).toBe(
      'https://www.youtube-nocookie.com/embed/Bui2mO6AbxA',
    );
  });

  test('returns null for an invalid URL', () => {
    expect(toEmbedUrl('not-a-url')).toBeNull();
  });
});
