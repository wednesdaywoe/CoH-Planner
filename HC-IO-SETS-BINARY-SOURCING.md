# HC IO-set binary sourcing — resume notes

_In-progress as of 2026-06-05. Closes Part 2 #1 of [HEAL-ABSORB-AND-EXPORT-GAPS.md](HEAL-ABSORB-AND-EXPORT-GAPS.md):
make Homecoming's `io-sets-raw.ts` binary-derived from `boostsets.bin`, retiring the
dead `convert-io-sets.js` + the legacy hand-data._

## TL;DR status

The hard part is **done and verified-safe**: the bin parser now reads HC's IO-set
pieces+bonuses, and the extractor's aspect logic is converged to **88% exact-match**
against the trusted hand-data (all real attrib gaps closed). What remains is mechanical:
parameterize the extractor for HC, add a small override table, regen the file, retire the
dead converter, test, commit.

## Committed on branch `feat/hc-io-sets-binary-sourcing` (resume here)

This branch holds the source changes below; `main` is clean. The HC data file is
NOT generated yet — that's the build-out step. Two modified source files:

1. **`tools/bin-crawler/bin_crawler/parser/_boostsets.py`** — the breakthrough.
   HC's `boostsets.bin` is **Parse7**, and the Parse7 branch only ever read the
   allowed-powers list; it never parsed the BoostLists (pieces) or Bonuses trailing
   block (only the Parse6/Rebirth branch did). HC's trailing block uses the **same
   inline-string layout** as Parse6. Changes:
   - Factored the Parse6 trailing-block parse into a shared `_parse_trailing_block(sub)` helper.
   - Parse6 branch now calls the helper (verified **byte-identical** Rebirth output — pure refactor).
   - Parse7 branch now parses the trailing block (over a `Parse6BinReader(buf[pl_end:])`)
     **and** threads `boostlists/bonuses/min_level/max_level` into the returned
     `BoostSetRecord` (the return construction previously dropped them — the final bug).
   - Result: all 227 HC sets now parse pieces + bonuses + levels.

2. **`scripts/extract-rebirth-io-sets-v2.py`** — aspect convergence (shared by both servers).
   - New attrib groups: `DEFENSE_ATTRIBS`, `MOVEMENT_SPEED_ATTRIBS`, plus
     `DEFENSE_DEBUFF_CATEGORIES` / `TOHIT_DEBUFF_CATEGORIES`.
   - `ATTRIB_TO_ASPECT`: `Endurance`→`EndMod` (was `Endurance Modification`),
     `Terrorized`→`Terrorize` (was `Fear`); added `RunningSpeed`→`Run`, `FlyingSpeed`→`Fly`,
     `JumpingSpeed`/`JumpHeight`→`Jump`, `Taunt`/`Placate`→`Threat`, `Unknown(91)`→`InterruptTime`;
     removed static `ToHit` (now contextual).
   - `_collapse_aspects`: added Defense collapse (`Base_Defense` → `Defense` / `Defense Debuff`
     by set category), Slow collapse (all 3 movement speeds → `Slow`; single mode → Run/Fly/Jump),
     ToHit context (`ToHit` / `ToHit Debuff` by category).
   - Rewrote `_ASPECT_CANONICAL_ORDER` comprehensively (Recharge mid-list; Stun/Sleep/
     Terrorize/Slow/Threat/ToHit come AFTER Recharge per HC naming).
   - **Rebirth ripple verified all-improvements**: Return-From-the-Grave sets now carry
     the `Defense` aspect they were dropping; labels/order consistent. (Re-running the
     Rebirth extractor changes ~230 lines of `rebirth/io-sets-raw.ts`, all improvements —
     regen + commit it as part of the final step.)

Both are committed on this branch (parser is pure-refactor + additive; extractor improves
both servers). The HC data file itself isn't generated yet (next step). NOTE: the committed
`rebirth/io-sets-raw.ts` is now stale relative to the extractor — re-running it yields a
~230-line improvement diff; regen it (with the Inexhaustibility revert) in the build-out step.

## Analysis findings (don't re-derive)

Against the 227-set hand-data, the binary extraction is:
- **Set coverage**: 225/227 shared, 0 binary-only. Hand-only: `cupids_crush`,
  `overwhelming_force` (wide-pool universal-damage sets — keep as overrides).
- **Pieces**: 1078/1219 exact (88%). Residual:
  - ~26 aspect/order outliers — cosmetic (e.g. a few `Confuse`-before-`Endurance` sets;
    `blessing_of_the_zephyr`/`winters_gift` hand `Move Speed` vs bin `Range`+`Slow`;
    one `KnockToKnockDown`). Order doesn't change aspect COUNT, so calc value is unaffected.
  - ~115 proc-piece name diffs + ~55 proc-flag diffs — cosmetic ("Chance for -Res(All)"
    vs the verbose damage-type list). Aspects on procs are empty either way.
- **Bonuses**: correct EXCEPT:
  - Empty-placeholder tiers: hand carries no-op `[]` tiers (e.g. a 2nd 6-piece `[]`); the
    binary correctly omits them. **Non-issue** (binary is cleaner).
  - **12 unique-global sets** genuinely missing bonuses — they encode their globals
    (e.g. Steadfast +3% Def, +400% KB Prot) as PIECES, not Set_Bonus auto-powers, so the
    binary can't resolve them as bonuses. **These need a hand-override.** The 12:
    `gift_of_the_ancients`, `shield_wall`, `karma`, `kheldians_grace`, `superior_kheldians_grace`,
    `impervious_skin`, `unbreakable_guard`, `gladiators_armor`, `rectified_reticle`,
    `synapses_shock`, `steadfast_protection`, `blessing_of_the_zephyr`.

