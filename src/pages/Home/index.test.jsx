import { render, screen } from '@testing-library/react';
import Home from '.';

test('renders the home heading', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: 'TimãoFlix' })).toBeInTheDocument();
});
