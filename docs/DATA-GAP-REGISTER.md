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

### TSPY-1 — the on-disk Thunderspy `bin.pigg` is INCOMPLETE. Never re-export tspy.
**Severity: blocker (for any tspy re-export) · Status: RECORDED · Blocked on: obtaining a complete, verified tspy binary**
A fresh parse of the current binary yields Super Speed as a single `Ones 35` template —
the real movement data is gone from the binary but present in the committed export
(discovered 2026-07-16 while verifying a planned re-export; the verification prevented a
regression). **The committed `exported_powers/` outranks any fresh tspy parse.** A
re-export is only permissible after a complete binary is obtained AND verified against
the committed export (count-parity style diff, both directions).

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

### HC-3 — effect-group `MainTargetOnly` flag dropped (proc area-factor mis-scoring)
**Severity: low (one player power, worked around) · Status: RECORDED · Blocked on: parser change + re-export**
`_parse_effect_group` reads the group flag word (`flags_val`) but keeps only the PvE/PvP
bits (bit 0/1), discarding `MainTargetOnly` — and the power-level `ProcMainTargetOnly`
isn't parsed at all. Consequence: a power whose damage lands on the main target only
while it carries an AoE radius from a *secondary* effect is indistinguishable from a
genuine AoE (Propel's damage groups look identical to Fire Ball's — both `radius_outer -1`
= "inherit power area"). Damage procs slotted in such a power were scored against the 15ft
AoE area-factor (~22–28%) instead of single-target (~59–76%). **Only Propel is affected
among player powers** (Controller/Dominator Gravity Control; scan of 10,707 HC powers).
Worked around in the calc layer via the curated `DAMAGE_MAIN_TARGET_ONLY_POWERS` set
(`src/data/proc-data.ts`) — damage procs there roll single-target, non-damage procs
(Force Feedback) keep the AoE radius (matches in-game). Durable fix: decode the
`MainTargetOnly` bit in the parser + re-export, then key the override off the real flag.
Note: `ProcAllowed` (HC-2 backlog) lives in the same power-level flag family.

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
