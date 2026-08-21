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

- **Accessibility pass + real `rem` scale:** the CRA-era `html, body { font-size: 1px }` hack
  (`1rem == 1px`) was removed — the root font size is now the browser default (16px) and
  respects the user's preference. Every component value was converted (`value / 16`; hairline
  borders stay `px`), with no visual change at default settings. Alongside it: skip link
  ("Pular para o conteúdo") targeting a focusable `<main id="main-content">`, visible
  `:focus-visible` outlines in `--color-primary-medium` on buttons/links/cards, decorative
  alt text for video thumbnails (the card link is named by its title, announced once),
  "(abre em uma nova aba)" screen-reader hints on external links, logo alt simplified to
  "TimãoFlix", and the card hover zoom wrapped in a `prefers-reduced-motion` guard.
  Screen-reader/WCAG audit remains tracked as debt.
- Clean Code pass: video data fields and component props renamed to English
  (`title`, `category`, `thumbnailUrl`); category grouping extracted into the pure helper
  `groupVideosByCategory` (unit-tested) so `Home` is presentation-only; noise comment and a
  duplicated DOM lookup removed.

### Added

- **SkipLinkTimao** component (visually hidden until focused) wired in `App.jsx`.
- **Coding standards reference** (`docs/coding-standards.md`): day-to-day conventions for
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

- **Coding standards reference** (`docs/coding-standards.md`): day-to-day conventions for
  naming, structure, React/Vite, formatting, testing and security; defers to `AGENTS.md` on
  conflicts and is referenced from it ("Sources of truth").
- **Testing playbook** (`docs/testing-playbook.md`): how to write and interpret tests for this
  stack — shallow pyramid for a static SPA (data-helper unit → component unit → page/routing →
  manual browser smoke), mandatory Testing Library patterns (query by role, offline,
  props-driven fixtures), a map of the current suite (20 tests / 13 files), regression
  checklists, failure-triage table and local CI-mirror quality gates; referenced from
  `AGENTS.md` ("Sources of truth").
- Code style enforcement: ESLint 10 (flat config, `eslint.config.mjs`) + Prettier 3
  (`.prettierrc.json`, single quotes) as devDependencies, with `lint`/`format` scripts and CI
  gates (`npm run lint` + `npm run format:check`) before tests. The vendored Meyer reset is
  excluded via `.prettierignore`.

- Video catalog with Netflix-style carousels: `src/data/videos.js` curates 12 real videos
  (official channels and documented productions, PT-BR copy) grouped by category; the Home page
  renders one horizontal carousel per category via `VideoSectionTimao` + `VideoCardTimao`
  (thumbnail + title linking to YouTube).
- Client-side routing with `react-router` 7 (library mode): Home (`/`) and Novo Vídeo
  (`/novo-video`) pages plus a catch-all back to Home; the header CTA became a router link
  (`ButtonLinkTimao`, reusing `ButtonTimao` styles via `withComponent`).
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
