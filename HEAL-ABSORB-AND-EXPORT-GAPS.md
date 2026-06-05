# Heal/Absorb enhancement fix + remaining raw-data export gaps

_Session 2026-06-05. Pick-up notes for the PC (where the `.pigg`/raw bins live)._

---

## Part 1 — Heal/Absorb enhancement fix (DONE, committed-ready)

### What was wrong
Healing enhancement set pieces listed only `Heal` where they should list `Heal/Absorb`.
In CoH HC/Rebirth every Heal-boosting enhancement also boosts **Absorb**, and the
planner treats Heal and Absorb as **separate, value-diluting aspects** (confirmed by
user). `aspects` is a **calc input** — [`parseIOSetPieceValues`](src/utils/calculations/enhancement-values.ts)
divides the enhancement value by the aspect count via `getEffectiveAspectCount` /
`getMultiAspectModifier`. So a `Heal` piece treated as 1 aspect was over-valuing Heal;
adding Absorb makes it 2 aspects and (correctly) lowers per-aspect value to match game.

Only **Triage** (and the Amyloplast/Chloroplast HamiOs) had it right; everything else
was missing Absorb.

### What changed
Inserted `Absorb` immediately after `Heal` in both the `name` and the `aspects` array
on every **non-proc** Heal piece. Proc pieces and already-correct sets untouched.

| Type | Sets fixed |
|---|---|
| Healing | Panacea, Doctored Wounds, Harmonized Healing, Miracle, Numina's Convalescence, Preventive Medicine, Regenerative Tissue |
| Accurate Healing | Touch of the Nictus, Theft of Essence |
| HamiO | Golgi Exposure |

Files:
- `src/data/datasets/homecoming/io-sets-raw.ts` — 35 pieces
- `src/data/datasets/rebirth/io-sets-raw.ts` — 35 pieces
- `src/data/enhancements.ts` — Golgi Exposure (+`Absorb` aspect)

Verification: both io-sets files re-parse cleanly; diff is 100% Absorb/Heal lines
(no unintended sets); calc layer already supports `Absorb` (normalizes to `absorb`,
Schedule A, same as `heal`). **Full test suite: 98/98 pass.**

> Could NOT binary-verify per-piece on the laptop — `raw_data_homecoming*` and
> `exported_powers/` are absent here. Relied on in-repo precedent (Triage + HamiOs)
> + user confirmation. Worth a spot-check against the binary on the PC.

### ⚠️ Regen will silently undo this — needs a PC fix
`io-sets-raw.ts` is generated. A re-run of the generators drops Absorb again because
their attrib→aspect maps have no `Absorb` entry:
- `scripts/extract-rebirth-io-sets-v2.py` → `ATTRIB_TO_ASPECT` maps `HitPoints: 'Healing'` only (line ~244)
- `scripts/convert-io-sets.js` (HC) reads the now-deleted `legacy/js/data/io-sets.js`

**To fix properly on the PC (needs the binary):**
1. Inspect a healing boost power's effect templates (e.g. Panacea's `Boosts.*` records)
   and determine how Absorb is represented:
   - **(a)** a distinct `Absorb` attrib (#21) alongside `HitPoints` → add `'Absorb': 'Absorb'` to `ATTRIB_TO_ASPECT`, OR
   - **(b)** only `HitPoints` present and Absorb is implied → make the `HitPoints` mapping emit **both** `Heal` and `Absorb`.
2. Force `Heal/Absorb` adjacency. `_sort_aspects_canonical` would otherwise alphabetize
   to `Absorb/Heal`; add both to the canonical order right after each other (Heal then Absorb).
3. Reconcile the label: generator emits `Healing`, hand data uses `Heal` — confirm which
   the planner's `normalizeAspectName` expects (both map to `heal`, so functionally fine,
   but keep names consistent with existing entries).
4. Re-run regen, diff against this hand-edit to confirm parity.

Until then: re-apply by hand, or with the scoped transform used this session
(insert `"Absorb"` after each standalone `"Heal"` aspect line + after the `Heal`
segment of the piece name, scoped to the 9 sets above).

---

## Part 2 — What other raw data still isn't binary-sourced

Audit of `tools/bin-crawler/` export vs. what `src/data/` consumes. ✅ = binary-sourced
and wired; ❌ = still legacy/hand-curated; ⚠️ = partial.

| Data | Export emits? | Planner source | Status |
|---|---|---|---|
| Powers / powersets / categories | yes | `exported_powers/<cat>/<ps>/` | ✅ |
| AT modifier tables (Melee/Ranged/AoE/Pet dmg, heal, etc.) | yes | `at-tables.ts` via `extract-at-tables.cjs` | ✅ |
| Incarnate **powers** + effects | yes | `generated/incarnate-effects.ts` via `convert-incarnate-effects.cjs` | ✅ |
| Pet entities | yes | `exported_powers/entities/` | ✅ |
| **IO-set piece aspects + set-bonus values** | ⚠️ Rebirth only (`boostsets.json`); HC none | `io-sets-raw.ts` (legacy Mids/CoD2) | ❌ **biggest gap** |
| **Non-IO enhancements** (Hamidon, origin SO/DO/TO base %) | no | `enhancements.ts` (legacy port) | ❌ |
| Incarnate salvage / components / recipes (thread & empyrean costs) | no | `incarnate-salvage.ts` etc. (ported from CoH-Incarnate-Calculator) | ❌ |
| Guardian AT tables (Rebirth-only AT) | n/a | `extract-at-tables.cjs` hardcodes `PLAYER_ARCHETYPES` w/o Guardian | ⚠️ Rebirth |

### Priority gaps to close (each needs the PC binary)
1. **IO-set aspects + bonuses → binary (HIGH).** This is the same family as the Heal/Absorb
   bug: as long as `io-sets-raw.ts` is hand/legacy data, these inconsistencies keep recurring.
   `_boostsets.py` already parses set metadata, piece refs (`Boosts.X.Y`) and bonus refs
   (`Set_Bonus.X.Y`); `extract-rebirth-io-sets-v2.py` partially turns those into aspects +
   bonus values for **Rebirth only**. Generalizing that to Homecoming (and getting Absorb
   right per Part 1) would make the whole IO-set dataset binary-derived and self-healing.
2. **Non-IO enhancement base values (MED).** Confirm whether HC stores SO/DO/TO/Hamidon
   schedules in a bin table; if so, export to replace the legacy `enhancements.ts` constants.
   (No binary source confirmed yet — needs investigation on PC.)
3. **Guardian AT table (MED, Rebirth).** Add Guardian to the AT extraction allow-list if
   `classes.bin` carries it.
4. **Incarnate salvage/recipe costs (LOW).** Likely a crafting/recipe bin not yet explored;
   may be fine to keep hand-curated since costs rarely change.

See [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md) for the running parser to-do log
(an entry pointing here has been added).
