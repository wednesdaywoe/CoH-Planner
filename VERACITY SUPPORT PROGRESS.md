# Veracity Support — Progress

**Last updated:** 2026-06-28
**Branch:** `veracity-test` (merged up to date with `main`)

Adding **Veracity** as a fourth dataset source alongside HC (Homecoming), Rebirth, and Thunderspy. Veracity is a heavily-modified private server (SCoRE-Neptune lineage) whose dev is actively collaborating — providing raw data and answering schema questions. Recon piggs live at `Veracity Bins/` in the repo root: `bin.pigg`, `bin_powers.pigg`, and `veracity_sidekick_icons.pigg` (a dedicated icon archive the dev built for Sidekick, ~3,770 `.texture` icons).

See also the memory note `veracity-bin-recon` and `dataset-scope-final` (Veracity is the first server added under the "dev actively collaborates" rule).

## Status

**Veracity is a fully selectable, experimental dataset in the planner.** It ships behind the amber "experimental" badge (same treatment as Thunderspy). End-to-end: parser → export → converters → dataset module → app wiring all complete and verified.

- **tsc:** 0 errors
- **Tests:** 606/606 pass (no regression on HC/Rebirth/Thunderspy)
- **Production build:** green (4-dataset bundle; PWA precache limit raised 16→24 MiB)
- **Runtime:** `loadDataset('veracity')` loads and assembles; dev-server spot-check clean (no console complaints)

Select it in the header server picker, or deep-link with `?serverId=veracity`.

### Latest round (2026-06-28): dev feedback triage

The dev reviewed the preview build. Triage of the 11 points:

| Dev note | Outcome |
|---|---|
| Archetype/Powerset alignment, Power order, Power pick levels | ✅ Dev-confirmed correct — no action |
| Sentinel deprecated, should come off the list | ✅ AT already absent; removed 4 lingering **Sentinel ATO IO sets** (257→**253**) |
| "Have DSyncs, but not Elementals" | ✅ Root cause was **empty `type`** on the Elemental/Paragon sets (allowed-powers gated, no EC category), *not* icons — fixed via the `{Element} Praxis` system below |
| Tenth power in sets missing | ⛔ **Binary-data gap, not ours** — proven below |
| Power pools missing options | ✅ **Fixed** — 12→**21 pools** (9 custom pools were being dropped by the converter) |
| Missing new Interface / Hybrid incarnates | ✅ **Phase 1 done** — incarnate slot indices + effects are now dataset-aware |
| Second epic-pool rule missing | ⏳ Open — needs the dev's rule |
| Missing new Interface/Hybrid (see above), new Accolades | ⏳ Accolades open |

**Tenth power — proven a binary gap (not parser).** Audited every wired player set: the only power dropped anywhere is a hidden `Build_Up_Proc` auto-power (correct). At the binary level Water/Ice/Energy/Psychic Blast have exactly **9 powers in both the powerset array AND powers.bin** (zero orphans) — there is no 10th power to render. Fire/Dark genuinely have 10 and we show 10. → resolves when the dev sends a finalized pigg with the 10th power actually wired into those sets.

#### Elemental/Paragon "Praxis" sets — the empty-`type` fix

The 16 `*_Elemental` (rare) + 16 `Paragon_*` (purple) sets carry **`category=''` in `boostsets.bin`** — they gate slotting via an explicit **`allowed_powers` list** (e.g. Fire → all 180 fire powers) rather than a standard EC enhancement category. With no `type`, the picker couldn't match them to any power slot, so they never appeared ("Elementals missing"). All 16 set icons resolve fine — it was never an icon issue.

