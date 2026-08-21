import { render, screen } from '@testing-library/react';
import VideoCardTimao from '.';

const video = {
  id: 'libertadores-2012-campanha',
  titulo: 'Melhores momentos da campanha campeã',
  url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  thumb: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
};

test('renders an external link with the video thumbnail and title', () => {
  render(<VideoCardTimao video={video} />);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', video.url);
  expect(link).toHaveAttribute('target', '_blank');

  expect(screen.getByRole('img')).toHaveAttribute('alt', video.titulo);
  expect(screen.getByText(video.titulo)).toBeInTheDocument();
});
