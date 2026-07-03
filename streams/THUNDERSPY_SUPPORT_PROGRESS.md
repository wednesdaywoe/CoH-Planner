---
project: coh-sidekick
kind: plan
title: Thunderspy Support
id-prefix: TSPY
relates:
  - THUNDERSPY_PARSER.md
  - HOMECOMING_PARSER.md
---

# Thunderspy Support

Source of truth for adding Thunderspy as a third dataset source alongside Homecoming
(HC) and Rebirth — bin parsing, export, and in-app integration. Thunderspy is an
i23-era fork with a custom **Primalist** form-shifter archetype and many custom
powersets; it reads directly from `…/Thunderspy Gaming/Sweet Tea/tspy/bin.pigg`.
As of 2026-07-02 it is a fully selectable dataset in the planner. This doc tracks
the work items (the former `THUNDERSPY_TODO.md` follow-ups are folded into `## Deferred`
below); deep binary-format RE lives in the parser logs under `relates`.
Numbers below reflect the current export: **8,532 player powers / 1,906 powersets /
58 categories**, 212 IO sets, 619 pet entities, 15 archetypes incl. Primalist.

## Active

### Parser (bin-crawler)
- [x] `powers.bin` — Thunderspy Parse7-wrapped / Parse6-derived record schema (HC-style 24-byte box, no field 43b) + string-named-attrib effect templates   verify: fn:_parse_effect_template_thunderspy
- [x] `powersets.bin` — Parse6-derived third fallback layout   verify: fn:_parse_parse6
- [x] `classes.bin` — `.tga`/`.texture` icon anchor + 50-level table finder; all 15 ATs' categories resolve   verify: fn:_find_icon_offset
- [x] Class attribs (HP / caps / threat / dmg-cap) for all 15 ATs incl. Primalist (50-entry parse7-framed tables)   verify: file:src/data/datasets/thunderspy/generated/archetype-stats.generated.ts
- [x] `boostsets.bin` placeholder-pollution guard — skips broken `SumoBoostName` sets (the `KB`→ECMelee record that leaked "Melee Damage" onto ~1,387 ranged powers)   verify: fn:_is_placeholder_set
- [x] `VillainDef.bin` pet-entity parse — tolerant level display-names reader handling Thunderspy's single bare-string offset vs HC/Rebirth's length-prefixed string_array (decision 2026-07-02: peek count-vs-offset; the level element is length-bounded so a wrong guess can only mis-read one element). All 619 pets parse; HC re-parse unchanged (744 pets)   verify: fn:_read_level_display_names, fn:peek_u4
- [x] Effect-template attribs recovered — `_resolve_str` string-table cap widened to the full ~38 MB table + post-`requires` **index-array** read (the affected-attrib list multi-type buffs leave only in the index array). Recovers **defense** magnitudes on every toggle/armor set (was 0)   verify: fn:_parse_effect_template_thunderspy, file:src/data/thunderspy-defense-data.test.ts
- [x] `Ones`-front recharge / recovery / regeneration / endurance buffs recovered from the index array (`ATTRIB_NAME_THUNDERSPY` adds the verified `RechargeTime = index 89` divergence; shortHelp `recoverThunderspyOnesBuffs` hack retired) + converter aspect-/target-trap guard   verify: fn:guardThunderspyOnesBuffs, file:src/data/thunderspy-ones-recharge-buff.test.ts
- [x] Applied **mez type + magnitude** & **offensive knockback** recovered from the index array (type from the lone index mez attrib, magnitude from the post-table `k+12` slot; target-/sign-trap guards; cross-dataset incarnate mez-mag `scale`→`magnitude` fix)   verify: fn:guardThunderspyAppliedMez, file:src/data/thunderspy-mez-knockback.test.ts
- [x] DoT `tickRate` — `application_period` read from the shared HC-Parse7 post-table block (array-aware walk past the two expr arrays)   verify: file:src/data/thunderspy-dot-tickrate.test.ts

### Export
- [x] Powers / powersets / classes export — 8,532 powers, 1,906 powersets, 58 categories, 59 class tables   verify: file:exported_powers/thunderspy
- [x] Pet-entity JSONs (619) from `VillainDef.bin`   verify: file:exported_powers/thunderspy/entities
- [x] IO sets — real extraction of all 212 sets from `boostsets.bin` (was an HC stand-in), incl. Subaluwa + Primalist ATOs rebuilt from display strings   verify: file:src/data/datasets/thunderspy/io-sets-raw.ts

