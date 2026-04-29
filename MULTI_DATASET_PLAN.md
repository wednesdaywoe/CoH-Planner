# Multi-Dataset Support Plan

Plan for restructuring the data layer to support multiple CoH server datasets
(Homecoming, Rebirth, future others). The goal is **infrastructure only** —
silo all current data as the `homecoming` dataset, with the plumbing ready to
drop a second dataset in alongside when its data is available.

## Status

**Plumbing + first migrated members landed (2026-04-29).** All work was done
in-place on `main`; nothing has been committed or pushed yet.

What's in:

- [src/data/dataset.ts](src/data/dataset.ts) — `Dataset` interface,
  `DatasetId`, `getActiveDataset()`, `loadDataset()` (lazy via dynamic
  `import()`), `getAllDatasetMetadata()`. Also defines `ATTableData` and
  `PetTableData` since those shapes are part of the contract.
- [src/data/datasets/homecoming/index.ts](src/data/datasets/homecoming/index.ts) —
  assembles HC's `Dataset` from the migrated files; this is the `default`
  export the lazy loader pulls.
- [src/data/datasets/homecoming/archetypes.ts](src/data/datasets/homecoming/archetypes.ts)
  and [src/data/datasets/homecoming/at-tables.ts](src/data/datasets/homecoming/at-tables.ts) —
  the moved data + helpers (`git mv` preserves history).
- [src/data/archetypes.ts](src/data/archetypes.ts) and
  [src/data/at-tables.ts](src/data/at-tables.ts) — replaced with **Proxy-based
  delegating facades** at the original file paths. Existing imports from
  `@/data/archetypes` / `@/data/at-tables` continue to work without any
  consumer changes.
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
   - `levels.ts` + `purple-patch.ts` (small; validates the interface for
     non-table data).
   - Powersets — `powersets/`, `overrides/`, `generated/`, `powersets.ts`,
     `power-pools(-raw).ts`, `epic-pools(-raw).ts`, `granted-powers.ts`,
     `pet-entities.ts`, `power-lookup.ts`. Largest group; biggest review.
   - Enhancements — `io-sets(-raw).ts`, `enhancements.ts`,
     `enhancement-registry.ts`, `set-bonus-index.ts`, `proc-data.ts`.
   - Incarnates — `incarnates.ts`, `incarnate-effects.ts`,
     `incarnate-recipes.ts`, `incarnate-components.ts`,
     `incarnate-salvage.ts`.
   - Misc — `accolades.ts`, `changelog*.ts`.
5. **Create `src/data/core/`** and move engine-only files there. Update
   direct imports for those (a small number, mostly inside `src/data/` itself).
6. **Update conversion scripts** to take `--dataset` (default `homecoming`).
7. **Add `serverId` to `Build`**, hydration migration, slim/hydrate plumbing,
   share-URL plumbing.
8. **Wire boot to `Build.serverId`** instead of the hardcoded
   `'homecoming'`.
9. **(Later, when Rebirth data is available)** Add `datasets/rebirth/`,
   server picker on new-build flow, dataset-switch confirmation UI.

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

- Adding the actual Rebirth dataset (no data yet).
- Server picker UI on new-build flow.
- Cross-server build inference mapping.
- Bin-crawler parser changes for Rebirth's binary format divergences.
- Mids `.mxd` server detection.
