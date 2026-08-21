#!/usr/bin/env bash
#
# deploy-timaoflix-docs.sh
# =============================================================================
# Recreates the re-timao-flix (TimãoFlix) documentation artifacts (all in English):
#
#   .github/workflows/ci.yml    CI: install -> test -> build -> audit gate (Node 24)
#   .nvmrc                      Node version pin (24)
#   AGENTS.md                   project rules for solo/AI-assisted development
#   docs/lessons.md             engineering lessons (phantom-0.0.0, lockfile, Dependabot)
#   CHANGELOG.md                changelog (Keep a Changelog)
#   README.md                   rewritten README (replaces the CRA boilerplate)
#
# Behavior:
#   - Creates parent directories as needed.
#   - Never overwrites silently: if a file already exists and differs, a backup
#     <file>.bak.<timestamp> is written first.
#   - Idempotent: re-running skips files whose content already matches.
#
# Usage:
#   ./deploy-timaoflix-docs.sh [path-to-project]     # default: current directory
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
info() { echo -e "${BLUE}[i]${NC} $*"; }
ok()   { echo -e "${GREEN}[ok]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[x]${NC} $*" >&2; }

PROJECT_DIR="${1:-.}"
cd "$PROJECT_DIR"

if [ ! -f package.json ]; then
  err "package.json not found in $(pwd). Run inside the re-timao-flix project or pass its path."
  exit 1
fi

# -----------------------------------------------------------------------------
# deploy_file <dest> — reads content from stdin, writes it safely (backup + skip if identical)
# -----------------------------------------------------------------------------
deploy_file() {
  local dest="$1" tmp
  mkdir -p "$(dirname "$dest")"
  tmp="$(mktemp)"
  cat > "$tmp"
  if [ -f "$dest" ] && cmp -s "$tmp" "$dest"; then
    echo -e "${GREEN}[skip]${NC} $dest (already up to date)"
  else
    if [ -f "$dest" ]; then
      local bak="${dest}.bak.$(date +%Y%m%d%H%M%S)"
      cp "$dest" "$bak"
      warn "backup: $dest -> $bak"
    fi
    cp "$tmp" "$dest"
    echo -e "${GREEN}[written]${NC} $dest"
  fi
  rm -f "$tmp"
}

echo "======================================================================"
echo "  Deploying re-timao-flix (TimãoFlix) documentation artifacts"
echo "  Target: $(pwd)"
echo "======================================================================"

deploy_file ".github/workflows/ci.yml" <<'GG_EOF'
name: CI

on:
  push:
    branches: [master]
  pull_request:

permissions:
  contents: read

