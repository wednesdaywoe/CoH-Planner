# Data Gap Register

The audited state of the game-data pipeline, produced by the 2026-07-16 data-integrity
audit that gates the rebuild transplant (see the rebuild repo's plan). **Every known gap
is either FIXED (with a guard) or RECORDED here with severity and what it's blocked on.**
The audit bar is "no unrecorded unknowns," not "no gaps" — a recorded, understood gap is
an acceptable state; an unknown one is not.

Audit tooling (rerun after any parser/converter change):

| Leg | Tool | What it proves |
|---|---|---|
| Effect-count parity | `tools/data-audit/count_parity.py --oracle <CoD2 archive>` | no power silently drops its whole effects array (the class that hid the 265-power misalignment) |
| `.powers` scalar diff | `tools/extraction-audit/audit.py` | extraction completeness vs the authoritative `.powers` defs |
| Converter twin diff | `scripts/audit-converter-twins.cjs` | the same power through two converter paths has the same base shape (dead-snipe / flat-Soul-Drain class) |
| Coverage census | `scripts/audit-coverage-census.cjs` | per-partition atom coverage; structural zeros visible, not averaged away |

CoD2 oracle archive: `~/Downloads/raw_data_homecoming-20251209_7415` (HC-only; rebirth
and thunderspy have NO independent archive oracle — their assurance rests on the twin
diff, the census, and the committed-export discipline).

---

## BLOCKERS (do not proceed past these)

### TSPY-1 — ~~the on-disk Thunderspy `bin.pigg` is INCOMPLETE~~ — RESOLVED 2026-07-17, re-export is permitted
**Severity: was blocker (for any tspy re-export) · Status: RESOLVED · Synced into this repo 2026-07-29**
**This entry was stale in this repo until 2026-07-29** — it still said "never re-export tspy"
months after the blocker was cleared, and that stale text was cited as blocking HC-3's parser
fix. Resolved in the rebuild (`coh-sidekick-1.0`, `docs/DATA-GAP-REGISTER-RESOLVED.md`
TSPY-1): a fresh powers parse of the current on-disk `tspy/bin.pigg` reproduces the committed
`exported_powers/thunderspy` tree **byte-for-byte** — 10,438 files, 0 content diffs, 0 drops,
0 spurious files, `diff -rq` both directions — and Super Speed (the 2026-07-16 "data is gone"
example) parses with its full `SpeedRunning` buffs. The blocker's own exit condition is met.
Thunderspy has since been re-exported twice on tspy parser improvements. Verified 2026-07-29
that **this repo's `exported_powers/thunderspy` and `/rebirth` power trees are byte-identical
to the rebuild's**, so that verification applies here directly.

**Live caveat (carried over):** a powers-only `export_powers.py` run does NOT emit the
committed tree's `entities/` and `tables/` subtrees (separate exporters). Any re-export must
regenerate or preserve those, or they are lost.

**Historical record (2026-07-16, superseded):** a fresh parse of the *then*-on-disk binary
yielded Super Speed as a single `Ones 35` template; the committed export was ruled to outrank
it and re-export was blocked — a correct call for that artifact. Either the client shipped a
complete binary since, or later parser work learned the `Ones`-front/index-array encoding that
looked degenerate (present-but-unparsed, not gone). Not disambiguated; doesn't change the
result. The real remaining tspy gap is TSPY-3 (atom typing), not missing data.

## RECORDED gaps (understood, tracked, not currently wrong-in-app)

### TSPY-2 — Combat Jumping / Hover `jumpHeight` missing (tspy)
**Severity: minor (one stat on two powers) · Status: RECORDED · Blocked on: parser change (+ TSPY-1 for verification)**
Encoded Ones-front with the real attrib in the post-requires index array — a deeper
front-vs-index layer than the known relabel; needs a parser change to read. CJ's defense
already works; only jumpHeight is absent.

### TSPY-3 — tspy atoms are largely `Unmapped`; the bag is load-bearing for tspy
**Severity: major (for the atom-native rebuild), none (for the current bag-reading app) · Status: RECORDED**
2,409 of 2,798 tspy powerset files carry `Unmapped`-typed atoms (HC: 0, Rebirth: 0);
only ~430 typed `Damage` atoms exist dataset-wide, and Heal/MaxHP/MezResist/Absorb are
near-zero (see census). Root cause: the tspy schema drops `aspect`/`target` and fronts
category labels (documented in GAME-DATA-PRINCIPLES §7), so the honest atom ingest emits
`Unmapped`/`Unspecified` rather than fabricate discriminators. The BAG (including the
top-level `damage` array/scalar forms) carries the recovered tspy values via the guarded
recovery lanes and is what the planner reads.
**Consequence for the rebuild:** the contract's transitional `effects` bag is REQUIRED
for tspy parity — not merely for the ~14 unmigrated effect families. Improving tspy atom
typing is pipeline work (partly blocked on TSPY-1).

### HC-1 — count-parity sweep vs CoD2: clean; residual classes explained
**Severity: none · Status: CLEAN (2026-07-16)**
`ZERO_DROP = 0` (after resolving redirect shells — 10 self-rez/heal powers carry their
templates on `redirects/*` targets, converter follows them). `MISSING` (15,898) is
category scoping by design: `boosts`/`set_bonus` come from `boostsets.bin` via the IO-set
extractor; NPC/critter/mission/AE categories aren't exported (the planner doesn't model
enemy powers); `temporary_powers`/`event`/`prestige` aren't modeled (a future-feature
decision, not a drop). `COUNT_DELTA` (428) explained: CoD2 de-dups PvE/PvP template
pairs (export>oracle, 384) and inlines redirect/Execute_Power chains that our pipeline
resolves at convert time instead (oracle>export, 73 — spot-verified Head Splitter,
Category Five, Resurgence land their damage in `generated/`).

