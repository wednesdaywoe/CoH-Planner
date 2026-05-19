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

A residual **~2.5 pp post-ED heal-enhancement gap** remains after the fix (planner 138.48% vs in-game 141.0%), equivalent to ~0.3 hp/s on this build.

### Status of original hypotheses

1. **~~Hidden +5 boosters on attuned IOs~~ — ruled out.** Attuned IOs cannot be boosted; the user inspected the in-game build and confirmed no boosted enhancements exist where we suspected.
2. **An unmodeled `+heal_strength` / `+regen_strength` source.** Still open. See "Binary aspect-split finding" below.
3. **~~Alpha bypass ratio~~ — ruled out.** Alpha contribution (32.25 pp) matches in-game (32.20 pp) within 0.05 pp.

### Binary aspect-split finding (2026-05-18)

Inspection of HC's compiled `.bin` files shows that **Heal-strength and Regeneration-strength are separate enhancement aspects**, not a single combined "Heal" bucket:

- **Numina's Convalescence #1 (`Endurance/Heal`)** — three independent Strength AttribMod groups, each scale 0.625:
  - `[Heal_Dmg, Absorb]`
  - `[HitPoints, Regeneration]`
  - `[EnduranceDiscount]`
- **Triage Interface #1** — identical three-group structure.
- **Vigor Alpha T4 (`Heal_Plus_Very_Rare`)** — four Strength templates: `[Heal_Dmg]` × {0.15, 0.30} and `[HitPoints, Regeneration]` × {0.15, 0.30}. The 0.15/0.30 split confirms the community "1/3 ED-subject + 2/3 ED-bypass" Alpha model.
- **Numina #6 (`+Recovery/+Regeneration` proc)** — no hidden Strength template. Only `[Regeneration]` scale 0.2 and `[Recovery]` scale 0.1, both unenhanceable.

**Implication.** For *this* build the Heal-bucket and Regen-bucket totals should be identical — every Heal IO and Vigor Alpha contributes the same scale to both. So the aspect split alone doesn't create the gap. The gap requires an **asymmetric source** that feeds one bucket but not the other.

**Candidates verified, all symmetric or absent (2026-05-18):**

| Power / source | Strength templates targeting Heal/HP/Regen |
|---|---|
| Numina #1, Triage #1 (binary) | `[Heal_Dmg, Absorb]` 0.625 **and** `[HitPoints, Regeneration]` 0.625 — symmetric |
| Numina #6 (unique +Regen/+Rec) | None — Current-aspect only |
| Vigor Core Paragon T4 (`Heal_Plus_Very_Rare`) | `[Heal_Dmg]` 0.15+0.30 **and** `[HitPoints, Regeneration]` 0.15+0.30 — symmetric |
| Integration, Fast Healing, Quick Recovery, Resilience, Health, Stamina | None — Current-aspect only |
| Hybrid Melee Radial (`melee_genome_9`) and its auto-granted `Melee_Boost_Very_Rare` passive | None — Current-aspect only (already in SK's `incarnate-effects.ts` as `passive: regeneration 0.3` + `perTarget: regeneration 0.45`) |
| Scrapper inherents (full binary scan) | None with Strength on Heal/HP/Regen |

**Conclusion of binary phase.** No asymmetric Strength source exists in any power in this build. The Heal/Regen aspect split is real in HC's binary as a structural fact, but every Strength template in this build contributes equally to both buckets. SK is already aggregating the right sources and `global.healOther` is zero for this build (no `healing_strength` set bonuses fire).

### ED math verified end-to-end (2026-05-18)

Controlled test on test-server character: Scrapper Regeneration, Integration 6-slotted with **plain generic Level 50 single-aspect Heal IOs**. No sets, no attuned IOs, no procs, no Alpha, no Hybrid.

- Pre-ED raw: 6 × 42.4% = **254.4%**
- In-game tooltip: **218.14% (118.1%)** — base 100% regen + 118.1% enhancement
- SK's ED formula `applyED(2.544, 'A')` = **118.16%**
- **Δ = -0.06 pp** (float rounding)

Conclusions:
- ED breakpoints **70/90/100** are correct (NOT 70/90/95 — that mistaken guess earlier in this doc is wrong)
- ED tail multiplier **0.15** is correct
- Generic L50 single-aspect Heal IO = **42.4%** is correct
- Heal aspect routes through Schedule A correctly

This eliminates the bulk of the original hypothesis space. **The 3.27 pp gap on Giggelles is not a systemic ED bug** — it must come from something build-specific that we missed when decomposing the slotting. Refocus the search on:
- The actual build file's slot list (Heal IOs we might not have counted)
- Set bonus aggregation (Panacea 5pc vs 6pc threshold — confirm count)
- A re-read of the in-game tooltip now that the user is set up on test server

### Alpha tier sweep — all five readings verified (2026-05-18)

Same baseline (Integration 6× generic L50 Heal IOs), then layered Alpha tiers from the binary:

| Configuration | SK calc | In-game | Δ |
|---|---|---|---|
| No Alpha | 118.16% | 118.10% | -0.06 pp |
| T1 Vigor Boost | 127.78% | 127.80% | +0.02 pp |
| T2 Vigor Core Boost | 132.46% | 132.50% | +0.04 pp |
| T3 Vigor Total Core Revamp | 144.03% | 144.00% | -0.03 pp |
| T4 Vigor Core Paragon | 150.41% | 150.40% | -0.01 pp |

All within 0.06pp. The whole heal-enhancement pipeline — raw IO total → ED → Alpha ED-subject add → ED-bypass add — is bit-perfect.

Notable corrections to community lore validated by this sweep: the Vigor totals from the binary are **T1=0.33, T2=0.33, T3 partial=0.33, T3 total=0.45, T4 radial=0.33, T4 core=0.45** — not the "T1=0.20, T2=0.33, T3=0.45, T4=0.45" that gets repeated on wikis. SK already had these binary-correct values; the test just confirmed it.

### Triage piece data — fixed (2026-05-18)

A second test sweep on the same character revealed a real data bug: SK's Triage piece definitions were missing the Absorb aspect on pieces #1/#3/#4. Test reading of **4× attuned Triage = 60.9% post-ED** only reconciles if those pieces are treated as triple/triple/quad aspect (not dual/dual/triple). Math: 0.424 × (0.5 + 0.5 + 0.4375) = 60.95% pre-ED, no ED triggered (under 70%).

Fix applied to both `src/data/datasets/{homecoming,rebirth}/io-sets-raw.ts`:
- #1 `Endurance/Heal` (dual, 26.5%) → **`Heal/Absorb/Endurance`** (triple, 21.2%)
- #3 `Heal/Recharge` (dual, 26.5%) → **`Heal/Absorb/Recharge`** (triple, 21.2%)
- #4 `Endurance/Heal/Recharge` (triple, 21.2%) → **`Heal/Absorb/Endurance/Recharge`** (quad, 18.55%)

The earlier "Absorb is bundled with Heal — cosmetic only" note in this doc was wrong. Absorb is a real aspect for the multi-aspect-modifier formula. Adding `Absorb` to the `aspects` arrays (alongside the name change) also correctly feeds the `absorb` enhancement bucket when slotted on absorb-buffing powers — a side benefit, not the goal.

Note: this fix WIDENS Giggelles' computed gap (Triage in Integration now contributes 21.2% not 26.5%, lowering SK's heal_enh further). So the Giggelles 3.27pp gap is not explained by this — it's a separate puzzle, and the Triage fix is correct on its own merits regardless.

