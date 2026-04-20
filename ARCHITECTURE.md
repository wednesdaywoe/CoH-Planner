# CoH Sidekick — Architecture & Technical Documentation

**Last updated:** April 19, 2026

CoH Sidekick is a City of Heroes character build planner and suite of helpful tools for the Homecoming server. Hosted at **coh-sidekick.com** via GitHub Pages.

This document covers the planner's architecture. The repository also ships three companion tools — **Pigg Wrangler**, **Bin Crawler**, and **Sidekick Launcher** — documented in a separate section at the end.

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
├── components/
│   ├── enhancements/   Enhancement picker, IO set browser
│   ├── help/           Help system, onboarding help
│   ├── incarnate/      Incarnate slot UI, effects tooltips
│   ├── info/           InfoPanel (power details, damage calc)
│   ├── layout/         Header, MainLayout, StatsDashboard
│   ├── modals/         Modal dialogs (compare-slotting, enhancement list, etc.)
│   ├── onboarding/     Onboarding beacon, feature discovery
│   ├── powers/         Power tray, power slots, level assignments
│   ├── shared/         BuildCard, BuildFilters (shared builds browser)
│   ├── stats/          StatsPanel, PinnedPowersBar, stat breakdowns
│   └── ui/             Primitives (Button, Select, Toggle, Tooltip, etc.)
├── data/
│   ├── powersets/      Generated power definition files
│   ├── at-tables.ts    AT modifier tables (105 values × N tables × 13 ATs)
│   ├── archetypes.ts   Archetype definitions, HP tables, damage caps
│   ├── io-sets-raw.ts  IO enhancement set database
│   ├── incarnate-effects.ts          Incarnate interfaces + lookup functions
│   ├── incarnate-effects-generated.ts Auto-generated incarnate data
│   └── ...             Pool powers, epic pools, accolades, salvage, recipes
├── hooks/              Custom React hooks
├── lib/                Supabase client singleton
├── pages/              PlannerPage, BuildsPage, BuildDetailPage, ImportPage, SettingsPage, PlasmicHost
├── services/           Supabase API wrappers (sharedBuilds, auth)
├── stores/             Zustand stores (buildStore, uiStore, authStore, historyStore, onboardingStore)
├── types/              TypeScript type definitions
└── utils/
    ├── calculations/   The math engine (~7,700 lines)
    ├── calc-debug.ts   Debug logging system (window.cohDebug)
    ├── external-import/ Import from external planner URLs
    ├── game-import/    Import from game .mxd files
    └── mids-import/    Import from Mids .mxd files
```

## Data Pipeline

Game data flows from Homecoming server dumps through extraction scripts into typed TypeScript modules that are committed to the repo:

```
Raw Server Data (gitignored)                    Processed App Data (committed)
─────────────────────────                       ─────────────────────────────
raw_data_homecoming-<build>/
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

The current raw dump in use is `exported_powers`. Swapping in a newer dump is a matter of dropping the new directory next to the old one and updating the path constant in the conversion scripts. Longer-term, the plan is to regenerate this data directly from the `.pigg` archives via Bin Crawler (see Suite section below), removing the dependency on externally-produced JSON dumps.

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
| `reconvert-redirect-powersets.cjs` | Rebuilds powersets that use in-game redirects |
| `generate-powerset-index.cjs` | Regenerates the powerset barrel index after powerset additions |

### Other Scripts

| Script | Purpose |
|--------|---------|
| `bulk-import-mids.ts` | Bulk-imports a directory of Mids `.mxd` files as shared builds (supports `--author-name` for attribution). See `README-bulk-import-mids.md`. |
| `env-loader.ts`, `env-shim.ts`, `register-env-loader.mjs` | Load `.env` vars into Node-side TypeScript scripts that need Vite-style `VITE_*` env access. |

> **Note on script hygiene:** historically this directory accumulated `fix-*`, `patch-*`, and one-shot migration scripts that applied corrections to generated data. Those have all been removed in favor of fixing the upstream data pipeline. If you need to apply a one-time correction in future, prefer regenerating from current `.pigg` data via Bin Crawler over committing a one-shot patch script — those scripts are usually non-idempotent and rot quickly.

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

Enable via browser console: `window.cohDebug.enable()` (or Settings gear → Debug Logging toggle).

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
| `update-build-visibility` | Toggle public/private (requires authenticated user) |
| `claim-builds` | Link anonymous builds to an authenticated account |

**Auth providers:** Supabase OAuth wrapped by [src/services/auth.ts](src/services/auth.ts). Two providers are supported:

- `discord` — Discord OAuth
- `custom:simplelogin` — SimpleLogin OAuth2 (privacy-preserving email-based identity)

