# Regen Discrepancy Investigation — Giggelles Build (2026-05-18)

## Summary

Reported: planner showed **144.25 hp/s** regen, in-game showed **145.23 hp/s** for the same build. Gap = **0.98 hp/s** (~0.7%), localized to Integration and Reactive Regeneration. Root cause identified as **attuned-IO scaling cap**: the planner was capping attuned IO enhancement values at `set.maxLevel`, but HC actually scales them with character level regardless of the set's natural max. Fix applied; closes ~70% of the gap. ~0.3 hp/s residual unresolved.

---

## Action taken

**Fix applied 2026-05-18** — [enhancement-values.ts](src/utils/calculations/enhancement-values.ts), two sites (`calculatePowerEnhancementBonuses` and `combineWithAlphaED`):

```ts
// Before
ioLevel = set.maxLevel > 1 ? Math.min(baseLevel, set.maxLevel) : baseLevel;
// After
ioLevel = exemplarLevel ?? globalIOLevel;
```

**What it changes:** attuned IOs now scale with character level (or exemplar level when exemplaring down), independent of the set's `maxLevel`. Confirmed in-game via the user's Triage `Heal/Abs/End` tooltip: attuned Triage (set `maxLevel: 30`) on a L50 character shows **26.5%** enhancement — the Schedule A L50 dual-aspect value (`0.424 × 0.625`), not the L30-capped 21.75%.

**Blast radius:** affects every build slotting attuned IOs from sets with `maxLevel < 50` — Triage, Steadfast Protection, Doctored Wounds, Regenerative Tissue, Tempered Readiness, low-tier damage sets, etc. Enhancement values for those slots increase to match in-game. Set bonuses, procs, and unique pieces are untouched.

**For this specific build:**
- Triage #1 (dual aspect, attuned, in L50 char): 21.75% → 26.50% (+4.75 pp pre-ED)
- Total raw IO heal: 170.15% → 174.90%
- Final heal_enh (with Alpha T4): 137.77% → 138.48% (in-game: 141.0%)
- Total regen: 144.25 hp/s → ~144.92 hp/s (in-game: 145.23 hp/s)

---

## Unresolved

A residual **~2.5 pp post-ED heal-enhancement gap** remains after the fix (planner 138.48% vs in-game 141.0%), equivalent to ~0.3 hp/s on this build. Three plausible sources, in decreasing likelihood:

1. **Hidden +5 boosters on attuned IOs.** HC allows catalyzing attuned IOs with boosters. The build file's `boost` field is only set on the explicit generic IO (`boost: 5`); attuned IO slots show no boost level. If the in-game character has booster catalysts applied to attuned IOs that the export/import doesn't capture, the planner will systematically undercount.
2. **An unmodeled `+heal_strength` source.** A proc, intrinsic passive, or Alpha sub-mod contributing `+heal_strength` globally that bypasses ED. The planner already has `globalBonuses.healOther` populated from `healing_strength` set bonuses but never *consumes* it — wiring that up is a separate latent fix (see follow-ups). For this build, no `healing_strength` set bonuses fire, so the missing source would be something else.
3. **Alpha bypass ratio.** The planner uses `2/3` ED-bypass for very-rare Alphas. If HC applies `3/4`, or splits Alpha across multiple AttribMods with different ED behavior, the Alpha contribution would land slightly differently. Empirically the Alpha contribution we compute (32.25 pp) matches in-game (32.20 pp) to within 0.05 pp, so this is the least likely.

## Follow-ups (independent of the residual)

These surfaced during investigation and are worth fixing on their own merits, but won't move this specific build's number:

