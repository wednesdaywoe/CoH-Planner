# 2026-07-06 Session Log

> Relates to: DEDUCTIVE_SCHEMA_HARNESS.md

## Scope completed

- Extended `tools/mids-oracle/diff_enh_oracle.py` with residual baseline support.
- Added triage output for highest-impact value mismatches/stat families.
- Applied targeted oracle->repo mapping improvements to reduce obvious false residuals.
- Updated `tools/mids-oracle/README.md` with new usage and baseline workflow.

## Key implementation details

- New CLI options in `diff_enh_oracle.py`:
  - `--baseline`
  - `--baseline-out`
  - `--triage-top`
- Added residual-signature generation buckets for:
  - missing/extra set names
  - missing/extra proc pairs
  - proc category mismatches
  - value-aware missing/extra/mismatch entries
- Added baseline comparison logic:
  - reports only **new** signatures vs baseline
  - with `--strict --baseline`, exits non-zero only on newly introduced residuals
- Added triage reporting:
  - top mismatches by absolute delta
  - top missing and extra stat keys by frequency
- Mapping updates included:
  - `Enhancement + Mez` handling (including KB/KU strength)
  - direct movement effects (`SpeedFlying`, `SpeedRunning`, `JumpHeight`) to movement stat
  - `Heal` with `aspect=Abs`
  - tighter mez-family collapse check (explicit family members)

## Validation run summary

- `python3 -m py_compile tools/mids-oracle/diff_enh_oracle.py` passed.
- `python3 tools/mids-oracle/diff_enh_oracle.py --dataset homecoming --value-diff --triage-top 10 --show 6` ran successfully.
- Baseline snapshot written:
  - `tools/mids-oracle/enh_oracle_residual_baseline.json`
- Strict baseline check:
  - `python3 tools/mids-oracle/diff_enh_oracle.py --dataset homecoming --value-diff --baseline tools/mids-oracle/enh_oracle_residual_baseline.json --strict --show 5`
  - Result: `new signatures vs baseline = 0`
- Tests passed:
  - `python3 tools/mids-oracle/test_diff_enh_oracle.py`
  - `python3 tools/mids-oracle/test_read_enhdb.py`

## Current status

- DSH9 enhancement diff now supports reproducible baseline gating and better mismatch triage.
- Residuals remain (expected), but they are now measurable and regression-safe for future mapping cleanup.

## Delta update (next-step follow-on)

- Added conservative proc-name auto-normalization (one-to-one per set), plus a small explicit alias layer for edge cases.
- Added `--triage-json` output to emit machine-readable summary/residual/top-mismatch artifacts.
- Refined proc category mismatch comparison to use raw exact-name intersections (prevents alias-induced category noise).
- New measured proc identity residuals after this pass:
  - missing proc pairs: **2** (down from 3 in prior step, down from 94 pre-normalization)
  - extra proc pairs: **56** (down from 57 in prior step, down from 148 pre-normalization)
- Strict baseline gate still passes with `new signatures vs baseline = 0`.

## Delta update (extra proc classification)

- Added heuristic classification for repo-only extra proc rows in `diff_enh_oracle.py` and exported it via `--triage-json`.
- Current classification split (Homecoming snapshot):
  - `likely_non_proc_global_or_passive`: **36**
  - `likely_mapping_gap`: **18**
  - `unknown`: **2**
- Triage artifact refreshed at `tools/mids-oracle/enh_oracle_triage.json` with both summary counts and per-row classification details.

## Delta update (mapping-gap worklist artifacts)

- Generated focused follow-up artifacts from `likely_mapping_gap` rows:
  - `tools/mids-oracle/enh_oracle_mapping_gap_worklist.json`
  - `tools/mids-oracle/enh_oracle_mapping_gap_worklist.md`
- Worklist includes confidence score + priority tier + suggested action per row.
- Current prioritized split:
  - `P1`: **10**
  - `P2`: **8**
  - `P3`: **0**

## Delta update (value-diff root-cause fix — review follow-up)

Investigated the damage "2×" mismatch (e.g. Gladiator's Javelin p4 oracle=5.0 vs
repo=2.5) surfaced in review. Two stacked bugs:

- **Set-bonus links were resolved by the EnhDB's cached power `index`, which is
  offset by a constant −22 vs the I12 power array this reader builds** (verified
  across all 1,138 links; 0 stored indices correct). Every set bonus was read from
  the wrong power (an `Increased_Damage_4` link resolved to a Defense power, an
  `Accuracy_3` link to `Boost_Up` → the nonsensical 2000 damage). Fixed by resolving
  links by `full_name` (Mids stores it on every link precisely for this reason) in
  `_build_oracle_set_bonus_map`. Revision-proof vs a `+offset` hack.
