# Thunderspy Support — Progress

**Last updated:** 2026-05-23

Adding Thunderspy as a third dataset source alongside HC (Homecoming) and Rebirth. Reads directly from `G:\Thunderspy Gaming\Sweet Tea\tspy\bin.pigg`.

## Status

Thunderspy is now a fully supported source. End-to-end export produces 10,410 JSON files: 8,506 player powers across 1,904 powersets in 56 categories, plus 212 IO sets.

## What works

| Bin file | Parse rate | Notes |
|---|---|---|
| `powers.bin` | 99.5% (20,850 / 20,956) | Power-level fields + effect templates |
| `powersets.bin` | 98.6% (6,561 / 6,653) | Parse6 fallback layout |
| `powercats.bin` | 100% (187) | Worked unchanged |
| `classes.bin` | 100% (15) | All standard ATs + Kheldians + VEATs, 92 modifier tables each |
| `boostsets.bin` | 212 IO sets | Worked unchanged |
| `clientmessages-en.bin` | 81,519 strings | P-hash resolution works |

## Sample validation against known game data

| Power | Field | Thunderspy | Expected |
|---|---|---|---|
| Brute Jab | range / rech / endur | 7 / 4 / 5.2 | 7 / 4 / 5.2 |
| Brute Jab eff[0] | Damage scale, Melee_Damage table, PvE | 1.0 | 1.0 |
| Brute Jab eff[1] | Stun template, Melee_Stun, scale 6.0 | mag 0.1 × 6 = 0.6 | mag 0.6 small-chance stun |
| Fire Blast eff[0] | Ranged_Damage scale, instant | 1.0 / 0s | 1.0 / instant |
| Fire Blast eff[1] | DoT scale / duration | 0.15 / 3.1s | 0.15 / 3.1s |
| Brawl | Damage scale | 0.36 | 0.36 |
| Hasten | Recharge buff scale / duration | 0.7 / 120s | +70% recharge / 120s |
| Dull Pain | HealSelf scale / duration | 2.0 / 120s | 2.0 / 120s |
| Class_Blaster | Melee_Damage[lvl 50] | -62.56 | -62.56 (matches HC sign convention) |
| Class_Tanker | Melee_Damage[lvl 50] | -44.49 | (lower than damage classes, correct) |

## Format discoveries

Thunderspy is **Parse7-wrapped** (same framing as HC: CrypticS magic, string table, u4 string offsets) but uses a **Parse6-derived record schema** for powers, powersets, and effects. It predates HC's schema additions and predates Rebirth's enum extensions, so it sits in its own corner of the format space:

### `powers.bin` (record schema)

Closest to Parse6, but with two important differences:

| Field | HC Parse7 | Parse6 (Rebirth) | Thunderspy |
|---|---|---|---|
| Field 35b (u4 after ai_report) | present | absent | absent |
| Field 38 chain_effect_array | present | absent | absent |
| Fields 38b-d (3 × u4) | present | absent | absent |
| Field 41b (8 bytes after chain_delay) | optional | absent | absent |
| Field 43b (u4_array after chain_fork) | optional | **present** | **absent** |
| Fields 43c, 45b, 48b, 52b | optional | absent | absent |
| Fields 44-45 box | 24 bytes (2×f4×3) | 8 bytes (2×f4) | **24 bytes** (HC-style) |
| Post-boosts tail | AIGroups + Redirect + Effects + ActivationEffects | flat AttribMod struct_array | flat AttribMod struct_array (no Redirect, no ActivationEffect) |

### Enum tables

- **BOOST_TYPE**: Thunderspy matches HC's table exactly. Rebirth has +1 insertions at positions 10 and 36 that Thunderspy lacks.
- **ATTRIB_NAME**: Thunderspy uses HC's table. Rebirth shifts Create_Entity (117→116) and Accuracy (84→85).

### Effect templates (AttribMod)

Thunderspy's effect template format is older than both HC's and Parse6's. Key difference: **attribs are stored as string-table offsets pointing to literal names** (`"Damage"`, `"Stun"`, `"Heal"`), not as integer indices into the ATTRIB_NAME enum.

Reliable schema (first 28 bytes + requires):

| Offset | Type | Field |
|---|---|---|
| +0 | u4 | attribs_count |
| +4 | u4 × N | attrib_name string offsets |
| (after) | f4 | magnitude default |
| (+4) | u4, u4 | two unknown fields (often 0) |
| (+12) | f4 | duration default (-1 = instant sentinel) |
| (+16) | f4 | max_duration default |
| (+20) | u4 × M | requires (RPN string_array) |

After requires, the layout has a variable middle block we don't fully decode. The parser scans for the modifier-table name (`Melee_Damage`, `Ranged_Damage`, `Self_Heal`, etc.) and pulls:
- `scale` (f4 at table_pos + 4)
- `duration` (f4 at table_pos + 8) — 0 for instant attacks, DoT window length for damage-over-time

Mez template durations live in a different tail slot we don't extract; the planner reconstructs them as `scale × table_lookup`, which is the same convention used for HC.

### `classes.bin`

