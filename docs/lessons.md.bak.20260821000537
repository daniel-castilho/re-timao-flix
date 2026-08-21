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

**Rule:** never run `npm audit fix --force` on a Create React App project. A "0 vulnerabilities"
result obtained by force-fixing is a **fake zero** — verify with `npm run build` + tests after
any audit-driven change. If the placeholder already landed, reinstall the real toolchain
(`npm install react-scripts@^5.0.1 react@^18.3.1 react-dom@^18.3.1 ...`) and restore the lockfile.

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
default branch. GitHub's Dependabot uses its own advisory database (and older lockfile state
during the scan), which is broader and lags the push.

**Rule:** evaluate by **severity and where the vulnerable package sits** (runtime vs dev/build
tooling), not by raw counts. Cross-check with `npm audit` locally and `npm ls <pkg>` for the
chain. Give Dependabot time to re-scan before acting on a count.

---

## The real fix for an EOL toolchain is migration, not force-fixing (2026-08-21)

`react-scripts@3.4.1` (Create React App, EOL since 2025) anchors hundreds of advisories through
its pinned webpack/Babel/Jest/SVG tooling. Upgrading to `react-scripts@5.0.1` + React 18 removed
the runtime-dependency advisories (including the `brace-expansion` family via `minimatch`) and
left only dev/build tooling. Reaching a true 0 requires leaving CRA entirely.

**Rule:** for EOL toolchains, plan the migration (here: CRA 5 now, Vite later) and document the
residual, rather than chasing per-package overrides or force-fixes that fabricate a green audit
while hiding real debt.