Fix: `_praxis_category()` in `tools/bin-crawler/bin_crawler/parser/_boostsets.py` synthesizes a per-element `{Element} Praxis` category, keyed on the Veracity-only `ECElemental`/`ECParagon` rarities (HC/Rebirth untouched). Because the powers export and the IO-set extractor share `_resolve_category`, both the per-power `allowedSetCategories` and the set `type` get the same key — so matching is precise per element (Ice can't slot into a fire power). The Elemental + Paragon variants of an element share an **identical** power list, so they share the category (rare → sidebar group; purple → Purple tab). 16 families × 2 rarities; `type:""` count is now **0**. Added the 16 `… Praxis` entries to `IOSetCategory` (`src/types/common.ts`) and to `IO_SET_TYPE_TO_CATEGORY` (`src/data/io-sets.ts`).

#### Power pools — 9 custom pools recovered

The binary/export had all **21** pool powersets but `convert-pool-powers.cjs` only emitted **12** (it iterates a known-pool map). Added a `veracity` entry to `DATASET_EXTRA_POOLS` for the 9 custom pools — **Arsenal, Bard, Gadgetry, Hierophany, Ki, Nocturne, Pedigree, Utility Belt, Verdant**. Now **21 pools / 112 powers** (was 12/63). The picker enumerates pools dynamically, so they appear automatically. (Veracity renamed Presence→"Manipulation"; we map it to the `presence` id.)

#### Incarnate Phase 1 — dataset-aware Interface/Hybrid

Only **Interface (72→90)** and **Hybrid (36→45)** differ from the global indices on Veracity — every other slot matches HC. Made the slot indices dataset-aware via `SLOT_INDEX_OVERRIDES` (`incarnates.ts`) — vendored Veracity's `interface`/`hybrid` `index.json` into `src/data/datasets/veracity/incarnate-indices/`, falling back to the global index for all other slots. The effects picker became `_pick4` (added Veracity) in `incarnate-effects.ts` so the new powers resolve real effects. The slot-definition cache is now keyed by dataset id (rebuilds on switch). New trees: **Hypnotic, Imbalancing** (Interface) + **Eductive** (Hybrid); their tree icons are already on disk. Pinned by `src/data/veracity-incarnate-options.test.ts` (incl. a no-leak-into-HC check).

**Phase 2 (deferred, pending dev confirm):** Veracity's standalone `fate`/`verdict`/`socket` incarnate export dirs are almost certainly the **Genesis sub-trees we already support** (Rebirth's Genesis trees are exactly `data/fate/socket/verdict`), not new slots — so Phase 2 may be nearly empty. Confirm with the dev before building new slots.

### Latest round (2026-06-26): updated bins + dev's icon pigg

- **`veracity-test` merged up to date with `main`** (10 commits: icon fixes, conjunctive grants, summon-shell AoE, Issue 28 panel-3 HC patch, etc.). Clean auto-merge; both the Veracity integration and main's changes preserved in the 3 overlapping files (`convert-powerset.cjs`, `dataset.ts`, `power.ts`).
- **Re-generated everything from the dev's updated bins** (powers/classes re-export + full converter pipeline). Counts shifted slightly (9,162 player powers / 63 categories).
- **All 257 IO sets now extract (0 skipped)** — the dev added clean rarity tokens (`ECElemental`, `ECParagon`, and `ECVeryRare`-first for Overwhelming Force) for content that previously serialized a garbled rarity field.
- **Power icons: 0 missing** (was 37) — extracted from `veracity_sidekick_icons.pigg`, incl. the custom Astral Control + Vapor Control sets.
- **Elemental IO-set icons (16): extracted** to `/img/Enhancements/IO Sets/`. **Paragon ("purple") set icons (16): still missing** — not in the dev's pigg yet (dev-confirmed: "you'll get all the elemental sets but miss the new purple sets"); they fall back to the placeholder.

## What works

| Bin file | Result | Notes |
|---|---|---|
| `powers.bin` | 23,424 / 23,425 records; 99.5% sane range/recharge | Full header + HC-style effect groups |
| `powersets.bin` | 7,161 powersets (2 skipped) | available-levels parse correctly (no level-1 bug) |
| `classes.bin` | 14 player classes | **No Sentinel** — see roster note below |
| `boostsets.bin` | 257 sets → **257 extracted (0 skipped)** | dev added clean rarity tokens (ECElemental/ECParagon) |
| `clientmessages-en.bin` | strings | P-hash resolution works |

