---
name: Calculation Engine
description: Rules for the stat/damage math engine under utils/calculations.
globs:
  - "src/utils/calculations/**"
  - "src/components/info/**"
---

# Calculation Engine

`src/utils/calculations/` (~9,000 lines) computes all build stats: enhancement values, set bonuses, damage, mez, defense/resistance, proc damage, AT modifiers.

## Rules
- This math models real game mechanics with many interacting systems. **Prefer a correct, root-cause fix over a band-aid** — surface patches compound into harder bugs later.
- AT (archetype) damage/buff/debuff modifiers come from **binary `named_tables`** (`at-tables.ts`), not hand-written scalars. The hand stats are calc fallbacks only.
- **Proc damage scales with the character's combat level**, not the slotted IO's crafted/global-IO level. (Past bug: using IO level under-counted ~10×.) Enhancement *values* still use IO level — only proc *damage magnitude* uses character level.
- Effect aspect/table/scale/magnitude in exported data are highly accurate; trust them. `type`/`application_type` may be semantically re-labeled vs. CoD2 — that's naming, not a data error.
- When a value looks wrong, trace it back through the data pipeline (composed → generated → exported_powers → binary) before changing the math.
- Use `window.cohDebug` (`src/utils/calc-debug.ts`) for tracing, and `fallback-warnings.ts` to surface "fell back to default" cases.
- Add/extend Vitest tests for math changes; many fixes are pinned by regression tests (e.g. pseudopet-redirect).
