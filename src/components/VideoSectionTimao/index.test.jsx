import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoSectionTimao from '.';

const videos = [
  {
    id: 'a',
    title: 'Vídeo A',
    url: 'https://www.youtube.com/watch?v=aaaaaaaaaaa',
    thumbnailUrl: 'https://example.com/a.jpg',
    category: 'Conquistas',
  },
  {
    id: 'b',
    title: 'Vídeo B',
    url: 'https://www.youtube.com/watch?v=bbbbbbbbbbb',
    thumbnailUrl: 'https://example.com/b.jpg',
    category: 'História',
  },
];

test('renders the section title and one playable card per video', () => {
  render(
    <VideoSectionTimao title="Conquistas" videos={videos} onOpen={() => {}} />,
  );
  expect(
    screen.getByRole('heading', { name: 'Conquistas' }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /assistir:/i })).toHaveLength(
    videos.length,
  );
});

test('renders previous and next navigation buttons', () => {
  render(
    <VideoSectionTimao title="Conquistas" videos={videos} onOpen={() => {}} />,
  );
  expect(
    screen.getByRole('button', { name: /anterior: conquistas/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /próximo: conquistas/i }),
  ).toBeInTheDocument();
});

test('opens a video through the onOpen callback', async () => {
  const user = userEvent.setup();
  const onOpen = vi.fn();
  render(
    <VideoSectionTimao title="Conquistas" videos={videos} onOpen={onOpen} />,
  );

  await user.click(screen.getByRole('button', { name: /assistir: vídeo a/i }));
  expect(onOpen).toHaveBeenCalledWith(videos[0]);
});
