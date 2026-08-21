# AGENTS.md

TimãoFlix — a Netflix-inspired UI study project built during Alura's **#ImersãoReact**: a fan
page for Sport Club Corinthians Paulista ("Timão"). Stack: **React 18**, **styled-components 5**,
**Create React App 5** (`react-scripts` 5.0.1), Node 24 (see `.nvmrc`), npm 11.17.0. No backend,
no state management, no routing.

The **UI copy is Brazilian Portuguese** (product content). All code, identifiers, comments,
commit messages, documentation and log messages are in **English**.

Sources of truth (read in order): `README.md`, `AGENTS.md`, `docs/lessons.md`, `package.json`.
Re-read the relevant parts before starting any task.

## Critical rules (never violate)

1. **English only** for code, comments, commit messages, docs and logs. UI strings stay PT-BR
   (they are product content, e.g. "Novo vídeo", "#ImersãoReact").
2. **No new npm dependency without explicit human approval.** Prefer Node/npm built-ins.
3. **Node 24 pinned via `.nvmrc`; npm 11.17.0.** Lockfile discipline: regenerate the lockfile
   with the **exact npm that CI uses** (npm 11.17.0) and sanity-check with
   `rm -rf node_modules && npm ci` on that same npm before pushing — see `docs/lessons.md`
   (lockfile generation is npm-version-sensitive).
4. **NEVER run `npm audit fix --force` on this project.** It "fixes" `react-scripts` to the
   phantom placeholder `0.0.0` (an empty package with no `bin`): `npm audit` then reports
   **0 vulnerabilities**, but `npm start` / `npm run build` / `npm test` break with
   `react-scripts: not found`. See `docs/lessons.md` (phantom 0.0.0 trap).
5. **Tests** run through the CRA runner: `CI=true npm test` for a one-shot, non-interactive run.
   Add or extend tests in `src/*.test.js` (CRA auto-discovers them). Never assert on the network
   — this app has no network code.
6. **Doc sync is part of Done.** After milestone-sized work (a feature, a behaviour change, a
   dependency/toolchain change, a security fix), the same change set — or an immediate follow-up
   commit — MUST update `README.md` ("Current State"), `CHANGELOG.md`, `AGENTS.md` ("Known
   technical debt"), and `docs/lessons.md` only when a durable rule was learned.
7. **Keep the security posture honest.** The remaining ~28 npm advisories (14 high) are all
   dev/build tooling inherited from Create React App (EOL) and never reach the app runtime.
   Do not paper over them with force-fixes; the real path to 0 is migrating to Vite (see
   `README.md` Roadmap).
8. **Do not push to the remote unless the human explicitly asks.**
9. **Known technical debt is documented, not silently "fixed"** — flag violations to the human;
   do not expand them.

## Commands

| Purpose | Command |
| :--- | :--- |
| Install dependencies | `npm install` |
| Dev server (port 3000) | `npm start` |
| Tests (interactive watch) | `npm test` |
| Tests (one-shot, CI-style) | `CI=true npm test` |
| Production build (`build/`) | `CI=true npm run build` |
| Security audit | `npm audit` |

> `build/` is gitignored (CRA output). `npm test` uses the CRA runner and requires
> `CI=true` when running non-interactively (e.g. in CI or scripts).

## Architecture

```
timaoflix/
├── public/                Static CRA shell (index.html, manifest, icons)
├── src/
│   ├── index.js           Entry point — React 18 createRoot, imports global styles
│   ├── App.js             Composes the page: HeaderTimao + FooterTimao
│   ├── components/        styled-components primitives (kebab-free, PascalCase files)
│   │   ├── ButtonTimao/   Nav CTA button ("Novo vídeo")
│   │   ├── FooterTimao/   Footer with logo + Alura credit
│   │   ├── HeaderTimao/   Top bar with logo + button
│   │   ├── HighlightTimao  Inline <strong> highlight
│   │   ├── LinkTimao/     Styled anchor
│   │   └── LogoTimao/     Styled <img> logo
│   ├── styles/
│   │   ├── reset.css      Meyer reset (global)
│   │   └── settings/colours.css  CSS custom properties (--color-* tokens)
│   ├── App.test.js        Smoke tests (react-scripts test + jest-dom)
│   └── setupTests.js      jest-dom matchers
└── package.json           All deps in "dependencies" (CRA 2020 layout)
```

- `App.js` is pure composition of styled-components; there are no class components, lifecycle
  hooks or business rules — keep it that way.
- Design tokens live in `colours.css` (`--color-primary-medium: #2A7AE4`,
  `--color-black-dark: #000`, `--color-gray-light: #F5F5F5`) and are referenced via
  `var(...)` inside styled-components. Add new tokens there, not inline.
- Styling belongs to styled-components only — no `.css` files per component, no inline
  `style={{}}` unless unavoidable.

## Known technical debt (resolve later; flag, don't silently fix)

- **Create React App is end-of-life** (`react-scripts` archived). The remaining ~28 npm
  advisories (14 high, all dev/build tooling — svgo, postcss, jest, workbox, webpack-dev-server)
  cannot be fixed in-tree. The honest path to a true `npm audit` 0 is **migrating to Vite**
  (see README Roadmap). Until then, `npm audit --audit-level=critical` is the CI gate (0
  critical today).
- Test coverage is smoke-level only (App renders) — no per-component assertions.
- No backend, no routing, no deployment pipeline — static bundle only.

## Notes

- No environment variables or secrets in this project. If one is ever added, follow `.env`
  hygiene: `.env`/`.env.*` gitignored, tracked `.env.example` template, values never committed.
- For current project status and pending work, see `README.md` ("Current State" / "Roadmap").
- Hard-won engineering rules live in `docs/lessons.md`.
