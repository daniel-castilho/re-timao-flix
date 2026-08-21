import styled from 'styled-components';

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 50%;
  background-color: var(--color-surface);
  font-size: 1.125rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-primary-medium);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

function ThemeToggleTimao({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <ToggleButton
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </ToggleButton>
  );
}

export default ThemeToggleTimao;