Records use the same .tga-anchored layout as HC, but:
- Categories are at `icon_off + 4 / +8 / +12` (Thunderspy) vs `icon_off + 20 / +24 / +28` (HC). Detected by checking whether the slot at `+20` returns a `Class_*` string (the parent_class field).
- Named-tables vcount is 50 (Thunderspy level cap) vs 105 (HC level cap + Incarnate). Loosened the table-finder range to accept both.

### `powersets.bin`

Uses the same 3-account-string + vestigial-available layout as Rebirth's Parse6. Added `_parse_parse6` as a third Parse7 fallback layout (`_parse_primary` and `_parse_fallback` for HC variants stay tried first).

## Category coverage

Thunderspy has 187 power categories (HC: 203, Rebirth: 188). Reflects the i23-era roster:

**Present and supported (matches planner's PLAYER_CATEGORIES):**
- Standard ATs: Blaster, Brute, Controller, Corruptor, Defender, Dominator, Mastermind, Scrapper, Stalker, Tanker
- Kheldians: Peacebringer, Warshade
- VEATs: Arachnos_Soldiers, Widow_Training, Teamwork, Training_Gadgets
- Generic: Pool, Epic, Inherent, Pets, Villain_Pets

**Missing (newer than i23):**
- `Sentinel_*` (HC addition)
- `Guardian_*` (Rebirth addition)
- `*_Aux` auxiliary categories (HC/Rebirth additions for leap/charge AoE data)
- `Redirects` (HC-only routing category)

**Extra in Thunderspy (legacy structure):**
- `Incarnate_AlphaStrike` and `Incarnate_I20` (older Incarnate split — HC merged these into one `Incarnate`)
- `Kheldian_Pets`, `Mastermind_Pets`, `NPC_Pets`, `Mission_Pets`, `Mission_Maker_Pets`, `V_Arachnos`, `V_Arachnos_Proxy`, `Base_Aux`

## Parser changes

All changes are additive — no HC or Rebirth regressions expected:

- **[tools/bin-crawler/bin_crawler/parser/_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py)**
  - Added `thunderspy: bool = False` flag to `_parse_power_parse6` (HC-style 24-byte box, no field 43b, HC's BOOST_TYPE/ATTRIB_NAME enum tables)
  - Added `_parse_effect_template_thunderspy` for the string-named-attribs schema with table-name scanning
  - Threaded `thunderspy` flag through `_parse_effects_parse6` so it dispatches to the Thunderspy template parser
  - Extended `_detect_format` to also test a Thunderspy layout score and return `(has_41b, has_45b, is_thunderspy)`; dispatcher routes Parse7 files to either HC's `_parse_power` or Parse6's `_parse_power_parse6(thunderspy=True)`

- **[tools/bin-crawler/bin_crawler/parser/_powersets.py](tools/bin-crawler/bin_crawler/parser/_powersets.py)**
  - `_parse_parse6` added as a third Parse7 fallback layout (HC's `_parse_primary` and `_parse_fallback` still tried first)

- **[tools/bin-crawler/bin_crawler/parser/_classes.py](tools/bin-crawler/bin_crawler/parser/_classes.py)**
  - Categories read at `icon_off + 20` first; falls back to `icon_off + 4` when the +20 slot returns a `Class_*` parent_class string
  - `_find_named_tables_offset` accepts sub_len 150–600 (was 400–500) and vcount 40–150 (was exactly 105) to handle Thunderspy's level-cap-50 tables

## Running the export

```
cd tools/bin-crawler
py -3 -m bin_crawler.export_powers --assets-dir "G:\Thunderspy Gaming\Sweet Tea\tspy" --output-dir "C:\tmp\tspy_export"
```

The HTTP API server also accepts `--assets-dir` pointing at the Thunderspy directory.

## Known limitations

None are blocking, but worth tracking:

- **92 powerset records (1.4%)** still fail to parse — likely a fourth rare layout variant. Not investigated.
- **Effect template tail fields** (cancel_events, suppress_events, stacking metadata) are not extracted. The tail block has a variable layout that depends on attrib type and would need more reverse engineering. The fields the planner uses for damage/heal/mez math (attribs, table, scale, duration) are extracted reliably.
- **Mez template durations** come via `scale × table_lookup`, not a direct field. This matches how the planner derives mez durations for HC, so end-to-end calculations should work.
- **Blaster Melee_Damage == Ranged_Damage** in Thunderspy (HC differentiates them slightly). May be an older table-sharing convention; not investigated.
- **Negative damage modifier values** (-10.25 for Blaster Ranged_Damage at level 1) match HC's sign convention. The downstream consumer is expected to negate when computing actual damage.

## How to add more sources later

The pattern is now well-established:

1. Probe one or two known records (an attack with known range/recharge, etc.) to find which fields exist
2. Add toggles to the parser for the differing fields
3. Add a format-detection step that tries the new layout and scores by plausibility
4. Spot-check against in-game values for half a dozen powers across different ATs

Most older CoH datasets will probably resemble one of the three formats we now support. Genuinely new schemas (post-modern HC) would need more work.
