# mids-oracle — Mids Reborn structural oracle (DSH1 + DSH5)

A Linux-native reader for the Mids Reborn `I12.mhd` power database, used as a
**structural oracle** for the Deductive Schema Harness
([streams/DEDUCTIVE_SCHEMA_HARNESS.md](../../streams/DEDUCTIVE_SCHEMA_HARNESS.md)).
Mids models a power the same way the game and our bin parser do — a flat array of
atomic, single-attrib effect records at *template granularity* — so it is a clean
parser-to-parser structural diff, **no Mids calc engine required**.

Trust boundary (plan doc): **Mids for topology, bins for names and numbers.** TRUST
sub-effect count/identity, `EffectType`/`DamageType`/`MezType`, `PvMode`,
`Resistible`, `ModifierTable` selection, `Aspect`/`AttribType`. DISTRUST exact
`Scale`/`Mag`/`Duration` (Mids is ~5 weeks rebalance-stale). When Sidekick and Mids
disagree numerically, the raw `.pigg` bin is the tiebreaker.

## Files

- **`read_i12.py`** — ports the MidsReborn `BinaryReader` layout to Python. Seeks the
  `\x0cBEGIN:POWERS` marker, reads `count+1` Powers (each with inline `count+1`
  Effects), maps enums, and emits one JSON line per power at template granularity.
  Layout is transcribed verbatim from (do not reorder without re-checking these):
  - `MidsReborn-master/MidsReborn/Core/DatabaseAPI.cs` `LoadMainDatabase` (top level)
  - `.../Core/Base/Data_Classes/Power.cs:213` `Power(BinaryReader)`
  - `.../Core/Base/Data_Classes/Effect.cs:87` `Effect(BinaryReader)`
  - `.../Core/Requirement.cs:67` `Requirement(BinaryReader)`
  - `.../Core/Enums.cs` (enum ordinals)

  **Self-check (the one desync risk):** the format's `+1` array idiom (writes
  `Length-1`, reads `count+1`) means a single misread field desyncs the whole
  stream. After reading `count+1` powers the reader MUST land exactly on the
  `BEGIN:SUMMONS` string; it raises with the byte offset otherwise. Passing this on
  the full HC DB (10,986 powers / 73,553 effects) proves the layout is byte-correct.

- **`diff_oracle.py`** — PoC structural comparison of the oracle vs our parser export
  (`exported_powers/`), canonicalized to the bridge-free identity tuple
  `(modifier_table, aspect, pv_mode, resistible)`. `--normalize-pvp` applies the
  combat canonicalization (fold `pv`→Combat, strip the `pvp` table token) that
  reconciles Mids' explicit PvE/PvP record pairs with our Any-base + `_pvp*`-override
  encoding. This is a **PoC validator, not the production harness** (that is DSH5,
  sequenced after the DSH4 closed schema).

- **`emit_canonical.ts` + `diff_harness.py`** — the DSH5 production harness. The TS
  emitter canonicalizes the whole HC export via the **tested DSH4 bridge**
  (`ingestExportPower` from `src/data/core/atomic-effect.ts`), resolving redirect
  shells, so the app's schema and the oracle diff can never drift (the bridge is
  single-source; Python never re-ports it). `diff_harness.py` joins every Mids power
  to the canonical export by `full_name`, keys effects by the DSH4 identity, checks
  the structural invariants, runs a tiered classifier, and writes
  `oracle_divergence_rules.json` (the committable baseline) + a coverage manifest.
  See "DSH5 harness" below.

## Requirements

Local only — `MidsReborn-master/` (the vendored Mids source + `I12.mhd`) is
**gitignored**, so these tools do not run in CI. Wiring the harness into CI (with a
committed DB or a golden JSON export) is DSH5/DSH7. Python 3, stdlib only.

## Usage

```sh
python3 read_i12.py                              # HC I12.mhd -> stdout JSONL
python3 read_i12.py --grep Trick_Arrow --limit 5 # spot-check specific powers
python3 diff_oracle.py --normalize-pvp           # DSH1 gate-2/3 known-answer comparison
python3 diff_oracle.py --cohort trick_arrow --normalize-pvp

# DSH5 production harness (auto-emits the canonical export on first run):
python3 diff_harness.py                           # full HC sweep, write rules, cohort gate
python3 diff_harness.py --baseline oracle_divergence_rules.json  # + regression gate
python3 diff_harness.py --emit --top 30           # force-refresh canonical, show 30 classes
```

## Gate results (2026-07-05)

- **Gate 1 (reader byte-correct):** PASS — parses all 10,986 HC powers / 73,553
  effects and lands exactly on `BEGIN:SUMMONS`.
- **Gate 2 (structural agreement):** the oracle corresponds to our parser export on
  known-answer powers (Single Shot, Flash Arrow, Poison Gas Arrow match *exactly*
  under canonicalization). Every divergence buckets into a modeling class below —
  **none is a Sidekick/parser defect.**