jobs:
  test-build:
    name: Test & Build (Node ${{ matrix.node-version }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        # Node 20 is EOL (Apr 2026); Vite 7 requires ^20.19 || >=22.12.
        node-version: [22, 24]
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      # The lockfile was generated with npm 11.17.0. Lockfile resolution is
      # npm-version-sensitive (see docs/lessons.md), so pin the exact npm that
      # produced it to keep `npm ci` deterministic on every matrix leg.
      - name: Pin npm to the lockfile's generator version
        run: npm install --global npm@11.17.0

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Run tests
        run: npm test

      # Informational only — no thresholds yet; the summary lands in the job log.
      - name: Test coverage summary
        run: npm run test:coverage -- --coverage.reporter=text-summary

      - name: Build production bundle
        run: npm run build

      # The toolchain migration to Vite took `npm audit` to 0 vulnerabilities.
      # Keep a strict gate so regressions fail the build.
      - name: Security audit
        run: npm audit --audit-level=high
GG_EOF

deploy_file ".github/workflows/deploy.yml" <<'GG_EOF'
name: Deploy

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    name: Build & Deploy to GitHub Pages
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Set up Node.js (from .nvmrc)
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc
          cache: npm

      # The lockfile was generated with npm 11.17.0. Lockfile resolution is
      # npm-version-sensitive (see docs/lessons.md), so pin the exact npm that
      # produced it to keep `npm ci` deterministic.
      - name: Pin npm to the lockfile's generator version
        run: npm install --global npm@11.17.0

      - name: Install dependencies
        run: npm ci

      # Same gates as CI — never deploy a bundle that did not pass all of them.
      - name: Lint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Run tests
        run: npm test

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Build production bundle
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
GG_EOF

deploy_file ".nvmrc" <<'GG_EOF'
24
GG_EOF

deploy_file "AGENTS.md" <<'GG_EOF'
# AGENTS.md

TimãoFlix — a Netflix-inspired UI study project built during Alura's **#ImersãoReact**: a fan
page for Sport Club Corinthians Paulista ("Timão"). Stack: **React 18**, **styled-components 5**,
**react-router 7** (library mode), **Vite 7** (`@vitejs/plugin-react`), **Vitest 3** + Testing
Library, Node 24 (see `.nvmrc`), npm 11.17.0. No backend, no state management.

The **UI copy is Brazilian Portuguese** (product content). All code, identifiers, comments,
commit messages, documentation and log messages are in **English**.

Sources of truth (read in order): `README.md`, `AGENTS.md`, `docs/coding-standards.md`,
`docs/testing-playbook.md`, `docs/frontend-deployment-readiness.md`, `docs/lessons.md`,
`package.json`.
Re-read the relevant parts before starting any task.

## Critical rules (never violate)

1. **English only** for code, comments, commit messages, docs and logs. UI strings stay PT-BR
   (they are product content, e.g. "Novo vídeo", "#ImersãoReact").
2. **No new npm dependency without explicit human approval.** Prefer Node/npm built-ins.
3. **Node 24 pinned via `.nvmrc`; npm 11.17.0.** Lockfile discipline: regenerate the lockfile
   with the **exact npm that CI uses** (npm 11.17.0) and sanity-check with
   `rm -rf node_modules && npm ci` on that same npm before pushing — see `docs/lessons.md`
   (lockfile generation is npm-version-sensitive).
4. **NEVER run `npm audit fix --force`.** It replaces toolchain packages with phantom
   placeholders (e.g. `react-scripts@0.0.0`) that zero the audit but break the build — see
   `docs/lessons.md` (phantom 0.0.0 trap). The tree is at **0 vulnerabilities** today; keep it
   honest.
5. **Tests** run with Vitest: `npm test` (one-shot). Component tests are colocated as
   `index.test.jsx` next to the component; Vitest auto-discovers them. Suites stay fully
   offline (never assert on the network) and order-independent (no test relies on state left
   behind by another). When a data layer arrives, fixtures go under `src/test/fixtures/` and
   the global `fetch` is mocked per test. Testing conventions and triage live in
   `docs/testing-playbook.md`.
6. **JSX lives in `.jsx` files.** Vite's `@vitejs/plugin-react` transforms JSX in `.jsx`, not in
   `.js` — do not rename `.jsx` files back to `.js`, and name new JSX files `.jsx`. Plain JS
   (no JSX) can stay `.js`.
7. **Doc sync is part of Done.** After milestone-sized work (a feature, a behaviour change, a
   dependency/toolchain change, a security fix), the same change set — or an immediate follow-up
   commit — MUST update `README.md` ("Current State"), `CHANGELOG.md`, `AGENTS.md` ("Known
   technical debt"), and `docs/lessons.md` only when a durable rule was learned.
8. **Keep the security posture honest.** `npm audit` is at **0** — any new advisory is a
   regression to fix, not to paper over.
9. **Do not push to the remote unless the human explicitly asks.**
10. **Known technical debt is documented, not silently "fixed"** — flag violations to the human;
    do not expand them.

## Commands

| Purpose                      | Command                 |
| :--------------------------- | :---------------------- |
| Install dependencies         | `npm install`           |
| Dev server (port 3000)       | `npm start`             |
| Tests (one-shot, CI-style)   | `npm test`              |
| Tests (watch mode)           | `npm run test:watch`    |
| Test coverage (v8 report)    | `npm run test:coverage` |
| Lint source                  | `npm run lint`          |
| Check formatting             | `npm run format:check`  |
| Production build (`dist/`)   | `npm run build`         |
| Preview the production build | `npm run preview`       |
| Security audit               | `npm audit`             |

> `npm test` is `vitest run` (non-interactive). `dist/` is gitignored (Vite output).

## Architecture

```
timaoflix/
├── index.html            Vite entry — loads /src/index.jsx, meta + manifest links
├── public/               Static assets served as-is (favicon, manifest, icons)
├── src/
│   ├── index.jsx         Entry point — React 18 createRoot + BrowserRouter, global styles
│   ├── App.jsx           Layout: HeaderTimao + <Routes> (Home, NovoVideo) + FooterTimao
│   ├── pages/            Route pages (PascalCase folders, index.jsx)
│   │   ├── Home/         Landing page ("/") — video sections by category
│   │   └── NovoVideo/    "Novo vídeo" page ("/novo-video")
│   ├── components/       styled-components primitives (PascalCase folders, index.jsx)
│   │   ├── ButtonTimao/  Nav CTA button ("Novo vídeo")
│   │   ├── ButtonLinkTimao/  ButtonTimao styles on a react-router Link (withComponent)
│   │   ├── FooterTimao/  Footer with logo + Alura credit
│   │   ├── HeaderTimao/  Top bar with logo + button
│   │   ├── HighlightTimao  Inline <strong> highlight
│   │   ├── LinkTimao/    Styled anchor
│   │   ├── LogoTimao/    Styled <img> logo
│   │   ├── VideoCardTimao/  Netflix-style card: thumbnail + title linking to YouTube
│   │   └── VideoSectionTimao/  Horizontal carousel row for one category
│   ├── data/
│   │   └── videos.js     Curated video catalog (PT-BR content, real YouTube links)
│   ├── styles/
│   │   ├── reset.css     Meyer reset (global)
│   │   └── settings/colours.css  Design tokens (--color-*)
│   ├── App.test.jsx      App composition smoke test (Vitest + jest-dom)
│   │                     + per-component suites in components/*/index.test.jsx
│   └── setupTests.js     jest-dom matchers
└── vite.config.mjs       Vite + Vitest config (react plugin; jsdom, globals, setupFiles)
```

- `eslint.config.mjs` (flat config, ESLint 10) and `.prettierrc.json` enforce code style; CI
  runs `npm run lint` + `npm run format:check` before tests. The vendored Meyer reset is
  excluded from formatting via `.prettierignore`.

- `App.jsx` is pure composition of styled-components; there are no class components, lifecycle
  hooks or business rules — keep it that way.
- Design tokens live in `colours.css` (`--color-primary-medium: #2A7AE4`,
  `--color-black-dark: #000`, `--color-gray-light: #F5F5F5`) and are referenced via
  `var(...)` inside styled-components. Add new tokens there, not inline.
- Styling belongs to styled-components only — no `.css` files per component, no inline
  `style={{}}` unless unavoidable.
- `vite.config.mjs` imports `defineConfig` from **`vitest/config`** (so the `test` block is
  honored) and must keep `.mjs` (ESM).

## Known technical debt (resolve later; flag, don't silently fix)

- No backend, no deployment pipeline — static SPA bundle only (client-side routing needs a
  fallback to `index.html` on static hosts).
- Accessibility pass not done (semantic HTML, focus states, alt text are partially improvised).
- `src/styles/reset.css` pins the root font size with `html, body { font-size: 1px }` (CRA-era
  hack so that `1rem == 1px`; all component sizing relies on it). It silently ignores the
  user's browser font-size preference — an accessibility issue to resolve together with the
  accessibility pass (proper fix: real rem scale + converting every value).

## Notes

- **Language conventions (i18n-ready):** all code is 100% English — identifiers, props, function
  names, comments, docs, commits, logs. UI strings and data content (video titles, categories,
  page copy) stay in **pt-BR**: they are product content for a Brazilian audience. When
  internationalization arrives, UI strings move to a dedicated layer (`src/i18n/`); until then
  the separation of code (English) from content (pt-BR) already holds — data lives in
  `src/data/`, copy in the components.
- Install scripts are reviewed through npm 11.17's `allowScripts` field in `package.json`
  (maintained with `npm approve-scripts`). The only entry is `esbuild@0.28.2` — vite's postinstall
  binary validator, the only install script in the tree. When an upgrade bumps the pinned
  version, review the script and re-run `npm approve-scripts <pkg>`.
- No environment variables or secrets in this project. If one is ever added, follow `.env`
  hygiene: `.env`/`.env.*` gitignored, tracked `.env.example` template, values never committed.
- For current project status and pending work, see `README.md` ("Current State" / "Roadmap").
- Hard-won engineering rules live in `docs/lessons.md`.
GG_EOF

deploy_file "docs/coding-standards.md" <<'GG_EOF'
# Coding Standards — JavaScript / React / Vite (TimãoFlix)

Practical reference for solo and AI-assisted development. Goal: **consistency over time**, not ceremony. Living document — edit as the project evolves.

**Relationship to other docs:**

| Doc               | Wins when                                            |
| ----------------- | ---------------------------------------------------- |
| `AGENTS.md`       | Project conventions, release flow, hard agent rules  |
| **This file**     | Day-to-day coding detail that does not fit in AGENTS |
| `docs/lessons.md` | Durable rules learned the hard way                   |

Where this file conflicts with `AGENTS.md`, **`AGENTS.md` wins**.

---

## 1. Naming

| Element                  | Convention                               | Example                                          |
| ------------------------ | ---------------------------------------- | ------------------------------------------------ |
| Packages / folders       | lowercase, kebab-case or feature-first   | `src/pages/novo-video`, `src/data`, `src/styles` |
| Component folders        | PascalCase                               | `VideoCardTimao`, `HeaderTimao`, `FooterTimao`   |
| Component files          | `index.jsx` inside the PascalCase folder | `src/components/VideoCardTimao/index.jsx`        |
| Test files               | colocated `index.test.jsx`               | `src/components/VideoCardTimao/index.test.jsx`   |
| Pages (route components) | PascalCase folder + `index.jsx`          | `src/pages/Home/index.jsx`                       |
| Functions / variables    | camelCase                                | `renderHome()`, `videoCount`, `useVideos()`      |
| Constants                | UPPER_SNAKE_CASE                         | `DEFAULT_PAGE_SIZE`, `API_BASE_URL`              |
| Environment variables    | UPPER_SNAKE_CASE                         | `VITE_PUBLIC_API_URL` (if ever added)            |
| Data modules             | camelCase or kebab-case                  | `src/data/videos.js`                             |
| Data helpers (pure)      | camelCase function, exported             | `groupVideosByCategory(videos)` in `videos.js`   |
| Routes                   | kebab-case paths                         | `/novo-video`                                    |

Name for **what it is or does**, not the implementation: `VideoCardTimao`, not `NetflixCardV2`.

**Data model (i18n-ready):** identifiers and code are English; only UI strings are PT-BR. The
video catalog uses English keys (`title`, `category`, `thumbnailUrl`, `url`, `id`) whose values
are PT-BR content. Keep it that way — do not reintroduce PT-BR identifiers (commit `c50148c`).

---

## 2. Package / folder structure (component-first, flat)

```
src/
├── index.jsx             Entry point — React 18 createRoot, BrowserRouter, global styles
├── App.jsx               Route table (react-router <Routes>) + shared shell (header/footer)
├── components/           Reusable presentational components (one PascalCase folder each)
│   ├── ButtonTimao/      Nav CTA button ("Novo vídeo")
│   ├── ButtonLinkTimao/  Router-aware link styled as a button (react-router)
│   ├── FooterTimao/      Footer with logo + Alura credit
│   ├── HeaderTimao/      Top bar with logo + button
│   ├── HighlightTimao/   Inline <strong> highlight
│   ├── LinkTimao/        Styled anchor
│   ├── LogoTimao/        Styled <img> logo
│   ├── VideoCardTimao/   Card for a single video (thumb + title, opens YouTube)
│   └── VideoSectionTimao  Section (carousel) rendering a category of videos
├── pages/                Route-level components (composition only)
│   ├── Home/             Landing page — one VideoSectionTimao per category
│   └── NovoVideo/        "New video" placeholder page
├── data/                 Static, module-level data (e.g. videos.js catalog)
├── styles/
│   ├── reset.css         Meyer reset (global)
│   └── settings/colours.css  Design tokens (--color-*)
├── setupTests.js         jest-dom matchers (Vitest setup)
└── *.test.jsx            Colocated test suites (one per component/page)
```

**Boundary rules:**

| Layer         | Responsibility                                                                | Imports allowed                                              |
| ------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `components/` | Pure presentational UI (props in → JSX out)                                   | styled-components, other components, `../data/*` (read-only) |
| `pages/`      | Route composition; may fetch/hold page-level state                            | `../components/*`, `../data/*`                               |
| `data/`       | Static data + **pure helpers** (e.g. `groupVideosByCategory`) — no UI imports | —                                                            |

- **No business logic in components** — keep JSX thin; derive helpers as plain functions or
  modules (see `groupVideosByCategory` extracted from `Home` in commit `7e2d2f5`). Pure data
  helpers are unit-tested in `src/data/*.test.js`.
- **No backend, no state management, no network code.** If a data layer arrives (API, forms),
  follow `AGENTS.md` rule 5 (fixtures under `src/test/fixtures/`, mock the global `fetch` per test).

---

## 3. React / JSX / Vite

- **JSX lives in `.jsx` files.** Vite's `@vitejs/plugin-react` transforms JSX in `.jsx`, **not** in
  `.js` (see `docs/lessons.md`). Name every JSX-bearing file `.jsx`; plain-JS modules (data,
  helpers) stay `.js`.
- **React 18.** Use `createRoot` from `react-dom/client` (never `ReactDOM.render`). Keep
  `<React.StrictMode>` in the entry.
- **react-router 7 (library mode).** Routes are declared in `App.jsx` with `<Routes>/<Route>`;
  link to routes with `ButtonLinkTimao`/react-router's `Link`; use kebab-case paths
  (`/novo-video`). Do not introduce a Pages Router or another router.
- **Function components only** — no class components, no lifecycle methods.
- **Props-driven presentational components.** Components receive data via props (e.g.
  `<VideoCardTimao video={video} />`) and stay reusable; page components own the data wiring.
- **No `style={{}}` inline styles unless unavoidable.** Styling goes in styled-components.

---

## 4. Formatting & tooling

- **ESLint 10** (`eslint.config.mjs`) + **Prettier 3** (`.prettierrc.json`) are installed and
  enforced by CI. Run before commit:
  - `npm run lint` / `npm run lint:fix` (ESLint over `src/`)
  - `npm run format:check` / `npm run format` (Prettier over the repo, via `.prettierignore`)
- Prettier config: **`singleQuote: true`, `semi: true`** — the codebase uses single quotes and
  semicolons. Do not introduce double quotes.
- 2 spaces, no tabs. Soft line length ~100–120 (Prettier default).
- Imports: Node built-ins → external packages → internal relative. **No wildcard imports**
  (`import * as`).
- Order of exports: a single `export default` per component file.
- `vite.config.mjs` imports `defineConfig` from **`vitest/config`** (so the `test` block is
  honored) and must keep the `.mjs` extension (ESM).
- ESLint rules in place: `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps`
  (warn), `no-unused-vars` with `argsIgnorePattern: '^_'`. Test files get jest globals via the
  dedicated config block.

---

## 5. Errors & logging

- This is a **static frontend** — there is no server-side logging path. Avoid leaving
  `console.log`/`console.error` in committed code; if a message is genuinely useful, keep it
  contextual (`console.error('failed to load videos:', err)`) and never log secrets.
- Never log passwords, tokens or personal data — even in dev.
- If a network/data layer is added later: never empty `catch`; log with context; map errors to
  user-facing messages only at the UI boundary.

---

## 6. Styling & design tokens

- **styled-components only** — no per-component `.css` files, no inline styles.
- **Design tokens live in `src/styles/settings/colours.css`** as CSS custom properties and are
  referenced via `var(...)` inside styled-components:

  | Token                    | Value     | Usage                             |
  | ------------------------ | --------- | --------------------------------- |
  | `--color-primary-medium` | `#2A7AE4` | Links, accents (Corinthians blue) |
  | `--color-black-dark`     | `#000`    | Backgrounds, footer/header        |
  | `--color-gray-light`     | `#F5F5F5` | Foreground text on dark           |

  Add new tokens to `colours.css` first; never hardcode a colour hex inside a component.

- All component sizing now uses **`rem`** under the project convention `1rem == 1px` (the
  `html, body { font-size: 1px }` rule in `reset.css`; see AGENTS debt — flagged as an
  accessibility issue to resolve with the accessibility pass). Media-query breakpoints stay
  in `px` (e.g. `@media (max-width: 800px)`): per spec, `rem` inside media queries resolves
  against the browser's initial root font size (16px), not the project's hack.
- Styled-components that target another styled component use `& ${Comp}` / `${Comp}:hover &`
  composition (see `VideoCardTimao`); keep those selectors adjacent to the styled block.

---

## 7. Testing

| Kind           | Tooling                          | Notes                                                                    |
| -------------- | -------------------------------- | ------------------------------------------------------------------------ |
| Component/page | Vitest + Testing Library (jsdom) | Colocated `index.test.jsx`; render + assert via roles                    |
| Data helpers   | Vitest (pure unit)               | `src/data/*.test.js` (e.g. `videos.test.js` for `groupVideosByCategory`) |
| Coverage       | `@vitest/coverage-v8`            | `npm run test:coverage`; informational for now (no thresholds)           |

- **Runner:** Vitest (config in `vite.config.mjs` — `environment: 'jsdom'`,
  `globals: true`, `setupFiles: './src/setupTests.js'`). Run one-shot with `npm test`
  (`vitest run`); watch with `npm run test:watch`.
- **Colocate:** every component/page folder has its own `index.test.jsx`; pure data helpers get
  `src/data/*.test.js`. Extend the existing file for that component/module — don't create
  parallel suites.
- **Test names:** descriptive — `renders the home heading`, `groups the catalog by category…`.
- **Query by role/accessibility:** prefer `screen.getByRole('heading', { name: ... })`,
  `getByRole('img', { name: ... })` over text/index lookups.
- **No network, no mocks-of-the-world:** suites stay offline, deterministic and
  order-independent (no test depends on state left by another).
- **Coverage:** `include: ['src/**']`, `exclude: ['src/setupTests.js', 'src/index.jsx']` (the
  DOM bootstrap) — keep this config accurate as the tree grows.

---

## 8. Documentation

- JSDoc where purpose is not obvious from the name; skip trivial getters.
- Comment **why**, not what.
- English only for code, comments, commits, and docs. UI strings stay PT-BR (product content).
- Durable rules: `docs/lessons.md`. Project rules: `AGENTS.md`. This file: day-to-day detail.

### Doc sync

After milestone-sized work (a feature, a public behaviour change, a dependency/toolchain change,
a debt resolution), the same change set — or an immediate follow-up commit — MUST update all of:

- `README.md` → "Current State"
- `CHANGELOG.md` (entry under the next version or `Unreleased`)
- `AGENTS.md` → "Known technical debt" (add or clear)
- `docs/lessons.md` only if a durable rule was learned

Do **not** claim work DONE while any of those files still describes a previous milestone as
current. The hard rule lives in `AGENTS.md` § _Critical rules_.

---

## 9. Version control

- Imperative commit subject: `Add video carousel to the home page`
- Small, focused commits
- Do **not** push unless the human asks
- Annotated tags only at milestones with DoD met (see `AGENTS.md`)

---

## 10. Security

- **`npm audit` is at 0** — any new advisory is a regression to fix, not to paper over. The CI
  gate runs `npm audit --audit-level=high` and fails the build on high+.
- **NEVER run `npm audit fix --force`** — it replaces toolchain packages with phantom
  placeholders (e.g. `react-scripts@0.0.0`) that zero the audit but break the build
  (see `docs/lessons.md`).
- **No new npm dependency without explicit human approval.**
- Secrets: the project currently has none. If an environment variable is ever added, follow
  `.env` hygiene — `.env`/`.env.*` gitignored, tracked `.env.example` template, values never
  committed, and only `VITE_*`-prefixed vars are exposed to the client.
- User-generated content: sanitize before rendering with a maintained library if it ever arrives.
- External links (e.g. YouTube): keep `target="_blank"` paired with `rel="noreferrer"`.

---

## Quick pre-commit checklist

- [ ] `npm run lint` and `npm run format:check` pass (ESLint + Prettier, enforced in CI)
- [ ] Files named `.jsx` for anything containing JSX; plain JS stays `.js`
- [ ] Single quotes + semicolons (Prettier `.prettierrc.json`); no wildcard imports
- [ ] Identifiers in English (PT-BR only in UI strings / data values)
- [ ] No `console.log` left in; no inline `style={{}}` added
- [ ] Colors use `var(--color-*)` tokens from `colours.css` (no new hardcoded hexes)
- [ ] New `rem`-based sizing; no new `px` unless intentional
- [ ] Colocated test added/extended for changed components (`index.test.jsx`) and data helpers
      (`src/data/*.test.js`)
- [ ] Tests pass (`npm test`); build passes (`npm run build`) for bigger changes
- [ ] No secrets in the diff
- [ ] No new npm dependencies without human approval
- [ ] Doc sync updated (README "Current State" / CHANGELOG / AGENTS debt) when milestone-sized
- [ ] Commit message says what and why (imperative, English)

---
GG_EOF

deploy_file "docs/testing-playbook.md" <<'GG_EOF'
# Testing Playbook

**Role:** Write and interpret tests for this React 18 + Vite single-page app (styled-components 5,
react-router 7, Vitest 3 + Testing Library).
**Stack constraints:** Vitest (config in `vite.config.mjs`) + Testing Library (`@testing-library/react` 14,
`jest-dom` 6, `user-event` 14). No Jest, no Playwright, no other test deps without human approval.

Sources: `AGENTS.md` · `docs/lessons.md` · `docs/coding-standards.md` · colocated `*.test.jsx` /
`*.test.js` · `vite.config.mjs` (coverage settings).

---

## Pyramid

This is a **static frontend with no backend and no network code**, so the pyramid is shallow:

1. **Data-helper unit** — pure functions over static data (`groupVideosByCategory` in
   `src/data/videos.test.js`). **No mocks, no DOM.**
2. **Component unit** — render a component with props in jsdom and assert the resulting DOM via
   roles (Testing Library). Prefer prop-driven fixtures over mocking the world.
3. **Page / routing (composition)** — render a page, or `App` inside a `MemoryRouter`, and assert
   that routes render the right trees (`src/App.test.jsx`, `src/pages/*/index.test.jsx`).
4. **Smoke (manual browser)** — `npm run dev` (or the production build) against the real browser;
   exercise navigation Home → Novo Video and back.

There is **no server, no database, no Docker**. Do not introduce network mocks, service layers or
containers until the project actually grows a data layer — the current rule is: components get
props, data lives in `src/data/*`, helpers are pure and unit-tested.

---

## Runner & layout

```bash
npm test              # vitest run — one-shot, CI-friendly
npm run test:watch    # vitest — watch mode
npm run test:coverage # vitest run --coverage (v8, informational — no thresholds yet)
```

- Colocate tests next to the code under test: `VideoCardTimao/index.jsx` →
  `VideoCardTimao/index.test.jsx`; pure data helpers → `src/data/videos.test.js`.
- English names, descriptive: `renders an external link with the video thumbnail and title`,
  `groups the catalog by category preserving first-appearance order`.
- Assert with `expect` + jest-dom matchers (`toBeInTheDocument`, `toHaveAttribute`,
  `toHaveTextContent`). Available globals come from `globals: true` in `vite.config.mjs` (no
  imports of `describe`/`test`/`expect` needed).
- jsdom environment + `src/setupTests.js` (jest-dom) are configured in `vite.config.mjs`; do not
  create per-file environments unless there is a real reason.

**Routing tests use `MemoryRouter`:**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

function renderApp(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}
```

---

## Mandatory patterns

| Pattern                 | Rule                                                                                                             |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Query by role           | Prefer `getByRole('heading'                                                                                      | 'link' | 'button' | 'img', { name })` over text/index lookups |
| Offline & deterministic | Never hit the network; never depend on timing or on state left by another test                                   |
| Colocation              | Extend the existing `index.test.jsx` / `*.test.js` for the code you changed — don't invent parallel suites       |
| Props-driven fixtures   | Component tests build small local fixtures (a `video` object, a label string) — no global factories until needed |
| `target="_blank"` links | Assert `rel="noreferrer"` alongside `target="_blank"` (security)                                                 |
| Coverage config         | Keep `include: ['src/**']` and `exclude: ['src/setupTests.js', 'src/index.jsx']` accurate as the tree grows      |
| New data helpers        | Pure unit tests (`src/data/*.test.js`) — no DOM required                                                         |
| No logic in tests       | Tests assert behaviour, they don't re-implement it (don't duplicate `groupVideosByCategory` logic in the test)   |

---

## Current automated suite (map)

| Area           | File(s)                                           | Focus                                                                                                                 |
| :------------- | :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| App / routing  | `src/App.test.jsx`                                | Header CTA links to `/novo-video`; root renders Home; `/novo-video` renders the new-video page; footer credit present |
| Button         | `src/components/ButtonTimao/index.test.jsx`       | Renders a `BUTTON` with content; forwards attributes (`type`)                                                         |
| Button (link)  | `src/components/ButtonLinkTimao/index.test.jsx`   | Router-aware button-link renders as a link                                                                            |
| Header         | `src/components/HeaderTimao/index.test.jsx`       | Header shell renders                                                                                                  |
| Footer         | `src/components/FooterTimao/index.test.jsx`       | Footer renders with logo/credit                                                                                       |
| Highlight      | `src/components/HighlightTimao/index.test.jsx`    | Inline highlight renders                                                                                              |
| Link           | `src/components/LinkTimao/index.test.jsx`         | Styled anchor renders with href                                                                                       |
| Logo           | `src/components/LogoTimao/index.test.jsx`         | Logo image renders with the expected alt                                                                              |
| Video card     | `src/components/VideoCardTimao/index.test.jsx`    | External link (href, target, rel), thumbnail alt = title                                                              |
| Video section  | `src/components/VideoSectionTimao/index.test.jsx` | Section renders its category heading and cards                                                                        |
| Data helpers   | `src/data/videos.test.js`                         | `groupVideosByCategory` — groups by category in first-appearance order; every video lands in exactly one group        |
| Home page      | `src/pages/Home/index.test.jsx`                   | Heading; one section per category covering every video                                                                |
| New-video page | `src/pages/NovoVideo/index.test.jsx`              | Placeholder page renders                                                                                              |

**Current total: 20 tests across 13 files** (as of the latest verified state). When you change
behaviour covered above, **extend the existing file** instead of inventing a parallel suite.

---

## Regression checklist

| Area                 | Must verify                                                                                                         |
| :------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Routes**           | `/` renders Home; `/novo-video` renders the new-video page; unknown paths fall back to Home (`Route path="*"`)      |
| **Header CTA**       | `ButtonLinkTimao` links to `/novo-video` with the label "Novo vídeo"                                                |
| **Video card**       | External link opens in a new tab (`target="_blank"`) with `rel="noreferrer"`; thumbnail alt equals the title        |
| **Catalog grouping** | `groupVideosByCategory` preserves first-appearance order and places every video in exactly one group                |
| **Coverage config**  | `src/setupTests.js` and `src/index.jsx` remain excluded; new src folders are still covered by `include: ['src/**']` |

**Catalog regression (data):** add/remove a video → `videos.test.js` still passes (group order,
total count).

---

## Release regression smoke (browser)

Run against the local dev server (or the production build) before a release tag:

```bash
npm install
npm run dev          # or: npm run build && npm run preview
```

**Required — stop and fix on first failure.**

| #   | Step                                | Expected                                                              |
| :-- | :---------------------------------- | :-------------------------------------------------------------------- |
| 1   | Open `http://localhost:3000/`       | Home renders with the TimãoFlix heading                               |
| 2   | Scroll the catalog                  | One carousel/section per category; all videos present with thumbnails |
| 3   | Click a video card                  | Opens the YouTube video in a **new tab**                              |
| 4   | Click "Novo vídeo"                  | Navigates to `/novo-video`                                            |
| 5   | Reload `/novo-video` directly       | Page still renders (client-side route)                                |
| 6   | Visit an unknown path (e.g. `/xyz`) | Falls back to Home (no crash)                                         |
| 7   | Resize to a narrow viewport         | Header/footer/cards remain usable (responsive)                        |

**Optional (do not block tag):** keyboard focus states on cards/links; thumbnail alt text audit.

---

## Quality gates (CI local mirror)

```bash
npm run lint           # ESLint 10 (react-hooks rules, no-unused-vars)
npm run format:check   # Prettier (singleQuote, semi) over the repo
npm test               # Vitest one-shot
npm run test:coverage  # informational summary (no thresholds yet)
npm run build          # production build (Vite)
npm audit --audit-level=high   # 0 vulnerabilities today
```

CI (`.github/workflows/ci.yml`) runs lint → format:check → test → coverage summary → build →
audit on the Node 22+24 matrix. Prefer the fast unit loop (`npm test`) during development.

---

## Reading failures

| Class                 | Signal                                          | First move                                                                                               |
| :-------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Logic**             | `AssertionError`, wrong role/name               | Fix the component or the expectation — read the test name first                                          |
| **Routing**           | `Unable to find role`, route renders wrong tree | Check `MemoryRouter initialEntries` and the `Routes` table in `App.jsx`                                  |
| **JSX transform**     | `Unexpected JSX expression` in a `.js` file     | Rename to `.jsx` (Vite/plugin-react transforms JSX only in `.jsx` — see `docs/lessons.md`)               |
| **Config**            | `test` block ignored (no jsdom, no globals)     | Confirm `defineConfig` is imported from `vitest/config` in `vite.config.mjs` (see `docs/lessons.md`)     |
| **jest-dom matchers** | `toBeInTheDocument` not a function              | Confirm `setupFiles: './src/setupTests.js'` and that `setupTests.js` imports `@testing-library/jest-dom` |
| **Flaky / env**       | Intermittent fails, ports, browser              | Re-run; fix the cause — don't skip tests                                                                 |

**Priority when many fail:** lint/format → data-helper tests → touched component tests → App
routing tests → unrelated components.

---

## Analyzer reply format

```text
## Summary
Component / test (Logic|Routing|JSX|Config|JestDom|Flaky)
Cause (one line)

## Fix plan
1. …
2. …

## Verify
npm test
# optionally: npm run lint && npm run format:check && npm run build
```

---

## Do not

- Skip, delete, or `test.skip` tests to green the build
- Add Jest/Playwright/Cypress or a new test framework without human approval
- Introduce network mocks, service layers or containers while the app has no data layer
- Assert on implementation details (class names, styled-components internals) — assert on roles
  and accessible text
- Duplicate business logic inside tests (re-deriving `groupVideosByCategory` in the test)
- Rename `.jsx` test files to `.js` (breaks the JSX transform — see `docs/lessons.md`)
- Call `npm audit fix --force` (phantom-placeholder trap — see `docs/lessons.md`)

---

## Done when

- [ ] Happy path + at least one meaningful assertion automated for the change
- [ ] New component/data-helper behaviour has a colocated `*.test.jsx` / `*.test.js`
- [ ] Route-level changes covered via `MemoryRouter` in the existing `App`/page suite
- [ ] Failure analysis names root cause and smallest fix
- [ ] `npm test` green (+ `npm run lint`, `npm run format:check`, `npm run build` as appropriate)
- [ ] Browser smoke steps clear when UI or routes are involved
- [ ] Docs synced if milestone-sized (README Current State / CHANGELOG / AGENTS debt) per `AGENTS.md`

---
GG_EOF

deploy_file "docs/frontend-deployment-readiness.md" <<'GG_EOF'
# Frontend Deployment Readiness — Reference & Compliance (TimãoFlix)

The project follows a **frontend-adapted subset of the Twelve-Factor App** methodology
([12factor.net](https://12factor.net/)). Goal: a static bundle that builds identically anywhere,
deploys to any static host with no code changes, and can be rolled back to any released commit.

> **This is a commitment, not a suggestion.** When writing or reviewing code, check the factor
> affected by the change and keep the table below green.

> This is **not** the full Twelve-Factor list. TimãoFlix is a static frontend with no backend,
> no state, no backing services and no runtime environment — the server-oriented factors
> (processes, concurrency, disposability, admin processes, backing services) are **N/A by
> design** and intentionally omitted.

## The factors and how TimãoFlix complies

| #   | Factor                              | Status                 | Notes                                                                                                                                                                                                                                                              |
| --- | ----------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Reproducible build**              | ✅ Compliant           | `package.json` + `package-lock.json` committed. CI pins npm to the lockfile's generator version (npm 11.17.0) — lockfile resolution is npm-version-sensitive (see `docs/lessons.md`). `npm ci` → `npm run build` must pass cleanly anywhere.                       |
| 2   | **Static artifact**                 | ✅ Compliant           | `npm run build` emits `dist/` (gitignored, regenerated at build time — never committed). No runtime environment variables, so **the build output is the artifact**: a given commit always produces the same bundle.                                                |
| 3   | **Config & secrets**                | ✅ Compliant           | The project has **no secrets and no required env vars**. If an env var is ever added: only `VITE_*`-prefixed variables are exposed to the client; `.env` / `.env.*` stay gitignored; a tracked `.env.example` documents the shape. Never commit real values.       |
| 4   | **CI quality gates**                | ✅ Compliant           | `.github/workflows/ci.yml` runs on every push to `master` and every PR: `npm ci` → `npm run lint` → `npm run format:check` → `npm test` → coverage summary → `npm run build` → `npm audit --audit-level=high`. A red gate blocks the merge.                        |
| 5   | **Deployment pipeline**             | ⚠️ **Not implemented** | CI validates but does **not** publish. There is no GitHub Pages / Netlify / Vercel step yet. The target (see Roadmap) is GitHub Pages from `dist/` — the CI job that builds the bundle is ready to become the publish job.                                         |
| 6   | **Release & rollback**              | ⚠️ Partial             | Commits are small and conventional; annotated tags mark milestones (`v0.1.0`-style). With a static bundle, **rollback = redeploy a previous commit** — trivial once factor 5 lands, but there is no deployment today to roll back.                                 |
| 7   | **Logs & observability (dev only)** | ✅ N/A in prod         | The app is static: no server-side logging path in production. Dev logs go to stdout (`vite`). When a deploy lands, enable the host's built-in request/asset logs (GitHub Pages offers none; a CDN/host dashboard would cover it). Never log secrets — even in dev. |

## Hard rules to keep the list green

- **Never hardcode environment-specific values** (URLs, keys, credentials) in code. The project
  currently needs none — keep it that way. If a `VITE_*` value is required later, put it in the
  build environment, never in `src/`.
- **Secrets live only in the deploy/build environment** — never in git, code, or logs. If a
  `.env` ever appears, it must be gitignored (`*.env`, `.env.*`) with a tracked `.env.example`.
- **Every build must be reproducible from the lockfile**: `rm -rf node_modules && npm ci && npm run build`. Do not rely on artifacts left in `node_modules`.
- **`dist/` is never committed** — it is a build output. Deploy the freshly built bundle from CI.
- **The CI must fail on any red gate** (lint, format, test, build, audit ≥ high) — never merge or
  deploy a bundle that did not pass all five.
- **Rollback readiness**: every deploy must be tied to a commit (immutable), so reverting is
  redeploying the previous commit/tag.
- **No new npm dependency without explicit human approval** — the lean tree is what keeps the
  audit at 0 and the build fast.

## Open TODOs (tracked)

1. **Deploy pipeline (the only ⚠️ that matters).** Add a CI job that publishes `dist/` —
   GitHub Pages is the lowest-friction target for a study project (no secrets, free, static).
   The existing `Build production bundle` step becomes the input to the publish step.
2. **Coverage thresholds** — `npm run test:coverage` is informational today; decide a minimum
   (e.g. ≥ 60–70%) and make it a CI gate once the suite stabilizes.
3. **Release automation (optional)** — document the exact release flow (tag → CI builds →
   deploy) in the README once factor 5 lands.

---
GG_EOF

deploy_file "docs/lessons.md" <<'GG_EOF'
# Lessons — TimãoFlix

Durable engineering rules learned the hard way in this project. Each entry states the failure
mode and the rule that prevents it. Add a new entry only when a rule proves itself; keep entries
short and actionable.

---

## `npm audit fix --force` installs a phantom `react-scripts@0.0.0` that breaks the build (2026-08-21)

A CRA project with `react-scripts@3.4.1` reported 217 advisories. `npm audit fix --force`
"fixed" it by writing `react-scripts: ^0.0.0` into `package.json` — npm's placeholder for "no
real fix exists" — and that placeholder package ships **no `bin/` and no code**. The audit then
reported **0 vulnerabilities**, but `npm start` / `npm run build` / `npm test` all failed with
`react-scripts: not found`. A tree that went from ~1,300 to ~150 packages was the tell.

**Rule:** never run `npm audit fix --force` on a project whose toolchain has no real fix. A "0
vulnerabilities" result obtained by force-fixing is a **fake zero** — verify with
`npm run build` + tests after any audit-driven change. If the placeholder already landed,
reinstall the real toolchain and restore the lockfile.

---

## The real fix for an EOL toolchain is migration, not force-fixing (2026-08-21)

`react-scripts@3.4.1` (Create React App, EOL since 2025) anchors hundreds of advisories through
its pinned webpack/Babel/Jest/SVG tooling. Upgrading to `react-scripts@5.0.1` + React 18 only
got the count down to 28 (all dev/build tooling, unreachable by fixes in-tree). **Migrating to
Vite (7) + Vitest (3) removed the CRA tree entirely and took `npm audit` to 0.** The React 18 +
styled-components code moved over unchanged (apart from file extensions).

**Rule:** for EOL toolchains, plan the migration — don't chase per-package overrides or
force-fixes that fabricate a green audit while hiding real debt. A migration is the honest way to
zero.

---

## Vite/plugin-react: JSX transforms only in `.jsx` files (2026-08-21)

After migrating CRA → Vite, `vite build` failed with `Unexpected JSX expression` on
`src/index.js`. CRA (Babel-based) handled JSX in `.js`; Vite's `@vitejs/plugin-react` transform
did **not** apply to `.js` files in this setup, but worked immediately once the files were
renamed `.jsx` (entry, App, components and tests).

**Rule:** in Vite + React projects, keep JSX in `.jsx` (and `.tsx` for TypeScript). Rename
JSX-bearing `.js` files during a CRA → Vite migration; plain-JS modules can stay `.js`.

---

## Vitest config must import `defineConfig` from `vitest/config` (2026-08-21)

The `test` block (`environment: 'jsdom'`, `globals: true`, `setupFiles`) in `vite.config.mjs`
was silently ignored when `defineConfig` was imported from `vite` — tests ran in the node
environment without globals (`ReferenceError: test is not defined`) and without `setupTests.js`.
Importing `defineConfig` from **`vitest/config`** fixed it.

**Rule:** for Vitest, use `import { defineConfig } from 'vitest/config'` in the shared
config file so the `test` options are honored.

---

## Pin bleeding-edge majors to the stable generation when a fresh stack misbehaves (2026-08-21)

`vite@8` + `@vitejs/plugin-react@6` failed to transform JSX because plugin-react 6 requires
three peer packages (`oxc-transform-react`, `@rolldown/plugin-babel`,
`babel-plugin-react-compiler`) that npm did not install, leaving the transform with nothing to
run. Pinning to the proven generation (`vite@7` + `@vitejs/plugin-react@5` + `vitest@3`) made
build, tests and dev server work immediately.

**Rule:** when a just-released major chain misbehaves, prefer the previous stable generation
over installing a pile of new peers or fighting configs. Revisit the new major later, when it
has stabilized.

---

## Lockfile generation is npm-version-sensitive (2026-08-21)

A `package-lock.json` regenerated with npm 11.17.0 (Node 24.19.0) failed `npm ci` under
npm 10.x / Node 20 with `Missing: yaml@2.9.0 from lock file`, yet installed cleanly under
npm 11.17.0. Different npm majors resolve the optional/transitive tree differently.

**Rule:** pin npm in CI to the exact version that generated the lockfile (here: `npm i -g
npm@11.17.0` in the workflow, Node 24 from `.nvmrc`), and sanity-check locally with
`rm -rf node_modules && npm ci` on that same npm before pushing. A locally green `npm ci` on a
different npm is not evidence the lockfile is CI-clean.

---

## Dependabot counts never equal local `npm audit` counts (2026-08-21)

After a push that fixed 217 advisories locally, GitHub reported "72 vulnerabilities" on the
default branch; later, after more fixes, "18". GitHub's Dependabot uses its own advisory
database (and older lockfile state during the scan), which is broader and lags the push.

**Rule:** evaluate by **severity and where the vulnerable package sits** (runtime vs dev/build
tooling), not by raw counts. Cross-check with `npm audit` locally and `npm ls <pkg>` for the
chain. Give Dependabot time to re-scan before acting on a count.

---

## npm 11.17 tracks reviewed install scripts in `allowScripts` (2026-08-21)

Installs with npm 11.17 print `npm warn allow-scripts ...` for every dependency that ships
preinstall/install/postinstall scripts without a review record. The mode is advisory today
(scripts still run), but a future release will block unreviewed scripts — which would turn CI's
`npm ci` into a failure mode overnight.

**Rule:** when the warning appears, read the script before approving it (e.g.
`node_modules/<pkg>/install.js`), then record the decision with `npm approve-scripts <pkg>`
(writes a version-pinned entry into `package.json`). Re-approve on version bumps — the returning
warning is the review trigger, not noise to silence with `--no-allow-scripts-pin`.
GG_EOF

deploy_file "CHANGELOG.md" <<'GG_EOF'
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
GG_EOF

deploy_file "README.md" <<'GG_EOF'
# TimãoFlix

![Node](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

TimãoFlix is a **Netflix-inspired UI study project** built during Alura's **#ImersãoReact**: a
fan page for Sport Club Corinthians Paulista ("Timão") rendered entirely with **React** and
**styled-components**, with client-side routing — no backend, no state management. The UI copy
is in Brazilian Portuguese.

**Project docs:** [AGENTS.md](AGENTS.md) (rules for solo/AI-assisted development) ·
[docs/coding-standards.md](docs/coding-standards.md) (coding standards) ·
[docs/testing-playbook.md](docs/testing-playbook.md) (testing guide) ·
[docs/frontend-deployment-readiness.md](docs/frontend-deployment-readiness.md) (deployment
readiness) · [docs/lessons.md](docs/lessons.md) (engineering lessons) ·
[CHANGELOG.md](CHANGELOG.md).

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Commands](#commands)
- [Testing](#testing)
- [Security Posture](#security-posture)
- [Current State](#current-state)
- [Roadmap](#roadmap)

## Tech Stack

| Category               | Technology                                                                                                                                                            |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language & Runtime** | ![Node](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white) (npm 11.17.0, pinned via `.nvmrc`)                           |
| **UI framework**       | ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)                                                                 |
| **Styling**            | ![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?style=for-the-badge&logo=styled-components&logoColor=white) + CSS custom properties     |
| **Routing**            | `react-router` 7 (library mode; v7 is the last generation supporting React 18)                                                                                        |
| **Build tooling**      | ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white) + `@vitejs/plugin-react`                                            |
| **Testing**            | ![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) + Testing Library (`react` 14, `jest-dom` 6, `user-event` 14) |
| **CI**                 | GitHub Actions (Node 22 + 24 matrix, npm 11.17.0)                                                                                                                     |

- **No runtime dependencies beyond React and styled-components** — the app is static and
  dependency-light at runtime.
- Design tokens are CSS custom properties in `src/styles/settings/colours.css`
  (`--color-primary-medium: #2A7AE4`, `--color-black-dark: #000`, `--color-gray-light: #F5F5F5`).
- Migrated from Create React App (`react-scripts`, EOL) to Vite — faster dev/build and a clean
  dependency tree.

## Architecture

The app is a single page composed of small styled-components — no framework layers, no data
layer:

```
timaoflix/
├── index.html            Vite entry — loads /src/index.jsx, meta + manifest links
├── public/               Static assets served as-is (favicon, manifest, icons)
└── src/
    ├── index.jsx         Entry point — React 18 createRoot + BrowserRouter, global styles
    ├── App.jsx           Layout: HeaderTimao + <Routes> (Home, NovoVideo) + FooterTimao
    ├── pages/            Route pages (PascalCase folders, index.jsx)
    │   ├── Home/         Landing page ("/") — video sections by category
    │   └── NovoVideo/    "Novo vídeo" page ("/novo-video")
    ├── components/       styled-components primitives
    │   ├── ButtonTimao/  Nav CTA button ("Novo vídeo")
    │   ├── ButtonLinkTimao/  ButtonTimao styles on a react-router Link (withComponent)
    │   ├── FooterTimao/  Footer with logo + Alura credit
    │   ├── HeaderTimao/  Top bar with logo + button
    │   ├── HighlightTimao  Inline <strong> highlight
    │   ├── LinkTimao/    Styled anchor
    │   ├── LogoTimao/    Styled <img> logo
    │   ├── VideoCardTimao/  Netflix-style card: thumbnail + title linking to YouTube
    │   └── VideoSectionTimao/  Horizontal carousel row for one category
    ├── data/
    │   └── videos.js     Curated video catalog (PT-BR content, real YouTube links)
    ├── styles/
    │   ├── reset.css     Meyer reset (global)
    │   └── settings/colours.css  Design tokens (--color-*)
    ├── App.test.jsx      App composition tests (Vitest + Testing Library)
    │                     + per-component suites in components/*/index.test.jsx
    └── setupTests.js     jest-dom matchers
├── vite.config.mjs       Vite + Vitest config (react plugin, jsdom environment)
```

- `App.jsx` is pure composition; there are no class components, lifecycle hooks or business
  rules.
- Styling lives in styled-components only; tokens come from `colours.css`.
- JSX lives in `.jsx` files (Vite/plugin-react transform JSX in `.jsx`; see
  [docs/lessons.md](docs/lessons.md) for why the files were renamed).

## Requirements

- Node.js **24** (use the bundled `.nvmrc`): `nvm use`
- npm **11.17.0** (the lockfile was generated with this version — see
  [docs/lessons.md](docs/lessons.md) for why it matters)
- No API keys, no environment variables, no backend

## Getting Started

```sh
git clone https://github.com/daniel-castilho/re-timao-flix.git
cd re-timao-flix
nvm use            # Node 24 (per .nvmrc)
npm install
npm start          # http://localhost:3000 (Vite dev server)
```

## Commands

| Purpose                      | Command                              |
| :--------------------------- | :----------------------------------- |
| Install dependencies         | `npm install`                        |
| Dev server (port 3000)       | `npm start`                          |
| Tests (one-shot)             | `npm test`                           |
| Tests (watch mode)           | `npm run test:watch`                 |
| Test coverage (v8 report)    | `npm run test:coverage`              |
| Lint source                  | `npm run lint`                       |
| Check formatting             | `npm run format:check`               |
| Production build             | `npm run build` → outputs to `dist/` |
| Preview the production build | `npm run preview`                    |
| Security audit               | `npm audit`                          |

## Testing

Tests run with **Vitest** + Testing Library in a jsdom environment (configured in
`vite.config.mjs`):

```sh
npm test             # one-shot, non-interactive (CI-friendly)
npm run test:watch   # watch mode
npm run test:coverage  # v8 coverage report
```

Current total: **20 tests across 13 suites**, all offline and deterministic (the app has no
network code):

| File                              | Scope                                                                                                             |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `src/App.test.jsx`                | Composition smoke test — header CTA ("Novo vídeo") + Alura credit.                                                |
| `src/components/*/index.test.jsx` | Per-component suites: correct DOM element, content/props forwarding, `LogoTimao` attrs (alt text, bundled asset). |
| `src/pages/*/index.test.jsx`      | Route-page suites (Home heading/tagline, Novo Vídeo heading).                                                     |
| `src/data/videos.test.js`         | Pure unit tests for `groupVideosByCategory`.                                                                      |

Testing conventions (adopted from the sibling project's discipline):

- Tests are **colocated** with the component (`index.test.jsx`); Vitest discovers them
  automatically.
- Suites are **fully offline** — never assert on the network.
- Tests are **order-independent**: no test relies on state left behind by another.

When a data layer arrives, canned responses go under `src/test/fixtures/` and the global
`fetch` is mocked per test — the same pattern used by [graphql-goodreads](https://github.com/daniel-castilho/graphql-goodreads).

## Security Posture

- **`npm audit`: 0 vulnerabilities.** The migration from Create React App to Vite removed every
  advisory (previously 217 → 28, all in CRA's dev/build tooling).
- **GHSA-3jxr-9vmj-r5cp / CVE-2026-13149** (and the other `brace-expansion` family advisories)
  are **fixed** — the vulnerable 1.1.x versions are no longer in the tree.
- **CI gate:** `npm audit --audit-level=high` (any future high+ advisory fails the build).
- Never run `npm audit fix --force` — it fabricates a fake zero by replacing toolchains with
  phantom placeholders (see [docs/lessons.md](docs/lessons.md)).

## Current State

- Netflix-style header + footer UI composed of styled-components, PT-BR copy.
- **Video catalog with Netflix-style carousels:** `src/data/videos.js` curates 12 real videos
  (official channels and documented productions) grouped into categories; the Home page renders
  one horizontal carousel per category (`VideoSectionTimao` + `VideoCardTimao`).
- **Client-side routing** with `react-router` 7: Home (`/`), Novo Vídeo (`/novo-video`),
  catch-all back to Home; the header CTA is a router link reusing the button styles.
- **Toolchain: Vite 7 + Vitest 3** (migrated from the EOL Create React App), React 18,
  testing-library 14.
- **Coding standards adopted** (`docs/coding-standards.md`, referenced from `AGENTS.md`) and
  component sizing unified on `rem` (`1rem == 1px` per the reset convention; media-query
  breakpoints stay `px`). The root font-size hack is tracked as accessibility debt.
- Component-level tests for every styled-component primitive + page/data suites + App
  composition smoke test (23 tests, 14 suites), GitHub Actions CI (install → test → coverage
  summary → build → audit gate) on a Node 22 + 24 matrix.
- **GitHub Pages deployment** configured via `.github/workflows/deploy.yml` (build with
  `base: '/re-timao-flix/'` → upload `dist/` → publish). Live once Pages is enabled with
  "Source: GitHub Actions" in the repository settings; see
  [docs/frontend-deployment-readiness.md](docs/frontend-deployment-readiness.md).
- `npm audit` at **0 vulnerabilities** (from 217, 17 critical, at the start of this effort).

## Roadmap

Deliberately not implemented yet (candidate backlog):

- Detail cards / dedicated video page.
- Product-consistency pass on accessibility (semantic HTML, focus states, alt text).
GG_EOF

deploy_file "vite.config.mjs" <<'GG_EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest configuration.
// `npm run dev` serves the app; `npm test` runs the suite via Vitest with a
// jsdom environment and the jest-dom matchers from src/setupTests.js.
export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/ (here: /re-timao-flix/).
  // This base makes the production bundle resolve its assets correctly there.
  // NOTE: keep in sync with the repo name; for another static host you can
  // drop it (root) or use './' for relative paths. It also means a hard
  // refresh on a deep route (e.g. /re-timao-flix/novo-video) 404s on Pages —
  // navigate from the home page, or switch to HashRouter for full robustness.
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
    },
  },
});
GG_EOF

echo
echo "======================================================================"
echo "  SUMMARY"
echo "======================================================================"
echo "  Created/updated:"
echo "    .github/workflows/ci.yml        CI (Node 22/24, npm pinned, audit gate)"
echo "    .github/workflows/deploy.yml    GitHub Pages deploy workflow"
echo "    .nvmrc                          Node 24 pin"
echo "    AGENTS.md                       project rules"
echo "    docs/coding-standards.md        coding standards reference"
echo "    docs/testing-playbook.md        testing playbook"
echo "    docs/frontend-deployment-readiness.md  deployment readiness (12-factor subset)"
echo "    docs/lessons.md                 engineering lessons"
echo "    CHANGELOG.md                    changelog"
echo "    README.md                       rewritten README"
echo "    vite.config.mjs                 adds base '/re-timao-flix/' for GitHub Pages"
echo
echo "  Notes:"
echo "    - Existing files were backed up as *.bak.<timestamp> before being replaced."
echo "    - Re-run safely: identical files are skipped."
echo "    - CI and Deploy workflows pin npm to 11.17.0 (lockfile's generator version)."
echo "    - GitHub Pages: after the first deploy, enable it in"
echo "      Settings -> Pages -> Source: 'GitHub Actions'."
echo
echo "  Next steps:"
echo "    git add -A"
echo "    git commit -m \"docs: add docs suite and GitHub Pages deploy workflow\""
echo "    git push"
echo "    Watch the Actions tab: https://github.com/<owner>/re-timao-flix/actions"
echo "    Enable Pages (Settings -> Pages -> Source: GitHub Actions) once after deploy."
echo "======================================================================"
