# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2](https://github.com/daniel-castilho/re-timao-flix/compare/v0.2.1...v0.2.2) (2026-08-21)


### Continuous Integration

* **release:** attach the bundle in the merge-push run itself ([1f3990c](https://github.com/daniel-castilho/re-timao-flix/commit/1f3990c3d1fbd381b7580f818990383d9d95735f))


### Miscellaneous

* **git:** stop tracking the release bundle archive ([629f166](https://github.com/daniel-castilho/re-timao-flix/commit/629f166ba149d1f66939c1ae41a6073001e45505))

## [0.2.1](https://github.com/daniel-castilho/re-timao-flix/compare/v0.2.0...v0.2.1) (2026-08-21)


### Fixed

* **ci:** exempt the Release Please changelog from prettier ([3a19b54](https://github.com/daniel-castilho/re-timao-flix/commit/3a19b5498a43265b5b117a94873d570cfacc1a30))

## [0.2.0](https://github.com/daniel-castilho/re-timao-flix/compare/v0.1.0...v0.2.0) (2026-08-21)


### Added

* **a11y:** accessibility pass with real rem scale ([d2f4e08](https://github.com/daniel-castilho/re-timao-flix/commit/d2f4e08a08418a89ff402ff140045d50660aac49))
* **a11y:** full focus trap in the video player modal ([ca17a44](https://github.com/daniel-castilho/re-timao-flix/commit/ca17a444b97b768248db708c34e6ad877ca6d3fe))
* **app:** video detail page, versioned storage and Pages deep-route fix ([89c4774](https://github.com/daniel-castilho/re-timao-flix/commit/89c477449a8e02f247f69bdfb57ff37b784ea7db))
* **home:** add curated video catalog with Netflix-style carousels ([35504a1](https://github.com/daniel-castilho/re-timao-flix/commit/35504a16045c6f6245cb1935a95f6879c9fe1033))
* **routing:** add react-router with Home and NovoVideo pages ([42711f7](https://github.com/daniel-castilho/re-timao-flix/commit/42711f7b66bb90007b6315c80f33952f0b336660))
* **storage:** export/import of user videos as versioned JSON ([c5de865](https://github.com/daniel-castilho/re-timao-flix/commit/c5de8659f3c54b7b5ad995a489db9b410ed45610))
* **ui:** always-dark UI with WCAG AA contrast fixes ([c729219](https://github.com/daniel-castilho/re-timao-flix/commit/c72921923f18039c22b40ac965208c973e82d871))
* **ui:** dark streaming redesign with hero, carousel arrows and video form ([b5198c3](https://github.com/daniel-castilho/re-timao-flix/commit/b5198c3b7847b117ac252a80db637ec9d1948a81))
* **ui:** embedded player, search, rotating hero, light theme and a11y checks ([84d3fe6](https://github.com/daniel-castilho/re-timao-flix/commit/84d3fe61d30ab0e5ab0972b62fbcfd9d90426b49))


### Fixed

* **build:** restore react-scripts 5.0.1 after phantom 0.0.0 audit-fix ([dcd69cd](https://github.com/daniel-castilho/re-timao-flix/commit/dcd69cd70c1af1615b3202d0afd50a69473117de))


### Changed

* **naming:** rename PT-BR identifiers to English (i18n-ready) ([c50148c](https://github.com/daniel-castilho/re-timao-flix/commit/c50148c639757218e84aa4a7fbd719b3a66926e2))
* **srp:** extract groupVideosByCategory; remove noise comment and dead lookup ([7e2d2f5](https://github.com/daniel-castilho/re-timao-flix/commit/7e2d2f5ba9d8f957cbe70058a54ac065c27ad38f))


### Documentation

* add CI, AGENTS, lessons, changelog and rewrite README ([554775b](https://github.com/daniel-castilho/re-timao-flix/commit/554775b082d7b880e5f9287f47cee54be2f5dc4c))
* add coding standards reference ([fee098a](https://github.com/daniel-castilho/re-timao-flix/commit/fee098a309d57bcb8e526d8fd4b5eee48ca56846))
* add docs suite and GitHub Pages deploy workflow ([85608e0](https://github.com/daniel-castilho/re-timao-flix/commit/85608e0bc098736482c49fcd675a0095bc07ecc9))
* add docs suite and GitHub Pages deploy workflow ([61e2233](https://github.com/daniel-castilho/re-timao-flix/commit/61e22335b51989538e9dddf11028c3e443149892))
* add testing playbook and wire cross-references ([ddaa59b](https://github.com/daniel-castilho/re-timao-flix/commit/ddaa59b3204ffb415b437b6fcaf9e61358fe5dc4))
* sync docs for coding standards adoption and rem unification ([4fd28a8](https://github.com/daniel-castilho/re-timao-flix/commit/4fd28a846a1e8fbb9ccbfc39dacf24db03ab80ba))


### Continuous Integration

* bump actions/checkout and actions/setup-node to v6 (node24 runtime) ([e4b8ed7](https://github.com/daniel-castilho/re-timao-flix/commit/e4b8ed75df7cc5c8a5cfff33977f8357d7a35b4a))
* **coverage:** enforce v8 coverage thresholds as a merge gate ([6ad2204](https://github.com/daniel-castilho/re-timao-flix/commit/6ad2204939a906dd2aaed465f97884d713e8bf4c))
* **release:** automate versioning and GitHub Releases via Release Please ([0fee143](https://github.com/daniel-castilho/re-timao-flix/commit/0fee1433e1da8e0b81601668428901ebd6b23cc6))
* run tests on a Node 22+24 matrix with an informational coverage step ([fc4aa4a](https://github.com/daniel-castilho/re-timao-flix/commit/fc4aa4ac5c28b08f3f5f4109e2a0a0a9285c549d))


### Miscellaneous

* **deploy:** track deployment readiness reference; harden dotenv gitignore ([2af61bf](https://github.com/daniel-castilho/re-timao-flix/commit/2af61bf368ed3a76c92d90040d398917d47c75b7))
* remove stray backup artifacts; ignore *.bak.* ([55cbe39](https://github.com/daniel-castilho/re-timao-flix/commit/55cbe39579240ca42073f7c030c5cdc9d8a3cd63))
* **style:** add ESLint 10 + Prettier with CI gates ([7d957f7](https://github.com/daniel-castilho/re-timao-flix/commit/7d957f7a4eb5fff82602e257f3fe9fdcb5a784f0))
* **toolchain:** approve esbuild install script via npm allowScripts ([3401575](https://github.com/daniel-castilho/re-timao-flix/commit/3401575b6c32e880e2a8fd356bfa1d9cc5c0d347))

## [Unreleased]

### Added

- **Dark streaming redesign** — deep-graphite palette (`#0b0d0f`/`#1a2027`), gold accent for
  "Conquistas", sticky blurred header with navigation, Home **hero** with a featured-video CTA,
  refined video cards (hover play overlay, category badges), and carousel **prev/next arrows**.
- **Functional "Novo vídeo" page** — form (title, category, YouTube URL) with validation that
  adds videos to a local list persisted in `localStorage` (`timaoflix:userVideos`).
- New components with tests: `HeroTimao`, `NavLinkTimao`, `BadgeTimao`.
- **Embedded video player** — `VideoModalTimao` opens a `youtube-nocookie` iframe modal from
  cards and the hero "Assistir" button (Escape/overlay/button close, body scroll lock) with a
  **full focus trap**: Tab/Shift+Tab cycle inside the dialog, initial focus lands on the close
  button and focus returns to the trigger element on close.
- **Always-dark UI** — the deep-graphite palette is the only theme (no light/dark toggle);
  `colours.css` sets `color-scheme: dark` so native widgets follow, and the palette passed a
  WCAG AA contrast audit (badges, CTA buttons, muted text, error text).
- **Video detail page** — `/video/:id` with a large embedded player, category badge and
  YouTube link; reachable from the modal's "Detalhes" link. Unknown ids fall back to Home; the
  lookup covers curated and user-added videos.
- **Versioned user-video storage** — `src/lib/userVideos.js` wraps `timaoflix:userVideos` in a
  `{ version, videos }` envelope (`USER_VIDEOS_STORAGE_VERSION`), migrates the legacy bare-array
  shape and degrades safely on corrupt/unknown data; unit-tested.
- **Export/import of user videos** — dependency-free portability between devices: the Novo vídeo
  page downloads the personal collection as a pretty-printed versioned JSON file and imports
  files back (same envelope or legacy array), merging by id without clobbering stored entries;
  invalid payloads are rejected with an inline alert.
- **Search** — Home title search (accent/case-insensitive via `src/lib/text.js`) with a
  no-results message.
- **Rotating hero** — three featured videos (one per category) rotate every 6 s, honouring
  `prefers-reduced-motion`, with dots and prev/next controls.
- **Accessibility checks** — `src/a11y.test.jsx` runs axe-core (via `vitest-axe`) against App,
  Home and NovoVideo; `globals.vitest` added to the ESLint test config.
- Shared pure helpers with tests: `src/lib/youtube.js` (id extraction, embed URLs) and
  `src/lib/text.js` (normalization).

### Changed

- `colours.css` extended (surfaces, text scale, gold, shadows, radii, header background token);
  `reset.css` uses the new tokens and a real `rem` scale.
- **Contrast fixes from the WCAG AA audit:** category badges now use near-black ink on the
  brand blue (was light gray on blue, 3.70:1 → 4.64:1) and the primary CTA buttons (hero
  "Assistir", form submit) use near-black ink on `--color-primary-light`, inverting to a light
  surface on hover (was white on blue, 4.20:1 → 6.62:1).
- The opt-in light theme and `ThemeToggleTimao`/`useTheme` were removed before release — the UI
  is always dark; the `timaoflix:theme` localStorage key no longer exists.
- `--color-surface-border` lightened to `#606f81`, clearing 3:1 against every dark surface
  (decorative borders are now WCAG-non-text-contrast compliant as well).
- Deep routes no longer 404 on GitHub Pages: the deploy workflow emits a `404.html` copy of the
  SPA entry so refreshes on `/novo-video` or `/video/:id` bootstrap the client router.
- **Coverage thresholds are now a CI gate** — `npm run test:coverage` enforces v8 floors
  (≥90% statements/lines, ≥85% branches, ≥75% functions) and CI runs it instead of a plain
  test pass plus an informational summary.
- **Automated releases via Release Please** — `.github/workflows/release.yml` maintains a
  rotating release PR from Conventional Commits (bumps `package.json` + `CHANGELOG.md`); merging
  it tags the commit, publishes the GitHub Release and attaches the production bundle built from
  the tagged commit through all CI gates.
- Full keyboard-navigation sweep completed: every interactive element has a visible focus
  indicator and an accessible name; no tabindex misuse.
- `VideoCardTimao` is now a button that opens the player modal (no more `target="_blank"` cards);
  the external YouTube link moved into the modal footer.
- Test suite stands at **67 tests across 23 suites** (lib incl. storage envelope, modal + focus
  trap, detail page, search, hero rotation, axe checks).
- Deployment readiness doc refreshed: factors 5–6 are compliant (Deploy workflow live on Pages;
  rollback = re-run an earlier commit); TODO list reduced to coverage thresholds and release
  notes.
- `AGENTS.md` debt updated: resolved — modal focus trap, colour-contrast audit, deep-route 404,
  unversioned localStorage; remaining debt notes only the iframe keyboard limitation inherent to
  embedded players.

### Security

- **`npm audit` is now at 0 vulnerabilities** — the migration from the EOL Create React App
  toolchain to Vite removed the entire vulnerable CRA tree (previously 217 → 28, all in
  dev/build tooling). GHSA-3jxr-9vmj-r5cp / CVE-2026-13149 (`brace-expansion`) and the rest of
  the family are fully out of the tree.

### Changed

- **Sizing unified on `rem`:** the 17 remaining `px` declarations across styled-components
  (Header, Footer, Button, Logo, VideoCard, VideoSection, Home, NovoVideo) were converted under
  the established `1rem == 1px` convention (see `html { font-size: 1px }` in `reset.css`) —
  no visual change. The `@media (max-width: 800px)` breakpoint intentionally stays in `px`
  (in media queries, `rem` resolves against the browser's initial root font size, not the
  project's). The root font-size hack itself is now tracked as accessibility debt in
  `AGENTS.md`.
- Clean Code pass: video data fields and component props renamed to English
  (`title`, `category`, `thumbnailUrl`); category grouping extracted into the pure helper
  `groupVideosByCategory` (unit-tested) so `Home` is presentation-only; noise comment and a
  duplicated DOM lookup removed.
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