- **Gate 3 (reproduces the collapse):** the resistible/unresistable-twin cohort
  (Flash Arrow, Poison Gas Arrow — the powers the 2026-07-05 converter fix repaired)
  matches the oracle exactly. Mids independently shows Flash Arrow's resistible +
  `IgnoreResistance` ToHit twin; the pre-fix generated output (commit `d94431fe0d^`)
  carried **0** `unresistable` markers, the post-fix output **1** — the oracle
  corroborates precisely the effect the collapse had dropped.

## Divergence taxonomy → DSH5 canonicalizer worklist

Modeling-convention differences the diff surfaces (NOT defects); each becomes a
typed rule in DSH5's tiered classifier:

| class | what | reconciliation |
|---|---|---|
| `PVP_MODELING` | Mids: base table + explicit PvE/PvP records. Ours: Any base + `_pvp*` override table. | fold `pv`→Combat + strip `pvp` token (done in `--normalize-pvp`) |
| `MULTI_TYPE_GRANULARITY` | Mids emits one record per damage type; our export keeps one multi-attrib record (e.g. Build Up: 7 `melee_buff_dmg` vs 1). | expand our multi-attrib templates one-per-attrib — **needs the DSH4 attrib→type bridge** |
| `MEZ_PVP_RESIDUAL` | our `_pvpmez` maps to Mids' `_ones`/`_special`, not `_mez`. | explicit table alias map |
| `INHERENT_EXTRA` | export carries `_inherentdamage` records Mids omits (the inherent bonus `damage.ts` deliberately filters). | skip inherent tables |
| `REDIRECT` | redirect shells (`effects: []` + `redirect[]`, e.g. Arachnos Burst→Crab/Wolf_Burst). Mids inlines the target; our export defers to the pointer. | resolve the redirect chain before diffing |
| `OTHER` | small residual: `_level` table ranged/melee-prefix differences + conditional-variant count imbalances in rich powers. | triage per-case in DSH5 |

## DSH5 harness — invariants, canonicalization, gate results (2026-07-05)

`diff_harness.py` sweeps **all 5,668 joined HC powers** (not a 14-power cohort) and
keys effects by the real DSH4 `(effectType, subType, resistible)` identity. The
build-out surfaced — and the harness now canonicalizes — the systematic *modeling*
differences that would otherwise masquerade as defects (each was verified against a
concrete power before being folded, never assumed):

| canonicalization | why | where |
|---|---|---|
| **complete-type-set fold** | an all-damage/all-position effect: Mids collapses to one `damage_type=None` record; our export lists every type (the bridge splits per-attrib). Fold a complete set → one `All` on both sides. Twin (R/U) folded independently, stays distinct. | Poison Gas Arrow (Mids 1 vs export 8) |
| **ResEffect fold** | Mids' catch-all for "resistance to a secondary-attribute debuff"; our bridge keeps the affected attrib at `aspect=Res` (the DSH4/DSH6 boundary). Bucket both → `ResEffect`. | Acid Arrow (−regen/−rec/−end…) |
| **set-not-multiset INV1** | Mids enumerates conditional/DoT/combo scale-tiers as separate records on the *same* key. Collapse drops a whole *distinct* sibling key — never duplicate copies — so compare distinct-key **presence**; count deltas on a shared key are advisory `MULTIPLICITY`. | Claw Swipe (Mids 28 vs export 6 Lethal) |
| **INV4 resistibility-flip** | a residual key whose base `(effectType\|subType)` exists on the other side with the opposite resistible bit — the twin-collapse axis. Split into its own `RESISTIBILITY_FLIP` class (kept in the worklist; not gated wholesale — Mids self-buff records carry an unresistable convention). | Power Surge (mez-protection U-twins) |

**Gate** (the teeth, false-positive-free): the known-answer cohort must match — Flash
Arrow + Poison Gas Arrow **twin-exact**, plus Single Shot / Acid Arrow / Build Up with
zero UNCLASSIFIED — and `--baseline` fails on any *new* UNCLASSIFIED signature. Both
green. Everything numeric/table-name against the ~5-week-stale, typo-carrying oracle is
**advisory only** (INV5 table-name agreement 97.0%; MULTIPLICITY 1,917) — gating on it
would be the one thing these guards must never do (a false positive).

**Result:** 2,576 / 5,668 powers carry a structural residual → `oracle_divergence_rules.json`
(schema `dsh5-oracle-divergence-rules/1`): BY_DESIGN 1,157 (redirect/inherent/pvp-only),
RELABEL 547 (type-granularity), **UNCLASSIFIED 6,245 = the DSH6 triage worklist.** The
UNCLASSIFIED bucket is genuine signal, not noise — spot-verified to be Mids semantic
relabeling (Enhancement = the `aspect=Str` boundary), content scope (incarnate/epic), the
289 resistibility-flips, and ~160 scattered "Mids has a damage type we lack" powers (e.g.
Mace Beam Blast Smashing+Energy vs our Energy — a concrete candidate finding for the bin
tiebreaker, DSH7). This is **local-only** (the `.mhd` is gitignored → not in CI yet, DSH7);
`.oracle_cache/` (the canonical dump) is gitignored, the distilled rules file is committable.
