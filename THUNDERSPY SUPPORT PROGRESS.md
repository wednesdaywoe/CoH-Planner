# Thunderspy Support — Progress

**Last updated:** 2026-06-16

Adding Thunderspy as a third dataset source alongside HC (Homecoming) and Rebirth. Reads directly from `G:\Thunderspy Gaming\Sweet Tea\tspy\bin.pigg`.

## Status

Thunderspy is now a fully supported export source. End-to-end export produces 10,438 JSON files: **8,532 player powers across 1,906 powersets in 58 categories**, plus 212 IO sets. This now includes Thunderspy's custom **Primalist** archetype and its custom powersets — see the "Thunderspy-exclusive content" section below. (Was 8,506 / 56 before the 2026-06-16 Primalist fix.) Still parser/export-only — Thunderspy is not yet a selectable dataset in the planner app.

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
  - **(2026-06-16)** `_find_icon_offset` now accepts a `.texture` icon extension in addition to `.tga` — Primalist's `archetypeicon_primalist.texture` was returning no icon anchor, which silently blanked its category fields

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
- ~~**Class attribs (HP/caps) don't parse** for any Thunderspy class~~ — ✅ FIXED 2026-06-16 via `_ATTRIB_LAYOUT["thunderspy"]` (parse7 framing + 50-level deltas) with a self-detecting fallback. All 15 ATs extract HP/caps/threat/dmg-cap. See the resolved note above and [parser_logs/THUNDERSPY-PARSER-LOG.md](parser_logs/THUNDERSPY-PARSER-LOG.md).

## Thunderspy-exclusive content (discovered 2026-06-16)

The original support pass treated Thunderspy as an old i23-era Homecoming and only kept the standard ATs that matched the planner's `PLAYER_CATEGORIES`. That **silently dropped Thunderspy's custom content** — the export filter let `Primalist_Misc` through only because it was parked in the Lore/NPC list. A re-parse of `powercats.bin` (187 cats) + `classes.bin` (15 classes) + a powerset diff vs HC reveals:

### Custom archetype: Primalist

`Class_Primalist` is the one non-standard player class (15 = 14 standard + Primalist). It is a **Kheldian-style form-shifter melee AT**:

- **Primary:** `Feral_Might.Feral_Might` (14 powers — base attacks Feral_Blow / Vicious_Strike / Brutal_Swipe / Primal_Strike / Upheaval / Savage_Blow, plus the form toggles `Hunter_Form` / `Prowler_Form`, plus Hunters_Howl, Pack_Frenzy, Call_of_the_Wild, Pounce, Natures_Boon, Primal_Guile).
- **Secondary:** `Primal_Gifts.Primal_Gift` (12 powers — Pack_Master, Thick_Hide, Rejuvenate, Primal_Ward, Primal_Howl, Primalists_Cloak, Inexhaustible, Wild_Roar, Shifters_Shield, Grace_of_Nature, Will_of_the_Wild, Natures_Boon).
- **Form attack redirects:** `Primalist_Misc` holds `Primal_Form_Powers` / `Hunter_Form_Powers` / `Prowler_Form_Powers` (per-form attack variants, like Kheldian Nova/Dwarf form attacks) + `Call_of_the_Wild_Pet` + a stack of `*_Heal` / `*_Heal_NBActive` redirect powers backing the lifesteal on each melee attack.

**Parser gap (FIXED 2026-06-16):** `Class_Primalist` parsed with **empty** primary/secondary/pool categories. Root cause: its icon is `archetypeicon_primalist.texture` — ends in `.texture`, not `.tga` — so `_find_icon_offset` returned `None` and the whole category block (correctly at icon+4/+8/+12) was skipped. Fix: `_find_icon_offset` now accepts `.texture` as well as `.tga`. Primalist now resolves `Feral_Might` (pri) / `Primal_Gifts` (sec) / `Pool`. Verified: all 15 Thunderspy + 15 HC + 15 Rebirth classes still parse with no empty categories.

### Custom powersets inside standard ATs (powerset diff vs HC)

| Category | Thunderspy-exclusive sets |
|---|---|
| Brute/Scrapper/Tanker Defense | `Organic_Armor` |
| Tanker Defense | `Sacred_Armor` |
| Controller/Dominator Control | `Water_Control` |
| Stalker Defense / Melee | `Spectral_Aura` / `Spectral_Melee` |
| Tanker Melee | `Hobo_Melee`, `Pale_Blade` |
| Dominator Assault | `Atomic_Assault`, `Dual_Pistols`, `Kinetic_Assault`, `Telekinetic_Assault` |
| Mastermind Buff / Summon | `Obedience_Training` / `Knights` |
| Widow / Teamwork | `Tarantula_Training` / `Tarantula_Teamwork` |
| Epic | several Controller/Dominator/MM masteries HC groups differently |

