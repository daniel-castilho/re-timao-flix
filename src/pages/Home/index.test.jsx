import { render, screen } from '@testing-library/react';
import Home from '.';
import videos from '../../data/videos';

test('renders the home heading', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: 'TimãoFlix' })).toBeInTheDocument();
});

test('renders one section per category covering every video', () => {
  render(<Home />);

  const categories = [...new Set(videos.map((video) => video.categoria))];
  for (const categoria of categories) {
    expect(screen.getByRole('heading', { name: categoria })).toBeInTheDocument();
  }

  expect(screen.getAllByRole('img')).toHaveLength(videos.length);
});
