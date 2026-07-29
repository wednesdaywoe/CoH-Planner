# CoH-Planner Development Notes
> document formatting: /home/jiiwii/Github/CoH-Sidekick/format_instructions.md

## Development Philosophy

Prefer fixing root problems properly over quick fixes. The planner handles complex game mechanics with many interacting systems (AT tables, enhancement calculations, power effects, set bonuses). Band-aid fixes create compounding issues that are harder to debug later. When a bug surfaces, investigate whether it's a symptom of a deeper systemic issue before patching the surface behavior. This is essential for making the app reliable and maintainable.

**Before touching game data (bin parser, converters, calc), read [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md)** — the durable principles and the specific gotchas (strength meta-templates, resistance-aspect traps, proc/pet exclusions, the verify-don't-assume discipline, the re-export de-risk workflow). For the structural *why* behind those gotchas — how CoH models a power as a flat list of atomic effects, the discriminators that distinguish them, and why any name-bucketed representation collapses — read [docs/COH-DATA-MODEL.md](COH-DATA-MODEL.md) first. The running issue log is [HOMECOMING_PARSER.md](docs/HOMECOMING_PARSER.md).

## Source Data

The raw source data (`raw_data_homecoming-*`) is gitignored due to the enormous number of files. This project exists on two machines (PC and Laptop), each with their own local copy of the source data.

**Data source (as of 2026-04-14):**

The binary parser now reads directly from the HC `.pigg` archives (`bin.pigg`, `bin_powers.pigg`, etc.) in the assets directory (e.g. `G:\Homecoming\assets\live`). The HC launcher updates these pigg files on every game patch, so whenever the parser runs it reads current data — no manual extraction step required.

Previously, the parser read from loose `.bin` files in a `bin/` subdirectory that were a one-time manual extract from April 2019 — 7 years out of date. This was the root cause of all "missing data" issues (brute modifier changes, Kinetic Melee rework, etc.) that were incorrectly attributed to HC server-side runtime overrides. The laptop's manual brute modifier edits were a workaround for this stale-data problem.

**Note on format changes:** HC occasionally adds new fields to the binary format when patching. The parser auto-detects format version (e.g. the post-2025 "field 45b" between box_size and range in powers.bin). If data looks wrong after an HC patch, investigate the binary layout for new/changed fields.

## Bin Crawler Export

Goal: Generate CoD2-compatible structured JSON from Bin Crawler's binary parser, filtered to only the 34 player-relevant categories (out of 204 total). This replaces the dependency on the external City of Data 2.0 raw data archive (thousands of NPC/critter files we don't need).

### `tools/bin-crawler/` and `exported_powers/` are VENDORED — do not edit them here

**`coh-sidekick-1.0` is canonical for the parser and for the exports it produces.** This repo ships the crawler as part of the Sidekick tool suite, so both paths must physically exist here, but they are a one-way copy. Edit the parser *there*, re-export *there*, then run [`scripts/sync-bin-crawler.sh`](scripts/sync-bin-crawler.sh) here and commit the refreshed tree. Everything downstream — the converters under `scripts/`, `src/`, `generated/` — is owned by this repo and edited normally.

The sync records what it copied in `tools/bin-crawler-vendored.json`; [`bin-crawler-vendored.test.ts`](src/data/bin-crawler-vendored.test.ts) checks it two ways. Editing either path here goes red anywhere, including CI. A canonical repo that has moved ahead goes red only on a machine that has both checked out — which is where the edits actually happen, but it does mean a machine holding only this repo cannot tell it is behind.

Why this exists: HC-3's parser decode landed in the canonical repo while this one kept a hardcoded stand-in, and nothing went red for twelve days. `export-staleness.test.ts` compares this repo's exports against *this* repo's parser, so a copy that is uniformly stale is also perfectly self-consistent.

### Current State

