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
