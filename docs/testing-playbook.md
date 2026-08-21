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