**Exported:** ~9,162 player powers across 63 categories. **Shipped dataset:** 287 powersets, **21 power pools** (incl. 9 Veracity-custom), 77 epic pools, incarnate (standard slots + Genesis, with Veracity-specific Interface/Hybrid options), **253 IO sets** (4 Sentinel ATO sets dropped).

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
- **IO sets** (`scripts/extract-rebirth-io-sets-v2.py`): `veracity` `DATASET_CONFIG` + `_apply_veracity_overrides` (HC-reuse for shared sets) + `COH_VERACITY_ASSETS` env + the `ECElemental`/`ECParagon` rarity tokens.
- **Icons** (`scripts/extract-thunderspy-icons.py`): generalized with a `--dataset` flag (power-icon extraction from a dataset's icon pigg). Plus a one-off elemental-set-icon extraction into `/img/Enhancements/IO Sets/`.
- **Types** (`src/types/power.ts`): widened `DebuffResistance.accuracy?` + `MovementEffect.perTarget?` (optional; Veracity-only in practice).
- **Dataset module** (`src/data/datasets/veracity/`): `index.ts`, `archetypes.ts`, `at-tables.ts`, `generated/` (archetype-stats, powersets, power-pools, epic-pools, incarnate-effects), `io-sets-raw.ts`, `power-pools-raw.ts`, `epic-pools-raw.ts`, `overrides/`. First-pass re-exports of HC: `purple-patch.ts`, `granted-powers.ts`. `pet-entities.ts` is an empty stub.
- **Wiring (9 files):** `DatasetId` + `loadDataset` + `getAllDatasetMetadata` (`dataset.ts`); `SERVER_OPTIONS` + `DATASET_BADGE_VARIANT.veracity='warning'` (`Header.tsx`); the io-sets / power-pools / powersets / epic-pools facades; `build.ts` (×3 `serverId` unions); `buildStore.ts` URL-param validation; `main.tsx` `KNOWN`; `importer.ts` Mids remap.
- **Build infra:** `vite.config.ts` PWA `maximumFileSizeToCacheInBytes` 16→24 MiB (the 4th dataset pushed the main chunk to ~18 MB).

## Enhancements (IO sets)

`extract-rebirth-io-sets-v2.py --dataset veracity` (with `COH_VERACITY_ASSETS` pointing at `Veracity Bins/`) → **all 257 sets (0 skipped)** in `veracity/io-sets-raw.ts`:

- 225 shared sets reuse HC's hand-curated entries (binary loses Accuracy aspects + auto-names that break Mids legacy import).
- 32 Veracity-specific sets extracted from the binary (the 16 `*_Elemental` "Praxis" damage sets, the 16 `Paragon_*` sets, etc.).
- Replaced the original first-pass HC re-export — now Veracity's real set list.

**Rarity tokens:** the dev added clean rarity tokens for content that previously serialized a garbled rarity field — `ECElemental` (→ `rare`) and `ECParagon` (→ `purple`), and made `ECVeryRare` lead Overwhelming Force's list. Mapped in `EC_RARITY_TO_PLANNER`. This recovered the 27 sets that were previously skipped on the garbled rarity field (no boostsets RE needed after all).

## Icons

**Power icons — 0 missing.** Veracity's powers mostly use standard CoH icon names (≈97% inherited from HC's `public/img/powers/`). The remaining custom ones — the **Astral Control** (Controller) and **Vapor Control** (Dominator) `quo*` sets + some MM/PB pet-upgrade icons — were extracted from the dev's dedicated **`veracity_sidekick_icons.pigg`** (306 written via `extract-thunderspy-icons.py --dataset veracity`).

