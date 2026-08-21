import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest configuration.
// `npm run dev` serves the app; `npm test` runs the suite via Vitest with a
// jsdom environment and the jest-dom matchers from src/setupTests.js.
export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/ (here: /re-timao-flix/).
  // This base makes the production bundle resolve its assets correctly there.
  // NOTE: keep in sync with the repo name; for another static host you can
  // drop it (root) or use './' for relative paths. Deep routes work on Pages
  // because the deploy workflow ships a copy of index.html as 404.html.
  base: '/re-timao-flix/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // setupTests.js is test infrastructure; index.jsx is the DOM bootstrap
      // (createRoot) that no component test exercises by design.
      exclude: ['src/setupTests.js', 'src/index.jsx'],
      // Enforced by vitest whenever coverage runs (`npm run test:coverage`),
      // which is how CI gates merges. Floors sit well below today's numbers
      // (≈99 stmts / ≈95 branch / ≈81 funcs) so they catch real regressions
      // without churning on every PR.
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 75,
        lines: 90,
      },
    },
  },
});
