# Thunderspy Parser Log

Running log of bugs and gaps specific to the **Thunderspy** dataset in the binary
parser → JSON conversion pipeline (`tools/bin-crawler/` + `scripts/convert-*.cjs`),
with diagnoses and recommended fixes. Newest entries at top. When an open issue is
fixed, move it to the top of the RESOLVED section with the fix details.

> **Remaining follow-ups** (enhancements/IO sets, pets/entities, minor icons) are
> tracked in [THUNDERSPY_TODO.md](THUNDERSPY_TODO.md).

> **Before you make any edits** read [GAME-DATA-PRINCIPLES.md](../GAME-DATA-PRINCIPLES.md).
> General (non-Thunderspy) findings live in [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md);
> the broader Thunderspy support narrative is in
> [THUNDERSPY SUPPORT PROGRESS.md](../THUNDERSPY%20SUPPORT%20PROGRESS.md).

> **Format orientation:** Thunderspy is **Parse7-framed** (CrypticS magic, string
> table, u4 string offsets — same framing as Homecoming) but uses a **Parse6-derived
> record schema** with **50-level modifier tables** (level cap 50, no Incarnate). It
> predates HC's schema additions and Rebirth's enum extensions, so it sits in its own
> corner of the format space. Source: `…/Thunderspy Gaming/Sweet Tea/tspy/bin.pigg`.

> --- NEW ISSUES / UNRESOLVED ---

## ⚠️ `export_entities` (VillainDef.bin) overruns record boundary on Thunderspy — 2026-06-16

**Symptom.** `python3 -m bin_crawler.export_entities --assets-dir <tspy>` crashes:
`ValueError: Read of 4 bytes at offset 465012 would exceed record boundary` in
`_parse_level_sub` → `read_string_array` (the per-level `display_names`), via
`_parse_entity_parse7` ([_entities.py:152](../tools/bin-crawler/bin_crawler/parser/_entities.py)).
Zero entity JSONs written.

**Likely cause.** Same family as the other Thunderspy gaps: `VillainDef.bin` uses the
older i23-era record schema, so the Parse7 entity layout reads one-or-more fields that
Thunderspy doesn't have (or in a different order), shifting the cursor until a
length-prefixed `read_string` runs off the end of the `levels` sub-record. Needs a
Thunderspy entity layout variant (probe field-by-field like the powers/classes work).

**Impact / workaround (deferred).** Entities feed `convert-pet-entities.cjs` →
`pet-entities.ts` (Lore/MM/pseudo-pet ability data). Rebirth shipped its dataset with an
**empty `PET_ENTITIES` placeholder** initially (see `datasets/rebirth/index.ts` history),
so Thunderspy can do the same: ship with `petEntities: {}` and fix the entity parser
later. Player power math is unaffected; only summoned-pet detail panels are.

> ---RESOLVED ---

## ✅ Damage element type was generic `Special` (Thunderspy uses a single `Damage` attrib) — 2026-06-16

**Context.** Thunderspy effect templates store damage with one generic `Damage`
attrib + table + scale; the element (Fire/Smashing/…) is NOT in the attrib —
it's only in `display_short_help` (e.g. `Minor DMG(Fire)`, `DMG(Energy/Smash)`).
First pass mapped the generic attrib to type **`Special`** (correct magnitude,
wrong label).

**Fix (2026-06-16).** `applyThunderspyDamageType(damage, shortHelp)` in
[convert-powerset.cjs](../scripts/convert-powerset.cjs) parses the primary element
from the shortHelp `DMG(...)` and re-types `Special` damage entries; applied in
`convertPower` (gated `datasetId === 'thunderspy'`, covers base + conditional
damage) and `generate-primalist-variants.cjs`. Result: realistic distribution —
Lethal 457, Smashing 346, Energy 205, Fire 140, Psionic 110, Negative 87, Cold
73 (Special dropped from ~everything to 424). Fire Blast now reads **Fire**.
HC/Rebirth never use a bare `damage` attrib, so they're untouched.

