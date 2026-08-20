---
project: coh-sidekick-beta
kind: register
title: Issue Register
id-prefix: varies by category (see below)
relates:
  - HANDOFF-EAA6.md
---

# Issue Register

The audited state of beta's own code — the parts canonical's gates can't see because they live
entirely in this repo: the JS display/calculation layer, the vendoring seam, the converter
scripts that diverge from canonical on purpose. Every known issue is either closed with a guard,
or recorded here with its severity and what it's waiting on. The bar is "no unrecorded unknowns,"
not "no issues." Full narrative for every entry lives in [gaps/](gaps/).

This register starts today, 2026-08-12. It does not backfill beta's history — only issues found
from this point forward are recorded here.

## Current frontier

Both entries closed the same day they were filed. Fix: a new scoped RPN evaluator
(`src/utils/conditionExpr.ts`, NOT a full port of `coh_math::expr` — just the source-relative
subset `quickSnipe`/`formVariants` conditions actually use) plugged into `resolveEffectivePower.ts`
so it evaluates `power.formVariants[].condition` and `power.quickSnipe.condition` for real instead
of trusting the raw `combatMode` toggle. Getting the two failing assertions green surfaced two
more bugs past the ones originally filed, both fixed alongside: `Source.Mode?` tokens are
`k`-prefixed (`kBoostPower`) while `setsModes`/`activeModes` publish the bare mode (`BoostPower`)
— canonical's `collect_source_modes` inserts both spellings and `toConditionContext` now does too
— and the test's own `strengthCandidates` fixture built a raw `Build` by hand, bypassing the store
logic that normally keeps `activeModes` synced with active `setsModes`-carrying powers, so it had
to gain that sync itself. Full suite green (the only remaining red is 11 pre-existing
`storage.setItem is not a function` / dataset-load-timeout failures, confirmed byte-identical on a
clean `git stash` baseline — unrelated, not touched).

---

## Engine/beta display parity

`resolveEffectivePower.ts`'s own docstring calls itself "single-sourced so the panel, the picker
tooltip, and the engine gate all resolve the same power" and claims "the engine mirrors every
rule here in `coh_math/src/effective.rs`." That claim ran one direction only for a while —
canonical added a rule to `effective.rs` that beta's JS side hadn't picked up yet.

[Full detail](gaps/engine-beta-parity.md) — 2 of 2 closed

- [x] **PARITY-1** — `resolveEffectivePower.ts` never implemented `formVariants`; fixed via
      `conditionExpr.ts` + `applyFormVariant`, guarded by `powerProjectionParity.test.ts`'s
      `+Strength self-buffs reach the granted magnitudes` (PROD6C)
- [x] **PARITY-2** — `applyQuickSnipe()` ignored `power.quickSnipe.condition`; `resolveEffectivePower`
      now evaluates it for real per fork, guarded by the same suite's
      `the shown power drives the projection under every combat state` (PROD6C-3k)

---

## Data ported from canonical

The three `io-sets-raw` registries and their extractor are vendored from canonical, and the two
trees had drifted wholesale (canonical's BOOST-5). The port landed 2026-08-20.

[Full detail](gaps/data-port.md) — 1 of 2 closed

- [x] **PORT-1** — a set's unique/global piece shipped as an extra `bonuses[]` tier (12/12/14 rows),
      piece-count-gated where the game gates on that one piece being slotted, so a lone unique was
      denied its global and a full set was credited it twice; deleted by the port after censusing
      that `PROC_DATABASE` covers each one
- [ ] **PORT-2** — `proc-globals.generated.ts` categorises the Rectified Reticle and Warp perception
      globals as `Special` where canonical says `Perception`; display-only (totals come from the
      vendored engine), waiting on the `extract-proc-data.py` port

---

## Method notes

[Full detail](gaps/method-notes.md) — cross-repo investigation method: how to tell a beta-side
display gap from an engine regression, and the cwd trap that nearly produced a false negative
while doing it.

*Update this register whenever an issue is found or changes state. An entry leaves this file only
as fixed-with-a-guard, never silently deleted.*
