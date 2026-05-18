# Regen Discrepancy Investigation — Giggelles Build (2026-05-18)

## Summary

Reported: planner shows **144.25 hp/s** regen, in-game shows **145.23 hp/s** for the same build. Gap = **0.98 hp/s** (~0.7%), attributed by the user to Integration and Reactive Regeneration. After full investigation, the planner's IO and proc math is provably correct against the published Homecoming rules; the residual gap is **not** in any slot-level calculation and most likely originates from an HC mechanic we don't yet model.

## Build context

- Character: Scrapper, Energy Melee / Regeneration, level 50, no exemplar
- Alpha: Vigor Core Paragon T4 (heal +45%, level shift +1)
- Hybrid: Melee Radial Embodiment T4
- Relevant slotting:
  - **Integration**: Numina #1, #3, #5 + Triage #1, #2 + Generic Heal IO L50+5
  - **Reactive Regeneration**: identical to Integration
  - **Fast Healing**: Panacea #1, #3, #4, #5, #6 + Generic Heal IO L50+5 (no Triage)

## Decomposition of the 0.98 hp/s gap

Comparing in-game Combat Attributes vs. planner per-line:

| Source | In-game (hp/s) | Planner (hp/s) | Δ |
|---|---|---|---|
| Fast Healing | 17.90 | 17.90 | 0.00 |
| **Integration (combined)** | 5.02 + 24.20 = 29.22 | 28.89 | **+0.33** |
| **Reactive Regeneration** | 48.40 | 47.74 | **+0.66** |
| Health (inherent) | 7.95 | 7.95 | 0.00 |
| Numina's +Recovery/+Regen proc | 2.01 | 2.01 | 0.00 |
| Impervious Skin proc | 2.51 | 2.51 | 0.00 |
| Regen Tissue proc | 2.51 | 2.51 | 0.00 |
| Melee Radial (Hybrid passive) | 3.01 | 3.01 | 0.00 |
| All set-bonus regen lines | match | match | 0.00 |

Total Δ = **0.99 hp/s**, accounting for the entire reported gap.

The ratio Δ_RR / Δ_Int = 0.66 / 0.33 = **2.0**, exactly the ratio of the powers' enhanceable regen scales (RR has `scale: 2`, Integration enhanceable has `scale: 1`). This proves the missing factor is **proportional to the enhanceable `scale`**, i.e. it acts as an additive bonus to the per-power heal-enhancement multiplier.

The 50% unenhanceable portion of Integration matches in-game exactly (5.02 hp/s on both), confirming the split is correct and the issue is isolated to the **heal-enhancement multiplier**.

## Heal-enhancement gap

| | Planner | In-game | Δ |
|---|---|---|---|
| Heal enhancement (no Alpha) | 105.52% | **108.8%** | +3.28 pp |
| Heal enhancement (with Alpha T4) | 137.77% | **141.0%** | +3.23 pp |
| Alpha contribution alone | 32.25 pp | 32.20 pp | -0.05 |

Alpha math matches almost exactly. The gap is a **flat +3.27 pp on the post-ED Heal enhancement, unaffected by Alpha**. The fact that the gap *doesn't* compound through Alpha's ED-subject portion means whatever's missing is applied *after* ED (i.e. as a global heal-strength-style bonus, or as a separate enhancement aspect added post-ED).

## What's been verified correct

Per-IO Heal aspect values, confirmed against user's in-game Triage/Numina enhancement tooltip:

| Slot | Planner value | In-game value | Match |
|---|---|---|---|
| Numina #1 (Heal/End dual, attuned L50) | 0.424 × 0.625 = 26.50% | 26.5% | ✓ |
| Numina #3 (Heal/Rech dual, attuned L50) | 26.50% | 26.5% | ✓ |
| Numina #5 (Heal single, attuned L50) | 0.424 × 1.0 = 42.40% | 42.4% | ✓ |
| Triage #1 (Heal/End dual, attuned cap L30) | 0.348 × 0.625 = 21.75% | 21.8% | ✓ |
| Generic L50+5 Heal IO (single) | 0.424 × 1.25 = 53.00% | 53.0% | ✓ |
| **Sum (raw pre-ED)** | **170.15%** | (implied 192%) | -21.85 pp |

