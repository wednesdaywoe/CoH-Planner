# Bug Investigation Session — 2026-05-21

User dropped 4 bug reports from a Rebirth-server tester. This doc captures what was investigated, what was fixed, and where to pick up.

## Triage decision

User chose "data bugs first" before tackling calc-engine / UI work. This pass addressed the dataset-side fixes from Bugs 1 and 2. Calc-engine work (Bug 3 partial + Bug 4) and UI gaps (Bug 5) remain.

---

## Bug summaries (verbatim user reports)

### Bug 1 — Superior Dominion of Arachnos proc PPM
> Superior Dominion of Arachnos proc slotted into Heavy Burst shows the wrong PPM (4) in Power Info. Should be 5 PPM. Rebirth database.

### Bug 2 — Superior Witchcraft proc not working
> Superior Witchcraft proc, slotted into Suppression, has no PPM and no effect in the Power Info window and thus does not compute proc chances. Should be 6 PPM, Chance for -20% Resist Debuff for 10s. Rebirth database.

### Bug 3 — Hybrid T4 Support endurance discount + display semantics
> +10% Endurance Discount auto effect of slotting Hybrid: T4 Support is not modifying the Endurance Discount global. Also, the display shows the "100-multiplier" value, not the "divisor" value for the `100/(100+divisor)` computation — should be presented as a global set-bonus-style additive percentage.

Stacking case the user cares about: 6-slot Preventive Medicine (+3.75%) + 6-slot Reactive Defenses (+3.75%) + 2-slot Unbreakable Guard (+2.5%) = +10% global Endurance Discount. Stack Hybrid: T4 Support Radial (+10%) on top for +20% total.

### Bug 4 — Heavy Burst / Suppression damage display
> Heavy Burst: `Average DMG 374.60 (+518%) + 208.5 proc`
> Suppression: `Average DMG 378.01 (+511%) + 208.5 proc`
>
> User suspects procs are being calculated per-DoT-tick instead of per-cast. +518%/+511% damage bonus also suspicious.
>
> User's expected math (Soldier of Arachnos build):
> - Slotted Damage: +78.24% pre-Alpha, pre-ED
> - Alpha T4 Intuition Radial: +11% pre-ED, +22% post-ED
> - Combined slotting after ED: `(89.24 - 70) * 0.9 + 70 = 87.316` → `+22% = +109.316%` enhancement
> - Global set bonuses: +16.5%
> - Tactical Training: Assault: +15% (NOT +19.95% — see below)
> - Leadership: Assault: +15% (NOT +19.95%)
> - Hybrid T4 Support Radial: +8% (toggle assumed ON; user also asks: **"where is the toggle ON/OFF slider switch for the Incarnate Destiny and Hybrid slots?"**)
> - **Expected total damage buff: +163.816%**

### Bug 5 — Power Info missing buff/debuff throughput
> Darkest Night doesn't show -ToHit Debuff throughput. Aim shows +ToHit but not +Damage. Post-enhancement values for buff/debuff effects are not shown.

### Bug 6 — Shield Defense: Grant Cover incorrectly grants defense to caster (added 2026-05-25)
> Grant Cover when toggled on increases the caster's defense numbers. However, Grant Cover only provides defense to teammates, not to self. It does provide DDR (defense debuff resistance) to self.
>
> Repro: Tanker / Shield Defense / level 50, Homecoming dataset. App version 0.1.7.8-beta.

---

## What was fixed this pass