**Decision (user-confirmed):** "correctness + overrides" — ship once aspects/bonuses are
equal-or-better; cover the cosmetic + unique-global residual with targeted hand-overrides
(same pattern Rebirth already uses via `_load_hc_sets` + `PIECE_OVERRIDES`).

## Remaining build-out (the next session)

1. **Parameterize `extract-rebirth-io-sets-v2.py` for `--dataset homecoming`:**
   - HC assets `G:/Homecoming/assets/live`, output `src/data/datasets/homecoming/io-sets-raw.ts`.
   - HC: `reuse_hc=False` (HC IS the source), and SKIP the Rebirth-specific overrides
     (`PIECE_OVERRIDES`, `REBIRTH_PIECE_RENAMES`, `REBIRTH_PIECE_ASPECT_OVERRIDES`, ICON_OVERRIDES).
   - Keep Rebirth (`--dataset rebirth`, the default) **byte-identical** — verify after refactor.
   - Cleanest refactor: extract the per-set build loop in `main()` into a
     `build_sets(resolver, msgs, sets, powers, power_index, hc_sets, apply_rebirth_overrides)`
     returning `out_sets`; `main(dataset)` wires the per-dataset config + header text.
2. **HC override tables** (small, in the script, HC-only):
   - Bonuses for the 12 unique-global sets above → copy from the current hand-data
     (`_load_hc_sets()` already parses it; reuse those `bonuses` arrays).
   - `cupids_crush` + `overwhelming_force` → copy whole-set from hand-data.
   - Optional: proc-piece NAME overrides for the ~115 cosmetic procs (or accept the
     binary's verbose names — confirm whether Mids import matches by piece-name first).
3. **Regen** `homecoming/io-sets-raw.ts`; diff vs the committed hand-data. Confirm the diff
   is purely (a) aspect/proc/order cosmetics and (b) the binary FIXING hand-data errors —
   no aspect-COUNT regressions, no lost bonuses.
4. **Retire** the dead `scripts/convert-io-sets.js` (reads a deleted legacy file). Note it
   in [HEAL-ABSORB-AND-EXPORT-GAPS.md](HEAL-ABSORB-AND-EXPORT-GAPS.md).
5. **Verify**: `npx tsc --noEmit`, full `npx vitest run` (esp. enhancement-value + the
   `io-sets-heal-absorb.test.ts` invariant), spot-check a build's set bonuses in the app.
6. **Commit** parser fix + extractor + regenerated HC **and** Rebirth `io-sets-raw.ts` together.

## Reusable de-risk diff (recreate as `c:/tmp/hc_io_trial.py`)

Generates HC from binary into a temp file (monkeypatching the extractor: HC assets, no
HC-reuse, no Rebirth overrides) and diffs vs the hand-data. Key moves:

```python
import importlib.util, pathlib, sys
ROOT = pathlib.Path(r'C:/Projects/CoH-Sidekick'); sys.path.insert(0, str(ROOT/'tools'/'bin-crawler'))
spec = importlib.util.spec_from_file_location('ex', str(ROOT/'scripts'/'extract-rebirth-io-sets-v2.py'))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
orig_load = mod._load_hc_sets
hand = orig_load()                                   # hand-data (HC io-sets-raw.ts)
mod.REBIRTH_ASSETS = r'G:/Homecoming/assets/live'    # point at HC
mod.OUTPUT_PATH = pathlib.Path(r'C:/tmp/hc-io-sets-trial.ts')
mod._load_hc_sets = lambda: {}                       # no reuse -> raw binary
mod.PIECE_OVERRIDES = {}; mod.REBIRTH_PIECE_RENAMES = {}
mod.REBIRTH_PIECE_ASPECT_OVERRIDES = {}; mod.ICON_OVERRIDES = {}
mod.main()                                           # writes temp
mod.HC_IO_SETS_PATH = pathlib.Path(r'C:/tmp/hc-io-sets-trial.ts'); binset = orig_load()
# then compare hand vs binset by set_id -> pieces[num].{name,aspects} and bonuses
```

## Gotchas

- `extract-rebirth-io-sets-v2.py` aspect logic is **shared with Rebirth**. Any change ripples
  to Rebirth-only sets (shared sets reuse HC). After every change, re-run the Rebirth
  extractor and confirm the diff is improvements only.
- Known pre-existing drift (unrelated): Rebirth `inexhaustibility` proc piece parses as
  `name:"Empty", proc:false` vs the curated `"Inexhaustibility"/proc:true`. Revert that one
  piece after any Rebirth regen (separate bin-parser to-do).
- Order affects piece NAMES (Mids import) but not aspect COUNT (calc value). Confirm how the
  Mids importer matches enhancements (by name vs set+index) before investing in 100% name parity.
- `py -3` is the Python entrypoint on this machine; bins live at `G:/Homecoming/assets/live`
  (HC) and `G:/Thunderspy Gaming/Sweet Tea/rebirth` (Rebirth).
