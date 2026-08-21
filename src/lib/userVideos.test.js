import {
  USER_VIDEOS_STORAGE_KEY,
  loadUserVideos,
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
