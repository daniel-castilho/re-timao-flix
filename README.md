# TimãoFlix

![Node](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

TimãoFlix is a **Netflix-inspired UI study project** built during Alura's **#ImersãoReact**: a
fan page for Sport Club Corinthians Paulista ("Timão") rendered entirely with **React** and
**styled-components** — no backend, no state management, no routing. The UI copy is in Brazilian
Portuguese.

**Project docs:** [AGENTS.md](AGENTS.md) (rules for solo/AI-assisted development) ·
[docs/lessons.md](docs/lessons.md) (engineering lessons) · [CHANGELOG.md](CHANGELOG.md).

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

| Category | Technology |
| :--- | :--- |
| **Language & Runtime** | ![Node](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white) (npm 11.17.0, pinned via `.nvmrc`) |
| **UI framework** | ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white) |
| **Styling** | ![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?style=for-the-badge&logo=styled-components&logoColor=white) + CSS custom properties |
| **Build tooling** | ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white) + `@vitejs/plugin-react` |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) + Testing Library (`react` 14, `jest-dom` 6, `user-event` 14) |
| **CI** | GitHub Actions (Node 24, npm 11.17.0) |

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
    ├── index.jsx         Entry point — React 18 createRoot, imports global styles
    ├── App.jsx           Composes the page: HeaderTimao + FooterTimao
    ├── components/       styled-components primitives
    │   ├── ButtonTimao/  Nav CTA button ("Novo vídeo")
    │   ├── FooterTimao/  Footer with logo + Alura credit
    │   ├── HeaderTimao/  Top bar with logo + button
    │   ├── HighlightTimao  Inline <strong> highlight
    │   ├── LinkTimao/    Styled anchor
    │   └── LogoTimao/    Styled <img> logo
    ├── styles/
    │   ├── reset.css     Meyer reset (global)
    │   └── settings/colours.css  Design tokens (--color-*)
    ├── App.test.jsx      Smoke tests (Vitest + Testing Library)
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

| Purpose | Command |
| :--- | :--- |
| Install dependencies | `npm install` |
| Dev server (port 3000) | `npm start` |
| Tests (one-shot) | `npm test` |
| Tests (watch mode) | `npm run test:watch` |
| Production build | `npm run build` → outputs to `dist/` |
| Preview the production build | `npm run preview` |
| Security audit | `npm audit` |

## Testing

Tests run with **Vitest** + Testing Library in a jsdom environment (configured in
`vite.config.mjs`):

```sh
npm test             # one-shot, non-interactive (CI-friendly)
npm run test:watch   # watch mode
```

Current total: **10 tests across 7 suites**, all offline and deterministic (the app has no
network code):

| File | Scope |
| :--- | :--- |
| `src/App.test.jsx` | Composition smoke test — header CTA ("Novo vídeo") + Alura credit. |
| `src/components/*/index.test.jsx` | Per-component suites: correct DOM element, content/props forwarding, `LogoTimao` attrs (alt text, bundled asset). |

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
- **Toolchain: Vite 7 + Vitest 3** (migrated from the EOL Create React App), React 18,
  testing-library 14.
- Component-level tests for every styled-component primitive + App composition smoke test
  (10 tests, 7 suites), GitHub Actions CI (install → test → build → audit gate) on Node 24.
- `npm audit` at **0 vulnerabilities** (from 217, 17 critical, at the start of this effort).

## Roadmap

Deliberately not implemented yet (candidate backlog):

- Expand the UI: video carousel/grid, detail cards, routing (React Router).
- GitHub Pages (or similar) deployment of the static bundle via CI.
- Product-consistency pass on accessibility (semantic HTML, focus states, alt text).
