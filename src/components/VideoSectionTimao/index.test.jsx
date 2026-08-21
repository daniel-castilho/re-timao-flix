import { render, screen } from '@testing-library/react';
import VideoSectionTimao from '.';

const videos = [
  { id: 'a', titulo: 'Vídeo A', url: 'https://example.com/a', thumb: 'https://example.com/a.jpg' },
  { id: 'b', titulo: 'Vídeo B', url: 'https://example.com/b', thumb: 'https://example.com/b.jpg' },
];

test('renders the section title and one card per video', () => {
  render(<VideoSectionTimao titulo="Conquistas" videos={videos} />);
  expect(screen.getByRole('heading', { name: 'Conquistas' })).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(videos.length);
});
