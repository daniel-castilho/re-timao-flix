import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router';
import App from './App';
import Home from './pages/Home';
import NovoVideo from './pages/NovoVideo';

// Fails the test with the full list of axe violations when any are found.
function expectNoViolations(results) {
  expect(results.violations).toEqual([]);
}

test('App has no accessibility violations', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  expectNoViolations(await axe(container));
});

test('Home page has no accessibility violations', async () => {
  const { container } = render(<Home />);
  expectNoViolations(await axe(container));
});

test('NovoVideo page has no accessibility violations', async () => {
  const { container } = render(<NovoVideo />);
  expectNoViolations(await axe(container));
});
