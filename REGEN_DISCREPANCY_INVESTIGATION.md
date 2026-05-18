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

## Most plausible remaining hypotheses

The 3.27 pp gap *must* come from a global modifier the planner doesn't apply. Candidates in priority order:

1. **A `+heal_strength` source we're not extracting from the HC binary.** The planner has the field plumbing — `globalBonuses.healOther` is populated from `healing_strength` set bonuses (Panacea 6pc, Numina 4pc, Triage 4pc) — but `healOther` is never *consumed* in any regen or heal calculation; it's dead code. Even if we wired it up, none of those set-bonus thresholds fire for this build, so wiring it alone won't explain this case. But a *different* source of `+heal_strength` (a proc, a passive, an Alpha sub-mod we're missing) would land here.

2. **The Numina #6 piece has a hidden `+heal_strength` bonus in HC.** The piece is marked `aspects: []` in our data (proc-only), so the converter wouldn't see any attached strength bonus. Worth checking the binary's `Numinas_Convalesence_Regeneration_Recovery.json` for an extra AttribMod we're dropping. The user slotted this in Ailment Resistance, so if it grants a global heal-strength aura, it would apply to all regen.

3. **The Regeneration powerset has an undocumented global heal-strength bonus** (passive intrinsic, hidden auto-power) that boosts heal-enhancement on all powers slotted with heal IOs in that powerset. This would explain why Fast Healing matches but Integration/RR don't — except Fast Healing IS in Regeneration too, so this would have to be selectively applied to *toggle* regen powers only. Less likely.

4. **HC's "Heal" enhancement display includes Absorb enhancement summed into the same number.** The user confirmed that Healing and Absorb are always bundled in HC — every IO that enhances Healing also enhances Absorb at the same value. If the in-game tooltip's `+141% Heal` line is actually summing the two stats (Heal + Absorb), and our planner only tracks Heal, we'd be off. But this would imply a doubling of the displayed enhancement value (not a +3% offset), so it doesn't fit the magnitude.

## Recommendation

Do **not** patch any calc-pipeline constants. The math is provably correct against the published rules; an empirical numeric tweak risks regressing dozens of other builds for the sake of one 0.7% mismatch.

The productive next step is targeted HC binary investigation:
- Dump the `Numinas_Convalesence_Regeneration_Recovery.json` AttribMod list and check for an extra `Healing_Strength` mod the converter is dropping.
- Cross-check whether the Regeneration powerset has a hidden global passive that grants `+Heal_Strength`.
- Wire up `globalBonuses.healOther` consumption in `applyActivePowerBonuses`'s regen branch as a separate latent-bug fix — it won't move this specific build's number (no `healing_strength` set bonuses are active), but it's a real gap that will bite builds with Panacea 6pc / Numina 4pc / Triage 4pc.

## Related findings (out of scope for this gap, but surfaced during investigation)

- **`globalBonuses.healOther` is dead code.** Populated by `healing_strength` set bonuses, never read. Wire it up in [character-totals.ts:1028](src/utils/calculations/character-totals.ts#L1028) (regen branch) and the direct-heal branch.
- **Triage's piece names don't include Absorb in our data.** HC has Triage as `Heal/Abs/End`, `End/Rech`, `Heal/Abs/Rech`, `Heal/Abs/End/Rech`. The user clarified that Absorb is *always* bundled with Healing on every IO that enhances healing — it doesn't add an extra aspect for the multi-aspect modifier (the dual-aspect value of 26.5% at L50 is the same whether we call it "Heal/End" or "Heal/Abs/End"). So this is **cosmetic only** for tooltip display; no calc impact. Fix at the converter level if/when we want piece names to match HC's display.

## Provenance

Build file: `Giggelles_2026-05-18.json` (Scrapper EM/Regen L50)
User-supplied data: in-game Combat Attributes regen breakdown, Integration enhancement tooltip (heal +137.77% planner / +141% in-game), Numina/Triage IO effectiveness tables, Triage piece names with Absorb aspect bundling.
