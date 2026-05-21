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

---

## What was fixed this pass

### ✅ Bug 1: Superior Dominion of Arachnos PPM 4 → 5
- **Edit**: [src/data/proc-data.ts:1731](src/data/proc-data.ts#L1731) — `ppm: 4` → `ppm: 5`
- **Scope decision**: applied to the SHARED `proc-data.ts` (affects both HC and Rebirth datasets). User wasn't sure whether HC also has it wrong; this is easy to split per-dataset later if HC's in-game value is actually 4.
- Regular Dominion of Arachnos stays at PPM 3 per user direction (gap from 3 → 5 is now +2, which is unusual but the user confirmed Superior should be 5 and regular is fine).

### ✅ Bug 2: Witchcraft + Superior Witchcraft proc piece data
- **Edits to** [src/data/datasets/rebirth/io-sets-raw.ts](src/data/datasets/rebirth/io-sets-raw.ts):
  - `superior_witchcraft` piece 6: `"Empty"` (proc: false) → `"Chance for -Res Debuff"` (proc: true)
  - `witchcraft` piece 6: same change
- **New entries in** [src/data/proc-data.ts](src/data/proc-data.ts) (appended at end):
  - `"Witchcraft: Chance for -Res Debuff"`: 3.5 PPM, `Foe(-Resistance 20%) for 10s`, level 10–50, Unique
  - `"Superior Witchcraft: Chance for -Res Debuff"`: 6 PPM, same effect, level 50, Unique
- Both sets are Rebirth-exclusive (HC has no Witchcraft sets at all).

### Verification
- `npm run lint` (typecheck) passes
- `npm run build` not yet run — recommend running before deploy to confirm no breakage

---

## What remains — concrete next steps

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

### 🔴 Bug 3: Hybrid Endurance Discount + display semantics

Two sub-bugs:
1. **Calc bug**: Hybrid: T4 Support's +10% Endurance Discount auto effect isn't reaching the global Endurance Discount stat. Likely a connection problem between the incarnate effect aggregation (`src/data/incarnate-effects-generated.ts` / `src/utils/calculations/`) and the `global.enduranceDiscount` accumulator. Trace from [src/utils/calculations/character-totals.ts:1135](src/utils/calculations/character-totals.ts#L1135) (`resolveScaledEffect(effects.enduranceDiscount, ...)`) backwards.
2. **Display semantics (NOT a bug, but a UX call to make)**: User argues Endurance Discount should be displayed in additive divisor form (e.g. `+20%` for set bonuses) rather than the current multiplier form. Argument: in-game, +Endurance Discount works like a "global set bonus" akin to +Global Recharge, additive between set bonuses + incarnate bonuses, then applied via `100/(100+divisor)`. Worth a conversation before changing display.

### 🟡 Bug 5: Power Info missing buff/debuff throughput

Lowest scope, additive UI work. Power Info modal (likely `src/components/modals/PowerInfoModal.tsx` or similar — confirm path) needs:
- Aim: add +Damage throughput display (already shows +ToHit)
- Darkest Night: add -ToHit Debuff throughput display
- Generalize: any effect with `{scale, table}` should show its post-enhancement resolved value

### 🟡 Outstanding decision: per-dataset proc data?

The Bug 1 fix was applied to the SHARED `src/data/proc-data.ts`. If HC's in-game Superior Dominion is actually 4 PPM (not 5 like Rebirth), this fix is currently wrong for HC. To revert just HC's value, would need to either:
- Split `proc-data.ts` into per-dataset variants (mirror the at-tables pattern), or
- Add Rebirth-specific overrides in a similar pattern to power overrides

User to confirm HC's actual in-game value when next testing on HC.

---

## File reference quick-jump

| Bug | Files touched / files to read next |
|-----|-----|
| 1 ✅ | [src/data/proc-data.ts:1727-1738](src/data/proc-data.ts#L1727-L1738) |
| 2 ✅ partial | [src/data/datasets/rebirth/io-sets-raw.ts:25454](src/data/datasets/rebirth/io-sets-raw.ts#L25454) (Superior); [:28845](src/data/datasets/rebirth/io-sets-raw.ts#L28845) (regular); [src/data/proc-data.ts](src/data/proc-data.ts) (appended at end) |
| 2 ⏭ rebuild | Same files; also `src/types/` for "Universal Debuff" aspect addition |
| 3 ⏭ calc | [src/utils/calculations/character-totals.ts:1135](src/utils/calculations/character-totals.ts#L1135) (`enduranceDiscount` accumulator); `src/data/incarnate-effects-generated.ts` |
| 3 ⏭ display | Stat display components — find via grep for `enduranceDiscount` in `src/components/` |
| 4 ⏭ calc | [src/utils/calculations/character-totals.ts:718](src/utils/calculations/character-totals.ts#L718) (damageBuff enh-multiplier gate); [src/utils/calculations/damage.ts](src/utils/calculations/damage.ts); [src/utils/calculations/at-effects.ts:104](src/utils/calculations/at-effects.ts#L104) |
| 4 ⏭ toggles | Find Incarnate Destiny/Hybrid `isActive` handling — search `src/components/incarnate/` |
| 5 ⏭ | Power Info modal — confirm path via `grep -rn "Power Info" src/components/` |

---

## Resume checklist

When picking back up:
1. Pull latest if you committed this session's fixes
2. `npm run lint` to confirm clean state
3. Pick a bug from "What remains" — recommend Bug 4 (highest user-visible impact) or finish Bug 2's full Witchcraft rebuild (clear scope, mechanical work)
4. Re-read this doc's "diagnosed source" sections — the root cause for Bug 4's +19.95% is already isolated; you can go directly to the fix