### HC-2 — `.powers` audit residuals: drift class + field-capture backlog
**Severity: low · Status: RECORDED**
Attrib section is entirely the documented drift class (slot-reuse renames: Willpower
Resurgence → "Up to the Challenge", Smoke Flash → "Bo Ryaku"; plus one `kUnique3` on a
silent temp power). Power-level field backlog — the mechanically-relevant subset worth
capturing eventually (§1 captured-vs-used rule): `ProcAllowed` (76 powers, proc
eligibility), `OverCapMultiplier`/`OverCapTrigger` (63), `MaxBoosts` (63), `ChainDelay`
(28, chain-jump powers), `MaxToggleTime` (16, Hibernate-class), `CastableAfterDeath`
(36), and server-only `StrengthsDisallowed` (952 — not in the client bin; would need
`raw defs/` sourcing). None feed a currently-modeled calc feature.

### HC-3 — ~~`MainTargetOnly` / `ProcMainTargetOnly` dropped (proc area-factor mis-scoring)~~ — RESOLVED 2026-07-29
**Severity: was MEDIUM (≥7 player power families, only 1 worked around) · Status: RESOLVED — power-level field decoded, exported, and read from the `Power` object; the curated override is deleted**
`_parse_effect_group` read the group flag word (`flags_val`) but kept only the PvE/PvP
bits (bit 0/1), discarding `MainTargetOnly` — and the power-level `ProcMainTargetOnly`
was not parsed at all. Consequence: a power whose damage lands on the main target only
while it carries an AoE radius from a *secondary* effect is indistinguishable from a
genuine AoE (Propel's damage groups look identical to Fire Ball's — both `radius_outer -1`
= "inherit power area"). Damage procs slotted in such a power were scored against the 15ft
AoE area-factor (~22–28%) instead of single-target (~59–76%).

**Scoping pass 2026-07-28 (bug-reporter follow-up: "find powers that have this flag").
The earlier claim "only Propel is affected" was wrong — it came from an effects-shape scan,
not from the flag.** Ground truth is `raw defs/` (the `.powers` server source; note the
local dump is PARTIAL — no `Controller_*`, `Corruptor_*`, Kheldian or Widow trees, so
these counts are a lower bound):
- **`ProcMainTargetOnly kTrue` (power-level — CoD2's `procs_only_on_main_target`, the field
  the reporter cites): 92 files.** 54 are `EffectArea kCharacter`, where it can't change an
  area factor (single-target melee: Chop/Bash/Clobber/Beheader…). **38 carry a real radius
  and would switch to the ST calc**, in 7 distinct power families: `Placate` (15ft — 17
  Stalker sets + Bane Spider), `Ground_Zero` (15ft, 5 ATs), `Touch_of_Fear` (6ft, 9ft on
  Tanker), `Lightning_Clap` (10–20ft), `Tesla_Cage` (kChain 10ft), `Focused_Burst`
  (kChain 8ft), `Propel` (15ft). Plus `Spirit_Ward` (no radius — no-op).
- **`Flags MainTargetOnly` (effect-group level) is a DIFFERENT field: 258 files.** Only 12
  powers carry both. Do not conflate them.

Bin decodability, probed against the 4,915 raw-defs files that match a bin power:
- The **group-level** flag IS recoverable: group-flag word **bit 3 (value 8)** matches
  `Flags MainTargetOnly` with **124 true-positive / 0 false-positive** — but 134 misses, so
  bit 3 alone is a partial decode, not the whole story.
