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

SLOT-2 closed 2026-08-26, the day it was reported, and it is SLOT-1's fix reporting a second defect
in itself. The matching solver displaces an incumbent slot to reach a grant — that is how a power
taken at 38 gets served at all — but nothing made displacement a last resort, so the placement
probe took the lowest grant in the build every time and shoved the slot already sitting there
upward. Placing slots one at a time on early powers therefore labelled them newest-first, and
`addSlot` stored what the probe said, so the scramble persisted into the save. Fixed by scanning
free grants before owned ones in `augment`; SLOT-1's re-housing case is untouched because the
second pass still runs when nothing is free. The lesson is the one that matters for the next
solver: SLOT-1's sixteen guards all stayed green, because they ask whether an assignment exists
and whether every slot sits on a real grant, and a scrambled assignment answers yes to both.
Nothing asked whether placing a slot MOVED one already placed.

Builds saved through the defect recover: `slotOrder` is append-ordered, so the placement order was
never lost and the solver rebuilds a legal assignment consuming the same grants a clean replay
would have. The attribution across powers of different pick levels is not perfectly recoverable,
and no stored data survives that could make it so.

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

[Full detail](gaps/data-port.md) — 2 of 2 closed

- [x] **PORT-1** — a set's unique/global piece shipped as an extra `bonuses[]` tier (12/12/14 rows),
      piece-count-gated where the game gates on that one piece being slotted, so a lone unique was
      denied its global and a full set was credited it twice; deleted by the port after censusing
      that `PROC_DATABASE` covers each one
- [x] **PORT-2** — `proc-globals.generated.ts` categorised the Rectified Reticle and Warp perception
      globals as `Special` where canonical says `Perception`; the extractor port turned out to be
      four deltas, not a divergence, and regenerating exposed a live pet-stamp defect in the shared
      script (canonical's PROCPET-1) that had to be fixed before the regen was shippable

---

## Slot grant allocation

Enhancement slots are placed against a lumpy, level-gated grant schedule — Homecoming issues 67 of
them at 28 specific levels and none at all at 38, 41, 44, 47 or 49. Pairing slots to grants is a
matching; beta allocated them with a walk.

[Full detail](gaps/slot-grant-allocation.md) — 2 of 2 closed

- [x] **SLOT-1** — deleting a slot and placing it on a later-picked power stranded the freed grant
      and stamped the new slot with its power's pick level (a level the schedule may grant nothing
      at), which the rehydrate backfill then froze in as a stored level while both exporters, keyed
      by display name, printed the pick level for every slot and so could not reveal it; fixed by a
      single Kuhn matching behind respec mode, leveling mode, the placement probe and the
      relocation check, a `SlotLevel = number | null` that refuses to substitute a plausible number
      for an unplaceable slot, and a `scrubFabricatedSlotLevels` migration for poisoned saves.
      Guarded by `slot-allocation.test.ts` (16 tests, mutation-tested 15/15)
- [x] **SLOT-2** — the placement probe displaced an incumbent slot whenever it could be re-housed,
      even with a free grant available, so each newly placed slot took the lowest grant in the
      build and pushed the slot already there upward: the leveling column read newest-first on
      every power whose pick level left a low grant reachable, and `addSlot` stored the probe's
      answer so the scramble survived the save; fixed by scanning free grants before owned ones in
      `augment`, leaving SLOT-1's re-housing to the second pass, plus a `reconcileStoredSlotLevels`
      migration that writes the solved assignment back over stored levels no grant can honor —
      poisoned saves display correctly on the fix alone, but cascaded peers on a removal until
      their storage was made honest. Guarded by four tests in `slot-allocation.test.ts`
      (mutation-tested 4/4)

---

## Method notes

[Full detail](gaps/port-method-notes.md) — cross-repo investigation method: how to tell a beta-side
display gap from an engine regression, and the cwd trap that nearly produced a false negative
while doing it.

*Update this register whenever an issue is found or changes state. An entry leaves this file only
as fixed-with-a-guard, never silently deleted.*