- **`_bonus_multiplier` DamageBuff/Str ×250** had been calibrated against those
  wrong (index-shifted) powers. With correct resolution the default ×100 matches the
  repo exactly (`0.025 → 2.5`); the special-case was removed. Test anchor updated.

Impact (value-aware residuals, homecoming):

| metric | before | after |
| --- | --- | --- |
| missing_stats | 1014 | **26** |
| extra_stats | 1422 | **43** |
| value_mismatches | 54 | **20** |

The `mez_resistance_(all)` 4.4-vs-7.5 gap was the **same root cause** (mis-resolved
power) and is now resolved. Remaining 20 mismatches are all one pattern: repo damage
is exactly +0.025 higher than Mids (e.g. repo desc literally `+1.525%` vs Mids
`1.5%`).

**Root cause of the +0.025 (verified, not staleness): Mids quantizes the damage-buff
scale to 3 decimal places in its `.mhd`.** Proof: the *same* Mids scale `0.025` feeds
BOTH repo `2.5` and repo `2.525` — Mids literally cannot distinguish them. The true
bin scale is `0.0X525`; Mids stores `0.0X5` (every delta is exactly +0.00025 in
scale). This is a fixed format-precision limit, NOT a patch-cycle drift (the value
didn't change between patches), i.e. exactly the "DISTRUST exact Scale — Mids
skew/display convention" case in the README trust boundary. Advisory, not a mapping
bug; the live-bin repo value is the tiebreaker and is correct. Baseline + triage
artifacts regenerated to lock in the corrected state; strict gate green
(`new signatures vs baseline = 0`).

## Delta update (DSH SC-3/4/5 + DSH8 + targeted Incarnate hardening)

Completed the planned DSH follow-on work for converter self-check coverage and
incarnate collapse safety, then added targeted converter hardening for Hybrid
and Destiny.

- Implemented SC-3 / SC-4 / SC-5 in `scripts/validate-converter-output.cjs`:
  - SC-3: explicit resistible presence checks on damage/debuff atoms.
  - SC-4: PvE/PvP sibling accounting checks.
  - SC-5: source-vs-output self-penalty routing leak detection.
  - Hardened source matching using explicit `Source: ...json` identity and deep
    child effect ingestion, with movement alias handling (`fly`/`flySpeed`).
- Added regression guard suite:
  - `src/utils/calculations/sc345-converter-self-check.test.ts`
  - Parses validator output and asserts SC-3/4/5 failure counts remain zero
    across Homecoming/Rebirth/Thunderspy, with non-trivial HC check volume.
- Refined DSH8 actionable scope in
  `scripts/dsh8-incarnate-collapse-detector.cjs`:
  - Excludes by-design `*_ArchVillain_Res` class-absent residuals from
    actionable collapse noise.
- Added shared targeted PvP/resistibility helpers in
  `scripts/convert-incarnate-effects.cjs`:
  - `isExplicitPvpOnlyGroup`
  - `isPvpEnttypePlayerRequires`
  - `isPvpMapOnlyRequires`
  - `isTemplateResistible`
- Applied targeted treatment to Hybrid extraction:
  - Narrow PvP filtering with beneficial `player eq` exception.
  - Resistible-aware dedup identity (`...|R/U`) to avoid collapsing distinct
    twins.
- Applied the same targeted treatment to Destiny extraction:
  - Narrow PvP filtering with beneficial `player eq` exception.
  - Persisted per-entry `resistible` metadata.
  - Changed timeline collapse bucket from duration-only to `duration|R/U`.
- Added a focused Destiny guard test in `src/data/destiny-decay.test.ts`:
  - Synthetic same-duration twin timeline case verifies duplicate-duration rows
    remain additive (not collapsed), covering the new `duration|R/U` behavior.

### Validation summary

- `node scripts/validate-converter-output.cjs --dataset homecoming --gate` passed.
- `node scripts/validate-converter-output.cjs --dataset rebirth --gate` passed.
- `node scripts/validate-converter-output.cjs --dataset thunderspy --gate` passed.
- `npx vitest run src/utils/calculations/sc345-converter-self-check.test.ts` passed.
- `node scripts/dsh8-incarnate-collapse-detector.cjs --dataset homecoming --gate` passed.
- `node scripts/dsh8-incarnate-collapse-detector.cjs --dataset rebirth --gate` passed.
- `node scripts/dsh8-incarnate-collapse-detector.cjs --dataset thunderspy --gate` passed.
- `npx vitest run src/utils/calculations/incarnate-effects-completeness.test.ts src/utils/calculations/dsh8-incarnate-collapse.test.ts` passed.
- `npx vitest run src/data/destiny-decay.test.ts` passed (includes new guard).

Status: SC-3/4/5 are shipped and regression-guarded; DSH8 noise is reduced to
actionable classes; Hybrid and Destiny now preserve targeted PvP/resistible
semantics under collapse/dedup.
