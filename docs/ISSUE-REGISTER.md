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

First entries. Both found the same way: PR #16 (the thunderspy-archetype-inherents merge) turned
up two pre-existing failures in `powerProjectionParity.test.ts` (`PROD6B-1` suite). Confirmed via
`gh run view` against `main`'s last CI run (`46cd6c368e`, 2026-08-11) that both failures are
byte-identical to before any of that branch's work — not a regression, just newly surfaced.
Root-caused by reading `resolveEffectivePower.ts` and `quick-snipe.ts` directly against canonical's
`coh_math/src/effective.rs` and the closed SNIPE-2 gap: in both cases the WASM engine is right,
and beta's own JS mirror of it has fallen behind. Neither is fixed yet.

---

## Engine/beta display parity

`resolveEffectivePower.ts`'s own docstring calls itself "single-sourced so the panel, the picker
tooltip, and the engine gate all resolve the same power" and claims "the engine mirrors every
rule here in `coh_math/src/effective.rs`." That claim now runs one direction only — canonical
added a rule to `effective.rs` that beta's JS side never got.

[Full detail](gaps/engine-beta-parity.md) — 0 of 2 closed

- [ ] **PARITY-1** — `resolveEffectivePower.ts` never implements `formVariants` (condition-gated
      power-record redirects, e.g. Energy Manipulation's Stun under Power Boost); every real
      display surface that resolves through it shows the wrong numbers while the condition is live
- [ ] **PARITY-2** — `applyQuickSnipe()` ignores `power.quickSnipe.condition` and gates the fast
      snipe form on the UI's combat-mode toggle for every fork; correct-ish for Homecoming, wrong
      for Rebirth/Thunderspy (gated on ToHit ≥ 97%, not combat engagement)

---

## Method notes

[Full detail](gaps/method-notes.md) — cross-repo investigation method: how to tell a beta-side
display gap from an engine regression, and the cwd trap that nearly produced a false negative
while doing it.

*Update this register whenever an issue is found or changes state. An entry leaves this file only
as fixed-with-a-guard, never silently deleted.*
