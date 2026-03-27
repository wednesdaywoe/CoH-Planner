# CoH Sidekick — Architecture & Technical Documentation

**Last updated:** March 27, 2026

City of Heroes character build planner for the Homecoming server. Hosted at **coh-sidekick.com** via GitHub Pages.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 7 |
| State | Zustand 5 (localStorage persistence) |
| Routing | TanStack Router |
| Styling | Tailwind CSS 4 (dark theme, Vite plugin) |
| Backend | Supabase (shared builds, auth) |
| Deployment | GitHub Actions → GitHub Pages (`main` branch) |

## Project Structure

```
src/
├── components/         72 React components
│   ├── enhancements/   Enhancement picker, IO set browser
│   ├── help/           Help system, onboarding
│   ├── incarnate/      Incarnate slot UI, effects tooltips
│   ├── info/           InfoPanel (power details, damage calc)
│   ├── layout/         Header, MainLayout, StatsDashboard
│   ├── modals/         ~15 modal dialogs
│   ├── powers/         Power tray, power slots, level assignments
│   ├── shared/         BuildCard, BuildFilters (shared builds browser)
│   ├── stats/          StatsPanel, stat breakdown display
│   └── ui/             Primitives (Button, Select, Toggle, Tooltip, etc.)
├── data/               35 data modules
│   ├── powersets/      ~3,700 generated power definition files
│   ├── at-tables.ts    AT modifier tables (105 values × N tables × 13 ATs)
│   ├── archetypes.ts   Archetype definitions, HP tables, damage caps
│   ├── io-sets-raw.ts  IO enhancement set database
│   ├── incarnate-effects.ts          Incarnate interfaces + lookup functions
│   ├── incarnate-effects-generated.ts Auto-generated incarnate data (468 powers)
│   └── ...             Pool powers, epic pools, accolades, salvage, recipes
├── hooks/              Custom React hooks
├── lib/                Supabase client singleton
├── pages/              4 route pages (Planner, Builds, BuildDetail, Settings)
├── services/           Supabase API wrappers (sharedBuilds, auth)
├── stores/             Zustand stores (buildStore, uiStore, authStore, historyStore)
├── types/              TypeScript type definitions
└── utils/
    ├── calculations/   12 modules, ~7,700 lines — the math engine
    ├── calc-debug.ts   Debug logging system (window.cohDebug)
    ├── external-import/ Import from external planner URLs
    ├── game-import/    Import from game .mxd files
    └── mids-import/    Import from Mids .mxd files
```

## Data Pipeline

Game data flows from Homecoming server dumps through extraction scripts into typed TypeScript modules:

```
Raw Server Data (gitignored)                    Processed App Data (committed)
─────────────────────────                       ─────────────────────────────
raw_data_homecoming-20251209_7415/
├── powers/
│   ├── <AT>/<set>/<power>.json  ──convert──→  src/data/powersets/<AT>/<role>/<set>/<power>.ts
│   ├── pool_power/<pool>/       ──convert──→  src/data/power-pools-raw.ts
│   ├── epic_power/<pool>/       ──convert──→  src/data/epic-pools-raw.ts
│   └── incarnate/
│       ├── alpha/ + alpha_silent/
│       ├── destiny/ + destiny_silent/
│       ├── hybrid/ + hybrid_silent/  ──convert──→  src/data/incarnate-effects-generated.ts
│       ├── interface/ + interface_silent/
│       ├── judgement/
│       └── lore/
├── tables/<AT>.json             ──extract──→  src/data/at-tables.ts
└── objects/<entity>.json        ──convert──→  src/data/pet-entities.ts
```

### Extraction Scripts (scripts/)

| Script | Purpose |
|--------|---------|
| `convert-powerset.cjs` | Main power converter: raw JSON → typed .ts files |
| `convert-all-powersets.cjs` | Batch converter for all powersets |
| `convert-pool-powers.cjs` | Pool power extraction |
| `convert-epic-pools.cjs` | Epic/patron pool extraction |
| `convert-incarnate-effects.cjs` | Incarnate effects from all 6 slots (Alpha through Lore) |
| `convert-io-sets.js` | IO enhancement set extraction |
| `convert-pet-entities.cjs` | Pet/minion entity definitions |
| `extract-at-tables.cjs` | AT modifier tables from archetype JSON |

### Fix/Patch Scripts

These apply corrections that can't be derived from raw data alone:

| Script | Purpose |
|--------|---------|
| `fix-allowed-enhancements.cjs` | Patches allowedEnhancements from raw boost data |
| `fix-mechanic-types.cjs` | Tags mechanic powers (childToggle, hiddenAuto, etc.) |
| `fix-missing-effects.cjs` | Adds effects from child_effects recursion |
| `fix-per-target-stacking.cjs` | Adds perTarget metadata to stacking powers |
| `fix-brute-feb2026.cjs` | Applies Homecoming Feb 2026 Brute balance changes |
| `fix-add-durations.cjs` | Adds duration data to powers |
| `fix-stats.cjs` | Miscellaneous stat corrections |

### Audit Scripts

| Script | Purpose |
|--------|---------|
| `audit-comprehensive.cjs` | 5-dimension audit comparing raw vs processed data |
| `audit-pool-powers.cjs` | Validates pool power data |
| `audit-epic-pools.cjs` | Validates epic pool data |
| `audit-powerset-effects.cjs` | Validates powerset effect values |

