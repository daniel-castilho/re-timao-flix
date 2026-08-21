import { render, screen } from '@testing-library/react';
import BadgeTimao from '.';

test('renders its children as a badge', () => {
  render(<BadgeTimao>História</BadgeTimao>);
  expect(screen.getByText('História')).toBeInTheDocument();
});

test('renders a gold variant for trophy categories', () => {
  render(<BadgeTimao gold>Conquistas</BadgeTimao>);
  expect(screen.getByText('Conquistas')).toBeInTheDocument();
});