### App integration
- [x] Thunderspy is a selectable dataset (registration, runtime routing, Header UI with amber "warning" badge)   verify: file:src/data/datasets/thunderspy/index.ts
- [x] Primalist modeled as a Kheldian-style form-shifter (Primal / Hunter / Prowler); empty attack shells overlay per-form variant data at display time (Rejected: baking variants into the base power — loses the slots-stay-on-shell model HC/Rebirth use for Kheldians)   verify: fn:resolvePrimalistRedirect, file:src/data/datasets/thunderspy/primalist-form-variants.ts
- [x] Dataset-wide damage extraction — Thunderspy's generic `Damage` attrib (element lives only in shortHelp `DMG(...)`) maps to a typeless `Special` damage entry with correct scale/table magnitude; HC/Rebirth unaffected
- [x] Tarantula Widow branch (`tarantula-training` + `tarantula-teamwork`) rostered via a Thunderspy-specific branch injection   verify: file:scripts/generate-archetypes.cjs
- [x] ~232 custom power icons backfilled from tspy `.texture` piggs — 83 core customs (Obedience Training, Spectral Aura/Melee, Knights, Pale Blade, Tarantula, …) + a later 149 from the sibling base `piggs/` (incl. the `awakened_*` Psychokinetic/Telekinetic Assault set)   verify: file:scripts/extract-thunderspy-icons.py

### Guardrails
- [x] `audit-allowed-set-categories --gate` covers all 3 datasets in CI (catches the malformed-boostset category-pollution class)   verify: file:scripts/audit-allowed-set-categories.cjs
- [x] `convert-pet-entities` wired for thunderspy; `regen-all --dataset thunderspy` completes green end-to-end incl. the audit gate   verify: file:scripts/regen-all.cjs

## Deferred
- [ ] **TSPY1** — refine damage element labels: multi-type powers collapse to the **primary** element (`DMG(Energy/Toxic)` → Energy) and powers whose tooltip lacks `DMG(...)` (e.g. Pale Wind) stay `Special`. Primary-element typing already ships (from shortHelp `DMG(...)`); magnitudes are correct — label-only. A `display_help` prose-parse fallback is possible but fragile.
- [ ] **TSPY2** — backfill the ~40 still-missing icons (was ~189; 149 extracted 2026-07-02). Remainder are Lore-pet / NPC-group (`banishedpantheon_*`, `tsoo_*`, …), enhancement (`e_icon_*`), and archetype (`archetypeicon_*`) icons absent from every local Sweet Tea pigg — sourceable from HC texture piggs (`--assets-dir <…/Homecoming/assets/live>`). These are redirect / Lore / temp powers, not player customs.
- [ ] **TSPY3** — 92 powerset records (1.4%) still fail to parse — likely a fourth rare layout variant. Not investigated.
- [ ] **TSPY4** — populate tspy `pet-lifespans.json` / `self-destruct-delays.json` (currently 0 entries). These come from pet-power *effect* parsing, a separate path from `VillainDef.bin`; only affects temp-pet despawn timing.
- [ ] **TSPY5** — add a Thunderspy archetype-stats test mirroring the HC one (`src/data/archetype-stats.test.ts` currently covers HC/Rebirth only).
- [ ] **TSPY6** — extract effect-template tail fields (cancel_events, suppress_events, stacking metadata). Variable tail layout; the fields the planner uses for damage/heal/mez math are already extracted reliably.
- [ ] **TSPY7** — decide whether to add thunderspy to `regen-all.cjs`'s default dataset list + the CI regen-diff (currently `[homecoming, rebirth]`; thunderspy is covered by the dedicated ci.yml audit step instead). Precondition: its full generated tree must be committed byte-stable first.
- [ ] **TSPY8** — code-split the dataset bundles. All 3 datasets ship in one ~14 MB chunk to every visitor (drove the deploy heap bump to 6144 MB); a dynamic-import split would cut initial page-load weight. Perf-only — not a scaling need now that the roster is final.

---

## Reference — format discoveries

Thunderspy is **Parse7-wrapped** (CrypticS magic, string table, u4 string offsets, same
framing as HC) but uses a **Parse6-derived record schema** for powers, powersets, and
effects. It predates HC's schema additions and Rebirth's enum extensions, so it sits in
its own corner of the format space. Full RE detail in the parser logs (`relates`).

### `powers.bin` record schema

| Field | HC Parse7 | Parse6 (Rebirth) | Thunderspy |
|---|---|---|---|
| Field 35b (u4 after ai_report) | present | absent | absent |
| Field 38 chain_effect_array | present | absent | absent |
| Field 43b (u4_array after chain_fork) | optional | **present** | **absent** |
| Fields 44–45 box | 24 B (2×f4×3) | 8 B (2×f4) | **24 B** (HC-style) |
| Post-boosts tail | AIGroups + Redirect + Effects + ActivationEffects | flat AttribMod struct_array | flat AttribMod struct_array (no Redirect/ActivationEffect) |

