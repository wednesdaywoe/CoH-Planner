# CoH Sidekick — Multi-Dataset & Foundation Plan

Originally scoped as multi-dataset infrastructure. The umbrella project now
includes the broader changes the Rebirth integration surfaced: data-model
extensions for conditional power mechanics, the InfoPanel visual redesign,
calc accuracy fixes, and the AT-mechanic alignment work the per-power
adjuster surface implies.

## Active Workstreams

Each entry below has a detail section further down. Status snapshot as of
2026-05-03:

| # | Workstream | Status | Anchor |
|---|---|---|---|
| 1 | **Multi-dataset infrastructure** (Rebirth data layer) | Stages A + C mostly done; Stage B (HC powersets-tree migration) not started | [#multi-dataset-infrastructure](#multi-dataset-infrastructure) |
| 2 | **Conditional Effects + Mechanic Adjusters** | Data-layer capture, scope/group/mode classification, base merger, AT-inherent routing all landed on main (commit 7716ffe67) | [#conditional-effects--mechanic-adjusters](#conditional-effects--mechanic-adjusters) |
| 3 | **InfoPanel visual redesign** | **Complete.** All six outline sections landed (Mechanic Adjusters / Tags Block / Damage Block / Effects Block / General Stats Block / Description), language pass to in-game terminology, plus several regressions caught and fixed along the way (DoT 5×tick, FE Fire leak, Melee/Ranged misclassification, false-positive SPECIAL rows). | [#infopanel-visual-redesign](#infopanel-visual-redesign) |
| 4 | **AT-mechanic alignment** (Header vs InfoPanel) | First overlap (Domination via `kStealth source>` on Dominator powers) routed through Header state; expand mapping as more overlaps surface | [#at-mechanic-alignment](#at-mechanic-alignment) |
| 5 | **Calc accuracy fixes** | **Complete.** Conditional-aggregation, pure-DoT 5×tick, accuracy-final tooltip, damageModifier audit, tooltip-level convention all shipped or documented. | [#calc-accuracy](#calc-accuracy) |
| 6 | **Rebirth scalar-table verification** | **Done.** Diffed exported `classes.bin` tables; Rebirth's `at-tables.ts` regenerated from real Rebirth values. Tanker (Ranged_Damage -37.5%, Melee_Damage -15.8%) and Brute (Ranged_Damage -33%) had meaningful divergence — those ATs got post-i24 reworks on HC. Other ATs match HC within float-precision noise. | [#rebirth-scalar-table-verification](#rebirth-scalar-table-verification) |
| 7 | **IO sets exporter for Rebirth** | **Done** (subset-of-HC approach). Audit shows Rebirth's set list is a strict subset of HC's (210 shared, 17 HC-only post-i24, 0 Rebirth-only). New exporter filters HC's curated `io-sets-raw.ts` by the 210 set names from Rebirth's `boostsets.bin`; `io-sets.ts` now resolves the active dataset's registry. Bonus values are HC-cloned with a documented caveat — full Parse6 `boost_effect_*.bin` parser is the long-term path for Rebirth-specific bonus tiers. | [#io-sets-exporter-for-rebirth](#io-sets-exporter-for-rebirth) |

## Open Tasks (not-yet-grouped backlog)

- [x] Multi-instance mez display — shipped 2026-05-03 (commit 8ed898bff). `applyActiveConditionals` now returns `{ power, extraInstances }` instead of just a Power; additive collisions (e.g. Suffocate's Stealthed Mag-3 hold on top of base Mag-3) are captured as `ExtraInstance` entries with the conditional's label, threaded to `RegistryEffectsDisplay` via the new `extraInstances` prop, and rendered as dimmed rows beneath the matching base ("+ Hold Mag 3 (12.0s) (from Stealthed)"). Power type's effects shape didn't need a `hold: MezEffect[]` change after all — the multi-instance lives on display metadata, not the persisted Power record.
- [x] Rendering "additive" Mechanic Adjuster contributions in the InfoPanel — shipped 2026-05-03. `describeAdjusterContribution` returns the conditional's effect keys partitioned into "new" (filled in by merger) vs "collision" (silently dropped). `MechanicAdjusters` shows a "+ extra <effect> instance" hint under each colliding toggle. Multi-instance display still pending; this is the documentation hint that bridges the gap.
- [x] Curated label overrides for the 19 remaining "Conditional"-fallback powers — fixed 2026-05-03 by extending `_isUntoggleableGate` (Grounded/NearGround, recent-mez EventTimeSince, target-low-HP, caster-mez-state break-free) and converting `@CustomFX` from a reject rule into a strip via `_stripIgnoredClauses`. Down from 19 generic "Conditional" entries to 0 across both datasets.
- [ ] Verify ~217 HC Beam Rifle / Disintegration powers in browser after the conditional-aggregation fix shipped
- [ ] Decide on tooltip-level convention (game uses power's design level; Sidekick uses character level)
- [ ] Stage B: migrate HC `powersets/` `overrides/` `generated/` trees into `datasets/homecoming/` (~600 import sites)
- [→] ~~Audit other Rebirth-vs-HC scalar tables~~ — folded into the rescoped Workstream 6 ([Rebirth scalar-table verification](#rebirth-scalar-table-verification))
- [ ] Investigate the 80+ "Conditional"-labeled Rebirth Vacuum-style pet conditional gates
- [x] AT-inherent ID map expansion — audited 2026-05-03; only `domination` exists as a binary-level gate among AT-inherent mechanics. See AT-mechanic alignment section for details.

## Multi-dataset infrastructure

Originally the entire scope of this document. Status, stage breakdown,
open Stage B / Stage C blockers, and historical detail follow.

## Status

**Plumbing + first wave of migrations landed (2026-04-29).**
**Rebirth dataset materialization landed (2026-04-29 cont.).**
**Stage A wired and smoke-tested (2026-04-30).** All work was done in-place
on `main`; subsequent commits are being moved to feature branches.

### Rebirth materialization summary

Strategy chosen was **C → A → B**: convert Rebirth raw data into TS files
first (catches data bugs cheaply), then wire a minimum-viable dataset, then
do the deferred powersets-tree migration. **Stage C is mostly complete;
A and B not yet started.**

What's in [src/data/datasets/rebirth/](src/data/datasets/rebirth/):

- **271 powersets** (zero conversion failures) under
  `generated/powersets/`, `overrides/powersets/`, `powersets/`
- **13 power pools** in `power-pools-raw.ts` + `generated/power-pools.ts`
- **75 epic pools** in `epic-pools-raw.ts` + `generated/epic-pools.ts`
- **`generated/incarnate-effects.ts`** — 1284 lines, all six incarnate
  slots (Alpha, Destiny, Hybrid, Interface, Judgement, Lore)
- **`at-tables.ts`** — 14 player ATs (no Sentinel; Rebirth's i25 snapshot
  predates HC's Sentinel addition) + 5 pet classes, 38 tables each (HC has
  42 — Rebirth lacks PvP-specific table variants)

Bin-crawler parser changes shipped in this pass:

- [_pigg.py](tools/bin-crawler/bin_crawler/parser/_pigg.py) BinResolver
  globs both `bin*.pigg` (HC) and `*_bin.pigg` (Rebirth's `z_rebirth_bin.pigg`).
- [_boostsets.py](tools/bin-crawler/bin_crawler/parser/_boostsets.py) gained
  a Parse6 path. Detects regular vs purple layout by byte-peek for `EC*`
  inline strings (Rebirth has many more rarity tags than HC —
  ECSATO/ECSWinter/ECSHalloween/ImperialMight/LibertysBelt/...). ATO
  category inference from first power's category prefix (ATOs in Rebirth
  Parse6 omit the category string entirely, unlike HC). Universal-pool
  fallback (>1000 powers) tags as ECUniversalDamage. Result: **3,374
  powers indexed for Rebirth** (was 0 before this pass).
- [_classes.py](tools/bin-crawler/bin_crawler/parser/_classes.py) gained a
  Parse6 path. Inline-string anchor on `.tga` for icon, then 3 sequential
  inline strings for primary/secondary/pool categories. Named-tables finder
  widened: HC uses 105 values per table (sub_len ~428), Rebirth uses 50
  values (sub_len ~220).
- New [export_classes.py](tools/bin-crawler/bin_crawler/export_classes.py)
  produces per-AT/per-pet-class JSON files matching the legacy CoD2
  schema, so [extract-at-tables.cjs](scripts/extract-at-tables.cjs) keeps
  working without an old-archive dependency.

Conversion scripts updated to be dataset-aware on **both** input and output:

- [convert-powerset.cjs](scripts/convert-powerset.cjs)
- [convert-pool-powers.cjs](scripts/convert-pool-powers.cjs)
- [convert-epic-pools.cjs](scripts/convert-epic-pools.cjs)
- [convert-incarnate-effects.cjs](scripts/convert-incarnate-effects.cjs)
- [extract-at-tables.cjs](scripts/extract-at-tables.cjs)

Pattern: HC keeps writing to legacy `src/data/` paths (so the runtime
~600 import sites under `powersets/`, `generated/`, `overrides/` keep
resolving until the deferred tree migration); other datasets write
directly into `src/data/datasets/<id>/` so they don't clobber HC.

`extract-at-tables.cjs` now reads `exported_powers/<datasetId>/tables/`
which `export_classes.py` writes; HC's old CoD2 archive
(`raw_data_homecoming-...20251209_7415/`) is no longer referenced by any
script and can be removed.

### Stage C blockers (Rebirth data not yet converted)

- **Pet entities (HC: shipped 2026-05-01; Rebirth: blocked)** —
  pet definitions actually live in `villaindef.bin`, not in the
  `PC_Def_Entities.bin` files this section originally pointed at.
  Both servers ship `villaindef.bin` (HC Parse7, Rebirth Parse6 as
  `VillainDef.bin`). New parser at
  [tools/bin-crawler/bin_crawler/parser/_entities.py](tools/bin-crawler/bin_crawler/parser/_entities.py)
  + exporter at [export_entities.py](tools/bin-crawler/bin_crawler/export_entities.py)
  produce CoD2-shape JSON; [convert-pet-entities.cjs](scripts/convert-pet-entities.cjs)
  is dataset-aware and reads from `tools/bin-crawler/exported_powers/<source>/entities/`
  for HC and `exported_powers/rebirth/entities/` for Rebirth.
  HC `pet-entities.ts` is fully regenerated off the new pipeline (no
  more dependency on the 2019 CoD2 archive). Caveats:
  - **Parse6 levels/tail-flags partially decoded.** Between powers
    and levels in Parse6 there's a 4 × u4 block (`54, 52, 1, 1` —
    same in every record I sampled) and the level sub-record itself
    appears to be inline rather than length-prefixed. The current
    Parse6 path stops after powers and falls back to name-derived
    display + class-name heuristic for `commandable_pet`. Effect:
    Rebirth pets that genuinely set `copy_creator_mods=true` (the
    Storm-style scaling pets) will be miscategorised as not copying.
    Most pets default to `false`, so the dominant case is right.
  - **Rebirth pet data was empty** because the Parse6 effect parser
    only recovered ~0.8% of records. **Resolved 2026-05-02:** Parse6
    effect coverage now sits at **88.0%** (18,976 / 21,559 records,
    107,487 templates extracted). Spot-checked against Power_Bolt,
    Resist_Physical_Damage, Hack, and Granite_Armor — attribs/tables/
    scales all match expected values. The remaining 12% are mostly
    NPC/Mission_Maker stub powers that legitimately have no effects.
    Pet-entities should now convert correctly; re-export of Rebirth
    pet data still needs to be triggered.

    **Root cause:** Parse6 stores effects as a flat struct_array of
    AttribMod records directly under each Power, with no EffectGroup
    wrapper. HC's newer schema added EffectGroup (Tag/DisplayInfo/
    Chance/PPM/Delay/RadiusInner/RadiusOuter/Requires/Flags/EvalFlags)
    as a layer above AttribMod to support procs, AoE chance, and
    requires-gated sub-effects. AIGroups, Redirect, ActivationEffect,
    DurationExpr, and MagnitudeExpr were also HC additions; Parse6
    omits them entirely. The previous parser was reading HC-shaped
    EffectGroups out of Parse6 bytes, which misaligned by 8+ bytes
    on every record.

    **Implementation:** [_powers.py](tools/bin-crawler/bin_crawler/parser/_powers.py)
    adds `_parse_effect_template_parse6` (uses the Ghidra depth=1
    AttribMod descriptor at `0x1408e8a10`: Name / DisplayAttackerHit /
    DisplayVictimHit / DisplayFloat / DisplayAttribDefenseFloat /
    ShowFloaters / Attrib / Aspect / BoostIgnoreDiminishing / Target /
    Table / Scale / ApplicationType / Type / Delay / Period / Chance /
    CancelOnMiss / CancelEvents / 9 bool flags / Requires /
    PrimaryStringList / SecondaryStringList / CasterStackType /
    StackType / StackLimit / StackKey / Duration / Magnitude) and
    `_parse_effects_parse6` (flat struct_array, wraps each AttribMod
    in a synthetic single-template EffectGroup so the downstream
    EffectTemplate-shaped pipeline is unchanged). Also dropped the
    AIGroups/Redirect/ActivationEffect/ModesSuppressed reads in
    `_parse_power_parse6` since none of those fields exist in Parse6.

    Quirk: the descriptor labels Name as a string_array (type
    `0x500009`) but in Parse6 it's stored as a single inline pstring
    with no count prefix. Verified by hand-decoding multiple records.
    **Ghidra audit (2026-05-01)** in [tools/ghidra-audit/](tools/ghidra-audit/)
    extracted the powers.bin descriptor table at `0x1408f04f0` /
    `0x1408f0610` (see `power_effects_parser_report.txt` next to
    `cityofheroes.exe`). The table revealed two definite missing
    fields between `BoostsAllowed` and `Effect` in Parse6:
    `ModesSuppressed` (u4_array) and `AIGroups` (string_array).
    Adding them to the Parse6 tail (`_parse_power_parse6`) lifts
    effect-bearing records from 0 → 173 / 21 559, so the structural
    fix is in the right area — but ~99% of records still misalign.
    A third pass with [FindBinSerializer.java](tools/ghidra-audit/FindBinSerializer.java)
    confirmed `+0x20` of every descriptor row is a **sub-descriptor
    pointer** (recursive into nested struct types), and dumped:
      - **EffectGroup** layout (sub-desc `0x1408ea180`): Tag
        (string_array), DisplayInfo (string), Chance/PPM/Delay/
        RadiusInner/RadiusOuter (5×f4), Requires (string_array),
        Flags (bitfield 0x12), EvalFlags (u4), AttribMod
        (struct_array → recurses into AttribMod descriptor),
        Effect (struct_array → recursive self).
      - **Level** layout (sub-desc `0x1408fb530`): Level (key u4),
        MinLevel, MaxLevel, DisplayNames (string_array), Costumes
        (string_array), XP. Confirms HC's 28-byte sub-record
        omits the Level key field at offset 0.
      - **Power** sub-record (`0x1408f9810`): cat/set/power
        strings + Level + Remove + DontSetStance — matches the
        24-byte sub-record the parser already reads.
      - **VillainDef** top-level (`0x1408fa9f0`): full field-
        serialization order. The parser's `_parse_entity_parse7`
        was using wrong labels (`gender_raw` was `rank_raw`,
        `group_description` was `display_name`, the "mystery"
        u4 between ai_config and powers is `villain_group_raw`).
        Fixed in this pass; semantic only — the HC byte stream
        was already aligning correctly under the wrong names.
    **What's still blocked:** the descriptor SAYS Rank should
    follow Level immediately, but the bytes at that position
    start with a constant `10` that doesn't match Rank's enum.
    HC inserts at least one undocumented field there. Same
    pattern in powers.bin: `TimeToRoot` and `MaxToggleTime`
    are in the descriptor but adding them shifts records into
    garbage.
    **Fourth Ghidra pass (2026-05-01 cont.)** added recursive
    sub-descriptor walks via [FindBinSerializer.java](tools/ghidra-audit/FindBinSerializer.java)
    and revealed that `+0x20` of every descriptor row is a
    **sub-descriptor pointer** (recursive — chase to get any
    nested struct's layout). Extracted full layouts for
    EffectGroup (0x1408ea180), AttribMod (0x1408e8a10), Power
    (0x1408f9810), Level (0x1408fb530), VillainDef (0x1408fa9f0),
    PetCommandStrings, Condition, etc. Discovered EffectGroup's
    second leading slot is actually `DisplayInfo` (string), not
    a u4 — fixed `_parse_effect_group` accordingly. HC unchanged
    at 22 459 / 26 297 = 85.4 % effect coverage.
    Hand-decoding (2026-05-02) revealed the real reason the
    sweep failed: the Parse6 effect schema is fundamentally
    different from HC's. There's no EffectGroup wrapper, no
    AIGroups, no Redirect, no ActivationEffect, and AttribMod
    uses a different field order (depth=1 descriptor at
    `0x1408e8a10` rather than depth=2 at `0x1408ed570`). See
    the resolution write-up at the top of this Stage-C section.
    Reports archived at `G:\Homecoming\bin\win64\live\bin_serializer_report.txt`.
  - **Lore "Support" variants drop out** of the HC export — they
    only carry buff/heal powers (e.g. Cauterize) that the bin
    parser currently exports with empty effects; on HC this is
    a separate parser issue, not the Parse6 one above. Net
    entity count: 533 vs ~612 in the previous CoD2-based file.
  - `export_powers.py` `PLAYER_CATEGORIES` was extended with
    `Mastermind_Pets`, `Kheldian_Pets`, `NPC_Pets`, plus the NPC
    villain-group cats Lore pets borrow from (`Rularuu`, `Objects`,
    `Cabal`, `Council`, `V_Arachnos`, `DevouringEarth`, `Crey`,
    `Rikti`, `Vanguard`, etc. — 19 in total).
- **IO sets data file** — `boostsets.bin` parsing works (3,374 powers
  indexed), but the per-set TS data file (`io-sets-raw.ts`) for Rebirth
  isn't generated yet. The convert pipeline goes through
  [scripts/convert-io-sets.js](scripts/convert-io-sets.js), which reads
  `legacy/js/data/io-sets.js` (no longer shipped). Need a new exporter
  off the boostsets parser that writes Rebirth's set definitions
  directly.

### Stage A — landed 2026-04-30

Rebirth is now a loadable, switchable dataset. Smoke-tested in the dev
server: archetype + powerset dropdowns populate from Rebirth data,
Rebirth-only sets (Wind Control, Water Control, Military Assault, etc.)
show up; switching back to HC round-trips cleanly.

What's in:

- [datasets/rebirth/archetypes.ts](src/data/datasets/rebirth/archetypes.ts) —
  14 ATs (no Sentinel; Rebirth's snapshot predates HC's i25 addition).
  Powerset lists filtered to only the IDs that actually exist under
  `datasets/rebirth/powersets/`. HP tables and damage modifiers are
  HC-cloned for now — the level-1 anchor in `classes.bin` agrees with HC
  values; deeper validation is a follow-up.
- [datasets/rebirth/purple-patch.ts](src/data/datasets/rebirth/purple-patch.ts),
  [granted-powers.ts](src/data/datasets/rebirth/granted-powers.ts) —
  re-export HC's tables. First-pass approximation; both create a static
  import chain from Rebirth → HC, which means Vite won't chunk-split the
  two datasets cleanly. Move them under `src/data/core/` or duplicate the
  data when chunk-splitting becomes important.
- [datasets/rebirth/pet-entities.ts](src/data/datasets/rebirth/pet-entities.ts) —
  empty `{}` placeholder until the `PC_Def_Entities.bin` Parse6 parser
  ships. Effect: Mastermind henchmen / Lore pet damage tables missing.
- [datasets/rebirth/index.ts](src/data/datasets/rebirth/index.ts) —
  assembles the `Dataset` object, mirrors HC's pattern.
- [src/data/dataset.ts](src/data/dataset.ts) —
  `loadDataset('rebirth')` now imports `./datasets/rebirth` instead of
  throwing; `getAllDatasetMetadata()` lists Rebirth.
- [src/types/archetype.ts](src/types/archetype.ts) — `ArchetypeRegistry`
  is now `Partial<Record<ArchetypeId, Archetype>>` because Rebirth ships
  fewer ATs than HC. Two helper functions in
  [src/data/archetypes.ts](src/data/archetypes.ts) and
  [datasets/homecoming/archetypes.ts](src/data/datasets/homecoming/archetypes.ts)
  filter out undefined entries from registry lookups.
- [src/main.tsx](src/main.tsx) — added a `?serverId=<id>` URL-param
  override on top of the existing localStorage pre-peek, useful for
  dev/QA dataset switching.

UI integration:

- [src/components/layout/Header.tsx](src/components/layout/Header.tsx)
  — Build Identity popover's Server `<Select>` is now controlled
  (bound to `build.serverId`) with an `onChange` that confirms before
  switching, persists the new `serverId` to localStorage, and reloads
  with `?serverId=<new>` so the loader boots the right dataset cleanly.
  No in-place dataset swap (Proxy facades + cached React state would be
  fragile across an async load mid-render). Rebirth is no longer
  disabled in `SERVER_OPTIONS`.

Bug fixed during smoke testing:

- [AvailablePowers.tsx](src/components/powers/AvailablePowers.tsx)
  was calling `Object.values(GRANTED_POWER_GROUPS)` at module-load
  time. `GRANTED_POWER_GROUPS` is a dataset-backed Proxy, so this ran
  before `loadDataset()` had resolved and threw "No dataset loaded".
  Converted to a `useMemo` keyed on `build.serverId`. **Pattern note:**
  module-level `Object.{values,keys,entries}` on any data-layer facade
  will fail. Grepped the rest of `src/`; no other module-level offenders
  at the time of writing.

Powerset lookup made dataset-aware (mini-Stage-B):

- [scripts/generate-powerset-index.cjs](scripts/generate-powerset-index.cjs)
  accepts `--dataset <id>`. HC writes to the legacy
  `src/data/powersets/index.ts`; other datasets write to
  `src/data/datasets/<id>/powersets/index.ts`.
- [datasets/rebirth/powersets/index.ts](src/data/datasets/rebirth/powersets/index.ts)
  generated — 271 powersets registered.
- [src/data/powersets.ts](src/data/powersets.ts) routes `getPowerset()`,
  `getAllPowersets()`, `getPowersetsForArchetype()` through
  `getActiveDataset().id`. Both HC and Rebirth registries are imported
  statically (still bundled together; chunk-splitting is a follow-up).

### Smoke-test backlog (not yet exercised)

- Pick a Rebirth-only powerset (e.g. Controller / Wind Control) and add
  several powers — verify tooltips, effects, accuracy/recharge/damage.
- Open Detailed Totals on a Rebirth build — heaviest calc path; touches
  AT tables, purple patch, set bonuses, granted powers.
- Slot enhancements / IO sets — `io-sets-raw.ts` is still HC-shaped;
  expect numerically-wrong set bonuses on Rebirth builds but no crashes.
- Round-trip server-switch HC → Rebirth → HC.

What's in:

- [src/data/dataset.ts](src/data/dataset.ts) — `Dataset` interface,
  `DatasetId`, `getActiveDataset()`, `loadDataset()` (lazy via dynamic
  `import()`), `getAllDatasetMetadata()`. Also defines `ATTableData` and
  `PetTableData` since those shapes are part of the contract.
- [src/data/datasets/homecoming/index.ts](src/data/datasets/homecoming/index.ts) —
  assembles HC's `Dataset` from the migrated files; this is the `default`
  export the lazy loader pulls.
- Migrated into `datasets/homecoming/` (via `git mv` to preserve history):
  `archetypes.ts`, `at-tables.ts`, `purple-patch.ts`, `levels.ts`,
  `granted-powers.ts`, `pet-entities.ts`, `power-lookup.ts`.
- Migrated into `src/data/core/` (engine-level, server-agnostic):
  `stat-definitions.ts`, `stat-colors.ts`, `effect-registry.ts`,
  `incarnate-registry.ts`, `help-topics.ts`.
- Original paths replaced with facades:
  - `archetypes.ts`, `at-tables.ts`, `purple-patch.ts` use **Proxy-based
    runtime delegation** (`getActiveDataset()` resolves at every read).
  - `levels.ts` and the five core/ modules use **`export *` re-export**.
    For levels.ts that's because most of its exports are primitive
    constants JS can't live-bind across module boundaries; for the
    core/ modules that's because they're server-agnostic so no runtime
    swap is needed. See the file headers for the trade-off. If a
    primitive ever needs to actually differ at runtime, that single
    export converts to a getter function (none currently diverge).
- [src/main.tsx](src/main.tsx) — `await loadDataset('homecoming')` before
  `createRoot().render()`.

Validated:

- `npx tsc --noEmit` clean.
- `npx vite build` succeeds. The homecoming dataset is correctly chunk-split
  into its own dynamic bundle (verified by greps for `Blaster_RANGED` and
  `Critical Hit` — present in the dataset chunk only, absent from the main
  chunk).

What's still ahead:

- Migrating the other ~30 data files (powersets, IO sets, pools, incarnates,
  etc.) into `datasets/homecoming/` using the same facade pattern.
- Creating `src/data/core/` and moving engine-only files there.
- Adding `serverId` to the `Build` type and threading through hydration /
  slim/hydrate / share URLs.
- Conversion script `--dataset` flag work.
- Build-store integration for the boot sequence (currently boot just
  hardcodes `loadDataset('homecoming')`).

## Why

Today every file in `src/data/` is implicitly Homecoming data. Adding a second
server means either branching the codebase (no), or running two parallel data
trees behind a runtime selector. The codebase is already well-positioned for
the latter:

- 46 consumer files import from `@/data` via the existing barrel.
- Accessor functions (`getArchetype`, `getPower`, `getIOSet`, …) are the
  ubiquitous shape — direct file imports are rare.
- A handful of files do import directly from specific data files
  (e.g. `from '@/data/at-tables'`); the **facade pattern** below means even
  those don't need to change.

## Target path structure

```
src/data/
├── core/                              Engine-level only — server-agnostic
│   ├── stat-definitions.ts
│   ├── stat-colors.ts
│   ├── effect-registry.ts
│   ├── incarnate-registry.ts          (slot/tier UI config — display structure)
│   └── help-topics.ts
├── datasets/
│   ├── homecoming/
│   │   ├── archetypes.ts ✅, at-tables.ts ✅, levels.ts
│   │   ├── powersets/ overrides/ generated/ powersets.ts
│   │   ├── power-pools(-raw).ts, epic-pools(-raw).ts
│   │   ├── io-sets(-raw).ts, enhancements.ts, enhancement-registry.ts
│   │   ├── set-bonus-index.ts, proc-data.ts, pet-entities.ts
│   │   ├── granted-powers.ts, purple-patch.ts, accolades.ts
│   │   ├── changelog*.ts, power-lookup.ts
│   │   ├── incarnates.ts, incarnate-effects.ts
│   │   ├── incarnate-recipes.ts, incarnate-components.ts, incarnate-salvage.ts
│   │   └── index.ts ✅                 (default export: Dataset)
│   └── rebirth/                       (added later, same shape)
├── dataset.ts ✅                       Dataset interface + active selector + lazy loader
├── archetypes.ts ✅                    Facade — proxies + delegating helpers
├── at-tables.ts ✅                     Facade — proxies + delegating helpers
└── index.ts                           Barrel — re-exports through the facades

✅ = landed in the first slice
```

### Engine vs dataset split — the calls

**Stays in `core/` (server-agnostic):**

- `stat-definitions.ts` — display metadata for stat fields.
- `stat-colors.ts` — palette.
- `effect-registry.ts` — display logic for power effect types.
- `incarnate-registry.ts` — slot/tier UI config, layout rows, abbreviation rules.
  The actual incarnate *powers* and effect values live in the dataset.
- `help-topics.ts`.

**Moves into `datasets/<id>/`:**

Everything else, including a few that initially looked engine-level:

- `levels.ts` — probably hasn't changed across servers, but cheap to silo and
  futureproofs against MAX_LEVEL or slot-grant tweaks.
- `purple-patch.ts` — engine math, but values are tunable.
- `enhancement-registry.ts` — siloed because servers add their own IO sets
  with unique icons and may tweak set bonuses; if this stays in `core/`, we
  have to engineer a way to tell HC sets apart from Rebirth sets, which is
  worse than just letting each dataset own its own registry.
- `incarnate-*` data files — registry stays in core, but the powers, effects,
  recipes, components, and salvage all silo.

## The Dataset interface

A **data record + per-dataset helpers**, not a static accessor surface. Each
dataset's `index.ts` constructs a `Dataset` object whose helpers close over
that dataset's own data records.

The first-slice version covers archetypes and AT tables only; fields will be
added incrementally as more files migrate.

```ts
// src/data/dataset.ts
import type { ArchetypeId, ArchetypeRegistry, Archetype } from '@/types';

export interface ATTableData {
  primaryCategory: string;
  secondaryCategory: string;
  tables: Record<string, number[]>;
}

export interface PetTableData {
  tables: Record<string, number[]>;
}

export type DatasetId = 'homecoming' | 'rebirth';

export interface Dataset {
  id: DatasetId;
  displayName: string;

  archetypes: {
    registry: ArchetypeRegistry;
    epicIds: readonly ArchetypeId[];
    standardIds: readonly ArchetypeId[];
  };

  atTables: {
    archetypes: Record<string, ATTableData>;
    pets: Record<string, PetTableData>;
  };

  // Helpers — closed over this dataset's own data records.
  getTableValue: (archetype: string, tableName: string, level: number) => number | undefined;
  calculateEffectValue: (archetype: string, tableName: string, scale: number, level?: number) => number | undefined;
  calculateIncarnateDamage: (scale: number, tableName: string, archetype: string, level?: number) => number | null;
  getPetTableValue: (petClass: string, tableName: string, level: number) => number | undefined;
  getArchetype: (id: ArchetypeId) => Archetype | undefined;

  // Future fields (will be added as their data files migrate):
  // levels, purplePatch, powersets, powerPools, epicPools,
  // grantedPowerGroups, petEntities, ioSets, setBonusIndex,
  // enhancements, enhancementRegistry, procDatabase,
  // incarnates, incarnateEffects, incarnateRecipes, incarnateComponents,
  // incarnateSalvage, accolades, changelog, lookupPower
}
```

## Active selector with lazy loading

Each dataset ships as a separate chunk via dynamic `import()`. App boot picks
the dataset based on the persisted build's `serverId`, awaits it, then mounts
the React tree. Accessors stay synchronous — the calculation pipeline doesn't
need to change.

```ts
// src/data/dataset.ts (cont.)
let active: Dataset | null = null;
const cache = new Map<DatasetId, Promise<Dataset>>();

export function getActiveDataset(): Dataset {
  if (!active) {
    throw new Error('No dataset loaded. Call await loadDataset(id) before any data access.');
  }
  return active;
}

export async function loadDataset(id: DatasetId): Promise<Dataset> {
  let promise = cache.get(id);
  if (!promise) {
    promise = (async () => {
      switch (id) {
        case 'homecoming': return (await import('./datasets/homecoming')).default;
        case 'rebirth':    throw new Error('Rebirth dataset not implemented yet');
      }
    })();
    cache.set(id, promise);
  }
  const ds = await promise;
  active = ds;
  return ds;
}

export function getAllDatasetMetadata(): Array<{ id: DatasetId; displayName: string }> {
  return [
    { id: 'homecoming', displayName: 'Homecoming' },
    // { id: 'rebirth', displayName: 'Rebirth' },  // enable when implemented
  ];
}
```

## Facade pattern at original file paths

The biggest design choice that crystallized during the first slice: when a
data file moves into `datasets/<id>/`, the **original file path is replaced
by a Proxy-based facade** that forwards all reads to the active dataset.

This means consumers that import directly from a specific data-file path
(e.g. `import { getTableValue } from '@/data/at-tables'`) keep working
unchanged. Without facades, every such import would have to be redirected
through the barrel — a sweeping mechanical change that adds risk without
benefit.

### Wrapper shape

For each migrated data file, the file at the original path becomes:

```ts
// src/data/at-tables.ts (facade)
import { getActiveDataset } from './dataset';
import type { ATTableData, PetTableData } from './dataset';

export type { ATTableData, PetTableData };

const objectProxy = <T extends object>(getter: () => T): T =>
  new Proxy({} as T, {
    get: (_, key) => Reflect.get(getter(), key),
    has: (_, key) => Reflect.has(getter(), key),
    ownKeys: () => Reflect.ownKeys(getter()),
    getOwnPropertyDescriptor: (_, key) => Reflect.getOwnPropertyDescriptor(getter(), key),
  });

// Indexed reads (`AT_TABLES[archetypeId]`, `archetypeId in AT_TABLES`)
// route through the active dataset at call time.
export const AT_TABLES: Record<string, ATTableData> = objectProxy(
  () => getActiveDataset().atTables.archetypes,
);
export const PET_TABLES: Record<string, PetTableData> = objectProxy(
  () => getActiveDataset().atTables.pets,
);

export function getTableValue(archetype: string, tableName: string, level: number) {
  return getActiveDataset().getTableValue(archetype, tableName, level);
}
// … etc — every original export preserved
```

For files that export arrays (`EPIC_ARCHETYPE_IDS`, `STANDARD_ARCHETYPE_IDS`),
use an analogous `arrayProxy<T>(getter)` helper.

The barrel (`src/data/index.ts`) is **untouched** — its existing
`export { … } from './archetypes'` re-exports automatically pick up the
facade behavior.

### Why Proxies and not just functions

Two reasons:

1. **Backward compatibility.** Consumers do `AT_TABLES[id]` and
   `id in AT_TABLES`. Converting these to function calls
   (`getATTables()[id]`) would be a breaking change for ~5 files.
2. **Single source of truth at the data layer.** With facades, the original
   path is the public surface and the dataset folder is the implementation
   detail. New consumers shouldn't import from `datasets/homecoming/*`
   directly.

### Helpers belong with the data

Helpers like `getTableValue` are exposed two ways:

- As **methods on the `Dataset` object** (closed over per-dataset data) — so
  `getActiveDataset().getTableValue(...)` resolves against whichever dataset
  is active.
- As **module-level functions on the facade file** that delegate to the
  active dataset.

This keeps the implementation per-dataset (Rebirth could ship its own
`getTableValue` if its tables have different normalization rules), while
keeping the public surface stable.

## Build-side touchpoints (not yet done)

- **`Build` type**: add `serverId: DatasetId` (default `'homecoming'`).
- **Hydration migration**: missing field → `'homecoming'`.
- **`slimBuild` / `hydrateBuild`**: pass `serverId` through.
- **Share URLs and Supabase rows**: include `serverId`.
- **App boot sequence**: read persisted `serverId` → `await loadDataset(id)`
  → mount React tree. Show a splash/loading state during the load.
  *(Currently `main.tsx` hardcodes `loadDataset('homecoming')`.)*
- **Dataset switch UX (baseline)**: if the current build has any picks,
  show a "this will clear your build" confirm. On confirm, reset build then
  call `loadDataset` for the new id. **Inference-mapping** (carry the build
  across servers by mapping similar ATs/sets) is future work — most
  archetypes and sets are similar across servers, so it's tractable but out
  of scope for the infrastructure pass.

## Conversion / pipeline scripts (not yet done)

These currently hardcode `src/data/...` write paths. They need a `--dataset`
(or `--server`) flag mapping to `src/data/datasets/<id>/...`:

- `scripts/convert-powerset.cjs`
- `scripts/convert-epic-pools.cjs`
- `scripts/convert-pool-powers.cjs`
- `scripts/convert-incarnate-effects.cjs`
- `scripts/extract-at-tables.cjs`
- `scripts/convert-io-sets.js`
- `scripts/convert-pet-entities.cjs`
- `scripts/bulk-import-mids.ts`

Default `--dataset homecoming` so existing muscle memory keeps working.
`scripts/migrate-to-layered.cjs` was a one-shot and doesn't need the flag.

The bin-crawler exporter (`tools/bin-crawler/bin_crawler/export_powers.py`)
already takes `--assets-dir`, so it's mostly there — what's missing is "which
dataset folder do I write to."

## Detecting Mids file dataset (secondary)

Mids `.mxd` files presumably encode which server they target somewhere in the
file header. Out of scope for the infrastructure pass; the behavior on
detection mismatch is the same as a manual server switch (warn-and-clear, or
inference-map later).

## Migration approach

**Incremental, file-group at a time** — the facade pattern means each
migration is independently shippable. The first slice (archetypes +
at-tables) validated this: tsc clean, build clean, dataset chunk-split
correctly, no consumer code changed.

The original draft of this plan suggested "one big mechanical PR" because the
assumption was that consumers would have to be redirected through the barrel.
The facade pattern eliminates that requirement, so incremental wins on review
size and risk.

### Order of work

1. **✅ Plumbing**: `Dataset` interface, `getActiveDataset()`, `loadDataset()`,
   `getAllDatasetMetadata()`. — **Done.**
2. **✅ First migrated members**: `archetypes.ts` + `at-tables.ts` moved into
   `datasets/homecoming/`, original paths replaced with Proxy facades. — **Done.**
3. **Boot wired**: `main.tsx` calls `loadDataset('homecoming')` before render. —
   **Done (hardcoded id; will read from `Build.serverId` once that exists).**
4. **Migrate remaining HC files** in groups, by interface section:
   - **✅ `levels.ts` + `purple-patch.ts`** — siloed (purple-patch via Proxy
     facade, levels via `export *` re-export per the primitive-binding
     limitation). — **Done.**
   - **✅ Self-contained powerset-adjacent files** — `granted-powers.ts`
     (Proxy facade + types in `dataset.ts`), `pet-entities.ts` (Proxy
     facade for the 24K-line PET_ENTITIES + types in `dataset.ts`), and
     `power-lookup.ts` (`export *` re-export — pure composition over
     already-faceted accessors). — **Done.**
   - **⏸ Powersets directory tree** — `powersets/`, `overrides/`,
     `generated/`, `powersets.ts`, `power-pools(-raw).ts`,
     `epic-pools(-raw).ts`. **Deferred** until a second dataset's data
     actually exists. The composed `powersets/X/Y/Z.ts` files import
     from `@/data/generated/...` and `@/data/overrides/...` via absolute
     paths — moving the directories into `datasets/homecoming/` would
     require updating ~600 import sites inside the tree. The pragmatic
     trade-off: do this when there's a Rebirth dataset to actually
     receive the parallel `datasets/rebirth/{powersets,generated,
     overrides}/` trees. The convert-script `--dataset` flag is
     already in place ([scripts/_dataset-paths.cjs](scripts/_dataset-paths.cjs)),
     so that's one fewer thing to change at fork time.
   - Enhancements — `io-sets(-raw).ts`, `enhancements.ts`,
     `enhancement-registry.ts`, `set-bonus-index.ts`, `proc-data.ts`.
   - Incarnates — `incarnates.ts`, `incarnate-effects.ts`,
     `incarnate-recipes.ts`, `incarnate-components.ts`,
     `incarnate-salvage.ts`.
   - Misc — `accolades.ts`, `changelog*.ts`.
5. **✅ Create `src/data/core/`** and move engine-only files there. — **Done.**
   Moved `stat-definitions.ts`, `stat-colors.ts`, `effect-registry.ts`,
   `incarnate-registry.ts`, `help-topics.ts`. Used `export *` re-export
   facades at the original paths so the 8 external consumers + 3 internal
   `src/data/` references didn't need to change. Internal `core/` cross-
   reference (`effect-registry → stat-colors`) and `stat-definitions →
   stat-colors` switched to relative imports.
6. **✅ Update conversion scripts** to take `--dataset` (default `homecoming`). — **Done.**
   - New shared helper [scripts/_dataset-paths.cjs](scripts/_dataset-paths.cjs)
     parses the flag and exposes `datasetPath(id, ...sub)` (for migrated
     files, routes to `src/data/datasets/<id>/...`) and `dataPath(...sub)`
     (for not-yet-migrated files, routes to `src/data/...`). Validates
     against a `KNOWN_DATASETS` set.
   - `extract-at-tables.cjs` switched to `datasetPath` because at-tables
     is migrated — running it now writes into the dataset folder, NOT
     clobbering the runtime facade at `src/data/at-tables.ts`.
   - All other generators (`convert-powerset.cjs`, `convert-epic-pools`,
     `convert-pool-powers`, `convert-incarnate-effects`, `convert-io-sets`,
     `convert-pet-entities`) now accept `--dataset` and use `dataPath`
     until their data files migrate. Inline parsing in `convert-io-sets.js`
     since it's ESM and can't `require` the cjs helper.
   - Orchestrators (`convert-all-powersets.cjs`,
     `reconvert-redirect-powersets.cjs`) parse and forward `--dataset`
     to their `convert-powerset.cjs` child invocations.
   - Both flag syntaxes work: `--dataset rebirth` and `--dataset=rebirth`.
     Unknown ids throw with the list of known ones.
7. **✅ Add `serverId` to `Build`**, hydration migration, slim/hydrate plumbing,
   share-URL plumbing. — **Done.**
   - `Build` interface: new `serverId: 'homecoming' | 'rebirth'` field;
     `createEmptyBuild()` defaults to `'homecoming'`.
   - `slimBuild()` / `hydrateBuild()` round-trip the field, defaulting
     legacy v2/v3 exports to `'homecoming'`.
   - `SlimBuildData` shape gains an optional `serverId` for backward compat.
   - Export envelope bumped to **v4**; `importBuild()` accepts v2/v3/v4.
     v2/v3 imports default to Homecoming via the hydrate fallback above.
   - Zustand `onRehydrateStorage` migration fills in `serverId` on
     persisted builds that predate the field.
   - Game-import (`utils/game-import/importer.ts`) and Mids-import
     (`utils/mids-import/importer.ts`) constructors set
     `serverId: 'homecoming'` since neither source currently carries
     a detectable server identifier.
8. **✅ Wire boot to `Build.serverId`** instead of the hardcoded
   `'homecoming'`. — **Done.** `main.tsx` now pre-peeks at
   `localStorage['coh-planner-build']` to read the persisted build's
   `serverId` BEFORE Zustand rehydrates and React mounts. Falls back to
   `'homecoming'` for fresh visitors and any parse / shape failure.
9. **🚧 Rebirth dataset materialization** — see Status section above.
   - **✅ Stage C (mostly done):** raw Rebirth data converted into TS
     files under [src/data/datasets/rebirth/](src/data/datasets/rebirth/).
     Powersets, pools, epic pools, incarnate effects, AT tables all
     landed. Pet entities + IO sets data still pending (need new
     bin-crawler exporters).
   - **✅ Stage A (landed 2026-04-30):** Rebirth is a loadable
     dataset. `loadDataset('rebirth')` works; UI server picker switches
     between HC and Rebirth with reload-based reset; powerset lookup
     routes through the active dataset's registry. Smoke-tested in the
     dev server.
   - **Stage B (not started):** the deferred powersets-tree migration.
     Move HC's `powersets/`, `overrides/`, `generated/` into
     `datasets/homecoming/`. ~600 import sites to update inside the
     tree. With Rebirth's parallel tree already at
     `datasets/rebirth/{powersets,overrides,generated}/`, this is now
     pure mechanical churn for HC. **Recommended order:** finish
     deeper Rebirth smoke-testing (powers/IO/calculations) first so
     any latent architectural issues surface before the large-scale
     rename.
   - Cross-server build inference mapping and full dataset-switch UX
     polish (preserve build name across switches, etc.) come after.

## Open questions / decisions deferred

- **Cross-dataset build browsing on `/builds`** — if the future shared-builds
  page wants to list builds from both servers without forcing both datasets
  to load, the listing page should rely only on `getAllDatasetMetadata()` +
  per-row `serverId`, not on accessor calls. Detail pages (`/builds/$id`)
  would `loadDataset(serverId)` for the build they're rendering.
- **Final shape of `Dataset` interface** — fields are being added
  incrementally as files migrate. The shape now is just the at-tables /
  archetypes minimum.
- **Per-dataset CHANGELOG.md / README.md** inside each `datasets/<id>/`
  folder — probably worth having for dataset-specific notes and override
  rationale, but not blocking.
- **Proxy hot-path performance** — the calculation pipeline calls
  `getTableValue` heavily during full build evaluation. The current facade
  routes every call through `getActiveDataset()` and then through a closure.
  Both are cheap, but worth a smoke test on a complex build (e.g. open
  DetailedTotalsModal on a level-50 build with full slotting and watch for
  lag) before committing to the pattern at scale. If a hot-path issue
  surfaces, hot-path callers can locally bind `const ds = getActiveDataset()`
  at function entry to amortize the lookup.

## Validation plan

Per migrated group:

- `npx tsc --noEmit` clean.
- `npx vite build` succeeds; the homecoming chunk grows by the migrated
  data's size, the main chunk shrinks by the same.
- Existing build hydrates correctly.
- All routes render: `/`, `/builds`, `/builds/$id`, `/settings`.
- A representative calculation (e.g. `calculateCharacterTotals` on a saved
  build) produces the same output as before the migration.

For the first slice (already done):

- `tsc --noEmit` ✅
- `vite build` ✅
- Dataset chunk-split confirmed ✅
- Runtime smoke test on the dev server: **pending** (recommended before
  committing the slice).

## Out of scope for this work

- ~~Adding the actual Rebirth dataset (no data yet).~~ **In progress** —
  see Stage C in the status section. Bulk of TS data files exist; pet
  entities and Dataset wiring still pending.
- Server picker UI on new-build flow.
- Cross-server build inference mapping.
- ~~Bin-crawler parser changes for Rebirth's binary format divergences.~~
  **Done in this pass:** Parse6 paths added to `_boostsets.py` and
  `_classes.py`; new `export_classes.py` exporter; BinResolver pigg
  globbing extended to match Rebirth's `z_*_bin.pigg` naming. Pet-entities
  parsing (`PC_Def_Entities.bin`) is the remaining bin-crawler work.
- Mids `.mxd` server detection.

---

## Conditional Effects + Mechanic Adjusters

The CoH bin format encodes per-template state gates (RPN expressions like
`Drowning target.ownPower? &&`, `kStealth source> 0.5 > &&`,
`kDefensiveAdaptation Source.Mode?`). These describe conditional bonuses
that apply only when the gate evaluates true. Pre-existing converter logic
silently filtered them out of base damage/effects (correct — they shouldn't
inflate base numbers). This workstream surfaces them as user-facing toggles
("Mechanic Adjusters") so the player can see what their build does *with*
Domination active, *with* drowning, etc.

### Data layer (landed on main, commit 7716ffe67)

- [scripts/convert-powerset.cjs](scripts/convert-powerset.cjs) gained
  `_classifyConditionalGate`, `_isUntoggleableGate`, `collectConditionalsGrouped`,
  `extractConditionalEffects`, `_annotateConditionalGroups`,
  `_collectBaseNegatedPredicates`. Recognized gate patterns:
  - `<dotted.power.name> {target|source}.ownPower(Num)?` — power-presence
    check (with stack-count form for `ownPowerNum? N ==`)
  - `kStealth source>` — Dominator powers in Rebirth → "Domination Active";
    everywhere else → "Stealthed"
  - `kEngaged` — "In Combat"
  - `k<Name> {Source|source|Target|target}.[Mm]ode?` — generic mode toggle
    (Bio Armor adaptations, Dual Blades combo levels, Wind Control's
    Clear Skies, DE Avatar Infection target states, etc.)
- ~80 untoggleable game-state patterns are filtered (target archetype
  scaling, NPC type/rank checks, costume/alignment scripts, internal
  ToHit roll branches, FX-only conditionals, account/auth gates, etc.)
- Each emitted entry has:
  - `id` — stable identifier
  - `label` — human-readable; auto-prettified from camelCase + a small
    curated override map (`beam_rifle_debuff` → "Disintegrating",
    `tidal_power` → "Tidal Power")
  - `scope: 'global' | 'per-power'` — derived from gate side. `source` =
    global (caster state shared across all powers); `target` = per-power
  - `group?: string` — set when entries are mutually exclusive (Bio Armor
    adaptations, Tidal Power stack tiers, Combo Level N). Render as
    radios.
  - `mode?: 'additive' | 'replace'` — set to `replace` when the base has
    a sibling template carrying the negated form of the conditional's
    predicate (Suffocate's "if NOT drowning" -Def vs "if drowning" -Def
    are mutex variants); `additive` (default) means the conditional adds
    a separate cast/instance on top of base
  - `damage?` and `effects?` — same shape as the power's base fields
- Coverage: 225 Rebirth + 194 HC powers carry `conditionalEffects`. Top
  labels: Stealthed/Domination Active, Defensive/Offensive/Rested
  Adaptation, Insight, Disintegrating, Combo Level 1/2/3, Drowning,
  Tidal Power (N stacks), Perfection of Body/Mind/Soul, Time Crawl Debuff,
  StormBlast InStormCell, Energy Store, Contaminated, etc. 19 remaining
  generic "Conditional" labels are real edge-case mechanics (mostly NPC
  mission scripts) that can be curated case-by-case if needed.

### Type extension

- [src/types/power.ts](src/types/power.ts) — new `ConditionalEffect`
  interface; `Power` gained `conditionalEffects?: ConditionalEffect[]`
- [src/types/index.ts](src/types/index.ts) re-exports `ConditionalEffect`

### State + selectors (landed)

- [src/stores/uiStore.ts](src/stores/uiStore.ts) gained
  `mechanicAdjusters: Record<string, boolean>` (per-power state, keyed
  `<powerName>:<id>`) and `globalAdjusters: Record<string, boolean>`
  (caster-state, keyed `<id>`). Both persisted via Zustand persist.
- New actions: `setMechanicAdjuster`, `toggleMechanicAdjuster`,
  `clearMechanicAdjusters`, `setGlobalAdjuster`, `toggleGlobalAdjuster`,
  `setGlobalAdjusterGroup` (atomic mutex update for radio groups).
- New selector hooks: `useMechanicAdjuster(powerName, id, defaultActive)`
  and `useGlobalAdjuster(id, defaultActive)`.

### Merger (landed)

- [src/components/info/powerDisplayUtils.ts](src/components/info/powerDisplayUtils.ts)
  — `selectActiveConditionals(power, mechanicAdjusters, globalAdjusters,
  atInherentState)` filters the conditional list by current toggle state;
  `applyActiveConditionals(power, active)` returns a new Power object
  with damage entries concatenated and effects shallow-merged according
  to each entry's `mode`.
- `AT_INHERENT_CONDITIONAL_IDS` set + `ATInherentState` type route ids
  that overlap with the Header's existing dashboard toggles (currently
  just `domination`) through their established state hooks instead of
  the new adjuster maps.

### UI (landed)

- [src/components/info/MechanicAdjusters.tsx](src/components/info/MechanicAdjusters.tsx)
  — renders below the per-target stacking slider, above the Power Effects
  display. Partitions entries into mutex groups (radio + clear button)
  vs singletons (checkbox). Routes state by scope. Filters out
  `AT_INHERENT_CONDITIONAL_IDS` so AT-level mechanics live only in the
  Header. Style is bare; visual treatment will land with the larger
  InfoPanel redesign.
- [src/components/info/InfoPanel.tsx](src/components/info/InfoPanel.tsx)
  — `effectivePower` is now a stack of transformations: snipe-quick swap
  → conditional merge. Damage calc + effects rendering downstream both
  consume the merged power object so toggles reflect in displayed numbers.

### Pending under this workstream

- [x] Multi-instance mez display — shipped 2026-05-03 (commit 8ed898bff).
  `applyActiveConditionals` returns `{ power, extraInstances }`; additive
  collisions render as dimmed "+ Hold Mag X (Ys) (from <Source>)" rows
  beneath the base. No Power-type shape change required — multi-instance
  is display metadata.
- [x] Surface "additive" conditional contributions in the InfoPanel —
  shipped 2026-05-03 (MechanicAdjusters ContributionHint + the new
  inline extra-instance rows above).
- [x] AT-inherent ID map audit — completed 2026-05-03; only `domination`
  exists as a binary-level gate. Other AT-inherents (Fury, Scourge, etc.)
  use hardcoded calc helpers, not conditional templates. Documented in
  the AT-mechanic alignment section.
- [x] Curate the 19 remaining "Conditional" generic labels — shipped
  2026-05-03 (extended `_isUntoggleableGate` for Grounded, recent-mez,
  break-free, low-HP procs; replaced @CustomFX reject with
  `_stripIgnoredClauses`). Down from 19 to 0 generic Conditional rows.
- [ ] Verify the `mode` heuristic catches all mutex cases. Detection
  currently only fires on `<X> ownPower? !` form; other negated
  predicates (e.g. `kStealth source> .9 <` for "not hidden") might
  represent mutex base sides we don't auto-detect

---

## InfoPanel visual redesign

**Complete (2026-05-03).** All six structural blocks from the user's
outline shipped, language pass to in-game terminology applied, and
several regressions caught and fixed along the way. The panel is now
production-ready; further polish is incremental rather than structural.

### Final structure

1. Header (icon, name, lock)
2. Tags row — [TagsRow.tsx](src/components/info/TagsRow.tsx) — chip-style
   render of `power.shortHelp` colored by category
   (debuff/buff/mez/damage/other/neutral)
3. Tags Block — [PowerInfoBlocks.tsx](src/components/info/PowerInfoBlocks.tsx)
   `TagsBlock` — Power Type / Target Type / Allowed Enh as compact
   key-value rows (Foe → "Enemies", set categories preferred over basic
   enhancement types)
4. Mechanic Adjusters — [MechanicAdjusters.tsx](src/components/info/MechanicAdjusters.tsx)
   — toggles for singletons, radios for groups, "+ extra X instance"
   collision hints for additive conditionals, AT-inherent ids routed
   through Header state
5. Damage Block — [DamageBlock.tsx](src/components/info/DamageBlock.tsx)
   — DMG/DPA/DPS/DPE mode toggle in-block, three-tier table with
   per-tick + DoT-total rows, cap-relative segmented bar, cycle-time
   metric
6. Power Effects Block — [SharedPowerComponents.tsx](src/components/info/SharedPowerComponents.tsx)
   `RegistryEffectsDisplay` — sectioned MEZ / BUFFS / DEBUFFS / SPECIAL
   with neutral subheaders. SPECIAL surfaces grant procs and effect
   procs from the new `power.specialEffects` field
7. General Stats Block — [PowerInfoBlocks.tsx](src/components/info/PowerInfoBlocks.tsx)
   `GeneralStatsBlock` — Activation / Rech Time / End Cost / Accuracy /
   Pwr Range / Effect Area / Attack Type
8. Description — bottom paragraph, header dropped per outline

### Language pass

Stat labels updated to compact in-game terminology so the column
doesn't wrap:

| Before | After |
|---|---|
| Endurance | End Cost |
| Recharge | Rech Time |
| Range | Pwr Range |
| Cast Time | Activation |
| Effect Dur | Effect Dur (kept) |
| Damage (mode) | Average DMG |

Damage type abbreviations shifted from single letters (S/L/E/N) to
community-standard short forms (Smash / Leth / Energy / Neg / Psi /
Tox) so they're unambiguous at a glance.

### Bug fixes caught along the way

- **DoT 5×tick**: pure-DoT InfoPanel rollup was double-counting the
  per-tick damage in `totalDmgBase`. Fixed by detecting
  `abs(base - dot.base) <= 0.001` and using only `dotTotal` in that case.
- **Accuracy "Final" tooltip**: title attr on the accuracy cell now
  explains the level-differential adjustment ("vs +3 target — effective
  base ToHit 48.0%") instead of leaving the user to decode a con arrow.
- **Redundant prefix in Debuff/Status Res children**: group header
  already says "Debuff Res", so children no longer repeat it.
- **Power-grant proc labels**: `Grant_Power` chance templates classified
  as `kind: 'grant'` with `params.power_names[0]` derivation — Insight
  / Contaminated / Drowning instead of raw "Grant_Power".
- **False-positive SPECIAL rows**: template-level `tick_chance` is the
  ToHit Roll, not a proc gate; only EG-level `chance < 1` counts now
  (no more "+99.80% chance to Base_Defense" on Slash).
- **Fiery Embrace Fire leak (Rebirth)**: Parse6's flat AttribMod schema
  doesn't capture the `chance: 0.0` gating that HC uses to suppress
  the FE bonus template. Convert-layer `_filterFieryEmbraceBonus`
  strips Fire entries on `Melee_Damage`-table damage on non-fire-themed
  powersets. Cleaner long-term fix is in the parser.
- **Melee/Ranged misclassification**: range=7 melee attacks (Barrage,
  Slash, Boxing) were labeled "Ranged" because the threshold was `>5`.
  Now uses the damage entry's table prefix (`Melee_Damage` vs
  `Ranged_Damage`) as the primary signal.

### Concerns deferred (not blocking)

- ~~Multi-tier mez with secondary magnitude tiers needs an array shape~~ —
  resolved 2026-05-03 via display-metadata route (extra-instance rows)
  instead of a Power-type shape change
- **Tooltip-level convention** (game uses power's design level vs
  Sidekick's character level) — see Open Tasks
- **Range row for self-targeted powers (range=0)** — currently shown
  as "Single Target" in Effect Area; range row is omitted by the
  General Stats Block when range is 0
- **Pet/redirect power info** — kept in the existing format per user
  direction; not redesigned

---

## AT-mechanic alignment

The Header's mechanic bar already owns AT-inherent toggles
(`dominationActive`, `stalkerHidden`, `furyLevel`, `scourgeActive`,
`criticalHitsActive`, `containmentActive`, `sentinelCritActive`,
`opportunityLevel`, `vigilanceTeamSize`, `supremacyActive`). With the
conditional-effects work, the binary-level gates that describe some of
these same mechanics (especially `kStealth source>` on Dominator powers
= Domination) would otherwise show up as redundant per-power toggles in
MechanicAdjusters. Resolved via `AT_INHERENT_CONDITIONAL_IDS` (see
Conditional Effects section).

### Audit (2026-05-03)

Surveyed every conditional `id` emitted across HC + Rebirth generated
powersets. The only ID that overlaps with an existing Header AT-inherent
toggle is `domination` — which is already routed. Fury, Scourge, Critical
Hit, Containment, Sentinel Crit, Opportunity, Vigilance, and Supremacy
have **no** corresponding binary-level conditional gates; their math is
implemented in the hardcoded `calculate*Damage` helpers and surfaced via
Header state directly. So `AT_INHERENT_CONDITIONAL_IDS = { 'domination' }`
is currently complete for the data we have.

Two adjacent ID classes worth noting (not AT-inherent, no action required):
- **Kheldian form gates** (`peacebringer_blaster_mode`,
  `peacebringer_tanker_mode`, `warshade_blaster_mode`) — the binary
  encodes "this power only fires in form X." They're scope='global'
  conditionals today, which is semantically correct (one global "I'm in
  Bright Form" toggle). If the planner later grows a first-class form-
  switching surface, these should route through that.
- **Power-presence cross-deps** (`master_brawler`) — "if you have Master
  Brawler slotted, this power gets extra effects." Currently a global
  conditional. Could later be auto-derived from build slotting rather
  than requiring a manual toggle.

### Pending

- [ ] Bigger refactor candidate: replace the existing hardcoded
  AT-mechanic damage calcs (`calculateScourgeDamage`,
  `calculateContainmentDamage`, `calculateFuryDamage`,
  `calculateCriticalHitDamage`, `calculateAssassinationDamage`,
  `calculateOpportunityCritDamage`) with reads from the binary's
  conditional templates. Same data source for both Header toggles and
  per-power displays — eliminates the chance of math drift between the
  two surfaces. Low priority; the existing math is well-tested.

---

## Calc accuracy

### Shipped to main (commit 7c17fe809)

- Conditional-aggregation fix in convert-powerset.cjs (corrects ~217 HC
  Beam Rifle / Disintegration powers + the entire Suffocate / Water
  Control family on Rebirth)
- Parse6 mez mag/duration: DurationExpr/MagnitudeExpr empty-array
  placeholders now read correctly (was off-by-8-bytes zeroing both fields)
- Soul Drain slider check: per-target `maxTargets` now wins over
  `maxStacks` self-cap when both are present

### Pending

- [x] **DoT 5×tick bug**: pure-DoT powers showed
  `calculatedDamage.base + dotTotal` in the DPS rollup, double-counting one
  tick (per-tick value lives in both `result.base` and `result.dotDamage.base`
  for pure-DoT, so adding both gave 5× per-tick). Fixed in
  [src/components/info/InfoPanel.tsx](src/components/info/InfoPanel.tsx)
  by detecting pure-DoT (`abs(base - dot.base) <= 0.001`) and using only
  `dotTotal` in that case. The per-row InfoPanel rendering and damage bar
  were already correct.
- [x] **Tooltip-level convention** — documented 2026-05-03 as intentional.
  Sidekick uses character level for all displayed stats (matches Mids).
  CoH's in-game tooltips use the power's design level (e.g. Suffocate at
  L26 even when your character is L50), which produces different numbers.
  The character-level convention is correct for build planning — values
  reflect what the build actually does in combat. If users surface
  confusion against in-game tooltips, can add a "Show game tooltip" mode
  later, but no current requests warrant the dual-rendering.
- [x] **Accuracy "Final" debuff** — confirmed it was the
  level-differential / purple-patch math (factor = baseToHit/0.75 ≈ 0.64
  vs +3 con drops 90% → 57.6%); not a real debuff. The con-arrow next
  to the value already encoded the offset, but the connection wasn't
  obvious. Fixed 2026-05-03 in [SharedPowerComponents.tsx](src/components/info/SharedPowerComponents.tsx)
  by adding a `title` tooltip on the accuracy "Final" cell explaining
  the level-differential adjustment, the effective base ToHit %, and
  the ToHit bonus contribution if any.
- [x] **`damageModifier` field is fallback metadata, not dead code** —
  audited 2026-05-03. Confirmed: `calculateActualDamage` (the generic
  path) uses `archetype.stats.damageModifier`; `calculateDamageWithATTable`
  (the canonical AT-tabled path) does not. Modern converted powers
  always have a `table` field and route through the AT-tabled path,
  bypassing damageModifier. The fallback path still fires for legacy /
  utility powers without table data (some summons, ammo redirects).
  Documented inline in [damage.ts](src/utils/calculations/damage.ts).

---

## Rebirth scalar-table verification

Originally framed as **"Original Domination"** assuming Rebirth's
Dominator inherent worked differently from HC's. Audit (2026-05-03)
shows that's not the case — every player-facing AT inherent on Rebirth
shares the exact same mechanic and description text as HC's modern
version. Domination has been meter-based since Issue 7 on both servers;
HC never reverted it to a passive aura. The audit-confirmed diff
between HC and Rebirth `archetypes.ts` reduces to:

- Sentinel (Opportunity) is HC-only — Rebirth predates i25
- Cosmic Balance / Dark Sustenance per-AT lists mention Sentinel on HC,
  omit it on Rebirth (correct — no Sentinel target to scale off)

The actual remaining gap is **numerical**, not mechanical: Rebirth's
`archetypes.ts` HP tables, damage modifiers, and `buffDebuffModifier`
values are inherited from HC. The file's own comments already flag
this:

> HP tables / damage modifiers are inherited from HC for now. They
> should be cross-checked against Rebirth's `classes.bin` named_tables
> (Melee_Damage[0]/Ranged_Damage[0]/etc.) — minor numerical divergence
> wouldn't be surprising.

### Audit findings (2026-05-03)

`classes.bin` exported from Rebirth's `v2_serverbin.pigg` and diffed
against HC's tables. Pigg resolver pattern extended to match
`*serverbin*.pigg` (Rebirth ships server-side bins separately;
HC keeps everything in one `bin.pigg`).

**Meaningful divergence — only on Tanker and Brute:**

| AT | Table | HC[L50] | Rebirth[L50] | Δ |
|---|---|---|---|---|
| Tanker | Ranged_Damage | -44.49 | -27.81 | -37.5% |
| Tanker | Melee_Damage | -52.83 | -44.49 | -15.8% |
| Tanker | Ranged_Buff_Dmg | 0.100 | 0.070 | -30.0% |
| Tanker | Ranged_Buff_ToHit | 0.100 | 0.070 | -30.0% |
| Tanker | Ranged_DeBuff_ToHit | -0.100 | -0.070 | -30.0% |
| Tanker | Ranged_Buff_Def | 0.075 | 0.065 | -13.3% |
| Tanker | Ranged_Res_Dmg | 0.075 | 0.065 | -13.3% |
| Tanker | Melee_Buff_Dmg | 0.0875 | 0.100 | +14.3% |
| Brute | Ranged_Damage | -41.71 | -27.81 | -33.3% |
| Brute | Ranged_Buff_Def | 0.0875 | 0.065 | -25.7% |
| Brute | Melee_HealSelf etc. | 160.6 | 149.9 | -6.7% |

These reflect HC's post-i24 Tanker/Brute reworks that Rebirth predates.
All other player ATs (Blaster, Controller, Defender, Scrapper,
Corruptor, Dominator, Mastermind, Stalker, Peacebringer, Warshade,
Arachnos Soldier/Widow) have **no meaningful divergence** — values
match HC within float-precision noise (typically ~10⁻⁶ relative).

**Patch:** ran [extract-at-tables.cjs](scripts/extract-at-tables.cjs)
with `--dataset=rebirth` to regenerate
[src/data/datasets/rebirth/at-tables.ts](src/data/datasets/rebirth/at-tables.ts)
from the now-available exported tables. (The file was already at
Rebirth values from earlier work — the regen was a no-op confirmation
that the per-AT scaling tables are correct.) Tanker and Brute calc
results on Rebirth builds now match what the live game reports for
those ATs.

**HC-only tables** (Melee_DamageUniqueness, Melee_IncarnateProcDamage,
Melee_InherentDamage, etc.) are i25+ HC additions; Rebirth correctly
omits them. No action needed.

**Rebirth-only tables** (Melee_SSDamage, Ranged_SSDamage on EATs) are
genuine Rebirth additions; included in the regenerated file.

### Follow-up

[archetypes.ts](src/data/datasets/rebirth/archetypes.ts) hardcodes per-AT
`baseHP` / `maxHP` scalars and HP curve tables (`HP_TABLE_BRUTE` etc.)
inherited from HC. The exported `classes.bin` JSON doesn't include
these `attrib_max` fields — only `named_tables`. The `Melee_Buff_MaxHP`
table differs by ~6.7% between HC and Rebirth at L50, suggesting the
underlying HP cap values likely diverge similarly. Verifying requires
extending [export_classes.py](tools/bin-crawler/bin_crawler/export_classes.py)
to dump `attrib_max` fields. Lower priority than the AT scaling tables
(the per-AT HP cap is a single number affecting cap calc, not every
power's display); deferred.

---

## IO sets exporter for Rebirth

`boostsets.bin` parsing already works (3,374 powers indexed for
Rebirth), but the per-set TS data file
(`src/data/datasets/rebirth/io-sets-raw.ts`) isn't generated.
[scripts/convert-io-sets.js](scripts/convert-io-sets.js) reads
`legacy/js/data/io-sets.js` (no longer shipped) — needs a new exporter
off the boostsets parser that writes Rebirth's set definitions
directly.

### Audit findings (2026-05-03)

Diffed Rebirth's `boostsets.bin` (210 sets) against HC's curated
`io-sets-raw.ts` (227 sets):

- **210 sets are shared** between HC and Rebirth — Rebirth's full
  set list is a strict subset of HC's
- **17 sets are HC-only** — post-i24 additions: Sentinel ATOs
  (Opportunity Strikes, Sentinels Ward, Superior variants), plus
  Bombardment, Cupids Crush, Hypersonic, Ice Mistral's Torment,
  Sudden Acceleration, Synapse's Shock, Power Transfer, Preemptive
  Optimization, Artillery, Launch, Experienced Marksman
- **0 Rebirth-only sets** — Rebirth has nothing HC doesn't

### Implementation (shipped)

[scripts/extract-rebirth-io-sets.cjs](scripts/extract-rebirth-io-sets.cjs)
shells into Python to dump set names from Rebirth's `boostsets.bin`,
loads HC's `io-sets-raw.ts`, filters to keys present in Rebirth, and
emits [src/data/datasets/rebirth/io-sets-raw.ts](src/data/datasets/rebirth/io-sets-raw.ts)
with the 210 matched sets. Punctuation normalisation handles
`gaussians_synchronized_fire-control` ↔ `gaussians_synchronized_firecontrol`.

[src/data/io-sets.ts](src/data/io-sets.ts) now imports both raw files
and resolves the active dataset's registry via `getActiveDataset()`,
caching the transform per dataset id. HC users see 227 sets; Rebirth
users see 210.

### Caveat / follow-up

Bonus values come from HC's Mids-curated data and may have minor
numerical drift from Rebirth's actual i24-era tier values. Building a
Parse6 parser for `boost_effect_above.bin` / `boost_effect_below.bin`
/ `boost_effect_boosters.bin` would let us extract Rebirth's actual
bonus tiers from binary; that's significant Parse6 work and is
deferred. If a specific set is reported with wrong numbers we can
audit ad-hoc.
