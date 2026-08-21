import { render, screen } from '@testing-library/react';
import NovoVideo from '.';

test('renders the new video heading', () => {
  render(<NovoVideo />);
  expect(screen.getByRole('heading', { name: 'Novo vídeo' })).toBeInTheDocument();
});
