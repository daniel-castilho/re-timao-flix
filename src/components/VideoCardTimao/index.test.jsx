import { render, screen } from '@testing-library/react';
import VideoCardTimao from '.';

const video = {
  id: 'libertadores-2012-campanha',
  title: 'Melhores momentos da campanha campeã',
  url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
};

test('renders an external link named by the video title', () => {
  render(<VideoCardTimao video={video} />);

  const link = screen.getByRole('link', {
    name: `${video.title} (abre em uma nova aba)`,
  });
  expect(link).toHaveAttribute('href', video.url);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noreferrer');
});

test('keeps the thumbnail decorative so the title is announced once', () => {
  const { container } = render(<VideoCardTimao video={video} />);

  expect(container.querySelector('img')).toHaveAttribute('alt', '');
});