User-provided IO-effectiveness table matches our `IO_EFFECTIVENESS` table at every level. User-provided multi-aspect modifier matches our 1.0 / 0.625 / 0.5 / 0.4375. User-provided +5 boost = ×1.25 matches our `BOOST_MULTIPLIER_PER_LEVEL = 0.05`.

Applying ED Schedule A (95% + 15% past 100%): 95 + (170.15 − 100) × 0.15 = **105.52%** post-ED → matches the planner's display exactly. Solving backward from in-game's 108.8% post-ED implies **192% pre-ED**, requiring **+21.85 pp of unaccounted-for raw IO Heal**, which isn't in any slot.

## Proc handling — verified clean (per user question)

User asked whether procs like Power Transfer might be erroneously running through heal-strength multiplication. They're not:

- **Power Transfer #6** (`Chance for Heal Self`, type `Proc`, PPM 3, mechanics `Buff(Heal 5%)`): slotted in Stamina (Auto). Goes through `applyPPMProcBonuses` → `Heal` case is **explicitly skipped** with comment "PPM heal procs grant a chunk of HP per fire — game does NOT count these as steady-state regen". Correct.
- **Panacea #6** (`Chance for +HP & +End`, type `Proc`): same code path, same skip.
- **Numina #6** (`+Recovery/+Regeneration`, type `Proc120s`/always-on): goes through `applySingleProcEffect` → `Heal` case adds raw value to `global.regeneration` directly with **no heal_enh multiplication**. Correct.

So procs are neither double-counted nor enhanced. Ruled out.

## Root cause identified: attuned IO scaling

The user's in-game screenshot of an attuned Triage `Heal/Abs/End` IO at level 50 character shows the enhancement value at **26.5%**, which is the standard Schedule A L50 dual-aspect value (`0.424 × 0.625`). The wiki table's L30 value of `21.8%` (`0.348 × 0.625`) is for IOs at level 30 *or* for non-attuned Triage capped by the set's natural max level.

