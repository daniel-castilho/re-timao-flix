import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggleTimao from '.';

test('renders the sun icon in dark mode with a clear label', () => {
  render(<ThemeToggleTimao theme="dark" onToggle={() => {}} />);
  const button = screen.getByRole('button', { name: 'Ativar tema claro' });
  expect(button).toHaveTextContent('☀️');
});

test('calls onToggle when clicked', async () => {
  const user = userEvent.setup();
  const onToggle = vi.fn();
  render(<ThemeToggleTimao theme="light" onToggle={onToggle} />);

  await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }));
  expect(onToggle).toHaveBeenCalledTimes(1);
});