**Defender melee secondaries (CONFIRMED REAL 2026-06-16):** `Defender_Ranged` lists ~14 *melee/assault* sets (Battle_Axe, Claws, Katana, Savage_Melee, Kinetic_Assault, Earth/Martial/Thorny_Assault, Brawling, Holy_Light, Staff_Fighting, …). These are NOT cross-listing garbage — each is a fully-populated powerset with real attacks + a Taunt (e.g. Claws = Strike/Swipe/Slash/Spin/Follow_Up/Taunt/Focus). Since Defender's secondary category *is* `Defender_RANGED` (per classes.bin), **Thunderspy lets Defenders take melee/assault secondaries**. `Holy_Light` and `Brawling` appear to be wholly custom Thunderspy sets. These live under the already-included `Defender_Ranged` category, so they export with no filter change.

### Non-player custom categories (skip for the planner)

- `Thunderspy_Staff` — dev/staff vanity powers (BubbleWrap, Senpai, Dafto, DrBrain, OBH, "Bannable").
- `Awakened` (23 sets, Penelope Yin / Seer story content), `WISDOM`, `Items_Of_Power` — NPC/story/mechanic categories with no `Class_*`; revisit only if a player power redirects into them.

### Next steps to fully support Primalist

1. **Parser** — ✅ DONE (2026-06-16). `_find_icon_offset` now accepts `.texture`; Primalist resolves Feral_Might/Primal_Gifts/Pool.
2. **Export** — ✅ DONE (2026-06-16). Added `Feral_Might`, `Primal_Gifts` to `PLAYER_CATEGORIES` (`Primalist_Misc` already present). All custom powersets in standard ATs export under their existing (already-included) categories — verified. Full export now: **8,532 player powers across 58 category dirs** (was 8,506 / 56; +26 = Feral_Might 14 + Primal_Gift 12).
3. **App** — ⏳ NOT STARTED. Thunderspy is **not yet a selectable dataset** (`src/data/datasets/` has only `homecoming`/`rebirth`). Wire Thunderspy in, then model Primalist as a form-shifter AT (reuse the Kheldian form machinery for Hunter/Prowler/Primal forms and the per-attack heal redirects).

### Thunderspy class attribs (HP/caps) — ✅ FIXED (2026-06-16)

Previously all 15 Thunderspy classes parsed with **empty `attribs`** because `_extract_attribs` only knew the parse7 layout (105-entry level tables incl. Incarnate), while Thunderspy uses 50-entry tables inside a parse7 frame. **Fixed** by adding `_ATTRIB_LAYOUT["thunderspy"]` (count 50, cap_delta 15268, res_value_delta 45808, threat_delta −3968, dmg_cap_delta 30536) and a self-detecting fallback in `parse_classes` (try parse7 → fall back to thunderspy when empty; HC's 105-anchor never matches Thunderspy's 50-curves, and Rebirth uses the Parse6 path). All 15 ATs now extract HP/caps/threat/dmg-cap matching canonical CoH values (Brute 7.75/0.90, Tanker 4.0/0.90, Kheldian 0.85; Primalist baseHP 1285, maxHP 2249, res 0.75, threat 1, dmgCap 4.0). No HC/Rebirth regression (`archetype-stats.test.ts` 60/60). Full write-up in [parser_logs/THUNDERSPY-PARSER-LOG.md](parser_logs/THUNDERSPY-PARSER-LOG.md). TODO at app-integration time: add a Thunderspy archetype-stats test mirroring the HC one.

## App-side dataset integration (started 2026-06-16)

Goal: make Thunderspy a selectable dataset in the planner app (currently only `homecoming`/`rebirth` exist in `src/data/datasets/`). Branch: `thunderspy-expansion`.

### Done — data export + plumbing + generated layer

- **Export** → `exported_powers/thunderspy/`: 8,532 powers / 1,906 powersets / 58 categories (`export_powers`), 59 class tables incl. `primalist.json` (`export_classes` → `tables/`). Entities **failed** (see parser-log open issue) — deferred with an empty `PET_ENTITIES` stub, as Rebirth originally did.
- **Registration plumbing**: `DatasetId` += `thunderspy` (dataset.ts); `Build.serverId` unions (build.ts ×3); `KNOWN_DATASETS` (_dataset-paths.cjs); Primalist category→AT map (`feral_might`→primalist/primary, `primal_gifts`→primalist/secondary) added to **both** `convert-all-powersets.cjs` and `convert-powerset.cjs`; `primalist` added to the AT lists in `extract-at-tables.cjs` and `convert-archetypes.cjs` (warn+skip on HC/Rebirth).
- **Generated data** (all built & verified): `at-tables.ts`, `generated/archetype-stats.generated.ts` (15 ATs incl. Primalist baseHP 1285/maxHP 2249/res 0.75/threat 1/dmgCap 4), `generated/incarnate-effects.ts` (Thunderspy has Genesis too), 305 powersets → 3,104 power `.ts` files + `powersets/index.ts`. Salvage (shared) regenerated.

