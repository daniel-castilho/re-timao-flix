import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ButtonLinkTimao from '.';

test('renders a router link reusing the button styles', () => {
  render(
    <MemoryRouter>
      <ButtonLinkTimao to="/novo-video">Novo vídeo</ButtonLinkTimao>
    </MemoryRouter>,
  );
  const link = screen.getByRole('link', { name: 'Novo vídeo' });
  expect(link).toHaveAttribute('href', '/novo-video');
});
