import { render, screen } from '@testing-library/react';
import HeaderTimao from '.';

test('renders a header element wrapping its content', () => {
  render(
    <HeaderTimao>
      <span>TimãoFlix</span>
    </HeaderTimao>
  );
  expect(screen.getByText('TimãoFlix').closest('header')).toBeInTheDocument();
});