The export is functional and verified. Run with: `py -3 tools/bin-crawler/bin_crawler/export_powers.py` (or `py -3 -m bin_crawler.export_powers` from inside `tools/bin-crawler/`).

**Re-export discipline (enforced 2026-07-07): a parser change means re-export ALL datasets.** `exported_powers/` is the committed converter input and CANNOT be regenerated in CI (no `.pigg`, no Python), so the `generated/` regen-diff can't cover it. Instead each dataset carries an `_export_manifest.json` stamped by `export_powers.py` with a fingerprint of the powers-exporter source (`parser/*.py` + `export_powers.py`, via `_export_fingerprint.py`); the vitest guard [`export-staleness.test.ts`](src/data/export-staleness.test.ts) recomputes it and fails if any dataset's committed export was produced by a different parser than what's committed. To make it green after touching the parser, re-export each dataset to its committed root and commit the refreshed tree (a `--categories` subset export deliberately does NOT stamp — partial trees can't claim whole-dataset currency):
- HC → `--assets-dir <…/Homecoming/assets/live> --output-dir exported_powers`
- Rebirth → `--assets-dir <…/Sweet Tea/rebirth> --output-dir exported_powers/rebirth`
- Thunderspy → `--assets-dir <…/Sweet Tea/tspy> --output-dir exported_powers/thunderspy`

Then `npm run regen` and commit `generated/` too. (This is the "re-export de-risk" workflow from GAME-DATA-PRINCIPLES, now gated. `entities`/`salvage`/`tables` come from separate exporters and are not yet manifest-guarded.)

The exporter and HTTP server read directly from `.pigg` archives via `BinResolver`, which uses Pigg Wrangler's `PiggArchive` under the hood. **CLI export tools** (`export_powers`, `export_salvage`, `export_classes`, `export_entities`, `dump_template_bytes`, `audit_stack_alignment`): point at an assets directory with `--assets-dir`; omit it and the shared resolver (`bin_crawler/assets_dir.py`) uses the **remembered path**, else opens a **folder picker** (tkinter), saving the choice to `~/.config/bin-crawler/config.json` (`%APPDATA%\bin-crawler\config.json` on Windows). `--pick` re-opens the picker; the flag always overrides (deterministic for scripts/CI); headless falls back to a typed prompt. The diff tool selects an assets *root* under a separate `assets_root` key. **The web server (`-m bin_crawler`) does NOT block on a picker** — it binds its port immediately and parses the remembered folder in a background thread (so the Sidekick Launcher's port-based status detection sees it online at once), and the folder is set/changed from the web UI's **⚙ cogwheel** (`/api/set-assets-dir`, mirroring Pigg Wrangler). `--source NAME=PATH` is the advanced multi-source mode (loads synchronously, no cogwheel).

- **5,277 player powers** exported across 610 powersets in 34 categories (last verified 2026-03-28)
- Effect template parsing implemented with core fields: attribs, aspect, table, scale, duration, magnitude
- 96 attrib indices mapped and verified by cross-referencing 7,687 powers against CoD2 data
- Key files (under `tools/bin-crawler/bin_crawler/`): `parser/_dataclasses.py` (EffectGroup/EffectTemplate), `parser/_enums.py` (ATTRIB_NAME, aspect/type/stack enums), `parser/_powers.py` (effect parser), `export_powers.py` (export script at package root)

### Verification Results (against 7,687 CoD2 reference powers)

| Template Field | Accuracy | Notes |
|---|---|---|
| aspect | **100%** | Encoded as value*8 in binary |
| table | **100%** | String table offset |
| target | **100%** | Fixed: Self, SelfAndPets, AnyAffected, AnyAffectedAndPets, etc. |
| magnitude | **100%** | Perfect match |
| scale | **99.99%** | 3 diffs from float32 precision |
| stack_limit | **98.86%** | Minor parsing issues in some templates |
| caster_stack | **97.63%** | Added Collective mapping |
| stack_key | **97.29%** | Some truncated string offsets |
| stack | **96.02%** | Added Extend, Overlap, Refresh, Continuous, etc. |
| attribs | **93.1%** | Remaining 7% are unmapped exotic indices |
| application_type | **79.31%** | CoD2 re-labels based on context (see below) |
| type | **78.85%** | CoD2 re-labels based on context (see below) |

