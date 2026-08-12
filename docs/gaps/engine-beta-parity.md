---
project: coh-sidekick-beta
kind: gap
title: Engine/beta display parity
relates:
  - ../ISSUE-REGISTER.md
---

# Engine/beta display parity

Beta carries a full JS reimplementation of "which power record is actually shown right now" —
`resolveEffectivePower.ts` — that exists specifically so the pre-WASM display surfaces
(`InfoPanel`, `PowerInfoTooltip`, the attack-chain calculators) and the WASM engine agree. The
converter (`scripts/convert-powerset.cjs`, ported from canonical but NOT vendored — see
[HANDOFF-EAA6.md](../../HANDOFF-EAA6.md)) already emits the data both mechanisms below need. The
gap in both entries is on the consuming side: the JS mirror was never extended to read it.

## PARITY-1 — `formVariants` unimplemented in `resolveEffectivePower.ts`

**Found:** 2026-08-12, investigating `powerProjectionParity.test.ts`'s
`homecoming: +Strength self-buffs reach the granted magnitudes` failure (10 deltas on
`blaster/Stun`).

**What's wrong.** A power can carry `formVariants`: an ordered table of alternate records,
each gated by a condition string read verbatim off the binary (`kBoostPower Source.Mode?`, etc.),
first match wins. Canonical's engine resolves this in `coh_math::effective::with_form_variant`
(closed 2026-08-07, graded by `form_variant_gate.rs`). The converter exports the field —
`blaster/secondary/energy-manipulation/stun.ts` carries three (`Stun_Ranged_AoE`, `Stun_Ranged`,
`Stun_Melee_AoE`) — and `types/power.ts` documents it accurately, right down to citing the engine
as the authority. But `resolveEffectivePower.ts` only implements four transforms (mode redirect,
quick snipe, mid-combat cast, active conditionals); `formVariants` isn't one of them, and nothing
else in the app reads the field either — confirmed by grepping the whole non-dataset, non-type
source tree for `formVariants` and finding zero consumers.

**Blast radius.** `resolveEffectivePower` backs `InfoPanel.tsx`, `PowerInfoTooltip.tsx`,
`AttackChainModal.tsx`, `attack-chain-powers.ts`, and `useBuildMaxAttackDamage.ts`. Any of these,
for any power with a live form-variant condition on any fork, shows the base record's numbers
instead of the redirected ones. Confirmed concretely on Energy Manipulation's Stun under an
active Power Boost: engine correctly reports recharge 90 / accuracy 60% / mag 2 (the
`Stun_Melee_AoE` form); the JS reference the parity test used as an oracle reports 12 / 75% / 3
(the base form) — the same numbers a real tooltip would show.

**Severity.** Real, but narrow — only powers that actually carry `formVariants` are affected, and
only while their condition is live. Not a totals/parser issue; the export is correct and the
engine reads it correctly.

**Closed 2026-08-12.** `src/utils/conditionExpr.ts` — a small stack-machine evaluator scoped to
exactly the operator/reader vocabulary that appears in `quickSnipe.condition` /
`formVariants[].condition` across all three forks today (`&&`/`||`/`!`/`==`/`eq`/`>`/`<`/`>=`,
`Source.Mode?`, `source.ownPower?`/`ownPowerNum?`, `cur.kToHit source>`), NOT a full port of
`coh_math::expr` (~1200 lines, 47 readers, probabilistic Die/Range values — most of it unused by
these two fields). A token it can't resolve (`target.isFriend?`, `enttype target>`, `distance`,
`@CustomFX`, …) aborts evaluation and the caller reads that as `false` — the same conservative
"the redirect doesn't fire, the base record stands" outcome canonical's own `Indeterminate`
reaches for the identical case. `resolveEffectivePower.ts` gained `applyFormVariant` (first
matching variant wins, base `internalName`/`condition` excluded from the merge so slots and
enhancements stay on the base power — same reason `applyModeRedirect` already does this) and now
evaluates `quickSnipe.condition` instead of trusting `state.combatMode` directly. Guarded by
`powerProjectionParity.test.ts`'s `+Strength self-buffs reach the granted magnitudes`.

## PARITY-2 — `applyQuickSnipe()` ignores `power.quickSnipe.condition`

