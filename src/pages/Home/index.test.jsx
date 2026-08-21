import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Home from '.';
import videos from '../../data/videos';

test('renders the home heading', () => {
  render(<Home />);
  expect(
    screen.getByRole('heading', { name: 'TimãoFlix' }),
  ).toBeInTheDocument();
});

test('renders one section per category covering every video', () => {
  render(<Home />);

  const categories = [...new Set(videos.map((video) => video.category))];
  for (const categoria of categories) {
    expect(
      screen.getByRole('heading', { name: categoria }),
    ).toBeInTheDocument();
  }

  expect(screen.getAllByRole('listitem')).toHaveLength(videos.length);
});

test('filters the catalog by title', async () => {
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText('Buscar vídeos'), 'mundial');

  expect(
    screen.getByRole('button', { name: /bicampeão mundial/i }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /libertadores 2012/i }),
  ).not.toBeInTheDocument();
});

test('shows a no-results message for an unmatched query', async () => {
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText('Buscar vídeos'), 'zzzzzz');
  expect(
    await screen.findByText(/nenhum vídeo encontrado/i),
  ).toBeInTheDocument();
});

test('opens the embedded player modal when a card is clicked', async () => {
  const user = userEvent.setup();
  // The dialog footer links to the detail route, so a router is required.
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  await user.click(
    screen.getByRole('button', {
      name: /assistir: melhores momentos da campanha/i,
    }),
  );

  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  expect(
    screen.getByTitle(/vídeo: melhores momentos da campanha/i),
  ).toBeInTheDocument();
});
