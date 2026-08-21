# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- **`npm audit` is now at 0 vulnerabilities** — the migration from the EOL Create React App
  toolchain to Vite removed the entire vulnerable CRA tree (previously 217 → 28, all in
  dev/build tooling). GHSA-3jxr-9vmj-r5cp / CVE-2026-13149 (`brace-expansion`) and the rest of
  the family are fully out of the tree.

### Changed
- **Toolchain migrated from Create React App to Vite:** `react-scripts` 5.0.1 → `vite` 7.3.6 +
  `@vitejs/plugin-react` 5.2; CRA's embedded Jest → `vitest` 3.2.7; `jsdom` 29 test
  environment. React 18 + styled-components 5 code moved over unchanged.
- JSX-bearing source files renamed `.js` → `.jsx` (entry, App, components, tests) and
  `index.html` moved from `public/` to the project root (Vite convention).
- `vite.config.mjs` added (Vite + Vitest: react plugin, jsdom, globals, jest-dom setup).
- `package.json` scripts updated: `start` → `vite`, `build` → `vite build`,
  `test` → `vitest run`, plus `preview` and `test:watch`; `eslintConfig`/`browserslist`
  (CRA-era) removed.
- CI (`ci.yml`): audit gate tightened to `npm audit --audit-level=high` (0 today).
- `docs/lessons.md` expanded with the Vite migration lessons.

### Added
- Smoke tests (`src/App.test.jsx`, `src/setupTests.js`) — first automated coverage.
- Project documentation: `AGENTS.md`, `docs/lessons.md`, `CHANGELOG.md`.
- GitHub Actions CI (`.github/workflows/ci.yml`) on Node 24 with npm pinned to the lockfile's
  generator version.
- `.nvmrc` pinning Node 24.
