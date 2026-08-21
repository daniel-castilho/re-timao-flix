import { render, screen } from '@testing-library/react';
import HeroTimao from '.';

const video = {
  id: 'libertadores-2012-campanha',
  title: 'Melhores momentos da campanha campeã — Libertadores 2012',
  category: 'Conquistas',
  url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
};

test('renders the brand heading and tagline', () => {
  render(<HeroTimao video={video} />);
  expect(
    screen.getByRole('heading', { name: 'TimãoFlix' }),
  ).toBeInTheDocument();
  expect(screen.getByText(/em um só lugar/i)).toBeInTheDocument();
});

test('renders the featured video title, category badge and watch link', () => {
  render(<HeroTimao video={video} />);
  expect(
    screen.getByRole('heading', { name: video.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(video.category)).toBeInTheDocument();

  const link = screen.getByRole('link', { name: /assistir/i });
  expect(link).toHaveAttribute('href', video.url);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noreferrer');
});