### Closing test — Giggelles slotting recreated in isolation (2026-05-18)

Recreated the exact Integration slotting from the Giggelles build (3 Numina #1/#3/#5 + 2 Triage #1/#2 + 1 Generic L50+5 Heal, all attuned) on a fresh test character. No other heal powers slotted, no Alpha, no Hybrid.

| | SK prediction | In-game | Δ |
|---|---|---|---|
| Heal enhancement (no Alpha) | 105.44% | **105.5%** | -0.06 pp |

Match within float rounding. Set bonuses on the screenshot match expectations (Numina 3pc +12% Regen + 1.88% MaxHP, Triage 2pc +4% Regen). No `healing_strength` bonuses firing.

**The original 108.8% / 141.0% Giggelles readings were measurement artifacts** (likely cross-power contamination of the global tooltip, or a misread). SK's heal-enhancement math is correct end-to-end with the Triage fix applied today.

### Verdict on the Giggelles gap

The 3.27 pp gap on Giggelles is **not** in any of the math we just verified. It must be build-specific:
- A piece-count miscount in the original decomposition (set-bonus thresholds, missing IO),
- A `boost` field on an attuned IO that wasn't captured (despite earlier ruling-out, worth re-checking the build JSON),
- Or a measurement artifact in the original tooltip read.

Recommended next step: **rebuild the exact Giggelles Integration slotting** (3 Numina + 2 Triage + 1 Generic L50+5 Heal, all attuned, no other powers slotted) on the test server character and re-read the tooltip. If it reads near SK's predicted 106.24%, the gap was a measurement issue. If it reads 108.8%, we have a focused puzzle worth chasing.

### Next step: in-game tier-sweep

Stop guessing and verify experimentally. Ask the user to read the heal_enh tooltip at four Alpha settings (other variables unchanged):

| Alpha | Expected post-ED contribution | Tooltip should read |
|---|---|---|
| None | 0 pp | 108.8% (matches the no-Alpha row above) |
| T1 (`Heal_Plus`/Boost) | ~20 pp | ~128.8% |
| T2/T3 | ~33–45 pp | ~141–153% |
| T4 (`Vigor Core Paragon`) | ~45 pp (with 1/3 ED-subject, 2/3 bypass) | 141% (confirmed) |

- If the gap is **constant 3.27 pp at every tier**, the missing source isn't Alpha-related — it lives in slotted IOs or in ED's high-end tail. Next step would be to print SK's pre-ED raw heal total and post-ED stepwise breakdown next to in-game's, and find the discrepancy bracket.
- If the gap **grows with tier**, it's an Alpha-modeling issue (e.g. ED-bypass ratio or level-shift effect on Alpha's contribution).

A second cheap check: the user reading "Healing" in Combat Attributes (which displays Heal Strength) and comparing that against the per-power regen value — would tell us whether the 141.0% reading is the Heal_Dmg bucket or the Regeneration bucket. If they're different in-game values, the aspect split is operationally observable and we'd need to track them separately in SK.

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