- **BOOST_TYPE / ATTRIB_NAME enums:** Thunderspy matches HC's tables exactly. Rebirth has
  +1 insertions (BOOST_TYPE at 10 & 36) and shifts (Create_Entity 117→116, Accuracy 84→85)
  that Thunderspy lacks.
- **Effect templates (AttribMod):** older than both HC's and Parse6's — **attribs are
  string-table offsets to literal names** (`"Damage"`, `"Stun"`, `"Heal"`), not enum
  indices. The parser scans for the modifier-table name and pulls `scale` (f4 at table+4)
  and `duration` (f4 at table+8). Mez durations are reconstructed as `scale × table_lookup`,
  matching the HC convention.
- **`VillainDef.bin` (pet entities):** header + powers struct-array match HC. The one
  divergence is the level sub-record — `levels[].display_names` is a single bare string
  offset in Thunderspy vs a length-prefixed string_array in HC/Rebirth (see TSPY item above).
- **`classes.bin`:** categories at `icon_off + 4/+8/+12` (HC: `+20/+24/+28`); named-tables
  vcount 50 (level cap) vs HC's 105 (cap + Incarnate). Primalist's icon is
  `archetypeicon_primalist.texture` (not `.tga`).

### Sample validation against known game data

| Power | Field | Thunderspy | Expected |
|---|---|---|---|
| Brute Jab | range / rech / endur | 7 / 4 / 5.2 | 7 / 4 / 5.2 |
| Brute Jab eff[0] | Damage scale (Melee_Damage, PvE) | 1.0 | 1.0 |
| Fire Blast eff[1] | DoT scale / duration | 0.15 / 3.1s | 0.15 / 3.1s |
| Brawl | Damage scale | 0.36 | 0.36 |
| Hasten | Recharge buff scale / duration | 0.7 / 120s | +70% / 120s |
| Dull Pain | HealSelf scale / duration | 2.0 / 120s | 2.0 / 120s |
| Class_Blaster | Melee_Damage[lvl 50] | -62.56 | -62.56 (HC sign convention) |
| Primalist | baseHP / maxHP / res / dmgCap | 1285 / 2249 / 0.75 / 4.0 | canonical CoH values |

### Custom content (Primalist + custom sets)

- **Primalist** (`Class_Primalist`): primary `Feral_Might.Feral_Might` (14 powers incl.
  Hunter/Prowler form toggles), secondary `Primal_Gifts.Primal_Gift` (12), per-form attack
  redirects in `Primalist_Misc.{Primal,Hunter,Prowler}_Form_Powers` + per-attack lifesteal
  heal shells.
- **Custom powersets inside standard ATs** fold under their existing (already-included)
  categories and appear under in-game display names: Sacred Armor→**Nature Armor**, Hobo
  Melee→**Hard Life**, Telekinetic Assault→**Psychokinetic Assault**, Dual Pistols→**Akimbo
  Assault**, Holy Light→**Radiant Blast**, plus Organic Armor, Spectral Aura/Melee, Knights,
  Obedience Training, Water Control, Pale Blade, and the Tarantula Widow branch.
- **Defenders take melee/assault secondaries:** `Defender_Ranged` lists ~14 fully-populated
  melee/assault sets (Claws, Katana, Savage Melee, the Assault families, plus custom Holy
  Light / Brawling), confirmed real (each has attacks + Taunt), not cross-listing garbage.
- **Non-player categories skipped:** `Thunderspy_Staff` (dev vanity), `Awakened`, `WISDOM`,
  `Items_Of_Power` (NPC/story) — revisit only if a player power redirects into them.

### Running the export

```
cd tools/bin-crawler
py -3 -m bin_crawler.export_powers   --assets-dir "<…/Sweet Tea/tspy>" --output-dir exported_powers/thunderspy
py -3 -m bin_crawler.export_entities --assets-dir "<…/Sweet Tea/tspy>" --output-dir exported_powers/thunderspy/entities
```

The tspy assets dir is remembered in the bin-crawler config, so `--assets-dir` can be
omitted. IO sets: `extract-rebirth-io-sets-v2.py --dataset thunderspy`. Reference
cross-check: a community Mids' Reborn DB export (`.mhd`) exists for roster/branch/IO-set
corroboration; the bin extraction (live game data) remains primary.
