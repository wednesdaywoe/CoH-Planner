# Multi-Dataset Support Plan

Plan for restructuring the data layer to support multiple CoH server datasets
(Homecoming, Rebirth, future others). The goal is **infrastructure only** —
silo all current data as the `homecoming` dataset, with the plumbing ready to
drop a second dataset in alongside when its data is available.

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