- The **power-level** flag is NOT that bit (80 powers have the power flag and no bit-3
  group; 112 the reverse).

**DECODED 2026-07-29 — it sits four words past where the tail decode stopped.** The real
layout after `StrengthsDisallowed` is `GlobalStrengthsDisallowed` (u4_array), two unnamed
bools, `ProcMainTargetOnly`, `AnimMainTargetOnly`. Verified against the `raw defs/**.powers`
oracle over all 4,943 authored player powers:

| field | result |
|---|---|
| `GlobalStrengthsDisallowed` | 15 TP / 0 FP / 0 FN, exact per-power element counts |
| `ProcMainTargetOnly` | **92 TP / 0 FP / 0 FN** |
| `AnimMainTargetOnly` | 48 TP / 0 FP / 0 FN |

**The probe lesson (worth more than the field).** An earlier probe of this region found a
near-perfect separator with 12 stubborn false positives — Teleport Foe, Kuji-In Rin,
Starless Step. They were not noise: every one carries `GlobalStrengthsDisallowed`, an unread
variable-length array that shifted exactly those records by `1+N` words onto a default-`1`
neighbour. Reading it first took the false positives to zero. **A ragged edge in a positional
probe is a variable-length field you have not read yet — ask what the outliers share before
doubting the hypothesis.**

The two unnamed bools only ever vary on `5thColumn.Aereus_Goliath_*` NPC powers, which have
no authored def to name them from, so they ship raw rather than being discarded (unknown is
exportable; discarded is unrecoverable). All four are bool-guarded — a value outside 0/1
raises, so a future layout shift drops the fields loudly instead of shipping a misread.
Re-export produced zero new tail-parse failures.

**The forks have no such field.** 40 words were probed past Parse6's `StrengthsDisallowed`
in both Rebirth and Thunderspy; no bool separates the flagged set (best: rebirth word[27],
39/84 with 155 FP), and `GlobalStrengthsDisallowed` is absent too — consistent with Parse6
following the stock i24 `ParseBasePower` table with no HC insertions. Absent field = absent
feature: Rebirth/Thunderspy Propel keeps the AoE denominator, now as a data statement rather
than an assumption.

**The one piece of counter-evidence is RETRACTED (2026-07-28).** The 2026-07-07 live log
(Touch of Fear landing three Eradication procs on three different targets in one
activation) was read as disproving the flag. **An HC dev explained the structure: Touch of
Fear is three powers in one — the parent runs two `ExecutePower` children, one ST and one
AoE.** The procs rolled on the AoE *child*, which does not carry the parent's flag. The log
never tested the flag at all, and the "DISPROVEN" verdict in `power-level-fields-triage`
is withdrawn. Confirmed in the source: `Touch_of_Fear.powers` carries
`Attrib kExecutePower` + `Flags NoHitDelay CopyBoosts`.

Splitting the flagged-with-radius families by whether they act directly or via a wrapper
(this is what decides which are testable, and it cleanly isolates both confounds):

| family | files | structure | radius |
|---|---|---|---|
| `Propel` | 1 | direct (`Attrib kSmashing` under `Flags MainTargetOnly`) | 15 |
| `Lightning_Clap` | 3 | direct (`Attrib kEnergy` + `kStunned`) | 15 |
| `Placate` | 20 | direct | 15 |
| `Tesla_Cage` | 3 | direct | 10 (chain) |
| `Focused_Burst` | 1 | direct | 8 (chain) |
| `Spirit_Ward` | 1 | direct | — (no-op) |
| **`Ground_Zero`** | 5 | **ALL `ExecutePower` wrappers** | 15 |
| **`Touch_of_Fear`** | 4 | **ALL `ExecutePower` wrappers** | 6, 9 |

Both wrapper families are unusable as evidence *and* untestable (see HC-4).

**VERIFIED LIVE 2026-07-28 — the ST calc is correct for Propel.** Gravity Controller vs a
Vanguard Training Pylon, Explosive Strike: Chance for Smashing Damage (3.5 PPM) as the only
proc, no recharge slotted in Propel:

| | |
|---|---|
| activations | 74 (8 misses, each followed by a streakbreaker hit — 8/8 internally consistent) |
| hits | 66 |
| procs | **43 → 65.2%** (95% CI 53.7–76.6%) |
| **ST model** (radius 0) | predicts 58.7% → 38.8 procs · **z = +1.06, p = 0.18 — consistent** |
| **AoE model** (15ft) | predicts 21.9% → 14.4 procs · **z = +8.51, p = 5.6e-14 — excluded** |

