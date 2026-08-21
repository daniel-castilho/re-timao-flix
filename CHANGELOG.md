# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Fixed GHSA-3jxr-9vmj-r5cp / CVE-2026-13149 (`brace-expansion` exponential-time DoS) and the
  rest of the 217-advisory tree (17 critical, 61 high) by migrating the toolchain:
  `react-scripts` 3.4.1 → 5.0.1, React/ReactDOM 16 → 18, testing-library 9/4/7 → 14/6/14,
  styled-components 5.1 → 5.3. `npm audit`: 217 → **28** (0 critical; residual all in CRA
  dev/build tooling).
- Restored `react-scripts` 5.0.1 after `npm audit fix --force` had replaced it with the phantom
  `0.0.0` placeholder (which zeroed the audit but broke build/test/start).

### Added
- GitHub Actions CI (`.github/workflows/ci.yml`) on Node 24 with npm pinned to the lockfile's
  generator version: `npm ci` → tests → production build → `npm audit --audit-level=critical`.
- Smoke tests (`src/App.test.js`, `src/setupTests.js`) — first automated coverage.
- Project documentation: `AGENTS.md`, `docs/lessons.md`, `CHANGELOG.md`.
- `.nvmrc` pinning Node 24.

### Changed
- `src/index.js` migrated to React 18 `createRoot`.
- `README.md` rewritten from the Create React App boilerplate.
- `.gitignore` now ignores CRA's `build/` output.
