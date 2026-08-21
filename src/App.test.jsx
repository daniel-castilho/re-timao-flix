import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the TimãoFlix header with a call-to-action button', () => {
  render(<App />);
  expect(screen.getByText('Novo vídeo')).toBeInTheDocument();
});

test('renders the footer credit from the Alura immersion', () => {
  render(<App />);
  expect(screen.getByText(/Alura/)).toBeInTheDocument();
});
