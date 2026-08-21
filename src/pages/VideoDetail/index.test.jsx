import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { axe } from 'vitest-axe';
import videos from '../../data/videos';
import { USER_VIDEOS_STORAGE_KEY, saveUserVideos } from '../../lib/userVideos';
import Home from '../Home';
import VideoDetail from '.';

// Declares the same route shape as App so :id is populated.
function renderDetail(id) {
  return render(
    <MemoryRouter initialEntries={[`/video/${id}`]}>
      <Routes>
        <Route path="/video/:id" element={<VideoDetail />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>,
  );
}

const featured = videos[0];

afterEach(() => {
  localStorage.clear();
});

test('renders the embedded player, title and category badge', () => {
  renderDetail(featured.id);

  expect(
    screen.getByRole('heading', { name: featured.title }),
  ).toBeInTheDocument();
  const frame = screen.getByTitle(`Vídeo: ${featured.title}`);
  expect(frame.tagName).toBe('IFRAME');
  expect(frame).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/Bui2mO6AbxA',
  );
  expect(screen.getByText(featured.category)).toBeInTheDocument();
});

test('resolves ids of videos added through the form (localStorage)', () => {
  saveUserVideos([
    {
      id: 'meu-video',
      title: 'Gol histórico da torcida',
      category: 'Torcida',
      url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
      thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
    },
  ]);

  renderDetail('meu-video');

  expect(
    screen.getByRole('heading', { name: 'Gol histórico da torcida' }),
  ).toBeInTheDocument();
});

test('falls back to the home page for unknown ids', () => {
  renderDetail('video-que-nao-existe');

  expect(
    screen.getByRole('heading', { name: 'TimãoFlix' }),
  ).toBeInTheDocument();
});

test('links back to the home page', async () => {
  const user = userEvent.setup();
  renderDetail(featured.id);

  await user.click(screen.getByRole('link', { name: 'Voltar para a home' }));

  // Router navigations render through a transition, so poll instead of
  // asserting synchronously.
  expect(
    await screen.findByRole('heading', { name: 'TimãoFlix' }),
  ).toBeInTheDocument();
});

test('has no accessibility violations', async () => {
  const { container } = renderDetail(featured.id);

  // axe-core cannot reach into cross-origin frames under jsdom; the embedded
  // player is third-party content outside this app's a11y contract anyway.
  container.querySelector('iframe')?.remove();

  expect((await axe(container)).violations).toEqual([]);
});

// Guards the storage contract the page relies on.
test('reads user videos from the documented storage key', () => {
  expect(USER_VIDEOS_STORAGE_KEY).toBe('timaoflix:userVideos');
});