**Known limits (left as Special by design):** multi-type powers collapse to the
**primary** element (`Energy/Toxic` → Energy — the binary carries no per-component
type, so secondary elements like Toxic don't surface); powers whose shortHelp has
no `DMG(...)` (e.g. Pale Wind = "Repel, Fester" — element only in prose) stay
Special; pet-summon powers have no direct damage entry (damage lives on the pet);
genuine `DMG(Special)`/`DMG(All)`. Damage magnitudes were always correct — this
only refines the element label.

## ✅ Every Thunderspy power showed as level 1 (per-power `available` levels all 0) — 2026-06-16

**Symptom.** In the planner, every Thunderspy powerset had all its powers
selectable at level 1 — no level progression. The exported powerset
`available_level` arrays were all zeros (`[0,0,0,…]`); HC/Rebirth have real
curves like `[0,0,1,5,7,11,17,25,31]`.

**Root cause.** `_parse_parse6` ([_powersets.py](../tools/bin-crawler/bin_crawler/parser/_powersets.py))
hard-coded Rebirth's tail arrangement — `[empty vestigial available][real
available][…]` — reading the *first* u4_array as throwaway and the *second* as
the real levels. Thunderspy (Parse7 frame, Parse6 schema) has **no empty
vestigial prefix**: its *first* tail array IS the real available curve, and the
second is an all-zeros array. So the parser discarded the real levels and used
the zeros → every power available at level 1. Confirmed by dumping the raw
record: `array[0]=[0,0,1,5,7,11,17,25,31]` (real), `array[1]=[0,0,0,…]` (zeros).

**Fix (applied 2026-06-16).** Read the first tail array; if it's empty use the
next (Rebirth), otherwise the first array IS the real available (Thunderspy):
`first = read_u4_array(); available = read_u4_array() if len(first)==0 else first`.
Verified: Thunderspy Fire_Blast now `[0,0,1,5,7,11,17,25,31]` (matches Rebirth);
Rebirth unchanged (its empty-first path still taken); converted powers carry the
right `available` levels; tsc + 535 tests green. (Also improved the conditional-
gate label for Thunderspy's bare `<side>.ownPower?` self-reference gates —
"Target Already Affected" / "Already Affected" instead of opaque "Conditional"
— so Pale Blade's Fester/Plaguebearer conditional damage is findable in the
InfoPanel's Mechanic Adjusters.)

## ✅ Class `attribs` (HP / caps / threat) did not parse for ANY Thunderspy class — 2026-06-16

**Symptom.** Every Thunderspy class (`parse_classes` on `classes.bin`) returned an
**empty `attribs` block** — no `hit_points` curve, `hp_cap` curve, `resistance_cap`,
`damage_cap`, or `base_threat`. The per-AT **named modifier tables parsed fine** (94
tables for Primalist incl. `Melee_Damage` etc.), so this was *only* the AT "frame" stats,
not power-scaling data.

**Root cause.** `_extract_attribs` was dispatched with `_ATTRIB_LAYOUT["parse7"]`
([_classes.py](../tools/bin-crawler/bin_crawler/parser/_classes.py)) for any Parse7-framed
file, and that layout assumes **105-entry** level curves (50 levels + combat/Incarnate
extension). Thunderspy uses **50-entry** curves. So `_find_hit_points_offset` anchored on
a `count == 105` array, never matched Thunderspy's 50-entry hit_points array → returned
`None` → `attribs = {}`. The `parse6` layout *does* use `count == 50`, but its byte-deltas
are calibrated for Parse6 **inline pascal strings**; Thunderspy uses Parse7 **string-table
offsets**, and its older/leaner i23-era CharacterAttributes member order differs again — so
neither existing layout fit.

**Fix (applied 2026-06-16).** Added a third layout `_ATTRIB_LAYOUT["thunderspy"]`
(`count` 50, `cap_delta` 15268, `res_value_delta` 45808, `threat_delta` −3968,
`dmg_cap_delta` 30536), derived empirically by anchoring on `Class_Blaster`'s hit_points
curve (rec-offset 4780) and measuring deltas to the hp_cap curve, resistance-cap float,
base-threat scalar, and first StrengthMax damage curve. `parse_classes` (Parse7 path) now
tries the HC layout first and **falls back** to the Thunderspy layout when it yields `{}`
— self-detecting, because HC's 105-entry anchor never matches Thunderspy's 50-entry curves
(and vice-versa), and Rebirth uses the separate Parse6 path so never reaches here.

**De-risk / verification.** All 15 Thunderspy classes now extract attribs; values match
canonical CoH stats, with the distinctive ones confirming the deltas are right:

| AT | baseHP (L50) | maxHP (L50) | resCap | threat | dmgCap |
|---|---|---|---|---|---|
| Blaster | 1204.8 | 1606.3 | 0.75 | 1 | 5.0 |
| Tanker | 1874.1 | 3534.0 | **0.90** | 4 | **4.0** |
| Brute | 1499.3 | 3212.7 | **0.90** | 4 | **7.75** |
| Peacebringer/Warshade | 1070.9 | 2409.5 | **0.85** | 2 | 4.45 |
| Mastermind | 803.2 | 1606.3 | 0.75 | 2 | 4.0 |
| **Primalist** | **1285.1** | **2248.9** | **0.75** | **1** | **4.0** |

(Brute 775% / Tanker 400% damage caps and Kheldian 85% resistance cap are server-specific
non-default values — matching them is strong evidence the deltas are correct.) **No
regression:** HC still resolves via the parse7 layout (HC Brute dmgCap 7.0 / Tanker 5.0 —
distinct from Thunderspy's older 7.75 / 4.0, proving the fallback does NOT trigger for HC);
`src/data/archetype-stats.test.ts` passes 60/60; Rebirth (Parse6 path) unchanged.
Verified the values survive into JSON via `export_classes` (Primalist's `tables` entry
carries the full block). **TODO when wiring the app dataset:** add a Thunderspy
archetype-stats test mirroring the HC one.

## ✅ `Class_Primalist` parsed with empty primary/secondary/pool categories — 2026-06-16

**Symptom.** Thunderspy's custom **Primalist** archetype (`Class_Primalist`, the 15th
class in `classes.bin` = 14 standard + Primalist) parsed with **empty** `primary_category`
/ `secondary_category` / `pool_category`, while every other class (including the Kheldian
EATs) parsed fine. This silently hid Primalist from the planner — and the export's
`PLAYER_CATEGORIES` filter compounded it by dropping the orphaned `Feral_Might` /
`Primal_Gifts` categories (only `Primalist_Misc` leaked through, because it had been
parked in the Lore/NPC pet-category list).

**Root cause.** `_find_icon_offset` only matched icon strings ending in **`.tga`**.
Primalist's icon is **`archetypeicon_primalist.texture`** (ends in `.texture`). With no
`.tga` match the function returned `None`, so the entire category-detection block — which
correctly reads the three categories at `icon_off + 4 / +8 / +12` — was skipped. The
category data was present and correctly placed all along; only the icon *anchor* failed.
(Warshade works because its icon is `archetypeicon_Warshade.tga`.)

Raw Primalist record (Parse7, string-offset fields):
```
+76 'archetypeicon_primalist.texture'   <- icon (.texture, not .tga)
+80 'Feral_Might'                        <- primary
+84 'Primal_Gifts'                       <- secondary
+88 'Pool'                               <- pool
```

**Fix (applied 2026-06-16).** `_find_icon_offset`
([_classes.py](../tools/bin-crawler/bin_crawler/parser/_classes.py)) now accepts a
`.texture` extension in addition to `.tga`. Primalist now resolves
`Feral_Might` / `Primal_Gifts` / `Pool`. **De-risk:** re-parsed all three datasets —
15 Thunderspy + 15 Homecoming + 15 Rebirth classes still parse with **no** empty
categories (no regression; the change only adds a previously-unmatched extension).

**Export follow-through (applied 2026-06-16).** Added `Feral_Might` and `Primal_Gifts`
to `PLAYER_CATEGORIES` in
[export_powers.py](../tools/bin-crawler/bin_crawler/export_powers.py) (`Primalist_Misc`
already present). Full Thunderspy export verified: **8,532 player powers / 1,906
powersets / 58 categories** (was 8,506 / 56 — the +26 powers are exactly Feral_Might's 14
+ Primal_Gift's 12). Primalist is a Kheldian-style form-shifter (primary `Feral_Might`
with Hunter/Prowler form toggles; secondary `Primal_Gift`; form-attack variants + per-hit
lifesteal redirects in `Primalist_Misc`). The class `attribs` are still empty — that's a
separate, dataset-wide issue tracked in NEW ISSUES above.
