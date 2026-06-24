# Veracity Support — Progress

**Last updated:** 2026-06-24
**Branch:** `veracity-test`

Adding **Veracity** as a fourth dataset source alongside HC (Homecoming), Rebirth, and Thunderspy. Veracity is a heavily-modified private server (SCoRE-Neptune lineage) whose dev is actively collaborating — providing raw data and answering schema questions. Recon piggs live at `Veracity Bins/` in the repo root (`bin.pigg` 19 MB, `bin_powers.pigg` 4.3 MB → `powers.bin` extracts to ~50.9 MB).

See also the memory note `veracity-bin-recon` and `dataset-scope-final` (Veracity is the first server added under the "dev actively collaborates" rule).

## Status

**Veracity is a fully selectable, experimental dataset in the planner.** It ships behind the amber "experimental" badge (same treatment as Thunderspy). End-to-end: parser → export → converters → dataset module → app wiring all complete and verified.

- **tsc:** 0 errors
- **Tests:** 572/572 pass (no regression on HC/Rebirth/Thunderspy)
- **Production build:** green (4-dataset bundle; PWA precache limit raised 16→24 MiB)
- **Runtime:** `loadDataset('veracity')` loads and assembles; dev-server spot-check clean (no console complaints)

Select it in the header server picker, or deep-link with `?serverId=veracity`.

## What works

| Bin file | Result | Notes |
|---|---|---|
| `powers.bin` | 23,424 / 23,425 records; 99.5% sane range/recharge | Full header + HC-style effect groups |
| `powersets.bin` | 7,161 powersets (2 skipped) | available-levels parse correctly (no level-1 bug) |
| `classes.bin` | 14 player classes | **No Sentinel** — see roster note below |
| `boostsets.bin` | 257 sets → 230 extracted | 27 custom sets skipped (rarity-field misread) |
| `clientmessages-en.bin` | 87,993 strings | P-hash resolution works |

**Exported:** 9,225 player powers across 66 categories. **Shipped dataset:** 287 powersets, 12 power pools, 77 epic pools, incarnate (Interface/Judgement/Lore + a Veracity-specific **Genesis** slot), 230 IO sets.

### Archetype roster (14, no Sentinel)

`classes.bin` holds the **pre-Sentinel** roster: the 8 base ATs (Blaster, Brute, Controller, Corruptor, Defender, Dominator, Mastermind, Scrapper, Stalker, Tanker) + 2 Kheldians (Peacebringer, Warshade) + 2 Arachnos (Soldier, Widow). There is **no `Class_Sentinel`** — Veracity does not offer Sentinel as a playable AT (consistent with its SCoRE-Neptune lineage; Sentinel was a later HC addition).