Ownership model: dual — owner token (localStorage) OR an authenticated account from either provider. RLS enforces visibility: anonymous users see only `is_public = TRUE` builds.

## Archetypes

13 archetypes supported: Blaster, Controller, Corruptor, Defender, Dominator, Brute, Mastermind, Scrapper, Sentinel, Stalker, Tanker, Peacebringer, Warshade (+ Arachnos Soldier/Widow as branch ATs).

Each has AT-specific:
- HP tables (base + cap, 105 levels)
- Damage modifiers (melee/ranged/aoe)
- Damage/defense/resistance caps
- Inherent power calculations (Fury, Vigilance, Defiance, Scourge, etc.)

## Environment

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- Both stored as GitHub Actions secrets

## Branches

- `main` — production, auto-deploys to GitHub Pages
- Long-running rework branches: `migration-plan`, `phase-0-foundation`, `rebuild`
- Short-lived feature branches come and go; check `git branch -a` for the current set rather than maintaining a list here.

---

# Companion Tools: The Sidekick Suite

The repository ships three maintenance tools alongside the planner, all under [tools/](tools/). Each is a standalone product, but Bin Crawler depends on Pigg Wrangler as a library, and Sidekick Launcher is a thin front door over the other two.

```
tools/
├── pigg-wrangler/          Pigg Wrangler source + launchers
│   ├── pigg_wrangler/      Python package (import as: pigg_wrangler)
│   │   ├── pigg.py         Core .pigg format library (PiggArchive, PiggCollection)
│   │   ├── server.py       Local HTTP server + web UI (port 8085)
│   │   ├── index_builder.py In-memory index across all archives
│   │   ├── texture.py      .texture file decoding
│   │   ├── config.py       Persistent user config
│   │   └── static/         Web UI assets
│   ├── PiggWrangler.bat    User launcher
│   ├── PiggWrangler.vbs    Background launcher (no console)
│   └── create_shortcut.ps1 Desktop shortcut installer
│
├── pigg-wrangler-dist/     PyInstaller packaging (build artifacts)
│   ├── PiggWrangler.spec   PyInstaller build spec
│   ├── piggwrangler.ico    Application icon
│   └── piggwrangler128.png Application icon (128px)
│
├── bin-crawler/            Bin Crawler source
│   ├── bin_crawler/        Python package (import as: bin_crawler)
│   │   ├── parser/         Parse6/Parse7 binary format parsers
│   │   │   ├── _reader.py, _dataclasses.py, _enums.py
│   │   │   ├── _powers.py, _powersets.py, _powercats.py, _classes.py
│   │   │   ├── _messages.py (P-hash → string lookup)
│   │   │   └── _pigg.py    (BinResolver; imports pigg_wrangler for archives)
│   │   ├── server.py       HTTP API for the planner (port 8090)
│   │   ├── export_powers.py JSON exporter
│   │   └── static/         Browser UI assets
│   └── bin-crawler.bat     User launcher
│
└── sidekick-launcher/      Unified front-door dashboard
    ├── launcher.py         Tiny HTTP server (port 8000) + status/launch API
    ├── tools.json          Tool registry (id, name, port, icon, launch command)
    └── static/index.html   Dashboard UI

# User launcher lives at the repo root for easy access:
SidekickLauncher.bat        Double-click to start the launcher
```

## Pigg Wrangler

A viewer, extractor, and Python library for the Cryptic `.pigg` archive format. Provides:

- **`pigg_wrangler.pigg`** — a dependency-free Python API: `PiggArchive` for single-archive access, `PiggCollection` for unified access across a whole assets directory.
- **`py -m pigg_wrangler`** — local web app that indexes all `.pigg` files in a directory and provides a browsable, searchable UI for navigating and extracting their contents (including texture previews).
- **PyInstaller distributable** built via `tools/pigg-wrangler-dist/PiggWrangler.spec`. End users who don't want Python can run the `.exe` directly.

Pigg Wrangler is the canonical home for anything `.pigg`-format — parsing the archive header, walking the directory table, decompressing entries, texture decoding. Other tools in the suite import from `pigg_wrangler.pigg` rather than duplicating this code.

## Bin Crawler

A parser for the Cryptic binary data file format used by City of Heroes. Handles both Parse7 (current Homecoming) and the older Parse6 container format. Produces structured Python dataclasses from `powers.bin`, `powersets.bin`, `powercats.bin`, and `clientmessages-en.bin`.

### Parser Modules (`bin_crawler/parser/`)

