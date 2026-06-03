# Bin Parser Issues

Running log of bugs and gaps in the binary parser → JSON conversion pipeline
(`tools/bin-crawler/` + `scripts/convert-powerset.cjs` + `scripts/convert-epic-pools.cjs`),
with diagnoses and recommended fixes. Newest entries at top.

---

## 2026-06-03 — Focused Accuracy missing its +Accuracy self-buff

**Reported:** User in-game build showed Focused Accuracy granting +ToHit but
no +Accuracy (expected ~+20%). General/Offense tab Accuracy total only
reflected the Hecatomb 4pc set bonus (+15%).

**Symptom in data:** Every Focused Accuracy variant in
`src/data/datasets/<dataset>/generated/epic-pools.ts` has a `tohitBuff` effect
but no `accuracyBuff`. Affected powers (HC):

- `Epic.Body_Mastery.Focused_Accuracy` (Scrapper)
- `Epic.Body_Mastery_Stalker.Focused_Accuracy`
- `Epic.Brute_Mace_Mastery.Focused_Accuracy`
- `Epic.Corruptor_Mace_Mastery.Focused_Accuracy`
- `Epic.Energy_Mastery.Focused_Accuracy` (Tanker)
- `Epic.Energy_Mastery_Brute.Focused_Accuracy`
- (likely more — grep `"name": "Focused Accuracy"`)

Note: the `"accuracy": 1` field on each is the power's own to-hit multiplier
for its attack roll (neutral), not a self-buff — a different concept.

**Root cause — three layers:**

1. **Converter drops the attrib.** `scripts/convert-powerset.cjs:876-884`
   defines `COMBAT_MODIFIERS` (`tohit → toHit`, `range → range`, etc.) but has
   no entry for `accuracy`. When the bin parser emits a template with attrib
   `Accuracy` (HC index 84, Rebirth index 85 — see
   `tools/bin-crawler/bin_crawler/parser/_enums.py:242` and `:308`), the
   converter has no branch for it and silently discards the effect.

2. **Calc engine has no handler.** `src/utils/calculations/character-totals.ts:889`
   reads `effects.tohitBuff` and adds to `global.toHit`. There is no parallel
   `effects.accuracyBuff` branch feeding `global.accuracy`. Set bonuses
   already populate `global.accuracy` via `STAT_TO_GLOBAL` at line 327, which
   is why Hecatomb's +15% shows up but no power-driven contribution can.

3. **Data is regenerable but currently empty for this effect.** Even after
   fixing the converter, existing `generated/epic-pools.ts` files won't pick
   up the change until the user re-runs `node scripts/convert-epic-pools.cjs
   --apply` against the .pigg archives.

**Likely also affected:** Other powers that grant flat +Accuracy as a
self-buff (not +ToHit) — check Targeting Drone (`Pool.Devices.Targeting_Drone`
or similar), any incarnate Alpha slot that emits an `accuracy` attrib
template (Alpha is special-cased at `character-totals.ts:2463` — that path
works), and any boost-style accuracy buffs in Epic pools.

**Recommended path forward:**

1. **Converter fix** (`scripts/convert-powerset.cjs`):
   - Add `'accuracy': 'accuracy'` to the `COMBAT_MODIFIERS` map (line ~877).
   - Add an `else if (modType === 'accuracy')` branch in the combat-modifiers
     section (~line 2479) that emits `effects.accuracyBuff = makeEffect();
     recordDuration('accuracyBuff');`. Mirror the `tohitBuff` branch shape;
     handle `aspect === 'resistance'` → `debuffResistance.accuracy` and
     `aspect === 'strength'` → `specialBuff.accuracy` for parity.

2. **Calc engine fix** (`src/utils/calculations/character-totals.ts`):
   - Right after the `tohitBuff` block at line 889, add a parallel
     `effects.accuracyBuff` block that resolves the scaled value, multiplies
     by `100`, applies any relevant enhancement multiplier (the in-game
     allowedEnhancements on FA is `ToHit` only — accuracy enhancements don't
     slot the toggle's buff, so likely no enh multiplier; double-check
     against Mids' behavior before deciding), and adds to `global.accuracy`
     with a breakdown entry.
   - Also extend the effect type declaration in
     `src/utils/calculations/power-stats.ts` and any Power type that lists
     buff-effect keys.

3. **Data regen / override:**
   - Preferred: re-run `node scripts/convert-epic-pools.cjs --apply` against
     a current `.pigg` set to repopulate `generated/epic-pools.ts` for both
     `homecoming/` and `rebirth/` datasets. This picks up the converter fix
     for every affected power in one pass.
   - Fallback if raw data is unavailable on the current machine: add entries
     to `src/data/datasets/<dataset>/overrides/epic-pools.ts` keyed by
     `fullName` that merge in an `accuracyBuff` effect. Approximate values
     from the in-game tooltip: scale ~0.2 on `Melee_Buff_ToHit` (verify
     against CoD2 or in-game numbers; FA is roughly +20% Accuracy /
     +7% ToHit at base for Tanker/Scrapper). Verify duration / aspect match
     the existing `tohitBuff` shape.

4. **Verification checklist:**
   - Toggle FA on a Tanker / Scrapper / Brute / Corruptor build and confirm
     the Acc total in the Offense panel and General/totals tab gains the
     expected +20% (or AT-modulated value).
   - Confirm the Power Info popup for FA now lists both ToHit and Accuracy.
   - Spot-check Targeting Drone and any Alpha-incarnate accuracy contribution
     for regressions.
   - Add a regression test under `src/utils/calculations/__tests__/` (mirror
     existing tohit-buff tests) that asserts `accuracyBuff` flows into
     `globalBonuses.accuracy`.

**Files involved:**

- `scripts/convert-powerset.cjs:876` (COMBAT_MODIFIERS map)
- `scripts/convert-powerset.cjs:2450` (combat-modifier emit block)
- `src/utils/calculations/character-totals.ts:889` (tohitBuff handler — add
  accuracyBuff sibling)
- `src/utils/calculations/character-totals.ts:327` (STAT_TO_GLOBAL — already
  maps `accuracy`, no change needed)
- `src/data/datasets/homecoming/generated/epic-pools.ts` (regenerate)
- `src/data/datasets/rebirth/generated/epic-pools.ts` (regenerate)
- `tools/bin-crawler/bin_crawler/parser/_enums.py:242,308` (attrib mapping —
  already correct, FYI)

---
