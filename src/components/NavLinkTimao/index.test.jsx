import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NavLinkTimao from '.';

test('renders a router link to the given path', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <NavLinkTimao to="/" end>
        Início
      </NavLinkTimao>
    </MemoryRouter>,
  );

  const link = screen.getByRole('link', { name: 'Início' });
  expect(link).toHaveAttribute('href', '/');
});
