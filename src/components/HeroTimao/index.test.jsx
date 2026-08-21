import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroTimao from '.';

const videos = [
  {
    id: 'libertadores-2012-campanha',
    title: 'Melhores momentos da campanha campeã — Libertadores 2012',
    category: 'Conquistas',
    url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
    thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
  },
  {
    id: 'invasao-maracana-1976',
    title: 'Invasão do Maracanã — 1976',
    category: 'História',
    url: 'https://www.youtube.com/watch?v=C9ycvHsKBm8',
    thumbnailUrl: 'https://img.youtube.com/vi/C9ycvHsKBm8/hqdefault.jpg',
  },
];

test('renders the brand heading, tagline and first featured video', () => {
  render(<HeroTimao videos={videos} onPlay={() => {}} />);
  expect(
    screen.getByRole('heading', { name: 'TimãoFlix' }),
  ).toBeInTheDocument();
  expect(screen.getByText(/em um só lugar/i)).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: videos[0].title }),
  ).toBeInTheDocument();
});

test('navigates to the next featured video', async () => {
  const user = userEvent.setup();
  render(<HeroTimao videos={videos} onPlay={() => {}} />);

  await user.click(screen.getByRole('button', { name: 'Próximo destaque' }));
  expect(
    screen.getByRole('heading', { name: videos[1].title }),
  ).toBeInTheDocument();
});

test('calls onPlay with the featured video when watch is clicked', async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<HeroTimao videos={videos} onPlay={onPlay} />);

  await user.click(screen.getByRole('button', { name: /assistir/i }));
  expect(onPlay).toHaveBeenCalledWith(videos[0]);
});