**IO-set (enhancement-picker) icons:**
- 225 shared sets reuse HC's icon strings → resolve already.
- **16 elemental sets: extracted** — `Elemental_<Element>.texture` from the pigg → `/img/Enhancements/IO Sets/s<element>_elemental.png` (matching the converter's default `s{set_id}.png` name, so no converter change). The lone naming nuance: set `electricity` ↔ texture `Electric`.
- **16 Paragon ("purple") sets: still missing** (`sparagon_*.png`) — not in the dev's pigg yet (dev-confirmed). They fall back to `/img/Unknown.png` gracefully until he adds those textures.

## Known gaps / first-pass items (not blocking; experimental badge)

1. ✅ ~~27 custom IO sets skipped~~ — RESOLVED (dev's rarity tokens; all 257 extract).
2. ✅ ~~Custom power icons missing~~ — RESOLVED (dev's icon pigg; 0 power icons missing).
2b. **16 Paragon ("purple") set-picker icons** still missing — not in the dev's icon pigg yet (placeholder fallback). Re-run the elemental-icon extraction for `Paragon_*` once they land.
2c. **17 custom pool-power icons** (Hierophany / Ki / Nocturne) not in the icon pigg yet — placeholder fallback. Same fix as Paragon: re-run `extract-thunderspy-icons.py --dataset veracity` once the dev adds them.
3. **3 new header bools** (`FaceTarget` / `ShowPowerLabel` / `PowerLabelRankThreshold`) the dev mentioned are *not* between accuracy and range (range hits the clean base offset) — they sit later (confirm-dialog region or post-effects) and are absorbed harmlessly. Pin exact positions when the dev sends the diff summary.
4. **Warshade / Arachnos Soldier / Widow** caps parsed Kheldian-like (res 0.85, HP cap 2409.5) via the validated deltas — worth a dev spot-check whether that's Veracity's intended value.
5. **`pet-entities.ts` empty** — no Veracity `VillainDef.bin` parser yet (Mastermind henchmen / Lore / pseudo-pet detail panels lack data). Same first-pass state as Thunderspy/Rebirth shipped with.
6. **A few "mode-spray" templates** (e.g. `Source.Mode?`-gated multi-attrib "Ones" effects) over-extract cosmetically-odd movement/accuracy/debuff-resistance entries — type-handled, tighten converter later.
7. **purple-patch / granted-powers** re-export HC (combat scaling + auto-grants assumed standard; replace if Veracity tunes them).
8. **GCM values** — `Veracity Bins/gcm-values.json` (119 GCMs, dev-provided magnitudes/durations). Deprecation = walk-the-powers (referenced = live). Not yet folded into the effect model beyond what the standard tables cover.

## Open questions for the dev

1. ✅ ~~Texture piggs~~ — provided (`veracity_sidekick_icons.pigg`). ✅ ~~boostsets rarity~~ — fixed (clean tokens).
2. **Paragon set icons** — the `Paragon_*` ("new purple") set icons aren't in the icon pigg yet; send them when ready and we extract.
3. **3 header bools** — roughly where do `FaceTarget` / `ShowPowerLabel` / `PowerLabelRankThreshold` serialize?
4. ✅ ~~Confirm no Sentinel~~ — dev confirmed deprecated (AT + ATO sets now removed).
5. Confirm **Warshade / Arachnos cap** values (res 0.85 / HP cap 2409.5).
6. Confirm intended **rarity tier** for the `ECElemental` sets — currently mapped to `rare` (the `ECParagon` ones map to `purple`).
7. **Tenth power** — several sets (Water/Ice/Energy/Psychic Blast, …) have only 9 powers in `powersets.bin`/`powers.bin`; the 10th isn't wired in the pigg sent. Send a finalized pigg once those are in.
8. **Second epic-pool rule** — what's the rule? (Epic-pool gating is currently deferred for Veracity.)
9. **New accolades** — where do they live / which are intended? (Accolade powers aren't yet surfaced for Veracity.)
10. **Incarnate Phase 2** — are `fate` / `verdict` / `socket` standalone player slots, or the Genesis sub-trees (as on Rebirth)? If standalone: unlock level, prerequisites, recharge, and whether Fate is independent of Destiny.

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

# 4. Power icons (from the dev's icon pigg in Veracity Bins/)
python3 scripts/extract-thunderspy-icons.py --dataset veracity

# 5. Elemental IO-set icons → public/img/Enhancements/IO Sets/ (one-off; see
#    "Icons" section). Re-run with Paragon_* once those textures land in the pigg.

# 5b. Vendor the dataset-specific incarnate slot indices (only the slots whose
#     option list differs from the global/HC index — Interface + Hybrid for now).
cp exported_powers/veracity/incarnate/interface/index.json \
   src/data/datasets/veracity/incarnate-indices/interface.json
cp exported_powers/veracity/incarnate/hybrid/index.json \
   src/data/datasets/veracity/incarnate-indices/hybrid.json

# 6. Verify
npx tsc --noEmit && npx vitest run
```

Note: `regen-all.cjs` does not include `veracity` in its default dataset list (same as Thunderspy) — regenerate per-converter as above.
