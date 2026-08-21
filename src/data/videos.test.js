import videos, { groupVideosByCategory } from './videos';

test('groups the catalog by category preserving first-appearance order', () => {
  const groups = groupVideosByCategory(videos);

  expect(groups.map((group) => group.category)).toEqual([
    'Conquistas',
    'História',
    'Documentários',
  ]);
});

test('places every video in exactly one group', () => {
  const grouped = groupVideosByCategory(videos).flatMap((group) => group.videos);

  expect(grouped).toHaveLength(videos.length);
  expect(new Set(grouped.map((video) => video.id))).toEqual(
    new Set(videos.map((video) => video.id))
  );
});