`powers.bin` still carries vestigial `sentinel_ranged`/`sentinel_defense` (and Thunderspy's `feral_might`/`primal_gifts`) category *definitions* with no class to use them — `convert-all-powersets` now skips these orphan categories for Veracity (`ORPHAN_CATEGORIES`), so they aren't shipped.

## Sample validation against known game data

| Power | Field | Veracity | Expected (HC) |
|---|---|---|---|
| Blaster Fire Blast | range / rech / end / cast | 80 / 4 / 5.2 / 1.67 | 80 / 4 / 5.2 / 1.67 ✓ |
| Fire Blast eff[0] | Ranged_Damage, PvE, instant | scale 1.0 / 0s | 1.0 / instant ✓ |
| Fire Blast eff (DoT) | scale / duration / tick | 0.15 / 3.1s / 1.0s | small fire DoT ✓ |
| Fire Blast eff (PvP) | Ranged_Damage, `player eq` | scale 2.13 | PvP variant ✓ |
| Brute Jab | range / rech | 7 / 2 | melee ✓ |
| Tanker | res cap / dmg cap | 0.90 / 4.0 | 0.90 / 4.0 ✓ |
| Brute | res cap / dmg cap | 0.90 / 7.75 | 0.90 / 7.75 ✓ |
| **Scrapper/Stalker** | **res cap** | **0.80** | **Veracity-specific (HC = 0.75)** |
| Peacebringer | res cap / dmg cap / HP cap | 0.85 / 4.0 / 2409.5 | Kheldian ✓ |
| Blaster | HP base / HP cap | 102.5 / 1606.3 | ✓ |

## Format discoveries

Veracity is **Parse7-wrapped** (CrypticS magic, string table, u4 string offsets — same framing as HC) but uses the **base/retail field set** (none of HC's later additions) with a handful of its own deltas. It sits in its own corner of the format space, distinct from HC, Rebirth (Parse6), and Thunderspy.

### powers.bin record layout

Reached via `_parse_power_parse6(veracity=True)` in `tools/bin-crawler/bin_crawler/parser/_powers.py`. Differences from stock Parse6:

1. **`Dictionary` string-array** inserted after the 6 `requires` arrays, just before `reward_fallback` (carries `Quick_Attack` etc. — the dev's no-self-root tags).
2. **Field 43b present** (a u4_array, like Parse6/Rebirth).
3. **Box = 24 bytes** (HC-style 2×f4×3, like Thunderspy — not Parse6's 8).

Net: `range` lands at **+112 after accuracy**. None of HC's extras are present (no 35b / 38 / 38b-d / 41b / 43c / 45b / 48b / 52b).

### Effects = HC-style EffectGroups (with two tweaks)

Veracity uses the **HC `EffectGroup` struct** (Tag / Chance / PPM / Delay / RadiusInner / RadiusOuter / Requires / Flags / EvalFlags / templates), **not** the flat Parse6 AttribMod array. Two differences from stock HC:

- **No `DisplayInfo` field** between Tag and the numeric block.
- Each template carries **`HitsToBreak` (u4) + `HitBreakMinScale` (f4)** inserted right after `tick_chance`.

PvE/PvP is encoded parse6-style in the group `Requires` RPN (`enttype target> critter eq` / `player eq`), so `_parse_effect_group(veracity=True)` derives `is_pvp` from requires. No Redirect, no ActivationEffect block. Attrib / boost / aspect index HC-style (stock `ATTRIB_NAME` / `BOOST_TYPE`).

Format auto-detection (`_detect_format`) gained a 4th candidate (the Veracity variant). HC / Thunderspy / Rebirth detection is unaffected.

### classes.bin AT-cap layout (`_ATTRIB_LAYOUT["veracity"]`)

50-entry level tables, Parse7-framed, schema close to Thunderspy but with extra per-level member arrays so the cap deltas shift. Derived empirically from `Class_Blaster` (hit_points anchor) and verified across 12 player ATs against canonical cap signatures:

```
count 50, cap_delta 15880, res_value_delta 47244, threat_delta -3968, dmg_cap_delta 31760
```

`parse_classes` tries the HC (105-entry) layout, then picks whichever of {thunderspy, veracity} resolves the most members — no Thunderspy regression. `base_threat` is a flat 1.0 (Veracity has no per-AT threat ladder in the record).

## Custom mechanics — intentionally NOT modeled

Two Veracity mechanics surfaced in the data and are deliberately dropped by the converter (dev-confirmed out of scope):

- **Vs-faction / vs-subtype conditional damage** (`Veracity.Subtypes.<Faction>_Properties target.ownPower?`): target-side bonus damage vs specific enemy groups (54 enemy factions + creature subtypes). Verified 27,761 such groups, all `target.ownPower?`, 0 source-side. Sidekick is a build planner, not a per-enemy combat sim, so target-conditional damage never enters the displayed numbers. Converter extracts damage from the **base** group (`critter eq` PvE + `player eq` PvP) and skips all `Subtypes.*_Properties` blocks.
- **Combo system** (`<Element>_Combo_Counter`): deprecated (dev-confirmed). Converter skips combo-gated groups AND the combo-setup procs (templates whose `params.power_names` reference a `*_Combo_Counter`).

Both filters are dataset-agnostic in code (no other server ships these tokens, so they're no-ops elsewhere).

## App integration

- **Parser** (`tools/bin-crawler/bin_crawler/parser/`): `_powers.py` (Veracity power + effect branch — committed at `3e0cffec1`), `_classes.py` (Veracity AT-cap layout).
- **Converter** (`scripts/convert-powerset.cjs`): faction/combo skip-filters, `normEffectArea()` (drops unmodeled areas Map/Volume/Touch/Room/Unknown(N) from the typed field), positional-resistance skip (Melee/Ranged/Area + Resistance aspect — not a CoH concept). `convert-all-powersets.cjs`: `ORPHAN_CATEGORIES` skip for Sentinel/Primalist. `_dataset-paths.cjs`: `veracity` added to `KNOWN_DATASETS`.
- **IO sets** (`scripts/extract-rebirth-io-sets-v2.py`): `veracity` `DATASET_CONFIG` + `_apply_veracity_overrides` (HC-reuse for shared sets) + `COH_VERACITY_ASSETS` env.
- **Types** (`src/types/power.ts`): widened `DebuffResistance.accuracy?` + `MovementEffect.perTarget?` (optional; Veracity-only in practice).
- **Dataset module** (`src/data/datasets/veracity/`): `index.ts`, `archetypes.ts`, `at-tables.ts`, `generated/` (archetype-stats, powersets, power-pools, epic-pools, incarnate-effects), `io-sets-raw.ts`, `power-pools-raw.ts`, `epic-pools-raw.ts`, `overrides/`. First-pass re-exports of HC: `purple-patch.ts`, `granted-powers.ts`. `pet-entities.ts` is an empty stub.
- **Wiring (9 files):** `DatasetId` + `loadDataset` + `getAllDatasetMetadata` (`dataset.ts`); `SERVER_OPTIONS` + `DATASET_BADGE_VARIANT.veracity='warning'` (`Header.tsx`); the io-sets / power-pools / powersets / epic-pools facades; `build.ts` (×3 `serverId` unions); `buildStore.ts` URL-param validation; `main.tsx` `KNOWN`; `importer.ts` Mids remap.
- **Build infra:** `vite.config.ts` PWA `maximumFileSizeToCacheInBytes` 16→24 MiB (the 4th dataset pushed the main chunk to ~18 MB).

## Enhancements (IO sets)

`extract-rebirth-io-sets-v2.py --dataset veracity` (with `COH_VERACITY_ASSETS` pointing at `Veracity Bins/`) → **230 sets** in `veracity/io-sets-raw.ts`:

- 224 shared sets reuse HC's hand-curated entries (binary loses Accuracy aspects + auto-names that break Mids legacy import).
- 6 Veracity-specific sets extracted from the binary.
- This replaced the previous first-pass HC re-export — now it's Veracity's real set list (no longer shows sets the server lacks).

**27 sets skipped** — the Veracity-custom `*_Elemental` damage sets + Overwhelming Force, whose `boostsets.bin` rarity field misreads (garbage strings like `'ng_Haymaker'` = string-offset misalignment, same layout-divergence class as `powers.bin`). Recovering them needs an RE pass on the boostsets record layout (or the dev's schema for the boostset struct).

## Icons

- **~97% covered** by the existing HC icon library — Veracity's powers use standard CoH icon names, so 1,147 / 1,184 shipped power icons already resolve from `public/img/powers/`.
- **~37 missing**, all Veracity-custom: the **Astral Control** (Controller) and **Vapor Control** (Dominator) sets (`quo*` textures) + a handful of Mastermind/Peacebringer pet-upgrade icons.
- **Blocked:** `Veracity Bins/` has only the *data* piggs — no `texture_gui.pigg` / `texture_library.pigg`, so the custom textures can't be extracted here. The app degrades gracefully (`/img/Unknown.png` fallback on icon error).
- **Next:** request the texture piggs from the dev, then port `extract-thunderspy-icons.py` (generalize `referenced_icons()` to read the Veracity export; point `--assets-dir` at the texture piggs).

## Known gaps / first-pass items (not blocking; experimental badge)

1. **27 custom IO sets** skipped (boostsets rarity-field RE — or dev schema).
2. **~37 custom power icons** need the dev's texture piggs.
3. **3 new header bools** (`FaceTarget` / `ShowPowerLabel` / `PowerLabelRankThreshold`) the dev mentioned are *not* between accuracy and range (range hits the clean base offset) — they sit later (confirm-dialog region or post-effects) and are absorbed harmlessly. Pin exact positions when the dev sends the diff summary.
4. **Warshade / Arachnos Soldier / Widow** caps parsed Kheldian-like (res 0.85, HP cap 2409.5) via the validated deltas — worth a dev spot-check whether that's Veracity's intended value.
5. **`pet-entities.ts` empty** — no Veracity `VillainDef.bin` parser yet (Mastermind henchmen / Lore / pseudo-pet detail panels lack data). Same first-pass state as Thunderspy/Rebirth shipped with.
6. **A few "mode-spray" templates** (e.g. `Source.Mode?`-gated multi-attrib "Ones" effects) over-extract cosmetically-odd movement/accuracy/debuff-resistance entries — type-handled, tighten converter later.
7. **purple-patch / granted-powers** re-export HC (combat scaling + auto-grants assumed standard; replace if Veracity tunes them).
8. **GCM values** — `Veracity Bins/gcm-values.json` (119 GCMs, dev-provided magnitudes/durations). Deprecation = walk-the-powers (referenced = live). Not yet folded into the effect model beyond what the standard tables cover.

## Open questions for the dev

1. **Texture piggs** for the custom icons (Astral Control, Vapor Control, MM/PB pet upgrades).
2. **boostsets struct** change that garbles the rarity field on the custom `*_Elemental` sets (or we RE it).
3. **3 header bools** — roughly where do `FaceTarget` / `ShowPowerLabel` / `PowerLabelRankThreshold` serialize?
4. Confirm **no Sentinel** is intentional (the lingering `sentinel_*` category defs in `powers.bin` are just leftovers).
5. Confirm **Warshade / Arachnos cap** values (res 0.85 / HP cap 2409.5).

## How to regenerate

From the repo root, with the recon piggs at `Veracity Bins/`:

```bash
# 1. Export powers + classes (Python; reads the .pigg archives)
cd tools/bin-crawler && PYTHONPATH="../pigg-wrangler:." \
  python3 -m bin_crawler.export_powers  --assets-dir "../../Veracity Bins" --output-dir "../../exported_powers/veracity"
PYTHONPATH="../pigg-wrangler:." \
  python3 -m bin_crawler.export_classes --assets-dir "../../Veracity Bins" --output-dir "../../exported_powers/veracity/tables"
cd ../..

# 2. Run the Node converters for veracity
node scripts/extract-at-tables.cjs        --dataset veracity
node scripts/convert-archetypes.cjs       --dataset veracity
node scripts/convert-all-powersets.cjs    --dataset veracity --force
node scripts/generate-powerset-index.cjs  --dataset veracity
node scripts/convert-pool-powers.cjs      --dataset veracity --apply
node scripts/convert-epic-pools.cjs       --dataset veracity --apply
node scripts/convert-incarnate-effects.cjs --dataset veracity
node scripts/generate-archetypes.cjs      --dataset veracity

# 3. IO sets (Python)
COH_VERACITY_ASSETS="$PWD/Veracity Bins" PYTHONPATH="tools/pigg-wrangler:tools/bin-crawler" \
  python3 scripts/extract-rebirth-io-sets-v2.py --dataset veracity

# 4. Verify
npx tsc --noEmit && npx vitest run
```

Note: `regen-all.cjs` does not include `veracity` in its default dataset list (same as Thunderspy) — regenerate per-converter as above.
