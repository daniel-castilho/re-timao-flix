import { render, screen } from '@testing-library/react';
import ButtonTimao from '.';

test('renders a button element with its content', () => {
  render(<ButtonTimao>Novo vídeo</ButtonTimao>);
  expect(screen.getByRole('button', { name: 'Novo vídeo' }).tagName).toBe(
    'BUTTON',
  );
});

test('forwards standard button attributes', () => {
  render(<ButtonTimao type="button">Enviar</ButtonTimao>);
  expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute(
    'type',
    'button',
  );
});