The AoE denominator is dead by 8.5 sigma. The observed rate runs a touch above the ST
prediction, but 1.1σ on n=66 is noise — no further claim. This validates the whole
`PROC_MAIN_TARGET_ONLY_POWERS` override *and* the 2026-07-28 correction that extended it
from foe-damage procs to every proc (the area factor is per-power, so a damage proc measures
the exact denominator Force Feedback rolls against).

**GENERALITY CONFIRMED 2026-07-29 — `Lightning_Clap`, second independent family.** Same
Explosive Strike proc, single pylon: **65 hits → 61 procs = 93.8%** (95% CI 88.0–99.7%).
AoE model predicts 35.2% → 22.9 procs, **z = +9.89, p = 2.8e-23 — excluded**. ST model
(our 90% clamp) predicts 58.5, z = +1.03 — consistent; uncapped 94.7% fits marginally better
(z = −0.30) but n=65 cannot separate 90% from 94.7%, so the clamp stands unchallenged. The
tested copy is confirmed as a *flagged* radius-15 one (Brute/Scrapper/Tanker): the observed
~16.2s cycle matches 15s recharge + 1.23s cast, not Stalker's 20s/2.53s or Blaster's
10s/2.03s. **Two independent families ⇒ the flag is the mechanism, not a Propel quirk.**

**BUT: the flag is per-AT-COPY, not per power name — a name-keyed override is unsafe.**

| family | flagged copies | NOT flagged |
|---|---|---|
| `Placate` | 20/21 (all player copies) | Mastermind pet `Jonin_2` |
| `Lightning_Clap` | 3/6 — Brute, Scrapper, Tanker (r15) | **Stalker (r10), Blaster (r20)**, Dominator (r0, no-op) |
| `Tesla_Cage` | 3/4 — Blaster, Defender, Sentinel (chain r10) | Dominator Electric Control (r0, no-op) |
| `Focused_Burst` | **1/4 — Scrapper only** | **Brute, Stalker, Tanker** (all r8) |
| `Propel` | 1/1 (dump has only the Dominator copy) | — |

Extending `PROC_MAIN_TARGET_ONLY_POWERS` by `internalName` would therefore *introduce* a bug:
Stalker Lightning Clap (61.8%→90%), Blaster Lightning Clap (21.6%→70.2%) and 3 of 4 Focused
Bursts would get an unearned boost. And `internalName` is the wrong key in principle — the
generated layer stores one Power object per AT copy, all sharing `internalName`, and even
`powerSet` doesn't discriminate (Scrapper and Stalker both call it "Electrical Melee"). This
is [[rain-of-fire-fireblast-internalname-collision]]'s bug class. **The flag belongs as a
field ON the Power object**, not in a name list — which is what the parser fix produces
naturally, since `powers.bin` keys `full_name = Category.Powerset.Power`.

Under-count that remains (3.5 PPM / 2 PPM proc, current → correct): Lightning Clap
35.2→90% / 20.1→54.1%; Tesla Cage 33.4→71.0% / 19.1→40.6%; Sentinel Tesla Cage 38.9→82.7%;
Scrapper Focused Burst 30.7→58.3%; Bane Placate 77.7→90%; Stalker Placate 90→90% at 3.5 PPM
but **75.4→90% at 2 PPM** (Force Feedback). Ground Zero caps either way (no visible change).
Only Propel is corrected today. `Ground_Zero`/`Touch_of_Fear` are the HC-4 wrapper families —
their procs roll on a child, so the parent's flag may not even govern; leave them alone.

**What shipped.** The flag rides the export as `procs_only_on_main_target`, the three power
converters put it on the `Power` object as `procsOnlyOnMainTarget`, and
`resolveProcRollGeometry` (`src/data/proc-data.ts`) — the single seam every PPM surface
calls — reads it. **95 converted powers carry it**, against the 1 the name-keyed set could
reach. `PROC_MAIN_TARGET_ONLY_POWERS` and `isProcMainTargetOnlyPower` are deleted, and with
them the Rule-0 deviation: the per-AT table above is now reproduced by the data itself
(Lightning Clap flagged on Brute/Scrapper/Tanker, absent on Stalker; Focused Burst on
Scrapper alone of four). The guard `src/data/proc-main-target-only.test.ts` asserts that
directly off the generated powers, which the hardcoded set made impossible; both axes are
mutation-tested.

The interim override was correct while it lasted — the first cut, 93807f1fab, applied it
only to foe-damage procs and left Force Feedback on the 15ft denominator; corrected
2026-07-28, since the flag is a property of the power, not of the individual proc.

