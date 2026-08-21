import { render, screen } from '@testing-library/react';
import HighlightTimao from '.';

test('renders its content inside a strong element', () => {
  render(<HighlightTimao>Imersão</HighlightTimao>);
  expect(screen.getByText('Imersão').tagName).toBe('STRONG');
});
