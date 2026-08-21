# TimãoFlix

![Node](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![CRA](https://img.shields.io/badge/Create_React_App-5-09D3AC?style=for-the-badge&logo=react&logoColor=white)
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
| **Build tooling** | Create React App 5 (`react-scripts` 5.0.1, webpack 5) |
| **Testing** | Jest (CRA runner) + Testing Library (`react` 14, `jest-dom` 6, `user-event` 14) |
| **CI** | GitHub Actions (Node 24, npm 11.17.0) |

- **No runtime dependencies beyond React and styled-components** — the app is static and
  dependency-light at runtime.
- Design tokens are CSS custom properties in `src/styles/settings/colours.css`
  (`--color-primary-medium: #2A7AE4`, `--color-black-dark: #000`, `--color-gray-light: #F5F5F5`).

## Architecture

The app is a single page composed of small styled-components — no framework layers, no data
layer:

```
timaoflix/
├── public/                Static CRA shell (index.html, manifest, icons)
└── src/
    ├── index.js           Entry point — React 18 createRoot, imports global styles
    ├── App.js             Composes the page: HeaderTimao + FooterTimao
    ├── components/        styled-components primitives
    │   ├── ButtonTimao/   Nav CTA button ("Novo vídeo")
    │   ├── FooterTimao/   Footer with logo + Alura credit
    │   ├── HeaderTimao/   Top bar with logo + button
    │   ├── HighlightTimao  Inline <strong> highlight
    │   ├── LinkTimao/     Styled anchor
    │   └── LogoTimao/     Styled <img> logo
    ├── styles/
    │   ├── reset.css      Meyer reset (global)
    │   └── settings/colours.css  Design tokens (--color-*)
    ├── App.test.js        Smoke tests
    └── setupTests.js      jest-dom matchers
```

- `App.js` is pure composition; there are no class components, lifecycle hooks or business
  rules.
- Styling lives in styled-components only; tokens come from `colours.css`.

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
npm start          # http://localhost:3000
```

## Commands

| Purpose | Command |
| :--- | :--- |
| Install dependencies | `npm install` |
| Dev server (port 3000) | `npm start` |
| Tests (interactive watch) | `npm test` |
| Tests (one-shot, CI-style) | `CI=true npm test` |
| Production build | `CI=true npm run build` → outputs to `build/` |
| Security audit | `npm audit` |

## Testing

Tests run through the CRA runner (Jest + Testing Library). Run them one-shot in CI-style:

```sh
CI=true npm test
```

Current coverage is a smoke test (`src/App.test.js`) that renders the app and asserts the header
CTA ("Novo vídeo") and the Alura credit are present. Add component tests in `src/*.test.js`;
CRA discovers them automatically. There is no network code, so tests are fully offline and
deterministic.

## Security Posture

- **GHSA-3jxr-9vmj-r5cp / CVE-2026-13149** (and the other `brace-expansion` family advisories)
  are **fixed**: the vulnerable 1.1.x versions were removed from the tree via the toolchain
  migration.
- **`npm audit`: 28 vulnerabilities (0 critical, 14 high, 5 moderate, 9 low)** — all in
  **dev/build tooling** (svgo, postcss, jest, workbox, webpack-dev-server…) inherited from
  **Create React App, which is end-of-life**. **None reach the app runtime** (`react` and
  `styled-components` are clean).
- **CI gate:** `npm audit --audit-level=critical` (blocks regressions to critical, passes today).
- **Never run `npm audit fix --force`** on this project — it replaces `react-scripts` with a
  phantom `0.0.0` placeholder that zeroes the audit but breaks the build (see
  [docs/lessons.md](docs/lessons.md)).
- The honest path to a true `0` is migrating away from CRA — see [Roadmap](#roadmap).

## Current State

- Netflix-style header + footer UI composed of styled-components, PT-BR copy.
- Toolchain migrated to React 18 / react-scripts 5 / testing-library 14 (CRA 2020 → 2022 era).
- Smoke tests + GitHub Actions CI (install → test → build → audit gate) on Node 24.
- `npm audit` down from 217 (17 critical) to 28 (0 critical), all residual in EOL CRA tooling.

## Roadmap

Deliberately not implemented yet (candidate backlog):

- **Migrate from Create React App to Vite** (the only way to a true `npm audit` 0; also faster
  dev/build). Keep the same React 18 + styled-components code.
- Expand the UI: video carousel/grid, detail cards, routing (React Router).
- Component-level tests (per component, not just the App smoke test).
- GitHub Pages (or similar) deployment of the static bundle via CI.
- Product-consistency pass on accessibility (semantic HTML, focus states, alt text).