## Calculation System

The calculation engine (`src/utils/calculations/`, ~7,700 lines) produces dashboard stats from build state:

```
Build State (Zustand)
    │
    ▼
calculateCharacterTotals()          ← Main entry point
    │
    ├── Step 1-3: Set Bonuses        calculateSetBonuses() + Rule of 5
    ├── Step 4: Collect Powers        All primary/secondary/pool/epic powers
    ├── Step 5: Alpha Bonuses         getAlphaEnhancementBonuses() → ED-bypass enhancement %
    ├── Step 6: Fitness Powers         Inherent fitness (Swift/Hurdle/Health/Stamina)
    ├── Step 7: Active Powers         Toggle/auto power effects via resolveScaledEffect()
    │   └── Per power: enhBonuses = calculatePowerEnhancementBonuses() + alphaBonuses
    ├── Step 7.5: Proc Bonuses        Always-on procs (Global, Proc120s)
    ├── Step 7.6: Build Up Procs      PPM click proc average contributions
    ├── Step 8: Accolades             Flat HP/End bonuses
    ├── Step 9: Incarnates            Destiny (direct stats), Hybrid (3-layer model)
    ├── Step 9.5: Hit Chance          Purple patch calculation
    └── Step 10: Final Stats          GlobalBonuses → CharacterStats + breakdown
```

### Key Formula: resolveScaledEffect()

Most power effects use `{ scale, table }` format. The table name maps to an AT-specific array in `at-tables.ts`:

```
result = scale × getTableValue(archetypeId, tableName, level)
```

Example: Brute Tough resistance = `scale: 3.0 × melee_res_dmg[brute, lvl50] (0.085) = 0.255 (25.5%)`

### Enhancement Diversification (ED)

Enhancement bonuses go through ED before being applied:
- Schedule A (33.33% SO): Damage, Accuracy, Recharge, Heal, etc.
- Schedule B (20% SO): Defense, Resistance, ToHit
- Three-tier penalty: 100% effective → 90% → 70% → 15%

### Debug Logging

Enable via browser console: `window.cohDebug.enable()` (or Settings gear → Debug Logging toggle)

Traces every calculation step with collapsible console groups, per-power diffs, and formula breakdowns.

## Incarnate System

Six slots, auto-extracted from raw server data via `scripts/convert-incarnate-effects.cjs`:

| Slot | Powers | Effect Type | Dashboard Impact |
|------|--------|-------------|------------------|
| Alpha | 72 | Enhancement bonuses (bypass ED) + level shift | Boosts all powers |
| Destiny | 45 | Click buffs with diminishing durations | Direct stat bonuses |
| Hybrid | 36 | 3-layer: passive + front-loaded + per-target | Regen/Res/Def/Damage/etc. |
| Interface | 72 | Proc debuffs on enemies | Display only |
| Judgement | 54 | Click AoE attacks | Display only |
| Lore | 189 | Pet summoning + level shift | Level shift (T3+) |

### Hybrid 3-Layer Model

Hybrid incarnate powers have three distinct effect layers:
1. **Passive** — always-on just by equipping (e.g., +30% regen for Melee T4)
2. **Front-loaded** — active when toggle is on, no enemies required (e.g., +241.2% regen, +16% res for Melee Core Embodiment)
3. **Per-target** — stacks per nearby enemy up to maxTargets (data present, slider not yet implemented)

## Shared Builds

Backend: Supabase (Edge Functions + PostgreSQL + RLS)

| Function | Purpose |
|----------|---------|
| `share-build` | Create/update shared builds (rate limited) |
| `delete-build` | Delete owned builds |
| `update-build-visibility` | Toggle public/private (requires Discord auth) |
| `claim-builds` | Link anonymous builds to Discord account |

Ownership model: dual — owner token (localStorage) OR Discord OAuth. RLS enforces visibility: anonymous users see only `is_public = TRUE` builds.

## Archetypes

13 archetypes supported: Blaster, Controller, Corruptor, Defender, Dominator, Brute, Mastermind, Scrapper, Sentinel, Stalker, Tanker, Peacebringer, Warshade (+ Arachnos Soldier/Widow as branch ATs).

Each has AT-specific:
- HP tables (base + cap, 105 levels)
- Damage modifiers (melee/ranged/aoe)
- Damage/defense/resistance caps
- Inherent power calculations (Fury, Vigilance, Defiance, Scourge, etc.)

## Known Data Accuracy Issues

- **Raw data is from Dec 9, 2025** (Homecoming build 7415). Patches after this date require manual fix scripts.
- **Homecoming may apply runtime modifier overrides** that don't appear in data dumps. A combat log parser could verify values case-by-case.
- **Brute Feb 2026 patch** applied via `fix-brute-feb2026.cjs` (resist/defense 75%→85%, HP increase, ranged damage unification).
- **City of Data 2.0** (our data source) hasn't been updated since Dec 2025.

## Environment

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- Both stored as GitHub Actions secrets

## Branches

- `main` — production, auto-deploys to GitHub Pages
- `feat/incarnate-extraction` — incarnate data extraction overhaul (active)
- `feat/perma-tracker` — permanent buff tracking feature (needs testing)
