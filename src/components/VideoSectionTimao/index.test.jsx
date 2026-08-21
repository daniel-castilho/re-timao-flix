import { render, screen } from '@testing-library/react';
import VideoSectionTimao from '.';

const videos = [
  { id: 'a', title: 'Vídeo A', url: 'https://example.com/a', thumbnailUrl: 'https://example.com/a.jpg' },
  { id: 'b', title: 'Vídeo B', url: 'https://example.com/b', thumbnailUrl: 'https://example.com/b.jpg' },
];

test('renders the section title and one card per video', () => {
  render(<VideoSectionTimao title="Conquistas" videos={videos} />);
  expect(screen.getByRole('heading', { name: 'Conquistas' })).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(videos.length);
});
