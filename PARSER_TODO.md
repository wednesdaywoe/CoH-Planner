# Bin Parser — Outstanding Work

The bin-crawler binary parser at [tools/bin-crawler/bin_crawler/parser/](tools/bin-crawler/bin_crawler/parser/) has three known issues that surfaced during the Stalker In-Combat / Hide audit on 2026-04-21. None block the planner today (each has a workaround), but fixing them upstream simplifies the converter and lets us regenerate stealth powers cleanly.

## 1. `Suppress` events not extracted from AttribMod tail

**Status:** TODO acknowledged in [_powers.py:327-345](tools/bin-crawler/bin_crawler/parser/_powers.py#L327-L345). The audit already noted that the tail layout (CancelEvents / RequiredEvent / Suppress / BoostModAllowed / Flags / Messages / FX / Params) isn't fully reverse-engineered — only `Params` is scanned heuristically.

**Impact:** Every stealth-style power (Hide, Stealth, Invisibility, Shadow Fall, Steamy Mist, Cloak of Darkness, Super Speed-with-stealth, Phase Shift) has its in-combat-suppressible defense buff incorrectly merged with its persistent baseline. Without Suppress events, the converter can't tell which AttribMod is the in-combat residual and which suppresses on attack.

**Workaround in place:** [convert-powerset.cjs](scripts/convert-powerset.cjs) reads the raw `.powers` def files under [raw defs/](raw%20defs/) directly — see `loadDefSuppressionMap()` and `templateIsCombatSuppressed()`. The .def files have explicit `Suppress Attacked 8 Always` lines per AttribMod and are the authoritative source the binary is compiled from. Pool stealth powers (which use outer Effect `Requires Attacked source.EventTimeSince> 10 >` clauses instead of template-level Suppress events) are handled by `_isOutOfCombatGate()` propagating a `_combatGated` tag through `collectAllTemplates`.

**Proper fix:** Extract `suppress_events` (and the rest of the tail) from binary in `_parse_effect_template`. Once `template.suppress_events` is populated by the parser, the .def-file detour and the gate-propagation hack can both be deleted.

**Reference:** Hide.def template suppress events look like:
```
AttribMod {
    Attrib kRanged_Attack kMelee_Attack ...
    Suppress Attacked 8 Always
    Suppress Damaged 8 Always
    Suppress MissionObjectClick 8 Always
    Suppress PseudoPetAttacked 8 Always
}
```
The combat-suppression event names to detect: `Attacked`, `Damaged`, `MissionObjectClick`, `PseudoPetAttacked`, `Helped`, `HitByFoe`.

## 2. `allowed_boostset_cats` field is broken

**Symptoms:** For most powers the field reports `count=0`. For ~16 powers (mostly stealth/Hide), count=1 but the resolved string is a corrupted FX-path fragment like `"olumnEndgame.NictusFX"` (clearly missing leading bytes — full string is `"5thColumnEndgame.NictusFX"` at offset 0 of the string table).

**Investigation done:**
- The field is parsed as `read_string_array()` at [_powers.py:760](tools/bin-crawler/bin_crawler/parser/_powers.py#L760).
- For Hide: count=1, offset=0x0F. That offset lands mid-string in the string table's early FX-path data.
- Across the whole dataset there are only 16 distinct values for this field — all 16 are corrupted FX-path fragments (`Endgame.NictusFX`, `me.NictusFX`, `umnEndgame.NictusFX`, …). Zero values resolve to legitimate IO category strings.
- Standard attack powers (Jab, Snap_Shot, Blind, Healing_Aura) all have `count=0`, suggesting the field is rarely populated even when valid.

**Two possible interpretations**: (a) the field at position 74 isn't actually `allowed_boostset_cats` — it's some other field (FX list?) and the real boostset_cats is elsewhere; or (b) it IS that field but encoded as a `u4_array` of category indices into an enum we haven't located, not a `string_array` of offsets.

**Workaround in place:** [convert-powerset.cjs](scripts/convert-powerset.cjs) ignores the binary field entirely. `inferAllowedSetCategories()` derives categories from `boosts_allowed` plus the power's targeting/effect-area context. Empirically matches ~88% of the previously-correct generated data; the remaining ~12% are edge cases (pet-summon detection, Mastermind/SoA ATO nuances, travel powers, hand-curated inconsistencies in the original overrides) that surface as needed via the override layer.

**Proper fix:** Either (a) find the actual `allowed_boostset_cats` field in the binary layout — likely requires checking the Ghidra-extracted descriptor — or (b) confirm the field is a `u4_array` of indices and locate the category enum table (probably referenced from `boostsets.bin`). Once correct values flow through, the inference helper can be deleted or kept as a fallback.

## 3. Inconsistent string-field decoding

**Symptoms:** Non-stealth-related but surfaced during regen of stalker_defense:
- `internalName` for Tough Hide (Stalker Invulnerability) decodes as `"Tough_hide"` — should be `"Tough_Hide"`. Case is being lost on one byte.
- Many power `description` and `shortHelp` strings differ subtly between the committed generated/ files and a fresh regen.

**Hypothesis:** Likely a related off-by-N issue in string-table reads, or a recent HC patch added a field that shifts subsequent offsets. The format-version auto-detector at [_powers.py:30-64](tools/bin-crawler/bin_crawler/parser/_powers.py#L30-L64) already handles two known shifts (`field_45b`, `field_41b`) but may need a third.

**Workaround:** Selectively revert non-stealth files when regenerating — see the workflow used in commit `829d7c6ad`. The Hide files get regenerated; everything else stays at its committed snapshot.

**Proper fix:** Audit raw bytes against a known-good reference (e.g. CoH 2.x snapshot) to identify the new field offset, then add it to `_detect_format`.

---

## Priority

1. **#2 first** (boostset_cats) — most user-visible; affects every power's IO-set slotability. A small fix once the right field/encoding is located.
2. **#3 next** (string decoding drift) — same area of code, likely the same root cause as #2.
3. **#1 last** (Suppress extraction) — biggest scope (full tail layout RE), but the .def-file workaround keeps it functional indefinitely.

When #2 is fixed, the `inferAllowedSetCategories` helper in [convert-powerset.cjs](scripts/convert-powerset.cjs) can be retired (or kept as a sanity-check fallback). When #1 is fixed, the `loadDefSuppressionMap` / `_combatGated` machinery in the same file can be deleted.

---

## Resolved

### Pool toggles showed 4× endurance cost (fixed 2026-04-21)

**Symptom:** Leadership Maneuvers/Tactics/Assault (and every other pool toggle) showed 1.56/s endurance instead of 0.39/s — exactly 4× too high.

**Root cause:** Not a parser bug — a converter omission. [convert-pool-powers.cjs](scripts/convert-pool-powers.cjs) only captured `activation_time` (cast time) from the JSON, never `activate_period` (toggle tick period). The planner computes per-second cost as `endurance / (activatePeriod ?? 0.5)`, so missing `activatePeriod` made every pool toggle fall back to the 0.5s default instead of using the real 2s period (0.78 / 0.5 = 1.56 vs 0.78 / 2 = 0.39).

**Fix:** Added `activatePeriod` capture, `BIN_BOOST_MAP` fallback for enhancement names, `inferAllowedSetCategories` for set categories, and `EFFECT_AREA_MAP` for the Sphere→AoE normalization — all ported from `convert-powerset.cjs`. The pool converter was missing all four.
