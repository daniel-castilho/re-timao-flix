import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

function renderApp(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

test('renders the header CTA linking to the new video page', () => {
  renderApp(['/']);
  expect(screen.getByRole('link', { name: 'Novo vídeo' })).toHaveAttribute('href', '/novo-video');
});

test('renders the home page at the root route', () => {
  renderApp(['/']);
  expect(screen.getByRole('heading', { name: 'TimãoFlix' })).toBeInTheDocument();
});

test('renders the new video page at /novo-video', () => {
  renderApp(['/novo-video']);
  expect(screen.getByRole('heading', { name: 'Novo vídeo' })).toBeInTheDocument();
});

test('renders the footer credit from the Alura immersion', () => {
  renderApp(['/']);
  expect(screen.getByText(/Alura/)).toBeInTheDocument();
});