### Done — Thunderspy is a fully selectable dataset (2026-06-16)

`tsc` clean, production build green, full test suite 535/535 + a Thunderspy load smoke test pass.

1. **`archetypes.ts`** — generated by the new `scripts/generate-archetypes.cjs` (re-runnable). Derives each AT's primary/secondary set lists from the converted powerset tree; reuses HC's display/inherent/scalar metadata; spreads this dataset's `ARCHETYPE_BINARY_STATS`. 15 ATs incl. the bespoke **Primalist** block (Feral Might / Primal Gift, Primal Energy inherent). Captures Thunderspy's Defender melee/assault secondaries (27 defender secondaries) and custom sets automatically.
2. **`index.ts`** — assembles the `Dataset` object (mirrors rebirth).
3. **Facades & inputs**: `power-pools-raw.ts` + `epic-pools-raw.ts` composed facades + empty `overrides/` + generated `generated/power-pools.ts`/`epic-pools.ts` (13 pools/70 powers, 66 epic pools/330 powers). `purple-patch.ts` + `granted-powers.ts` re-export HC. `pet-entities.ts` empty stub.
4. **Runtime wiring**: `loadDataset` case + `getAllDatasetMetadata` (dataset.ts); 3-way routing in `powersets.ts`, `io-sets.ts`, `power-pools.ts`, `epic-pools.ts`, `incarnate-effects.ts` (incl. Genesis); `ArchetypeId` += `primalist`; mids-importer remap map.
5. **UI** (Header.tsx): Thunderspy `SERVER_OPTIONS` enabled, `warning` (amber) badge, Primalist-aware archetype picker.
6. **`primalist` added** to converter AT lists (`extract-at-tables`, `convert-archetypes`) and both powerset category maps.

### Primalist form mechanics — ✅ DONE (Phase F, 2026-06-16)