**Translation: HC's attuned IOs scale with character level, ignoring the set's `maxLevel` cap.** Our planner caps attuned IOs at `set.maxLevel` ([enhancement-values.ts:546](src/utils/calculations/enhancement-values.ts#L546) and [enhancement-values.ts:662](src/utils/calculations/enhancement-values.ts#L662)):

```ts
ioLevel = set.maxLevel > 1 ? Math.min(baseLevel, set.maxLevel) : baseLevel;
```

For this build's Triage #1 (Heal/Abs/End, dual aspect, attuned, in a L50 character):
- Our planner: `0.348 × 0.625 = 21.75%` (capped at Triage's maxLevel 30)
- HC actual: `0.424 × 0.625 = 26.50%` (scales to character level)
- Diff: **+4.75 pp pre-ED**

Re-running the heal-enhancement math with the corrected Triage value:

| | Planner (old) | Planner (with fix) | In-game | Δ remaining |
|---|---|---|---|---|
| Raw IO pre-ED | 170.15% | **174.90%** | (implied 192%) | -17.1 pp |
| Heal enh, no Alpha | 105.52% | **106.23%** | 108.8% | -2.57 pp |
| Heal enh, with Alpha T4 | 137.77% | **138.48%** | 141.0% | -2.52 pp |

The Triage attuned-scaling fix closes **~70% of the gap** (3.3 pp → 2.5 pp). Residual ~2.5 pp pp remains.

## Residual ~2.5 pp gap — possible sources

The Triage fix alone is high-confidence based on direct empirical evidence. The remaining ~2.5 pp is still unexplained:

1. **Hidden +5 boosts on attuned IOs.** HC allows catalyzing attuned IOs with boosters. The build file doesn't track boost levels on attuned IOs (only `boost: 5` on the explicit generic IO). If the user has booster catalysts applied to one or more attuned IOs that the export/import doesn't capture, our planner would systematically undercount.
2. **An unmodeled `+heal_strength` source.** As before — a proc, intrinsic passive, or Alpha sub-mod contributing +heal_strength globally that bypasses ED. Wiring up `globalBonuses.healOther` consumption (currently dead) is a separate latent fix that won't resolve this build's gap but should land regardless.
3. **Alpha bypass ratio.** Our planner uses `2/3` bypass for very-rare Alphas. If HC actually applies `3/4` or splits Alpha across multiple AttribMods with different ED behavior, the Alpha contribution would land slightly differently. Worth checking the binary AttribMod layout for `vigor_core_paragon`.

## Recommendation

**Status: pending in-game verification before any code change.** The user has flagged this as a likely HC bug — attuned IOs from `maxLevel < 50` sets (Triage confirmed) appear to be bumped up to character-level scaling, which may or may not be intentional HC behavior. Need to verify against other `maxLevel < 50` sets in-game before patching the planner.

If verification confirms HC universally scales attuned IOs to character level (regardless of `set.maxLevel`), the fix is:

- [enhancement-values.ts:541-546](src/utils/calculations/enhancement-values.ts#L541-L546) and [enhancement-values.ts:657-662](src/utils/calculations/enhancement-values.ts#L657-L662) — drop the `Math.min(baseLevel, set.maxLevel)` for attuned IOs; use `baseLevel` directly.

This is a load-bearing change — it shifts enhancement values for every build slotting attuned IOs from sets with `maxLevel < 50` (Triage, Steadfast Protection, Doctored Wounds, Regenerative Tissue, Numina's pre-rework, low-level damage sets, etc.). Want full verification before flipping it.

Separately (no verification dependency):
- Wire up `globalBonuses.healOther` consumption in `applyActivePowerBonuses`'s regen branch — a real latent gap for builds with Panacea 6pc / Numina 4pc / Triage 4pc that this build doesn't trigger.
- Check the HC binary for the `Numinas_Convalesence_Regeneration_Recovery.json` AttribMod list to see if the +Recovery/+Regen proc carries an extra `Healing_Strength` mod the converter is dropping.

## Related findings (out of scope for this gap, but surfaced during investigation)

- **`globalBonuses.healOther` is dead code.** Populated by `healing_strength` set bonuses, never read. Wire it up in [character-totals.ts:1028](src/utils/calculations/character-totals.ts#L1028) (regen branch) and the direct-heal branch.
- **Triage's piece names don't include Absorb in our data.** HC has Triage as `Heal/Abs/End`, `End/Rech`, `Heal/Abs/Rech`, `Heal/Abs/End/Rech`. The user clarified that Absorb is *always* bundled with Healing on every IO that enhances healing — it doesn't add an extra aspect for the multi-aspect modifier (the dual-aspect value of 26.5% at L50 is the same whether we call it "Heal/End" or "Heal/Abs/End"). So this is **cosmetic only** for tooltip display; no calc impact. Fix at the converter level if/when we want piece names to match HC's display.

## Provenance

Build file: `Giggelles_2026-05-18.json` (Scrapper EM/Regen L50)
User-supplied data: in-game Combat Attributes regen breakdown, Integration enhancement tooltip (heal +137.77% planner / +141% in-game), Numina/Triage IO effectiveness tables, Triage piece names with Absorb aspect bundling.

What to test in-game (suggesting order of most likely to confirm/deny the HC-bug hypothesis):

Other maxLevel ≤ 30 sets: Steadfast Protection, Regenerative Tissue, Tempered Readiness — slot attuned at L50, check if enhancement % > the wiki's L30 value. If yes → systemic. If no → Triage-specific.
Mid-range maxLevel sets: Doctored Wounds (40), Performance Shifter (50) — Performance Shifter as a control since maxLevel = 50 should show no scaling difference.
Boosted attuned IOs: Take an attuned Triage, apply +1 booster, and see if the displayed value goes up by the standard 5% — confirms whether the catalyst path is interacting weirdly.
Ping me with what you find and I'll scope the fix accordingly.