| Module | Responsibility |
|--------|----------------|
| `_reader.py` | Low-level binary reader; length-prefixed records, sub-readers, alignment |
| `_pigg.py` | `BinResolver` — locates `.bin` files inside `.pigg` archives via Pigg Wrangler |
| `_enums.py` | Enum mappings (attribs, aspects, stack modes, targets, etc.) |
| `_dataclasses.py` | Typed record structures (Power, Powerset, Powercat, EffectGroup, EffectTemplate) |
| `_classes.py` | Higher-level classes layered on top of dataclasses |
| `_powercats.py`, `_powersets.py`, `_powers.py` | Category / set / power record parsers |
| `_messages.py` | `clientmessages-en.bin` loader; resolves P-hash display strings |

### HTTP Server

[`bin_crawler/server.py`](tools/bin-crawler/bin_crawler/server.py) exposes Bin Crawler's parsed data over HTTP (default port 8090) so the planner's build pipeline or ad-hoc consumers can query current data without regenerating static dumps. Supports multiple data sources at once (e.g., one instance serving both Homecoming and a local dev build).

### Data Sources

Bin Crawler reads directly from the `.pigg` archives Homecoming updates on every patch (typically `G:\Homecoming\assets\live\bin.pigg` and siblings). Because HC's launcher refreshes these archives automatically, Bin Crawler always sees current data. This is the long-term answer to "the JSON dump is out of date." The planner's shipping data pipeline has not yet been migrated to consume Bin Crawler's output; once it is, the conversion scripts in `scripts/` can be retired in favor of pulling current data from the live API.

### Binary Format Notes

- **Parse7 format:** CrypticS magic + CRC + "Parse7" header + string table + data block. String references are `u4` offsets into the string table (base = header_end + 4).
- **Parse6 format:** CrypticS magic + CRC + "Parse6" header + "Files1" container + inline strings. Strings are `u16(len) + chars` padded to 4-byte alignment.
- Records are length-prefixed (`u4 len`, then `len` bytes). The reader uses `sub_reader(len)` for bounded record parsing.
- `open_parse7()` auto-detects format and returns a `BinReader` or `Parse6BinReader`.
- **Attrib indices** are stored as `value * 4` (byte offsets into a 4-byte-per-entry table).
- **Aspect** is stored as `value * 8`, not a simple enum index.
- **P-hashes** (e.g. `P2631953439`) are CRC32 of the English display text. Resolved via `clientmessages-en.bin` — a flat file of null-terminated strings (not Parse7). 99.7% resolution rate in practice.

### Homecoming Format Drift

Homecoming occasionally adds new fields to the binary format during patches. Bin Crawler includes auto-detection for known additions (e.g., the post-2025 "field 45b" inserted between `box_size` and `range` in `powers.bin`). If parsed data looks wrong after an HC patch, investigate the binary layout for new/changed fields before assuming a semantic bug.

## Sidekick Launcher

A small dashboard that lives at `http://localhost:8000/` and acts as the front door for the suite. It reads [`tools/sidekick-launcher/tools.json`](tools/sidekick-launcher/tools.json), polls each registered tool's port to show live status, and exposes a `/api/launch` endpoint that shells out to a tool's `.bat` when the user clicks Launch.

The launcher is intentionally thin (~150 LOC, stdlib-only): it does not bundle, proxy, or wrap the other tools — they keep running on their own ports and remain usable standalone. Adding a future tool is one entry in `tools.json`. The dashboard also lists external links (e.g. the hosted planner at coh-sidekick.com).

Run with `py -3 tools/sidekick-launcher/launcher.py` or by double-clicking `SidekickLauncher.bat` in the repo root.

## How the Tools Fit Together

```
                    ┌───────────────────────┐
                    │   Sidekick Launcher   │  front door, status + launch
                    │  (port 8000, JSON cfg)│
                    └─────┬───────────┬─────┘
                          │           │ launches / links
              ┌───────────┘           └───────────┐
              ▼                                   ▼
      ┌─────────────────┐                 ┌─────────────────┐
      │  Pigg Wrangler  │  owns: .pigg    │   Bin Crawler   │  owns: .bin format,
      │  (port 8085)    │  format, index, │  (port 8090)    │  Parse6/Parse7,
      │                 │  texture decode │                 │  P-hash resolution,
      └────────┬────────┘                 └────────┬────────┘  HTTP API
               │ exports PiggArchive,              │
               │ PiggCollection, PiggEntry         │ (future) API consumed by
               └──────────► imports ───────────────┤
                                                   ▼
                                          ┌─────────────────┐
                                          │  CoH Sidekick   │  owns: build planning,
                                          │    (planner)    │  calculations, UI
                                          │  coh-sidekick.com│ (currently JSON dump;
                                          └─────────────────┘  will migrate to Bin Crawler)
```