- **`globalBonuses.healOther` is dead code.** [character-totals.ts:135](src/utils/calculations/character-totals.ts#L135) declares it, set-bonuses.ts populates it from `healing_strength` bonuses, but nothing reads it. Wire it up in the regen and direct-heal branches of `applyActivePowerBonuses`. Latent gap for builds with Panacea 6pc / Numina 4pc / Triage 4pc.
- **Check `Numinas_Convalesence_Regeneration_Recovery.json` AttribMods.** The +Recovery/+Regen unique proc piece (Numina #6) might carry a `+Healing_Strength` AttribMod the converter drops because the piece is marked `aspects: []`.
- **Triage piece names don't include Absorb in our data.** HC has Triage as `Heal/Abs/End`, `End/Rech`, `Heal/Abs/Rech`, `Heal/Abs/End/Rech`. The user confirmed Absorb is *always* bundled with Healing — same enhancement value, doesn't add an aspect to the multi-aspect modifier. So this is **cosmetic only** for tooltip display; no calc impact. Fix at the converter level if/when piece names should match HC's display verbatim.

---

## Investigation detail

### Build context

- Character: Scrapper, Energy Melee / Regeneration, level 50, no exemplar
- Alpha: Vigor Core Paragon T4 (heal +45%, level shift +1)
- Hybrid: Melee Radial Embodiment T4
- Relevant slotting:
  - **Integration**: Numina #1, #3, #5 + Triage #1, #2 + Generic Heal IO L50+5
  - **Reactive Regeneration**: identical to Integration
  - **Fast Healing**: Panacea #1, #3, #4, #5, #6 + Generic Heal IO L50+5 (no Triage)

### Decomposition of the 0.98 hp/s gap

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

Total Δ = **0.99 hp/s**, accounting for the entire reported gap. Ratio Δ_RR / Δ_Int = 0.66 / 0.33 = 2.0, exactly the ratio of the powers' enhanceable regen scales (RR has `scale: 2`, Integration enhanceable has `scale: 1`). This proves the missing factor is **proportional to the enhanceable `scale`** — i.e. it acts as an additive bonus to the per-power heal-enhancement multiplier. Integration's 50% unenhanceable portion matches in-game exactly (5.02 hp/s on both), confirming the regen split is correct and the issue is isolated to the heal-enhancement multiplier.

### Heal-enhancement gap (pre-fix)

| | Planner | In-game | Δ |
|---|---|---|---|
| Heal enhancement (no Alpha) | 105.52% | 108.8% | +3.28 pp |
| Heal enhancement (with Alpha T4) | 137.77% | 141.0% | +3.23 pp |
| Alpha contribution alone | 32.25 pp | 32.20 pp | -0.05 |

Alpha math matches. The gap is a **flat +3.27 pp on post-ED Heal enhancement, unaffected by Alpha** — whatever's missing applies *after* ED.

### Per-IO values (all verified correct against user's in-game data)

| Slot | Planner value (pre-fix) | In-game | Match |
|---|---|---|---|
| Numina #1 (Heal/End dual, attuned L50) | 0.424 × 0.625 = 26.50% | 26.5% | ✓ |
| Numina #3 (Heal/Rech dual, attuned L50) | 26.50% | 26.5% | ✓ |
| Numina #5 (Heal single, attuned L50) | 0.424 × 1.0 = 42.40% | 42.4% | ✓ |
| Triage #1 (Heal/End dual, attuned cap L30) | 0.348 × 0.625 = 21.75% | **26.5%** | **✗** |
| Generic L50+5 Heal IO (single) | 0.424 × 1.25 = 53.00% | 53.0% | ✓ |

The user's IO-effectiveness tables match `IO_EFFECTIVENESS` exactly. Multi-aspect modifier (1.0 / 0.625 / 0.5 / 0.4375) matches `getMultiAspectModifier`. +5 boost ×1.25 matches `BOOST_MULTIPLIER_PER_LEVEL = 0.05`. The single mismatch was Triage attuned in a L50 character — the fix above resolves it.

### Proc handling — verified clean

The user asked whether procs like Power Transfer might be erroneously running through heal-strength multiplication. Traced and ruled out:

- **Power Transfer #6** (`Chance for Heal Self`, type `Proc`, PPM 3): in Stamina (Auto). Goes through `applyPPMProcBonuses` → `Heal` case is **explicitly skipped** ("PPM heal procs grant a chunk of HP per fire — game does NOT count these as steady-state regen").
- **Panacea #6** (`Chance for +HP & +End`, type `Proc`): same code path, same skip.
- **Numina #6** (`+Recovery/+Regeneration`, type `Proc120s`/always-on): goes through `applySingleProcEffect` → `Heal` case adds raw value to `global.regeneration` directly with **no heal_enh multiplication**.

Procs are neither double-counted nor enhanced.

---

## Provenance

- Build file: `Giggelles_2026-05-18.json` (Scrapper EM/Regen L50)
- User-supplied data: in-game Combat Attributes regen breakdown screenshot, Integration enhancement tooltip (planner heal +137.77% / in-game +141%), Numina/Triage IO-effectiveness wiki tables, attuned Triage in-game enhancement tooltip showing 26.5%, Triage piece names confirming Absorb is bundled with Healing on every heal-aspect IO.
- Heal-enh data points provided by user:
  - No Alpha: 108.8%
  - With Vigor Core Paragon T4 Alpha: 141.0%
