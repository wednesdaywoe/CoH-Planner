#!/usr/bin/env bash
# Local mirror of the GitHub Actions workflows (ci.yml, regen-diff.yml, deploy.yml).
# Run before pushing to catch what CI would catch — same commands, same order.
#
#   ./scripts/ci-local.sh          # run all checks (assumes deps installed)
#   ./scripts/ci-local.sh --ci     # also run `npm ci` first (clean install, like CI)
#
# Note: the beta repo is PUBLIC, so its GitHub-hosted CI is free and still runs on
# push — this is a fast pre-push gate, not a replacement for it.

set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
pass() { printf '\033[1;32m✓ %s\033[0m\n' "$1"; }

if [[ "${1:-}" == "--ci" ]]; then
  step "Install dependencies (npm ci)"
  npm ci
fi

# ---- CI workflow (ci.yml) ----
step "Type-check — tsc --noEmit  [ci.yml: lint]"
npm run lint
pass "lint"

step "Tests — vitest run  [ci.yml: test]"
npm test
pass "tests"

step "Audit IO-set categories, all datasets  [ci.yml: audit:set-categories]"
npm run audit:set-categories
pass "audit:set-categories"

step "Validate converter output (collapse gate)  [ci.yml: validate:converter]"
npm run validate:converter
pass "validate:converter"

# ---- Regen diff workflow (regen-diff.yml) ----
step "Regenerate generated/ and assert no drift  [regen-diff.yml]"
npm run regen:generated
GENERATED_PATHS="src/data/datasets/homecoming/generated src/data/datasets/rebirth/generated src/data/datasets/thunderspy/generated"
git diff --stat -- $GENERATED_PATHS
if ! git diff --exit-code -- $GENERATED_PATHS; then
  echo "::error:: generated/ drifted from converter output. Run 'npm run regen' and commit the result." >&2
  exit 1
fi
pass "regen-diff clean"

# ---- Deploy workflow (deploy.yml) — build only (Pages upload/deploy is CI-only) ----
step "Production build — tsc && vite build  [deploy.yml: build]"
npm run build
pass "build"

printf '\n\033[1;32m═══ all local CI checks passed ═══\033[0m\n'