Primalist is a Kheldian-style form-shifter: its six Feral Might attacks (+ Primal Gift's Primal Howl) are **empty redirect shells**; the real per-form effect data lives in `Primalist_Misc.{Primal,Hunter,Prowler}_Form_Powers` as `<Power>_Primal/_Hunter/_Prowler` variants. Modeled on the Rebirth Kheldian redirect system (display-time overlay; slots stay on the base shell):

- **`scripts/generate-primalist-variants.cjs`** (new) → `datasets/thunderspy/primalist-form-variants.ts`: emits `PRIMALIST_FORM_VARIANT_POWERS` (20 variants) + `PRIMALIST_REDIRECTS` (7 base→form maps, derived from `_Primal/_Hunter/_Prowler` suffixes).
- **`datasets/thunderspy/primalist-redirects.ts`** (hand): `PrimalistForm` type, `resolvePrimalistRedirect` (every form redirects since the shell is empty; missing variant falls back to Primal), `isPrimalistFormShell`, variant-name set.
- **State**: `Build.primalistForm` (`primal`|`hunter`|`prowler`, default primal) + `buildStore.setPrimalistForm` (syncs Hunter_Form/Prowler_Form toggle `isActive`).
- **Display**: InfoPanel `formRedirectedPower` overlays the resolved variant's stats/damage/effects onto the shell.
- **UI**: Header `PrimalistFormSelector` (Primal/Hunter/Prowler), shown for Thunderspy Primalist.

### Dataset-wide damage extraction — ✅ FIXED (2026-06-16, surfaced by Phase F)

Phase F exposed that **no Thunderspy attack had any damage** in the converted data (0 of 3,104 power files). Cause: Thunderspy stores damage with a single **generic `Damage` attrib** (the element — Fire/Smashing/… — lives only in the shortHelp like `DMG(Fire)`), whereas HC/Rebirth use per-type attribs; `extractDamage`/`isDamageTypeAttrib` (`convert-powerset.cjs`) only recognised the typed attribs and dropped the generic one. Fixed by mapping the bare `damage` attrib to a typeless `Special` damage entry (correct scale/table magnitude). HC/Rebirth never use a bare `damage` attrib, so their output is unchanged. After regen: **1,276 power files now carry damage**. **Follow-up:** refine the `Special` label to the real element by parsing the power's shortHelp `DMG(...)` — magnitude is already correct; only the type label is generic.

### Custom-powerset audit + Tarantula branch fix (2026-06-16)

Investigated a report that custom powersets were "ignored / didn't extract." Findings:
- **Nothing is dropped.** Per-category counts match 1:1 between `exported_powers/thunderspy/<cat>` and the converted tree; no display-name collisions; every custom set has powers. The converter folder-names powersets by **display name**, so customs appear under their in-game names (which can read as "missing"): Sacred Armor→**Nature Armor**, Organic Armor→Organic Armor, Hobo Melee→**Hard Life**, Bio Armor (bio_organic_armor), Telekinetic Assault→**Psychokinetic Assault**, Dual Pistols→**Akimbo Assault**, Holy Light→**Radiant Blast**, etc.
- **One real gap, fixed:** Thunderspy's custom **Tarantula** Widow branch (`tarantula-training` + `tarantula-teamwork`) was converted on disk but unrostered, because `generate-archetypes.cjs` reused HC's verbatim VEAT branches (Night Widow / Fortunata only). Added `'tarantula'` to `ArchetypeBranchId` and a Thunderspy-specific branch injection in the generator. The branch picker is generic, so it now surfaces. (Arachnos Soldier matches HC — no custom soldier sets.)

### Custom icons — 83 backfilled from tspy piggs (2026-06-16)

Of 1,844 distinct icons referenced by Thunderspy powers, 272 were missing from `public/img/powers/` (broken images on custom powers — looked like bad extraction but the data was fine). New **`scripts/extract-thunderspy-icons.py`** indexes the icon `.texture` files across all tspy `.pigg` archives, finds the referenced-but-missing ones, and converts each to a 32×32 RGBA PNG (DDS/JPEG → PIL). **83 extracted** (the high-value customs: Obedience Training, Spectral Aura/Melee, Knights, Pale Blade, Tarantula, custom assault/control sets) — verified as real icons, 0 failures. Re-run with `python3 scripts/extract-thunderspy-icons.py [--assets-dir <…/tspy>]` (env `THUNDERSPY_ASSETS_DIR`).

**189 still missing** (not in the tspy piggs): mostly Lore-pet / NPC-group (`banishedpantheon_*`, `tsoo_*`, `talonsofvengeance_*`, …), enhancement (`e_icon_*`), generic temp/pseudo-pet, and archetype icons (`archetypeicon_*.tga/.texture`). Most NPC/standard ones are sourceable from the **HC** texture piggs (`…/Homecoming/assets/live`); archetype icons are handled on a separate asset path. Lower priority — these are redirect/Lore/temp powers, not the player's own custom sets.

### Reference asset: `Thunderspy/` (Mids' Reborn DB export)

A community Mids' Reborn database export (`.mhd` files incl. the 26 MB `I12.mhd`, `EnhDB.mhd`, `Recipe.mhd`, `Salvage.mhd`) plus icon folders. Useful as an **authoritative cross-check** for rosters/branches/IO-sets and as an icon source. Our bin extraction (live game data) remains the primary source; Mids is secondary corroboration.

### Remaining

> Consolidated, actionable list: [parser_logs/THUNDERSPY_TODO.md](parser_logs/THUNDERSPY_TODO.md). Top two: **IO sets** (replace the HC stand-in) and **pets/entities** (fix the entity parser).

1. **Custom icon backfill** (272 missing): from `Thunderspy/Images` (quick, partial) or Thunderspy texture piggs (complete, authoritative).
2. **Damage element-type refinement** (above): `Special` → Fire/Smashing/etc. from shortHelp. Magnitudes correct; cosmetic/resistance-grouping only.
2. **IO sets** (`io-sets-raw.ts`): re-exports HC as a first-pass; real extraction needs `extract-rebirth-io-sets-v2.py` ported to Thunderspy (212 sets in `boostsets.bin`).
3. **Entities parser fix** so `pet-entities.ts` can be populated (parser-log open issue). Until then summoned-pet detail panels are empty.
4. **regen-all**: Thunderspy isn't in `regen-all.cjs`'s default list (its `convert-pet-entities`/`generate-kheldian-variants` steps need entities / a form-variants file). Regen its generated layer manually per-converter; note the new `generate-primalist-variants.cjs` and `generate-archetypes.cjs` steps.

## How to add more sources later

The pattern is now well-established:

1. Probe one or two known records (an attack with known range/recharge, etc.) to find which fields exist
2. Add toggles to the parser for the differing fields
3. Add a format-detection step that tries the new layout and scores by plausibility
4. Spot-check against in-game values for half a dozen powers across different ATs

Most older CoH datasets will probably resemble one of the three formats we now support. Genuinely new schemas (post-modern HC) would need more work.
