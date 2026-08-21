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

| #   | Factor                              | Status         | Notes                                                                                                                                                                                                                                                                                                                              |
| --- | ----------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Reproducible build**              | ✅ Compliant   | `package.json` + `package-lock.json` committed. CI pins npm to the lockfile's generator version (npm 11.17.0) — lockfile resolution is npm-version-sensitive (see `docs/lessons.md`). `npm ci` → `npm run build` must pass cleanly anywhere.                                                                                       |
| 2   | **Static artifact**                 | ✅ Compliant   | `npm run build` emits `dist/` (gitignored, regenerated at build time — never committed). No runtime environment variables, so **the build output is the artifact**: a given commit always produces the same bundle.                                                                                                                |
| 3   | **Config & secrets**                | ✅ Compliant   | The project has **no secrets and no required env vars**. If an env var is ever added: only `VITE_*`-prefixed variables are exposed to the client; `.env` / `.env.*` stay gitignored; a tracked `.env.example` documents the shape. Never commit real values.                                                                       |
| 4   | **CI quality gates**                | ✅ Compliant   | `.github/workflows/ci.yml` runs on every push to `master` and every PR: `npm ci` → `npm run lint` → `npm run format:check` → `npm test` → coverage summary → `npm run build` → `npm audit --audit-level=high`. A red gate blocks the merge.                                                                                        |
| 5   | **Deployment pipeline**             | ✅ Compliant   | `.github/workflows/deploy.yml` publishes `dist/` to **GitHub Pages** on every push to `master` (plus `workflow_dispatch`), after running the same gates as CI. The build step also emits a `404.html` copy of the SPA entry so deep routes survive refreshes on Pages. Live at `https://daniel-castilho.github.io/re-timao-flix/`. |
| 6   | **Release & rollback**              | ✅ Compliant   | Every deploy is tied to the commit that triggered it; **rollback = re-run the Deploy workflow on a previous commit** (`workflow_dispatch`) or revert and push. Annotated tags still mark milestones (`v0.1.0`-style).                                                                                                              |
| 7   | **Logs & observability (dev only)** | ✅ N/A in prod | The app is static: no server-side logging path in production. Dev logs go to stdout (`vite`). When a deploy lands, enable the host's built-in request/asset logs (GitHub Pages offers none; a CDN/host dashboard would cover it). Never log secrets — even in dev.                                                                 |

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

1. **Coverage thresholds** — `npm run test:coverage` is informational today; decide a minimum
   (e.g. ≥ 60–70%) and make it a CI gate once the suite stabilizes.
2. **Release automation (optional)** — document the exact release flow (tag → CI builds →
   deploy) in the README; today a release is "push to `master`" and rollback is a
   `workflow_dispatch` re-run of an earlier commit.

---
