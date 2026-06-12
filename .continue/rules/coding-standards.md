---
name: Coding Standards & Workflow
description: Commit, test, lint, and CI conventions. Always loaded.
alwaysApply: true
---

# Coding Standards & Workflow

## Before considering a change done
- **Type-check:** `npm run lint` (runs `tsc --noEmit`). CI fails on any type error — strict mode, no `any` escape hatches.
- **Test:** `npm test` (`vitest run`). Add or extend tests for logic/math changes; many fixes are pinned by regression tests.
- **Data changes:** if you touched a converter, `exported_powers/`, or anything feeding `generated/`, run `npm run regen` and commit the regenerated output. The **regen-diff CI guard** (`npm run regen:generated`) asserts `generated/` matches converter output byte-for-byte and fails otherwise.

## Code style
- TypeScript strict. Prefer explicit types on exported functions and props.
- Match the surrounding file's naming, comment density, and idioms — don't introduce a new pattern when an existing one fits.
- Reuse `@/...` path-alias imports; reuse existing `components/ui/` primitives and `utils/` helpers instead of duplicating.

## Philosophy
- **Fix root causes, not symptoms.** This codebase models complex interacting game systems; band-aid fixes compound into harder bugs. Investigate whether a bug is a symptom of a deeper systemic issue before patching surface behavior.
- **Verify, don't assume.** Distrust "low value / cosmetic / can't fix" labels — re-investigate against the source data before accepting or emitting a fix.

## Commits
- Small, focused commits. Don't commit `node_modules/`, build output (`dist/`), or the gitignored raw source data.
