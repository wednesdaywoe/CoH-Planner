# Bin Parser — Outstanding Work

The bin-crawler binary parser at [tools/bin-crawler/bin_crawler/parser/](tools/bin-crawler/bin_crawler/parser/) has three known issues that surfaced during the Stalker In-Combat / Hide audit on 2026-04-21. None block the planner today (each has a workaround), but fixing them upstream simplifies the converter and lets us regenerate stealth powers cleanly.

## 1. `Suppress` events — RESOLVED 2026-04-22

**Fixed in:** [_powers.py:327-378](tools/bin-crawler/bin_crawler/parser/_powers.py#L327-L378), [_enums.py](tools/bin-crawler/bin_crawler/parser/_enums.py) (`EVENT_NAME` table).

**What was done:**
- Reverse-engineered the AttribMod tail layout against Hide and pool Stealth: `CancelEvents` (u4_array of event IDs), `RequiredEvent` (single u4), `Suppress` (struct_array, each record 12 bytes: event_id u4, duration f4, flag u4), then `BoostModAllowed` / `Flags` / `Messages` / `FX` / `Params` (still scanned heuristically for Params).
- Built an `EVENT_NAME` enum by matching parsed IDs against `.def` event lists in known files (Pool Stealth's CancelEvents has 10 events that sort to a unique ID list, giving a clean mapping for Attacked=2, Damaged=21, Stunned=23, Held=25, Sleep=26, MissionObjectClick=37, PseudoPetAttacked=47, etc.).
- The exporter now emits `template.suppress_events` and `template.cancel_events` as named arrays in the JSON.

**Workarounds removed:**
- [convert-powerset.cjs](scripts/convert-powerset.cjs) no longer parses `.def` files. The 100-line `loadDefSuppressionMap`, `templateIsCombatSuppressed`, `_defPathForFullName`, `_normalizeDefAttrib`, `_defSuppressionCache`, and `RAW_DEFS_PATH` are all deleted.
- `defEntries` parameter removed from `extractEffects` and `convertPower`.
- `extractEffects` now reads `template.suppress_events` directly from the JSON: any entry whose `event` is in `COMBAT_SUPPRESS_EVENTS` (Attacked / Damaged / Helped / HitByFoe / MissionObjectClick / PseudoPetAttacked / PseudoPetHelped / CommandedPet) marks the AttribMod as combat-suppressed.
- The `_isOutOfCombatGate` / `_combatGated` machinery for outer `Requires Attacked source.EventTimeSince>` Effect clauses **stays** — pool Stealth and Invisibility use that pattern instead of template-level Suppress events, and it's still the right approach for them.

**Verified:** Hide and pool Stealth both still produce correct `defenseBuff` (in-combat residual) + `defenseBuffSuppressible` (out-of-combat addition) splits after the parser change, with no .def-file lookups. All other Hide-related fields (durations, scales, attribs) unchanged.

## 2. `allowed_boostset_cats` field — partially resolved 2026-04-22

**What we found:** Field 74 in `powers.bin` is **not** `allowed_boostset_cats` at all — that field doesn't exist in the binary. The slot is a `u4_array` of small integer indices (mode/group refs) that's empty (`count=0`) for ~97% of powers and populated only on mode/stance-setting powers (Hide, Bio Armor adaptations, Dual Pistols ammo modes, etc.). The garbage strings (`olumnEndgame.NictusFX` and family) came from misinterpreting these small ints as string-table offsets — they happened to land mid-string in the early FX-path region of the table.

**The real picture:** In the live game, the categories an IO set can slot into are determined at runtime from each set's own `category` string (stored in `boostsets.bin`, e.g. `"ECMelee"`, `"ECRare"`) plus the power's boost types. Powers themselves don't carry an explicit "allowed categories" list — it's derived. The planner converter's `inferAllowedSetCategories` in [convert-powerset.cjs](scripts/convert-powerset.cjs) does this same derivation and is *not* a workaround — it mirrors how the game actually computes it.

**What's fixed:** [_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py) now reads field 74 as `u4_array` (skipping the data) and emits `allowed_boostset_cats: []` consistently. The garbage offsets are gone; re-exporting yields clean JSON. The inference helper stays — it's the right approach.

**What's still unknown:** What the small integer indices in field 74 actually mean. They're plausibly mode/group IDs (cf. `kHide_Group` in Hide's .def) but we haven't located the enum table that maps them. Decoding this matters for accurate mode tracking but doesn't affect IO slotability.

## 3. Description drift audit — completed 2026-04-22

**The audit:** regenerated 5 representative powersets (tanker invulnerability, blaster archery, controller fire-control, scrapper broad-sword, defender empathy) and categorized every diff against the committed snapshot. Result: most drift is genuine HC patch updates that we should accept; **two real converter bugs were found and fixed**.

### Real bugs (fixed)

**a) `effect_area: 'Sphere'` not normalized in two converter paths:**
- [convert-powerset.cjs](scripts/convert-powerset.cjs) `detectStackingEffects()` checked `effectArea === 'AoE' || 'Cone'` against the raw bin value — `'Sphere'` (which the bin uses for what the planner calls AoE) silently failed the check, causing AoE per-target stacking to be skipped entirely. This dropped `perTarget` metadata from Invincibility, Death Shroud, and any other AoE toggle. Fix: normalize through `EFFECT_AREA_MAP`.
- Same bug in `inferAllowedSetCategories` call site: `'Sphere'` didn't match any of the area branches, so AoE attacks lost their damage category. Same fix.

**b) Missing `target_type` mappings.** Bin format uses short names (`'Friend'`, `'DeadOrAliveFoe'`, `'Position'`, `'MyCreator'`, …) where CoD2 used long ones. `TARGET_TYPE_MAP` only had the long ones. Result: ~159 powers per `Friend` alone (Heal Other, Fortitude, etc.) lost their `targetType` field on regen. Added 9 missing bin-format mappings.

### Accepted as HC patch updates (no action)

Other drift between committed and freshly-regenerated files is dominated by genuine game changes:
- **Description/shortHelp text rewrites** — e.g. broad-sword Slice now reads "...reducing their defense and damage resistance. Every 15 seconds, you can perform a more powerful Rending Slice..." instead of the old "Slice does less damage than Hack but can hit multiple foes...". HC reworked the power.
- **Cast time / recharge / scale changes** — Slice cast time `2 → 1.83`, Slice defenseDebuff scale `1 → 0.5`, Invincibility psionic scale `0.1999 → 0.1667`. All HC patch values.
- **PvP damage entries added** — every damaging power now carries both PvE (`Ranged_Damage`/`Melee_Damage`) and PvP (`Ranged_PvPDamage`/`Melee_PvPDamage`) damage scales as multiple entries in the `damage` array. Existing `Array.isArray(power.damage)` consumers handle this.
- **Float precision** — `arc: 2.2689 → 2.268928050994873` etc. Cosmetic.

### Build name migration (still a concern)

The `Tough_Hide` → `Tough_hide` lowercase-h is the canonical name in the binary AND the `.def` file. Saved builds with the old `Tough_Hide` internalName won't match after regen. Easiest mitigation is case-insensitive lookup or an alias map at the build hydration layer. Not blocking but worth scheduling.

### Epic pools converter is broken on fresh data

[convert-epic-pools.cjs](scripts/convert-epic-pools.cjs) only converts pool IDs that already exist in the committed `epic-pools.ts` (it's a merge-into-existing flow), and it expected the old CoD2 `index.json` shape with `power_names`/`display_help` instead of the bin-export `powers`/`help`. Partial fix landed (path probe + `EFFECT_AREA_MAP` import), but full discovery + index-shape probe still needed. **Workaround:** committed `epic-pools.ts` is left untouched; epic powers retain their last-known-good values.

---

## Priority

Parser is in good shape. Remaining housekeeping:

1. **Decode Flags bitmask** — `flags_raw` is now captured per-template (see Resolved §). Bit-to-name mapping isn't yet done — we know `0x10` = IgnoreStrength (delta between Hide single-flag 0x420 and double-flag 0x430), and 0x420 corresponds to `Flags IgnoreResistance` in .def, but the rest of the bits would need cross-referencing many .def files. Once decoded, the legacy `template.flags: list[str]` field can be populated and the converter's pseudo-pet / IgnoreStrength filters (currently dead code due to empty flags) will start firing.
2. **Decode FX struct + remaining tail fields** — Messages / FX struct_array / Params remain heuristic-scanned. The .def `FX { ContinuingFX PFX }` block lands as a 16-byte FX record for simple cases, larger for Create_Entity templates. Layout is partially known but the per-record format varies and needs more samples to nail down.
3. **mode/group enum decoding** — minor; only matters if we want to track which mode each Hide-style power activates. Not user-visible today.

---

## Resolved

### AttribMod tail: BoostModAllowed + raw Flags (2026-04-22)

Added two new template fields to the parser/dataclass/export:
- `boost_mod_allowed_id: int` — small enum (~99% of templates have 0; non-zero values are 5/9/14/15/18/etc., likely boost-type indices).
- `flags_raw: int` — the 32-bit Flag bitmask. Verified against Hide.def: AttribMods with `Flags IgnoreResistance` produce `0x420`, AttribMods with `Flags IgnoreStrength IgnoreResistance` produce `0x430` (delta = `0x10` = IgnoreStrength bit).

Both fields are emitted in the JSON when non-zero (most templates omit them to keep the export small). The legacy `flags: list[str]` field stays empty for now — bit-to-name decoding deferred (see Priority §1) so existing converter checks (`template.flags?.some(f => f.includes('PseudoPet'))` etc.) keep their current behavior. Re-export + bulk regen verified no regressions: Hide still has the correct `defenseBuff` (0.25) + `defenseBuffSuppressible` (0.5/5.0) split, Invincibility still has `perTarget: 0.1` and `0.2` for ToHit, type check clean, 361 powersets + 13 pools + 81 epic pools all converted with zero failures.

What's still TODO in the AttribMod tail: Messages, FX struct_array, and Params layout decoding (Params still works via the heuristic tail-byte scan).

### Epic pools converter — fixed for bin-export shape (2026-04-22)

[convert-epic-pools.cjs](scripts/convert-epic-pools.cjs) was stuck on the old CoD2 layout: required pre-existing pool entries to know what to convert, used the old `power_names`/`display_help` index keys, and didn't run inference for IO categories. Updated to:

- **Discover pools from disk** — unions `existingIds` with directory listing under `<RAW_DATA_PATH>/epic/`. Old data is still consulted for archetype/minLevel preservation, but new pools introduced by HC patches will be picked up on the next regen.
- **Handle the bin-export index shape** — normalized `powers`/`help`/`short_help` to the CoD2 `power_names`/`display_help`/`display_short_help` so the rest of the function works unchanged.
- **`inferArchetypeFromPoolId` helper** — maps `<at>_*` pool IDs to their AT, `veat_*` to `arachnos_soldier`, and shared/no-prefix pools to `''` (override-required). All 81 currently-known pools have explicit archetype tags in the existing data, so this only matters for net-new pools.
- **Wired in `inferAllowedSetCategories`, `BIN_BOOST_MAP`, `EFFECT_AREA_MAP`** — same defensive triplet the other converters got.
- **GlobalBoost mapping** — `'GlobalBoost'` powerType → `'Global Enhancement'`.

**Verified:** 81 pools, 405 powers — same tally as the committed snapshot. Type check clean. HC patch updates landed (Spirit Shark endurance `9.1 → 7.28`, RPN `requires` expressions handled by the runtime evaluator added earlier).

### Broad regen — all 361 powersets up-to-date with current HC data (2026-04-22)

After the parser/converter fixes landed (Suppress events, allowed_boostset_cats, Sphere normalization, target_type mappings, GlobalBoost → Global Enhancement), did a full bulk re-export + re-convert. **361 powersets converted, 0 failures, type check clean.**

**Side effects of the broad regen:**
- 5065 modified files (generated TS + JSON exports refreshed)
- 15 new files: 2 newly-added HC powers (`BoostRange`, `BoomerangSlice`) × 3 layered files each (generated, override, composed)
- 1 orphan removed: old `Range` power (renamed to `Boost_Range` in HC) — manually deleted across all 3 layers
- All HC patch updates that had accumulated (description rewrites, scale/cast-time tweaks, PvP damage entries, new powers) now reflected

**Defensive changes shipped to support the regen:**
- [convert-powerset.cjs](scripts/convert-powerset.cjs): `convertPower` now maps bin's `'GlobalBoost'` powerType to the planner's `'Global Enhancement'` (185 powers affected — proc-style global enhancement powers).
- [convert-powerset.cjs](scripts/convert-powerset.cjs): scaffolding logic now creates composed/override files INDEPENDENTLY when missing (was previously only-when-both-missing — broke after `--force` deleted the composed dir while overrides remained).
- [convert-all-powersets.cjs](scripts/convert-all-powersets.cjs): bin-export path probe (handles new `<RAW_DATA_PATH>/<category>/` layout vs old `<RAW_DATA_PATH>/powers/<category>/`) and refreshed EXTRA_CATEGORIES to match HC's category names (`peacebringer_defensive`/`offensive`, `arachnos_soldiers`, `widow_training`, `teamwork`).
- [build-serialization.ts](src/utils/build-serialization.ts): `hydratePowers` now does a 3-tier lookup (exact internalName → case-insensitive internalName → display name). Catches the 7 internalName casing flips (`Tough_Hide`→`Tough_hide`, `Telekinetic_Blast`→`Telekinetic_blast`, etc.) and the one rename (`Range`→`Boost_Range`, where display name "Boost Range" stayed the same).

### Pool toggles showed 4× endurance cost (fixed 2026-04-21)

**Symptom:** Leadership Maneuvers/Tactics/Assault (and every other pool toggle) showed 1.56/s endurance instead of 0.39/s — exactly 4× too high.

**Root cause:** Not a parser bug — a converter omission. [convert-pool-powers.cjs](scripts/convert-pool-powers.cjs) only captured `activation_time` (cast time) from the JSON, never `activate_period` (toggle tick period). The planner computes per-second cost as `endurance / (activatePeriod ?? 0.5)`, so missing `activatePeriod` made every pool toggle fall back to the 0.5s default instead of using the real 2s period (0.78 / 0.5 = 1.56 vs 0.78 / 2 = 0.39).

**Fix:** Added `activatePeriod` capture, `BIN_BOOST_MAP` fallback for enhancement names, `inferAllowedSetCategories` for set categories, and `EFFECT_AREA_MAP` for the Sphere→AoE normalization — all ported from `convert-powerset.cjs`. The pool converter was missing all four.