Not fixed here (deliberate): `globalStrengthsDisallowed` still comes from the `raw defs/`
scrape rather than the export, even though the bin now carries it — the two disagree on
attrib vocabulary (`Psionic_Dmg` vs `Psionic`), so switching sources is a consumer-visible
rename, not a drop-in. Note also that `ProcAllowed` (HC-2 backlog) lives in the same
power-level flag family.

### HC-4 — procs in `ExecutePower` wrapper powers roll on the CHILD, not the parent
**Severity: unknown, potentially material · Status: OPEN, found 2026-07-28 · Found via: HC-3**
Some powers deal nothing themselves: the parent carries `Attrib kExecutePower` with
`Flags NoHitDelay CopyBoosts`, and `CopyBoosts` hands the parent's slotted enhancements —
**including procs** — to the child that does the work. An HC dev's description of Touch of
Fear ("a sneaky three powers in one — the main power does two Execute Powers, one for ST
one for AoE") is the canonical shape, and a live log confirms procs firing from the child.

The planner scores a slotted proc's PPM against the **parent's** radius/arc and recharge.
If the game rolls it on the child, the inputs are wrong in both terms: the child has its own
geometry (Touch of Fear's ST child and AoE child differ), and a child's recharge is
typically 0 — so which recharge the engine feeds the PPM window is an open question. Where
a parent fans out to more than one child, one activation may also roll more than once.

Unquantified — the population of wrapper powers that accept procs hasn't been counted, and
no live measurement exists. Known instances: `Touch_of_Fear` (4 files), `Ground_Zero` (5).
Both surfaced only because HC-3's flag scan happened to cross them, so treat those two as a
lower bound, not the population. First step is a census of `kExecutePower` + `CopyBoosts`
powers that allow boosts, then a live proc-rate measurement on one of them.

### TWIN-1 — converter-twin shape divergences: triage worklist
**Severity: low-medium (each needs an individual eyeball) · Status: RECORDED, worklist**
After filtering gated conditionals, chance-0 riders (see METHOD-1), and §3 strength
meta-templates: **HC 36 / Rebirth 24 / Thunderspy 7** base-shape divergences between
powerset copies and their pool/epic twins. **No ATOMLESS powers, no missing-damage class
on HC/tspy.** Dominant explained classes: same-name different-power collisions (Titan
Weapons vs Mace Mastery "Shatter Armor"), genuine epic retunes (epic Hibernate/EM Pulse/
Frozen Armor differ in-game from their powerset namesakes), and Rebirth's FE-rider
encoding (its 2 missing-damage hits are the chance-0 Fiery Embrace rider, encoded
differently than HC). Worklist: rerun `scripts/audit-converter-twins.cjs --json` and
burn down entries during calc-port milestones; treat any NEW entry after a converter
change as a regression signal.

### CENSUS-1 — coverage census: clean, two benign structural zeros
**Severity: none (verify during M2 ports) · Status: CLEAN (2026-07-16)**
100% of swept powers carry atoms or a bag (0 empty powers, all datasets). Pool partition
has zero MaxHP and zero Elusivity atoms on HC/Rebirth — plausibly correct (no pool power
grants +MaxHP or elusivity); re-verify when porting those effect families.

## Method notes (learned by this audit; candidates for GAME-DATA-PRINCIPLES)

### METHOD-1 — chance-0 templates are conditionals wearing a probability field
The Fiery Embrace fire rider rides every FA-adjacent melee attack as a present-but-inert
`baseProbability = 0` Damage atom (e.g. Brute Knockout Blow: `Damage|Fire scale 1.602,
prob 0`, ungated, no requires). A mechanic flips the chance at runtime. Any analysis
that partitions atoms into base-vs-conditional MUST treat `baseProbability === 0` as
gated, or every FE-capable attack reads as carrying phantom base fire damage.

### METHOD-2 — audit false-positive filters, in order
When diffing shapes: (1) resolve redirect shells (`redirect` field → `redirects/*`
targets) and Execute_Power chains before calling a zero a drop; (2) exclude
`aspect=Str, scale=0` strength meta-templates (§3); (3) treat `gated` and chance-0 atoms
as conditional; (4) intersection-reference same-name copies (union-referencing inflates
"missing" on name collisions); (5) scope the export tree — `exported_powers/` nests
`rebirth/` and `thunderspy/` subtrees under the HC root.

---

*Update this register whenever an audit leg is rerun or a recorded gap changes state.
A gap leaving this file must leave as FIXED-with-a-guard-test, not as silently deleted.*