**Note on type/application_type (79%):** The binary stores consistent enum values, but CoD2 applies semantic re-labeling based on attrib context. For example, mez templates (Held, Stunned) use binary type=0 (Magnitude) but CoD2 relabels as "Duration". The underlying data is correct — this is a naming convention difference, not a parsing error.

### Remaining Tasks (low priority — not blocking current use)

**Fill remaining `Unknown(N)` attrib indices (~7% of templates)**
Mostly exotic attribs like `Toxic_Elusivity`, `Revoke_Power`, `InterruptTime`. The planner handles the ~69 common attribs already. Only matters if a specific power shows broken data.

**Map remaining `type`/`application_type`/`target` enum values (82.9% match)**
~17% of templates have values beyond the common 0-1 range — unusual effect types (Expression-based, AoE targets, pet targets). Medium priority; some edge cases in damage/heal calculations could be affected.

**Parse template tail fields** — **largely DONE (2026-07-05).** The parser now captures the tail natively in `EffectTemplate` (`tools/bin-crawler/bin_crawler/parser/_dataclasses.py`): `cancel_events`, `suppress_events`, `required_events`, and `flags` (with `flags_raw`/`flags2_raw` — `IgnoreResistance` 0x420, `IgnoreStrength` 0x430, and `CopyBoosts`/`PseudoPet` in the second word). The converter honors `IgnoreStrength`/`IgnoreResistance` from this native parse, **no longer from CoD2.** Remaining: only `fx` (cosmetic visual effects, irrelevant to the planner) is genuinely unparsed, and the converter does not yet *fold in* `suppress_events` (Hide's AoE-defense suppression) — a converter-side task tracked in [HOMECOMING_PARSER.md](docs/HOMECOMING_PARSER.md).

**Enum naming alignment**
Cosmetic — "Caster" vs "Self", "Character" vs "SingleTarget". No functional impact.

**None of these block using the export today.** The 100% accuracy on aspect, table, and magnitude means the data the planner uses for stat calculations is correct. Remaining work only matters when fully replacing the CoD2 archive, and can be done incrementally.

### Binary Layout Notes

- Attrib indices are stored as `value * 4` (byte offsets into a 4-byte-per-entry table)
- Aspect is stored as `value * 8` (byte offset), not a simple enum index
- After field 73 (boosts_allowed): field 74 is boostset_cats (string_array), fields 75-78 are mode arrays (u4_arrays), then 2 unknown u4s, then the effects struct_array
- Effect group: 2 pre-fields + chance/ppm/delay/radii + requires + flags/eval_flags + templates struct_array
- Template: attribs(u4_array) + aspect(u4*8) + type/app/target(u4s) + unknown(u4) + table(str) + scale/dur/mag(f4s) + ...

### Player-Relevant Categories (34 of 204)
Blaster_Ranged, Blaster_Support, Brute_Defense, Brute_Melee, Controller_Buff, Controller_Control, Corruptor_Buff, Corruptor_Ranged, Defender_Buff, Defender_Ranged, Dominator_Assault, Dominator_Control, Mastermind_Buff, Mastermind_Summon, Scrapper_Defense, Scrapper_Melee, Sentinel_Defense, Sentinel_Ranged, Stalker_Defense, Stalker_Melee, Tanker_Defense, Tanker_Melee, Peacebringer_Defensive, Peacebringer_Offensive, Warshade_Defensive, Warshade_Offensive, Arachnos_Soldiers, Widow_Training, Teamwork, Pool, Epic, Inherent, Incarnate, Redirects
