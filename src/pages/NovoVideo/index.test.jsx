import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NovoVideo from '.';

beforeEach(() => {
  localStorage.clear();
});

test('renders the new video heading', () => {
  render(<NovoVideo />);
  expect(
    screen.getByRole('heading', { name: 'Novo vídeo' }),
  ).toBeInTheDocument();
});

test('adds a video to the list on submit', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(screen.getByLabelText(/título/i), 'Gols da final de 2012');
  await user.type(
    screen.getByLabelText(/url do youtube/i),
    'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  );
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByText('Gols da final de 2012')).toBeInTheDocument();
  // The added video is rendered as a list item under "Seus vídeos".
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(
    screen.getByRole('heading', { name: 'Seus vídeos' }),
  ).toBeInTheDocument();
});

test('shows a validation error for an invalid YouTube URL', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(screen.getByLabelText(/título/i), 'Vídeo inválido');
  await user.type(screen.getByLabelText(/url do youtube/i), 'not-a-url');
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/url/i);
});

test('shows a validation error for an empty title', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(
    screen.getByLabelText(/url do youtube/i),
    'https://youtu.be/Bui2mO6AbxA',
  );
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/título/i);
});
