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
- CI (`ci.yml`): `actions/checkout` and `actions/setup-node` bumped `@v4` → `@v6` — both majors
  now run on the Node 24 action runtime, clearing the "Node.js 20 is deprecated" annotations
  (Node 20 removal from GitHub runners lands later in 2026).
- CI (`ci.yml`) now runs a **Node 22 + 24 matrix** (Node 20 is EOL since Apr 2026; Vite 7
  requires ^20.19 || >=22.12). Every leg pins npm 11.17.0 and runs an informational coverage
  summary step (no thresholds yet).
- `docs/lessons.md` expanded with the Vite migration lessons.

### Added
- Supply-chain review of install scripts (npm 11.17 `allowScripts`): `esbuild@0.28.2` approved —
  vite's postinstall binary validator and the only install script in the tree. Advisory today;
  a future npm release will block unreviewed install scripts.
- Test coverage tooling: `@vitest/coverage-v8` (devDependency) with a `test:coverage` script —
  v8 provider over `src/**`, excluding test infrastructure (`setupTests.js`) and the DOM
  bootstrap entry (`index.jsx`). Current suite reports 100% statements/branches/functions/lines.
- Component-level test suites for every styled-component primitive
  (`src/components/*/index.test.jsx`) alongside the existing App composition smoke test —
  10 tests across 7 suites, all offline, deterministic and order-independent.
- Smoke tests (`src/App.test.jsx`, `src/setupTests.js`) — first automated coverage.
- Project documentation: `AGENTS.md`, `docs/lessons.md`, `CHANGELOG.md`.
- GitHub Actions CI (`.github/workflows/ci.yml`) on Node 24 with npm pinned to the lockfile's
  generator version.
- `.nvmrc` pinning Node 24.
