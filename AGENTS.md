# AGENTS.md

TimãoFlix — a Netflix-inspired UI study project built during Alura's **#ImersãoReact**: a fan
page for Sport Club Corinthians Paulista ("Timão"). Stack: **React 18**, **styled-components 5**,
**react-router 7** (library mode), **Vite 7** (`@vitejs/plugin-react`), **Vitest 3** + Testing
Library, Node 24 (see `.nvmrc`), npm 11.17.0. No backend, no state management.

The **UI copy is Brazilian Portuguese** (product content). All code, identifiers, comments,
commit messages, documentation and log messages are in **English**.

Sources of truth (read in order): `README.md`, `AGENTS.md`, `docs/coding-standards.md`,
`docs/testing-playbook.md`, `docs/lessons.md`, `package.json`.
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
- Accessibility basics are in place (real rem scale, landmarks, skip link, `:focus-visible`,
  decorative-image alts, reduced-motion guard) but no screen-reader or full WCAG audit has
  been done yet.

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
