import {
  USER_VIDEOS_STORAGE_KEY,
  buildUserVideosExport,
  loadUserVideos,
  mergeUserVideos,
  parseUserVideosJson,
  saveUserVideos,
} from './userVideos';

// Minimal in-memory stand-in so tests never touch real storage.
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
  };
}

const legacyList = [
  { id: 'a', title: 'Título A', url: 'https://youtu.be/a' },
  { id: 'b', title: 'Título B', url: 'https://youtu.be/b' },
];

describe('loadUserVideos', () => {
  test('returns an empty list when nothing is stored', () => {
    expect(loadUserVideos(memoryStorage())).toEqual([]);
  });

  test('reads the current versioned envelope', () => {
    const storage = memoryStorage({
      [USER_VIDEOS_STORAGE_KEY]: JSON.stringify({
        version: 1,
        videos: legacyList,
      }),
    });

    expect(loadUserVideos(storage)).toEqual(legacyList);
  });

  test('migrates the legacy bare-array shape', () => {
    const storage = memoryStorage({
      [USER_VIDEOS_STORAGE_KEY]: JSON.stringify(legacyList),
    });

    expect(loadUserVideos(storage)).toEqual(legacyList);
  });

  test('drops malformed entries from stored lists', () => {
    const storage = memoryStorage({
      [USER_VIDEOS_STORAGE_KEY]: JSON.stringify([
        ...legacyList,
        null,
        42,
        { title: 'sem id nem url' },
      ]),
    });

    expect(loadUserVideos(storage)).toEqual(legacyList);
  });

  test('returns an empty list for unknown future versions', () => {
    const storage = memoryStorage({
      [USER_VIDEOS_STORAGE_KEY]: JSON.stringify({
        version: 99,
        videos: legacyList,
      }),
    });

    expect(loadUserVideos(storage)).toEqual([]);
  });

  test('returns an empty list when the stored JSON is corrupt', () => {
    const storage = memoryStorage({ [USER_VIDEOS_STORAGE_KEY]: '{oops' });

    expect(loadUserVideos(storage)).toEqual([]);
  });
});

describe('saveUserVideos', () => {
  test('wraps the list in a versioned envelope', () => {
    const storage = memoryStorage();

    saveUserVideos(legacyList, storage);

    expect(JSON.parse(storage.getItem(USER_VIDEOS_STORAGE_KEY))).toEqual({
      version: 1,
      videos: legacyList,
    });
  });
});

describe('buildUserVideosExport', () => {
  test('produces the same envelope shape as storage, pretty-printed', () => {
    const payload = JSON.parse(buildUserVideosExport(legacyList));

    expect(payload).toEqual({ version: 1, videos: legacyList });
    expect(buildUserVideosExport(legacyList)).toContain('\n  "videos"');
  });
});

describe('parseUserVideosJson', () => {
  test('accepts an export payload produced by buildUserVideosExport', () => {
    const text = buildUserVideosExport(legacyList);

    expect(parseUserVideosJson(text)).toEqual(legacyList);
  });

  test('accepts the legacy bare-array shape', () => {
    expect(parseUserVideosJson(JSON.stringify(legacyList))).toEqual(legacyList);
  });

  test('returns null for corrupt JSON', () => {
    expect(parseUserVideosJson('{definitely not json')).toBeNull();
  });

  test('returns null for unknown envelope versions', () => {
    const text = JSON.stringify({ version: 99, videos: legacyList });

    expect(parseUserVideosJson(text)).toBeNull();
  });

  test('returns null when no well-formed entry remains', () => {
    const text = JSON.stringify([{ title: 'sem id nem url' }, 7]);

    expect(parseUserVideosJson(text)).toBeNull();
  });
});

describe('mergeUserVideos', () => {
  test('appends incoming videos that are not stored yet', () => {
    const current = [legacyList[0]];
    const incoming = [
      legacyList[1],
      { id: 'c', title: 'Título C', url: 'https://youtu.be/c' },
    ];

    expect(mergeUserVideos(current, incoming)).toEqual([
      legacyList[0],
      legacyList[1],
      { id: 'c', title: 'Título C', url: 'https://youtu.be/c' },
    ]);
  });

  test('keeps the stored entry when an imported id already exists', () => {
    const current = [{ id: 'a', title: 'Local', url: 'https://youtu.be/a' }];
    const incoming = [
      { id: 'a', title: 'Importado', url: 'https://youtu.be/a' },
    ];

    expect(mergeUserVideos(current, incoming)).toEqual(current);
  });
});
