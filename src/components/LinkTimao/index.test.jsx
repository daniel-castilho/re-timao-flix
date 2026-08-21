import { render, screen } from '@testing-library/react';
import LinkTimao from '.';

test('renders an anchor forwarding the href', () => {
  render(<LinkTimao href="https://alura.com.br">Alura</LinkTimao>);
  const link = screen.getByRole('link', { name: 'Alura' });
  expect(link).toHaveAttribute('href', 'https://alura.com.br');
});