### ✅ Bug 1: Dominion of Arachnos proc PPM fix (both variants)
- **Edits in shared** [src/data/proc-data.ts](src/data/proc-data.ts):
  - Regular Dominion of Arachnos: `ppm: 3` → `ppm: 4` ([:1719](src/data/proc-data.ts#L1719))
  - Superior Dominion of Arachnos: `ppm: 4` → `ppm: 5` ([:1731](src/data/proc-data.ts#L1731))
- **Confirmed by user**: HC reports the same values (Superior = 5, regular = 4) — shared-file change is correct for both datasets, no per-dataset split needed.

### ✅ Bug 4 (calc, partial): Alpha not gated by `allowedEnhancements`
Root cause was Alpha incarnate bonuses leaking into powers that don't accept the corresponding enhancement category. Toggle damage buffs (Tactical Training: Assault, Leadership: Assault, etc.) listed 15% in the data but displayed as **+19.95%** because `enhBonuses.damage` from Alpha Intuition Radial T4 (+33%) was being multiplied in unconditionally (15 × 1.33 = 19.95). TT:Assault's `allowedEnhancements` is `["EnduranceReduction", "Recharge"]` — it doesn't accept Damage enhancement, so Alpha's Damage portion shouldn't apply.

**Edits:**
- [src/utils/calculations/enhancement-values.ts](src/utils/calculations/enhancement-values.ts):
  - Added optional `allowedEnhancements?: EnhancementStatType[]` to `PowerWithSlots` interface.
  - New exported helper `filterAlphaByAllowedEnhancements(alphaBonuses, allowed)` that returns only the Alpha aspects whose corresponding `EnhancementStatType` appears in `allowed` (undefined = no filter, preserves legacy behaviour).
  - New `ASPECT_TO_ENH_TYPE` reverse map: aspect-key (`damage`) → `EnhancementStatType` (`Damage`).
  - `combineWithAlphaED` now gates both Step 2 (ED-subject alpha) and Step 4 (ED-bypass alpha) by `allowedEnhancements`.
- [src/utils/calculations/character-totals.ts](src/utils/calculations/character-totals.ts):
  - Added `allowedEnhancements?: EnhancementStatType[]` to internal `PowerWithToggle` interface.
  - `applyActivePowerBonuses` call to `combineWithAlphaED` now passes `power.allowedEnhancements`.
  - No-slots branch uses the new `filterAlphaByAllowedEnhancements` helper instead of cloning Alpha verbatim.

**Verified:** the new helper, called with `['EnduranceReduction', 'Recharge']`, drops Alpha's `damage` and `accuracy` aspects (preserves `endurance` and `recharge`). TT:Assault's displayed bonus should now read +15% instead of +19.95%. Type-check passes.

**✅ Bug 4 part 2 (DONE): Heavy Burst +518% / Suppression +511% display fix**

Not a calc bug — a display bug in the `(+%)` badge next to the Average DMG /
DPS / DPA / DPE value. The badge was computed as `(valueFinal / valueBase - 1) * 100`,
but `valueFinal` included proc damage that was ALSO shown separately as
`+208.5 proc`. So proc damage was double-counted into the multiplier display.

Traced with the Huntspidermind Arachnos Soldier build:
- Heavy Burst pure-DoT, scale 0.155714, 7 ticks → `dotTotalBase ≈ 60.6`, enhanced ratio `dotTotalFinal/dotTotalBase ≈ 2.74` (≈ +174% — close to the user's expected +163.816% once Bug 4 part 1's Alpha gating took effect)
- `procDamagePerActivation` ≈ 208.5 (slotted Detonation: Smashing Damage + Spectral Radial Flawless Interface Negative DoT × 10 expectedTargets on a cone)
- Old display: `(60.6 × 2.74 + 208.5) / 60.6 - 1 ≈ 5.18 → +518%`. The 208.5 / 60.6 ≈ 3.44 inflation came entirely from including proc in the numerator but not denominator.

**Fix:** [src/components/info/DamageBlock.tsx:436](src/components/info/DamageBlock.tsx#L436) —
subtract `procContribution` from `valueFinal` before computing the +% so the badge
reflects the enhancement-strength multiplier on the attack itself, not the additive
proc chunk that's already shown next to it. Subtraction is unit-safe across all four
display modes because `computeProcContribution` divides proc damage by the same
denominator (`finalCycleTime` / `effectiveCastTime` / `endCost`) that `valueFinal`
uses internally. Tooltip on the proc annotation updated to spell out the convention.

Hypothesis from the original report — "procs are being calculated per-DoT-tick instead
of per-cast" — checked and ruled out. The slotted-IO proc loop in DamageBlock and the
incarnate proc accumulator in InfoPanel both compute one `chance × damage` per
activation, not per DoT tick.

### ✅ Bug 2: Witchcraft + Superior Witchcraft proc piece data
- **Edits to** [src/data/datasets/rebirth/io-sets-raw.ts](src/data/datasets/rebirth/io-sets-raw.ts):
  - `superior_witchcraft` piece 6: `"Empty"` (proc: false) → `"Chance for -Res Debuff"` (proc: true)
  - `witchcraft` piece 6: same change
- **New entries in** [src/data/proc-data.ts](src/data/proc-data.ts) (appended at end):
  - `"Witchcraft: Chance for -Res Debuff"`: 3.5 PPM, `Foe(-Resistance 20%) for 10s`, level 10–50, Unique
  - `"Superior Witchcraft: Chance for -Res Debuff"`: 6 PPM, same effect, level 50, Unique
- Both sets are Rebirth-exclusive (HC has no Witchcraft sets at all).

### ✅ Bug 6: Grant Cover defenseBuff team-only flag
- The calc engine already supports `effects.defenseBuffExcludesSelf: true` at [character-totals.ts:799](src/utils/calculations/character-totals.ts#L799) — the data files just weren't setting it.
- Added `effects: { defenseBuffExcludesSelf: true }` to all 7 Grant Cover override files (4 HC ATs + 3 Rebirth ATs):
  - HC: tanker (primary), scrapper/brute/stalker (secondary)
  - Rebirth: tanker (primary), scrapper/brute (secondary — no Rebirth stalker shield)
- DDR (`debuffResistance.defense`) and -Recharge resistance still apply to self via the generated layer — only the `defenseBuff` block is gated.

### Verification
- `npm run lint` (typecheck) passes
- `npm run build` not yet run — recommend running before deploy to confirm no breakage

---

## What remains — concrete next steps

### ✅ Bug 2 follow-up (DONE): Witchcraft + Superior Witchcraft full rebuild

Rewrote both sets at [io-sets-raw.ts:25454](src/data/datasets/rebirth/io-sets-raw.ts#L25454) (Superior) and [:28845](src/data/datasets/rebirth/io-sets-raw.ts#L28845) (regular) to match the canonical Rebirth bin data:

**Type clarification:** the user's wiki paste said "Sleep set" but the bin category is `ECToHitDeBuff` (To Hit Debuff). Keeping `"type": "To Hit Debuff"` is correct — that's the official game classification.

**Piece aspects:** active pieces 1-5 now use `"ToHit Debuff"` (the primary aspect, matches HC's pattern for ToHit Debuff sets). Display names use the CoH community term "Universal Debuff" for the multi-aspect debuff pieces (the bin shows these pieces are also slottable in Slow + Defense Debuff powers, but ToHit Debuff is the primary classification).

| # | Aspects | Name |
|---|---|---|
| 1 | `["ToHit Debuff"]` | Universal Debuff |
| 2 | `["Accuracy", "ToHit Debuff"]` | Accuracy/Universal Debuff |
| 3 | `["Accuracy", "Recharge"]` | Accuracy/Recharge |
| 4 | `["ToHit Debuff", "Endurance", "Recharge"]` | Universal Debuff/Endurance/Recharge |
| 5 | `["Accuracy", "Endurance", "Recharge"]` | Accuracy/Endurance/Recharge |
| 6 | `[]` proc | Chance for -Res Debuff (already fixed prior session) |

**Bonus tiers** rebuilt from bin (`Increased_Damage_3`/`_7`, `Increased_Energy_Neg_Ranged_Def_5`/`_7`, `Improved_Recharge_Time_4`/`_7`, `Accuracy_4`/`_7`, `Energy_Neg_Mez_Res_5`/`_7`):

| Pieces | Witchcraft | Superior |
|---|---|---|
| 2 | +2% Damage (all) ← **was missing** | +4% Damage |
| 3 | +3.75/3.75/1.875% Def E/N/Ranged | +5/5/2.5% Def E/N/Ranged |
| 4 | +6.25% Recharge | +10% Recharge |
| 5 | +9% Accuracy ← **was missing** | +15% Accuracy |
| 6 | +4.5% E/N Resist + 7.5% Imm/Hold/Stun/Sleep Resist | +6% E/N Resist + 10% Imm/Hold/Stun/Sleep Resist |

Also removed spurious **Fear** and **Confuse** resistance entries from the 6-pc bonus — those weren't in the bin (only Immobilized, Held, Stunned, Sleep are).

Type-check passes. Witchcraft set composition is now ground-truth-matched.

### ✅ Other Rebirth event-set bonus gaps (DONE for Imperial Might, deferred for Total_Might)

- **`imperial_might`** — populated 4 of 5 bin tiers at [io-sets-raw.ts:11396](src/data/datasets/rebirth/io-sets-raw.ts#L11396):
  - 2pc: +7.5% Increased Movement
  - 3pc: +300% Knockback Protection (scale −3.0 in the bin)
  - 4pc: +9.0% Accuracy
  - 5pc: +3.0% Damage (all 8 damage types — bin's `Increased_Damage_5` lists Smashing/Lethal/Fire/Cold/Energy/NegEnergy/Toxic/Psionic)
  - 6pc: **deferred** — Total_Might is a `Set_Mode` unlock (10.25s click effect via `Set_Bonus.Set_Bonus.Total_Might`), not a passive stat bonus. The planner has no model for set-mode unlocks. Would need either a flavour "unique effect" string entry or a new bonus type. Confirmed via [tools/bin-crawler](tools/bin-crawler) inspection that this is a real Rebirth-exclusive 6pc mode trigger.
- **`inexhaustibility`** — bin has no bonuses; 0 in the data is correct. Leave as-is.

**Original section (kept for reference):**
### 🔴 Bug 2 follow-up: Witchcraft set composition is fundamentally broken

User's wiki paste (canonical Rebirth source) says Witchcraft is a **Sleep** set with these pieces:
1. Universal Debuff
2. Accuracy/Universal Debuff
3. Accuracy/Recharge
4. Universal Debuff/Endurance/Recharge
5. Accuracy/Endurance/Recharge
6. Chance for Resistance Debuff (← only this piece is fixed so far)

Current Rebirth data at [src/data/datasets/rebirth/io-sets-raw.ts:25454](src/data/datasets/rebirth/io-sets-raw.ts#L25454) and [src/data/datasets/rebirth/io-sets-raw.ts:28845](src/data/datasets/rebirth/io-sets-raw.ts#L28845) says:
- Type: `"To Hit Debuff"` (WRONG — should be `"Sleep"`)
- Pieces 1-5 use `"ToHit Buff"` aspects (WRONG — should be `"Universal Debuff"` and/or `"Accuracy"`)

Correct set bonuses per user spec (also wrong/incomplete in current data):
- 2pc: +4% Damage (all powers) — **MISSING**
- 3pc: +5% E/N Defense, +2.5% Ranged Defense — present
- 4pc: +10% Recharge — present
- 5pc: +15% Accuracy — **MISSING**
- 6pc: +6% E/N Resistance — present
- 6pc: -10% Stun, Sleep, Hold duration — **MISSING**

**Blocker**: `"Universal Debuff"` is not an existing aspect/enhancement category anywhere in the codebase. Verify with:
```
grep -in "Universal Debuff" src/data/datasets/**/*.ts src/types/**/*.ts
```

This means the rebuild needs:
1. Add "Universal Debuff" as a recognized aspect (likely in `src/types/enhancement.ts` or wherever aspects are enumerated)
2. Verify which powers accept "Universal Debuff" enhancements (probably anything that accepts To Hit Debuff)
3. Rewrite both `witchcraft` and `superior_witchcraft` entries with correct aspects, set bonuses, and type
4. Audit other Rebirth event sets — `grep -B2 -A2 '"category": "event"' src/data/datasets/rebirth/io-sets-raw.ts` — at least `inexhaustibility` showed up with empty bonuses

### 🔴 Bug 4: Damage display calc engine bug — root cause found, fix not yet applied

**Diagnosed source of the +19.95% (TT:Assault / Leadership:Assault)** — discovered while investigating:
- Both datasets reference table `"Ranged_Buff_Dmg"` which **does not exist** in either at-tables file
- [src/utils/calculations/character-totals.ts:1417](src/utils/calculations/character-totals.ts#L1417) silently falls back to `effect.scale * 0.10` for missing tables → 1.5 × 0.10 × 100 = **15%** (the user-expected value, by coincidence)
- [src/utils/calculations/character-totals.ts:718](src/utils/calculations/character-totals.ts#L718) then inflates this with `enhMultiplier = 1 + enhBonuses.damage`. Alpha Intuition Radial T4 contributes +33% damage to `enhBonuses.damage`, but TT:Assault's `allowedEnhancements` is `["EnduranceReduction", "Recharge"]` — it does NOT accept Damage enhancement.
- Result: 15% × 1.33 = **19.95%** (matches user's report exactly)

**Root cause**: `damageBuff` effects get the damage-enhancement multiplier applied unconditionally. Need to gate the multiplier by whether the power's `allowedEnhancements` actually includes the relevant category. Same logic likely applies to other buff types (tohitBuff at line 703-706, defenseBuff, etc.).

**Suspected related** (not confirmed): The +518%/+511% on Heavy Burst/Suppression and the per-DoT-tick proc multiplication. Likely the same family of bugs — buff effects compounding into damage attacks. Trace from the Heavy Burst data → which effects contribute to the displayed bonus → which contribution is wrong.

**Files to read first when resuming**:
- [src/utils/calculations/character-totals.ts:625-727](src/utils/calculations/character-totals.ts#L625-L727) — `applyActivePowerBonuses` (toggle damage buff aggregation)
- [src/utils/calculations/damage.ts](src/utils/calculations/damage.ts) — final damage display per power
- [src/utils/calculations/at-effects.ts:104](src/utils/calculations/at-effects.ts#L104) — `calculateScaledEffect` (the "proper" path for scaled effects, vs. the buggy fallback in character-totals)

**Secondary question from Bug 4**: User asks where the ON/OFF toggle for Destiny and Hybrid slots is. Find/add this — likely in the IncarnatePicker component or build dashboard. Search for `isActive` on incarnate slots and how Hybrid effects get gated on/off.

### ✅ Bug 3 (calc, DONE): Hybrid T4 Support Endurance Discount restored

Root cause was a **literal wrong-attrib-name** in [scripts/convert-incarnate-effects.cjs](scripts/convert-incarnate-effects.cjs) silent-boost handler (line ~531). The Hybrid Support silent boosts (`support_boost_{common,uncommon,rare,very_rare}.json`) store the +%/EndDiscount as bin attrib `'EnduranceDiscount'` (index 92), but the converter was checking for `'Endurance'` (index 22 — a different attrib for max-end buffs). The silent boost was silently dropped → `support_genome_8/9` shipped with `passive: {}` → `applyHybridStatBlock` had nothing to add → `global.enduranceDiscount` got 0 contribution.

**Edits:**
- [scripts/convert-incarnate-effects.cjs](scripts/convert-incarnate-effects.cjs):
  - Silent-boost handler (line 530-538): `'Endurance'` → `'EnduranceDiscount'`. The 5 lines added a comment explaining the index-22-vs-92 distinction since the bug pattern is exactly the kind of trap to hit again.
  - Inline buff handler (line ~477): accepts both `'Endurance'` and `'EnduranceDiscount'` defensively, since Mids/CoD2-derived data uses the shorter name and bin export uses the longer one.
- Re-ran `node scripts/convert-incarnate-effects.cjs` for both HC and Rebirth.

**Verified** in [src/data/datasets/homecoming/generated/incarnate-effects.ts](src/data/datasets/homecoming/generated/incarnate-effects.ts):
- `support_genome_2` (T2): `passive: {"enduranceDiscount": 0.05}`
- `support_genome_8` (T4 Core): `passive: {"enduranceDiscount": 0.1}` ← was `{}` before
- `support_genome_9` (T4 Radial): `passive: {"enduranceDiscount": 0.1, defMelee/AoE/...}` ← `enduranceDiscount` added
- Same fix lands in Rebirth. Type-check passes.

`applyHybridStatBlock` already had the correct path: it iterates `stats[stat]` → multiplies by 100 → adds to `global[stat]`. The +10% now flows through. Stacking case (6-slot PrevMed + 6-slot ReactDef + 2-slot UnbGuard + Hybrid Support T4 = +20%) should compute correctly.

### ✅ Bug 3 (display + pipeline, DONE): EndDisc unified + divisor math everywhere

Display-semantics discussion uncovered three more latent calc bugs sharing the same
root cause: the planner had **two parallel EndDisc accumulators**
(`global.endurance` from set bonuses and `global.enduranceDiscount` from active-power
effects), they were combined with the wrong formula at the wrong time, and the
dashboard converted the result into a multiplier-form percentage that didn't match
in-game / Mids convention. Fixed as one consolidated pass.

**Symptoms**
- A. Set-bonus +EndDisc never reached toggle cost calc (wrong divisor input).
- B. Active-power EndDisc (Conserve Power, Hybrid Support T4, etc.) was applied
  post-hoc as `cost *= (1 - global/100)` — a linear approximation that diverges
  badly from the true divisor `cost = base / (1 + EndDisc/100)` at higher %.
- C. Dashboard "End Disc" stat showed only set-bonus EndDisc, ignoring active-
  power contributions.
- D. Dashboard label `End Disc` showed multiplicative `1 - 1/(1 + endRdx/100)` form
  (e.g. `16.67%` from +20% sum) rather than the additive divisor input (`+20%`)
  that matches Mids and the in-game combat-attributes window.

**Fix — single canonical accumulator, divisor math, ordering**

[src/utils/calculations/character-totals.ts](src/utils/calculations/character-totals.ts):
1. **New `applyToggleEndCosts` function** — runs in a new Step 9.7 after every
   global EndDisc source is aggregated (set bonuses → fitness → active powers →
   procs → accolades → incarnates). Uses `cost = base / (1 + slotEndRdx + global.endurance/100)`
   per toggle.
2. **Removed inline toggle cost calc** from `applyActivePowerBonuses` (was Step 7);
   only the per-power side-effects (defense/resistance/etc.) remain there.
3. **Active-power `effects.enduranceDiscount`** now adds to `global.endurance`
   instead of `global.enduranceDiscount`, with breakdown key `'endurance'`.
4. **Hybrid Support T4 passive `enduranceDiscount`** in `applyHybridStatBlock`
   now routes to `global.endurance` (same path / breakdown bucket as set bonuses).
5. **Removed post-hoc reduction** (lines 2945-2952) — the linear `cost *= (1 - global/100)`
   patch is gone; the divisor formula in Step 9.7 supersedes it.

[src/data/core/stat-definitions.ts](src/data/core/stat-definitions.ts):
6. `endreduction.getValue` now returns `stats.enduranceReduction` directly
   (additive divisor-input %), with tooltip explaining the divisor formula and
   that the value matches Mids / in-game.

**`global.enduranceDiscount` field retained but no longer written** — left in the
GlobalBonuses type for the moment so external consumers don't break; safe to delete
in a follow-up. Type-check passes.

### ✅ Bug 5 (DONE): Power Info now shows buff/debuff throughput

Two separate sub-bugs, both fixed.

**Sub-bug A — Aim's +Damage was hidden by a display filter.**
[SharedPowerComponents.tsx:777-781](src/components/info/SharedPowerComponents.tsx#L777-L781) had a `if (key === 'damageBuff') continue;` short-circuit (only let `perTarget` damageBuffs like Soul Drain through). Comment said "handled by Defiance section for Blasters" but that section no longer exists — and the filter was hiding +Damage on Aim, Build Up, Tactical Training: Assault, Leadership: Assault, Fortitude, and every other click/toggle damage buff. Removed the filter; damageBuff now renders the same as tohitBuff. **Verified live:** Aim Power Info shows `+Damage 50.00%` alongside `+ToHit 50.00%`.

**Sub-bug B — Foe debuffs were dropped at convert time entirely.**
[scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) had three `if (isSelfTargeting) { ... }` guards on `damageDebuff`, `tohitDebuff`, and `rechargeDebuff` capture. The intent was to prevent foe debuffs from being applied to the caster's own stats (since `effects.damageDebuff` used to mean "self-penalty only"). But the calc engine ALREADY gates those fields on the `selfPenalty: true` flag, so the safer pattern is:
- Capture the debuff into the existing field regardless of target
- Only set `selfPenalty: true` when `isSelfTargeting`
- Calc engine ignores fields without `selfPenalty` for caster stats (unchanged)
- Display layer renders them via existing registry entries (`tohitDebuff` → "-ToHit", `damageDebuff` → "-Damage", `rechargeDebuff` → "-Recharge") — no display changes needed

Removed the three guards. Re-converted all HC + Rebirth powersets + pools + epic pools. **Verified live:** Darkest Night Power Info now shows `-ToHit 18.75%` and `-Damage 25.00%` in a DEBUFFS section. Granite Armor's self-penalty Damage debuff still applies to the caster (the `selfPenalty` flag is still set). Other powers that now light up: Time's Juncture, Radiation Infection (also gained `defenseDebuff` since that was already foe-aware), Cold Domination toggles, the rest of the Dark Miasma debuff suite.

**Generalization piece:** the post-enhancement "Final" column for these debuffs uses the registry's `enhancementAspect: 'tohitDebuff' | 'defenseDebuff' | 'damageDebuff'` mapping, so slotted ToHit Debuff / Defense Debuff IOs will boost the displayed value automatically. Stats with `{scale, table}` already flowed through this path for buffs; debuffs now use the same path.

**Files touched:**
- [src/components/info/SharedPowerComponents.tsx](src/components/info/SharedPowerComponents.tsx) — removed the damageBuff display filter
- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) — removed 3 `isSelfTargeting` debuff drops
- Regenerated all powerset / pool / epic TS files (~1k generated files updated). Type-check passes.

---

## ✅ Audit closed (2026-05-25): other "team-only buff" data omissions

Bug 6 (Grant Cover) was a case where the in-game description says the buff "is only applied to nearby team mates, but not yourself" but the data didn't reflect that — so the caster was getting a phantom defense bonus. The calc engine's `effects.defenseBuffExcludesSelf` flag at [character-totals.ts:799](src/utils/calculations/character-totals.ts#L799) was added for exactly this case.

**Result of audit:** Grant Cover remains the **only power across HC and Rebirth** datasets that needs this flag. Every suspect was verified to be correctly modeled:

| Power | Verified behavior | Status |
|---|---|---|
| **Phalanx Fighting** (Shield Defense) | Self-only buff that scales with nearby allies (`targetType: "Self"`, "you will gain a small bonus...grows for each ally"). | ✅ Correct |
| **Maneuvers** (Leadership) | "Defense of yourself and all nearby teammates" — caster explicitly included. | ✅ Correct |
| **Dispersion Bubble** (Force Field) | PBAoE toggle centered on caster; shortHelp says "Team +Def" (CoH convention: includes caster). | ✅ Correct |
| **Sonic Dispersion / Barrier / Haven** (Sonic Resonance) | Same shape as Dispersion Bubble; caster included per game behavior. | ✅ Correct |
| **Insulation/Deflection Shield** (Force Field) | Single-ally targeted via `targetType: "Ally"`. | ✅ Already filtered by `ALLY_ONLY_TARGET_TYPES` |
| **Speed Boost** (Kinetics) | "You cannot use this power on yourself" — `targetType: "Ally (Alive)"`. | ✅ Already filtered by `ALLY_ONLY_TARGET_TYPES` |

**Broader sweep:** grepped both datasets for any other description containing exclusion language (`except yourself`, `not the caster`, `excluding yourself`, `not affect you`, `but not yourself`). **Zero hits outside Grant Cover** — Grant Cover is the only power in the dataset whose description explicitly excludes the caster from a buff.

**Architecture gap status — still theoretical.** No team-only ToHit-buff or damage-buff power exists in the data today, so the Power type does not need `tohitBuffExcludesSelf` / `damageBuffExcludesSelf` yet. The calc engine sites at [character-totals.ts:703-727](src/utils/calculations/character-totals.ts#L703-L727) remain ready to gate them if such a power ever appears (most likely vector: new Rebirth / Thunderspy content, or a future HC pool rework).

**Re-trigger this audit if:** a user reports the analogous "buff is showing on my totals but shouldn't" for another power, or if new dataset content introduces a power whose description carries the "not yourself / not the caster" exclusion clause. No proactive resweep needed.

---

## File reference quick-jump

| Bug | Files touched / files to read next |
|-----|-----|
| 1 ✅ | [src/data/proc-data.ts:1715-1738](src/data/proc-data.ts#L1715-L1738) (both regular and Superior) |
| 2 ✅ partial | [src/data/datasets/rebirth/io-sets-raw.ts:25454](src/data/datasets/rebirth/io-sets-raw.ts#L25454) (Superior); [:28845](src/data/datasets/rebirth/io-sets-raw.ts#L28845) (regular); [src/data/proc-data.ts](src/data/proc-data.ts) (appended at end) |
| 2 ⏭ rebuild | Same files; also `src/types/` for "Universal Debuff" aspect addition |
| 3 ⏭ calc | [src/utils/calculations/character-totals.ts:1135](src/utils/calculations/character-totals.ts#L1135) (`enduranceDiscount` accumulator); `src/data/incarnate-effects-generated.ts` |
| 3 ⏭ display | Stat display components — find via grep for `enduranceDiscount` in `src/components/` |
| 4 ⏭ calc | [src/utils/calculations/character-totals.ts:718](src/utils/calculations/character-totals.ts#L718) (damageBuff enh-multiplier gate); [src/utils/calculations/damage.ts](src/utils/calculations/damage.ts); [src/utils/calculations/at-effects.ts:104](src/utils/calculations/at-effects.ts#L104) |
| 4 ⏭ toggles | Find Incarnate Destiny/Hybrid `isActive` handling — search `src/components/incarnate/` |
| 5 ⏭ | Power Info modal — confirm path via `grep -rn "Power Info" src/components/` |
| 6 ✅ | 7 Grant Cover override files under `src/data/datasets/{homecoming,rebirth}/overrides/powersets/*/shield-defense/grant-cover.ts` |

---

## Resume checklist

When picking back up:
1. Pull latest if you committed this session's fixes
2. `npm run lint` to confirm clean state
3. Pick a bug from "What remains" — recommend Bug 4 (highest user-visible impact) or finish Bug 2's full Witchcraft rebuild (clear scope, mechanical work)
4. Re-read this doc's "diagnosed source" sections — the root cause for Bug 4's +19.95% is already isolated; you can go directly to the fix
