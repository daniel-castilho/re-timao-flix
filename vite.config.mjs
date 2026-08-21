import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest configuration.
// `npm run dev` serves the app; `npm test` runs the suite via Vitest with a
// jsdom environment and the jest-dom matchers from src/setupTests.js.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
});
