import { render, screen } from '@testing-library/react';
import SkipLinkTimao from '.';

test('renders a link pointing at the main content landmark', () => {
  render(
    <SkipLinkTimao href="#main-content">Pular para o conteúdo</SkipLinkTimao>,
  );

  const skipLink = screen.getByRole('link', { name: 'Pular para o conteúdo' });
  expect(skipLink).toHaveAttribute('href', '#main-content');
});
