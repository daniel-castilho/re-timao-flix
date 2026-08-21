import { render, screen } from '@testing-library/react';
import LogoTimao from '.';

test('renders the logo image with descriptive alt text', () => {
  render(<LogoTimao />);
  const logo = screen.getByRole('img');
  expect(logo).toHaveAttribute('alt', '.:: TimãoFlix ::.');
});

test('points the image source at the bundled logo asset', () => {
  render(<LogoTimao />);
  expect(screen.getByRole('img').getAttribute('src')).toMatch(/logo\.png$/);
});