**Found:** 2026-08-12, investigating `powerProjectionParity.test.ts`'s
`rebirth: the shown power drives the projection under every combat state` failure (rebirth: 5
quick forms in the corpus, 0 cast times moved between the default and in-combat states).

**What's wrong.** `power.quickSnipe.condition` carries the fast-snipe gate verbatim per fork —
Homecoming's is `kEngaged Source.Mode? … Experienced_Marksman …` (combat engagement); Rebirth's
and Thunderspy's is `cur.kToHit source> .97 >=` (the caster's own current ToHit, a pre-i25
mechanic). This split is exactly canonical's closed SNIPE-2 gap, and the type comment on
`quickSnipe` in `types/power.ts` states it plainly: "No threshold is re-derived anywhere in the
pipeline; matching one fork's gate text is what left two forks with no fast form." `quick-snipe.ts`
does exactly that anyway — `applyQuickSnipe(power, combatMode)` swaps in the fast form whenever
the boolean `combatMode` is true, full stop. It never reads `condition`.

**Blast radius.** Same call sites as PARITY-1 minus `AttackChainModal`'s direct usage nuance:
`InfoPanel.tsx`, `useBuildMaxAttackDamage.ts`, and `attack-chain-powers.ts` (which hardcodes
`applyQuickSnipe(power, true)` for its in-combat form, compounding the same assumption). For
Homecoming this is a reasonable proxy — the UI's combat-mode toggle roughly tracks
`kEngaged`. For Rebirth/Thunderspy it's the wrong signal entirely: the fast form can show with
the toggle on and real ToHit at baseline (~75%, well under the 97% the game requires), and the
slow form can show with the toggle off even at capped ToHit.

**Severity.** Real, fork-specific. Every Rebirth/Thunderspy snipe is affected; Homecoming's is
incidentally close to correct.

**Closed 2026-08-12,** alongside PARITY-1 — one piece of work, per the note above.
`resolveEffectivePower.ts` now evaluates `power.quickSnipe.condition` through the same
`conditionExpr.ts` evaluator before calling `applyQuickSnipe`, so Rebirth/Thunderspy correctly
require `currentToHit >= .97` and Homecoming correctly requires the synthetic `kEngaged` mode
(bound from `state.combatMode`, mirroring `gather::live_modes`'s `ENGAGED_MODES`/
`OUT_OF_COMBAT_MODES`). `applyQuickSnipe()` itself is UNCHANGED — still a plain
`(power, fastFormActive: boolean)` merge with no condition awareness of its own, on purpose:
`attack-chain-powers.ts` and `useBuildMaxAttackDamage.ts` call it with their own deliberately
simplified booleans for a different question ("what does this chain look like once the fast form
is reachable" vs. "what does the build show right now"), and widening its signature would have
forced both to either take on real ToHit context they don't need or fake one. Guarded by the same
suite's `the shown power drives the projection under every combat state`.

## Fix notes — two more bugs the fix surfaced

Getting the two assertions above to actually go green (rather than just stop citing base-record
numbers) surfaced two further bugs, both fixed in the same pass:

**`Source.Mode?` tokens are `k`-prefixed; `setsModes`/`activeModes` are not.** The condition text
says `kBoostPower Source.Mode?`, but Power Boost's own `setsModes: ["BoostPower"]` — no `k` — and
`build.activeModes` mirrors that bare spelling. Canonical's `gather.rs` `collect_source_modes`
already documents this exact split and inserts BOTH spellings for every live mode; missing that
was why the redirect never fired even once `formVariants` was implemented.
`toConditionContext` now does the same.

**The test's own `strengthCandidates` fixture never populated `activeModes`.** In the real app,
`buildStore.ts`'s power-toggle handler keeps `build.activeModes` in sync with every active power's
`setsModes` the moment it's switched on. `strengthCandidates` builds a `Build` by hand (to reach
every fork's `specialBuff` carrier without going through the store), so Power Boost could be
marked `isActive: true` on the power object without ever reaching `activeModes` — a form-variant
condition gated on a mode nothing ever declared live. The fixture now derives `activeModes` from
its own selected powers' `setsModes` the same way the store does.
