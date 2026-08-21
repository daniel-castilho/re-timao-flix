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
