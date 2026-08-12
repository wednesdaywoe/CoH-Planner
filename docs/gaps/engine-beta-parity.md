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

**What it's waiting on.** A decision on how `resolveEffectivePower.ts` should evaluate an
arbitrary condition string (`kBoostPower Source.Mode?`-shaped expressions) — either a small JS
expression evaluator mirroring `coh_math::expr`'s subset, or some other bridge — scoped before
starting.

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

**What it's waiting on.** Same as PARITY-1 — both need the same condition-string evaluation, so
they're likely one piece of work: read `power.quickSnipe.condition` /
`power.formVariants[].condition` against real build state instead of trusting a single UI
boolean. Worth scoping together rather than separately.
