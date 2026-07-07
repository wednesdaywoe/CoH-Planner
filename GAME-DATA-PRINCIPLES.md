# Game-Data Handling Principles

Durable guidance for working with City of Heroes game data in this project —
the principles and the specific gotchas that keep biting us. Read this before
touching the bin parser, the converters, or the calc when game data looks wrong.

**Scope:** this started as powers guidance and most examples below are powers
(the bin parser's original focus), but the principles apply to **every data
domain we binary-source** — powers, archetypes, enhancements, IO sets, AT
tables, pet entities, incarnates. The binary-sourcing campaign now spans several
of these; treat "power" in older examples as "whatever game data you're touching."
§12 collects the cross-domain method (anchoring, fingerprinting, verifying
derived data) learned extending this beyond powers.

This is the **principles reference**. The chronological issue log lives in
[HOMECOMING_PARSER.md](docs/HOMECOMING_PARSER.md); project setup is in CLAUDE.md.

---

## 0. The Standing Principle: When there is a decision to be made, the preference is always in favor of decisions that move the planner toward being more data-driven

Getting away from hand-curated data entries and overrides is an ongoing battle that has roots in the earliest versions of this planner. Clearing away fragile data and consolidating sources of truth should be preferred over quick wins. This connects directly back the development philosophy: **Prefer fixing root problems properly over quick fixes**

## 1. The core rule: capture everything mechanical; don't assume our *use* of it is complete either

> The data was rarely the problem. Our assumptions about what the planner needs were.

The recurring failure mode that has bitten us many times: decide a field is
"not relevant for a build planner," drop it (or never use it), then discover months
later it mattered. Examples: offensive knockback, foe -KB protection, brute modifiers,
Kinetic Melee, Kheldian effects, `IgnoreStrength`.

> Examples of 'low value data' turns out to be signifcant (HOMECOMING_PARSER.md)
> 6/11/26

  Three log items filed as "low-value leftovers" → on
  investigation, two were genuinely-wrong player-facing bugs with clean fixes:
  - Fire Imps/Gremlins "cosmetic P-hash, indistinguishable from a rain, unmergeable" →
    the discriminator (the P-hash's own `priority_list`) was in the data all along; a
    garbage entity was shown to every Fire/Electric Controller+Dominator. FIXED.
  - Soul Extraction "needs a tier model, low value" → it showed NO pet at all. FIXED with
    a `mutuallyExclusive` summon variant.
> 6/11/26
    Began as "10 unresolved are all NPC/temp, not player". Upon questioning that assumption, it turned into "Trip Mine shows no damage." On further investigation, we find a SYSTEMIC parser misalignment that drops effects on ~265 entity/pet powers (incl. Trip Mine).
 



**Rule:** capture and surface everything that affects *what a power does*. Skip only
**asset / presentation references** — `VisualFX`/`.PFX` paths, animation `include`s,
combat-text message IDs (`P119576033`), icon internals. Those are art-pipeline pointers
with zero build-math or stat-display value. Everything else (effects, attribs, tables,
scales, magnitudes, durations, stacking, conditions/`Requires` gates, flags like
`IgnoreStrength`) is in-scope.

**There are TWO layers where we "skip" — both bite:**
1. **Parser / export** — the data isn't extracted into `exported_powers/` at all
   (the irreversible "missing data" pattern).
2. **Converter / calc** — the data *is* in `exported_powers/` but the converter doesn't
   emit it, or the calc doesn't honor it (knockback was dropped here; `IgnoreStrength`
   was only honored for regen). This is the higher-ROI gap class — captured-but-unused.

When you find a gap, ask which layer it's in. If it's already in `exported_powers/`,
it's a converter/calc fix (no re-extraction needed).

## 2. Verify, don't assume

Before declaring anything "moot," "already handled," or "irrelevant," **prove it with
the data.** The `IgnoreStrength` "mostly moot" call was wrong — verification found 288
real effects and a confirmed over-enhance bug. Concretely:
- A count that looks suspiciously high or low usually means you're matching the **wrong
  thing** — go inspect 3–5 concrete examples before drawing conclusions.
- Trace one clear case end-to-end (source `.powers` → `exported_powers` → `generated` →
  calc/display) before generalizing a fix.
- **Comments lie — grep before trusting them.** In-file comments here have actively
  misdescribed data flow. A 2026-06 adversarial audit found `buffDebuffModifier`
  documented as *"effectively VESTIGIAL … the calc just never reads them"* while
  `damage.ts:864` reads it (a live table-less fallback). A maintainer trusting that
  comment reasons about a system that does not exist. Treat any in-file claim that data
  is *"vestigial," "never read," "safe to ignore,"* or *"handled elsewhere"* as a
  hypothesis to verify with a grep, not a fact — and when you confirm one is false, **fix
  the comment in the same change** so it can't mislead the next person.

## 3. The recurring traps (read before any effect-data analysis)

These are why a naïve `flags.includes('X')` or attrib match over-fires:

- **Strength meta-template.** Damage AttribMods with `aspect=Strength, scale=0` on
  `*_Ones` tables are the engine's *strength-definition* rows, **not real effects**.
  A naïve "mark all `IgnoreStrength` unenhanceable" would have de-enhanced ~1,600
  attacks because they carry the flag only on this meta-template. **Exclude
  `aspect=Strength` / `scale=0`.**
- **Resistance-aspect templates that use stat attribs.** `aspect=Resistance` templates
  use `*_Dmg` / `Base_Defense` / `ToHit` attribs but are **-Resistance debuffs** (Venom
  Grenade) or **debuff-resistance** (Obsidian Shield's Base_Defense) — *not* the player's
  damage/defense buff. **Discriminate by aspect, not attrib name.**
- **Proc and pet contexts.** Chance-based (`chance < 1` or `ppm`) groups are procs
  (fixed output, handled as `specialEffects`); `pets`/`*_pet` category powers have their
  own modifiers. **Exclude both** from "the player's enhanceable effect" analysis.
- **Offensive vs protection knockback.** Positive-magnitude `aspect=Current` KB is the
  attack knocking the foe (emit as `knockback`); `aspect=Resistance` **or negative scale**
  is KB *protection* appliRefactor code structure for improved readability and maintainabilityed to the foe (immobilize -KB) — a different thing. Sign and
  aspect matter.
- **Mez tables: prefer PvE over PvP.** A power's mez may exist on both `*_PvPMez` and a
  PvE table; prefer the PvE one. A small allowlist grandfathers genuinely PvP-only powers.
- **Conditional `group` ≠ `mode` (mutual-exclusivity is not "replace base").** A
  conditionalEffect's `group` makes siblings mutually exclusive (one Bio Armor adaptation
  stance at a time); its `mode` controls whether the active member *replaces* or *adds to*
  the base power's effects. These are **orthogonal**. The converter once force-tagged every
  grouped conditional `mode: 'replace'`, which silently dropped always-on base values: the
  raw `.powers` def for Environmental Modification shows the base +Def(Fire 1.5) mod has **no
  `Requires`** (always-on) while each stance is a separate `Requires k<Mode>Adaptation
  source.Mode?` mod that **adds** +Def(Fire 0.45) on top (total 1.95). A genuine `replace`
  exists only when a base template *negates the conditional's own predicate* (Suffocate:
  base "if NOT drowning", conditional "if drowning") — that's detected via `baseNegated`.
  Grouped conditionals otherwise default to **additive**. The dashboard calc applies the
  active mode as a *synthetic active power* (`expandActiveConditionals`) so colliding effect
  keys SUM at the totals level instead of forcing a lossy merge.
- **Compound gates: test "untoggleable" on the STRIPPED expression, not the raw.** A
  conditional's `requires_expression` can chain a *strippable* game-state clause (per-target
  HP-state `Cur.kHitPoints target> 0 >`, PvE/PvP `enttype`) with a *real* toggle (`k<Mode>
  Source.Mode?`). `_classifyConditionalGate` must run `_isUntoggleableGate` on
  `_stripIgnoredClauses(req)` — checking the raw req rejects the whole gate because the HP
  clause reads as untoggleable game-state, silently dropping the mode bonus. This bit DNA
  Siphon: its Defensive (+HP per living foe) and Efficient (+Regen/+Rec per defeated foe)
  bonuses were dropped while Offensive (a plain `enttype`+mode gate) survived. The general
  rule: strip the ignored clauses first, then classify what remains.

**The validated discriminator for "the player's own enhanceable stat":**
`aspect ∈ {Current, Absolute, Magnitude}`, non-proc, non-pet, and positive scale where
sign distinguishes buff from debuff/protection.

## 4. `IgnoreStrength` (and `IgnoreResistance` / `IgnoreCombatMods`) specifics

`IgnoreStrength` means the effect ignores the caster's Strength (enhancements + global
buffs for that attribute). It's captured in `template.flags`. An effect with it must
**not** be boosted by the matching enhancement/global buff.

- It only matters for effect types that are *actually enhanced in the calc*. Verify
  per type: `recoveryBuff` (End Mod) and `tohitBuff` (ToHit) **are** enhanced → split to
  `…Unenhanced` keys. `rechargeBuff`/`absorb`/`enduranceGain` are **not** enhanced in
  the calc → no split (splitting would create dead keys / a new drop).
- Pattern: route to a `XBuffUnenhanced` key (mirror `regenBuffUnenhanced`); add it to
  the global total **without** the enhancement multiplier; add the key to
  `CASTER_BUFF_KEYS` so a power whose only buff is unenhanced still registers.
- Beware `activation_effects`: non-regen `IgnoreStrength` templates are currently
  *dropped* there — but some are genuine unenhanceable-only effects (keep) and some are
  enhanceable-copy duplicates (drop). Needs the duplicate-vs-genuine discriminator.

## 5. The raw source is the oracle (`.powers` for powers)

`raw defs/` holds the HC dev's authoritative `.powers` source (4,943 powers, same
category structure; public game data). It is the ground truth for "what should be there."
`tools/extraction-audit/` (`parse_powers.py` + `audit.py`) diffs `.powers` vs
`exported_powers` to find gaps **proactively** instead of one-at-a-time. The attrib side
needs a `.powers`↔export name-map before its numbers are trustworthy (`kDefense` =
`Base_Defense`, `kSpeedFlying` = `FlyingSpeed`, etc.).

**Generalizes beyond powers:** every data domain has a ground-truth source to
verify against. For data we *derive* or used to hand-port (archetypes, IO sets),
there are TWO oracles — the prior hand-port (what was true when written) and the
binary (what's true now); diff both. See §12 for the cross-domain method.

**Diff the WHOLE export against the oracle — silent drops are invisible from the
inside (2026-06-11, the bite that keeps biting).** "Trip Mine shows no damage" looked
like one niche power; a blunt count-diff of *every* power's effect-template total
(`exported_powers` vs the CoD2 archive `raw_data_homecoming-*`, child_effects counted on
both sides) surfaced **265 powers** our parser silently drops effects on — a whole class
of pet/summon entity powers (Mastermind_Pets, Incarnate/Lore, Kheldian_Pets, Objects…).
The data was in `powers.bin` the whole time (CoD2 reads the same file and gets it); the
parser **misaligns** on those records (`_parse_effects` reads a garbage `eff_count` like
2360) and the surrounding **`try/except pass` swallows every failed group read → `effects:
[]`, no crash, no warning.** Two durable rules from this:
- **A self-consistent pipeline proves nothing.** Our export, converter, and calc all
  agreed on "0 effects" — internally consistent, externally wrong. Only an *independent*
  oracle diff catches a silent drop. Keep a cheap effect-count parity sweep
  (CoD2 vs export) in the toolbox and run it after any parser change, not just when a
  number looks off.
- **Beware the false positive in the diff itself.** A first pass flagged Dual Pistols /
  Electrical Melee as "empty" — they merely *nest* their templates in `child_effects`
  while CoD2 flattens to top-level. Count **deep** (recurse `child_effects` +
  `activation_effects`) on both sides before believing a mismatch.
- **Fail loud, not silent.** A `try/except pass` around a struct read turns a parser
  misalignment into invisible data loss across hundreds of powers. Swallowed parse
  failures must at least `log` (power name + what was dropped) so the next misalignment
  announces itself instead of hiding for months.

## 6. The re-export workflow (always de-risk)

When a parser change needs a re-export, **export to a scratch dir first and diff against
committed `exported_powers/`** — this isolates the new field from any game-data drift
(an HC/Rebirth patch since the last export) so you review exactly what changed before
committing.

- Homecoming assets: `G:\Homecoming\assets\live`
- Rebirth assets: `G:\Thunderspy Gaming\Sweet Tea\rebirth`
- Command: `py -3 -m bin_crawler.export_powers --assets-dir <dir> --output-dir <scratch>`
- Adding a universal field (e.g. `toggle_ignore`) touches ~every power JSON — a large but
  expected diff. Confirm the *only* non-field change is benign before committing.
- **A refresh re-export also pulls in unrelated drift — isolate it.** Re-exporting to add
  one field will also pick up any game-data change since the last export (e.g. boss-class
  category flips, a new `Melee_SSHealSelf` table on PB/WS). For a *focused* commit, keep
  only the target files and `git checkout` the rest — or call out the incidental refresh
  explicitly in the message. (The archetype-defs leg reverted ~100 critter-table files to
  keep the diff to the player ATs it actually touched.)

## 7. Cross-server binary formats: HC Parse7 vs Rebirth/Thunderspy Parse6

Two structurally different formats. **Design converter features key-based, not
structure-based** — anything keyed off `Tag`s or the `EffectGroup` wrapper
silently no-ops on Rebirth.

- **HC = Parse7.** Effects are nested `EffectGroup`s carrying group-level `Tag`,
  `chance`, `is_pvp`.
- **Rebirth / Thunderspy = Parse6** (`_parse_effects_parse6`): **no `EffectGroup`
  wrapper** — flat AttribMods, each wrapped in a *synthetic* single-template
  group. So **no group-level `Tag`** (HC's tag capture comes back empty for
  Rebirth), `chance` is derived from the template `tick_chance` (with a `0 → 1.0`
  default that hides HC's chance-0 gating), and `is_pvp` is synthesized from the
  `enttype` clause in the per-template requires.

Both formats land the same effect **keys** in base, so attribute by key when a
feature must work on both. Worked example: Dual Pistols Swap Ammo keys on
`defenseDebuff`/`rechargeDebuff`/`damageDebuff`, not HC ammo `Tag`s — see the DP
entry in [HOMECOMING_PARSER.md](docs/HOMECOMING_PARSER.md).

**When a format DROPS a discriminator field, a byte-level relabel can't reconstruct
the semantic — you need an out-of-band signal, and an adversarial audit to find where
it's missing.** Thunderspy's `Ones`-attrib templates carry the *affected* stat only as an
index array, but the schema **drops both the AttribMod `aspect` and the per-template
`target`** — exactly the two fields that separate a buff from a resistance and a
self-effect from a foe-effect. Recovering the attrib from the index is honest, but routing
it by *sign alone* then silently mislabels (a) "resistance to recharge slow" as a +recharge
buff (aspect gone) and (b) a foe attack's positive template as a caster self-buff (target
gone). The trap is that **structural/additive-diff checks all pass** — the export is purely
additive, no field drifts, only the intended attribs appear — while the *semantic* output is
wrong on a minority of powers. Two durable rules from this (2026-07-02, recharge/recovery
recovery):
- **Run an adversarial audit, not just a structural diff, on any relabel/recovery.** A
  Workflow of independent skeptics (each given one lens: "find a wrong buff," "find a dropped
  effect," "find a leak") caught the resistance-as-buff and foe-as-self classes that the
  additive-diff sweep certified "clean." Byte-level additivity proves you didn't *drop* data;
  it says nothing about whether your *interpretation* is right.
- **The resolved shortHelp / power `target_type` may be the only surviving disambiguator, and
  that's OK as a VETO (not a source).** The retired `recoverThunderspyOnesBuffs` hack was fragile
  because it *invented* the buff from shortHelp; `guardThunderspyOnesBuffs` uses the binary for
  the value (scale/table/sign/duration) and shortHelp/target only to *reject* the false-positive
  classes (keep `rechargeBuff` only if shortHelp advertises `+Recharge`; drop resource buffs on
  foe-targeted powers). Using a text field to disambiguate what the binary genuinely can't encode
  is legitimate; using it as the primary source is the §5 anti-pattern.
- **When the per-template `target` is dropped, the power-level `targets_affected` is the
  authoritative recipient list — consult it, not just `target_type`.** The MM pet-upgrade powers
  set `target_type='Self'` (the MM casts the auto-pulse PBAoE on itself) yet `targets_affected=['MyPet']`
  (the effects land on the henchmen). Routing by `target_type` alone leaked a pet +15% Recovery
  (and Fortify Pack's pet +Defense/+Regen, Repair's pet Endurance) into the MM's totals. A pet-only
  `targets_affected` means *no* effect on that power is a caster buff — drop them — but stay
  shortHelp-aware because `targets_affected` **under-reports**: Rally the Militia is also `['MyPet']`
  yet its shortHelp is "Self, Pets +Defense, +Regeneration" and genuinely buffs the MM, so a
  Self-advertised stat survives. Note the earlier audit *missed* this by comparing only the template
  (Self target, empty requires) to a known-real buff and never reading `targets_affected` — the
  adversarial pass is only as good as the fields the skeptics are told to look at.
- **A format's "front" attrib may be a CATEGORY/label, not the effect — the authoritative effect
  can live in a secondary array, and its magnitude in a slot you're discarding.** Thunderspy stores
  TWO attrib fields per template: a front string (the *enhancement/duration category*) and a
  post-`requires` INDEX array (the *applied* attribute). They routinely disagree — a Hold reads front
  `Immobilize`/`Sleep` but index `Held` (verified: index == HC's mez type on 415/422 shared powers,
  while the front is the wrong effect on ~40% of mez). Reading the front mislabelled every control
  power (Blind emitted `immobilize`, not `hold`) *and* the real Magnitude rode the post-table slot
  (`table scale duration MAGNITUDE`, the k+12 float) — the flat header `magnitude` was a 1.0
  placeholder, so even correctly-typed mez read Mag 1. Two durable rules: (a) when a schema carries a
  secondary/index attrib list, prove which one is authoritative per effect kind (front `Damage` ↔
  index `Smashing_Dmg` is a type refinement; front `Immobilize` ↔ index `Held` is a *different
  effect*) — never a blanket swap. (b) The magnitude/scale you surface may be the wrong field of
  several similar floats; cross-check the surfaced value against a correctly-decoded reference
  (k+12 == HC magnitude exactly where the server didn't rebalance) before trusting it.
- **The §3 sign rule applies to mez, not just KB — but PROTECTION is table-encoded, so scope the
  guard.** A negative-scale mez on a *duration* table is a debuff/duration artifact, not an applied
  mez (Thunderspy Time Stop's scale -0.25 `Stun` on Ranged_Stun surfaced as a phantom Mag-1 stun on a
  pure Hold). But mez PROTECTION rides a `*_Res_Boolean` table at *any* sign and the dashboard's
  `isProtectionMez` re-reads it — so a blanket "skip negative mez" drops all protection. Skip only
  negative-scale mez on NON-`Res_Boolean` tables. (This bit cross-dataset: HC/Rebirth encode some
  armor mez-protection as negative-scale `*_Ones` — a separate question, so the guard was scoped to
  the one server whose dropped-aspect made it necessary rather than changed globally.)

## 8. Determinism (committed `generated/` must be reproducible)

`generated/` is committed and CI re-derives it (regen-diff guard). So converters must be
deterministic across platforms:
- **Sort `readdir` results** — NTFS is alphabetical, ext4 is hash-order; unsorted
  aggregate output (e.g. `incarnate-effects.ts`) diverges on Linux CI.
- **No timestamps** or other run-varying content in codegen headers.
- Stale duplicate source files (e.g. `enervating__field.json` double-underscore) cause
  non-determinism and phantom duplicate powers — clean them up.

## 9. Guard rails already in place

- **CI type-check + tests** (`.github/workflows/ci.yml`): `npm run lint`
  (`tsc --noEmit`) then `npm test` (`vitest run`). The type-check catches calc/type
  breakage (new effect keys, changed signatures); the test suite includes both the
  structural invariant scan and focused data tests that re-read a specific fix from
  the dataset (adaptation-modes, dual-pistols-ammo, effective-level, …).
  **Pattern: when you fix a data/extraction bug, add a focused test that loads the
  power from the dataset and asserts the fixed shape** — it's the cheapest guard
  against a future regen silently undoing it.
- **regen-diff CI** (`.github/workflows/regen-diff.yml`): rebuilds `generated/` from
  committed `exported_powers/` and asserts byte-equality. **Known blind spot:** scoped
  to `generated/` only — the layered `at-tables`/`pet-entities`/`kheldian`/`index`
  outputs are NOT covered (this is where the at-tables/kheldian drift slipped through;
  diff those by hand after touching them).
- **converter-invariants test** (`src/data/converter-invariants.test.ts`): structural
  scan (export-name === internalName, no bare `specialBuff`, no `0xFFFFFFFF` sentinels,
  no new PvP-mez).
- **Committed `exported_powers/` + `raw defs/`** — a deliberate safety measure, not just
  data. Committing the export makes regen-diff (and any local regen) reproducible
  **without** the `.pigg`/Python pipeline, so a converter/calc gap is a pure source fix;
  committing the `.powers` oracle means §5's verify-against-ground-truth is always
  available to every session, local *and* remote.
- **`npm run regen`** rebuilds everything; `npm run regen:generated` rebuilds only
  `generated/` (what the guard checks).

## 10. Foe-facing effects are first-class — don't deprioritize debuffs by "stat impact"

Debuffs are core to how players build characters, and players expect to see every
effect an attack applies — even purely informational ones that don't change their
own dashboard. Dark Melee's small -ToHit stacks up fast; a defense-focused player
wants to count it toward how much defense they actually need. Same for
-Resistance, -Regen, -Recharge/slow, -Damage, -Defense (the very Cryo-ammo -Slow
we just chased).

**How to apply:** weight a gap by the *completeness and correctness of the power's
advertised behavior*, **not** by whether it changes the player's own stats. The
trap isn't forgetting debuffs matter — it's quietly down-ranking a gap because
"it doesn't move the dashboard." A missing foe-debuff component is not
low-priority. (Radiation Infection does *nothing but* debuff and is top-tier.)
Prefer the principled root fix — capture a dropped field (§1) — over a heuristic.

## 11. IO sets: bonus values and piece dilution are derivable from the binary

Both servers' `io-sets-raw.ts` are now generated from `boostsets.bin` + `powers.bin`
by `scripts/extract-rebirth-io-sets-v2.py --dataset <id>` (the old
`convert-io-sets.js` / `extract-rebirth-io-sets.cjs` are retired). The non-obvious
parts that bit us:

- **Set-bonus value = `scale × a per-attrib multiplier`, not flat `scale × 100`.**
  The binary stores the raw scale; the displayed % multiplies by an attrib-specific
  modifier: **damage buff ×250, max HP ×10, max endurance ×1 (scale is already the %),
  everything else ×100.** A flat ×100 over-values max HP 10× (1.125% → 11.25%) and
  under-values damage (2% → 0.8%). Multipliers were derived and cross-validated against
  all 225 shared HC hand sets.
- **Bonus `stat` keys must be planner-canonical or they're silently DROPPED.** The calc's
  `normalizeStatName` (STAT_NAME_MAP in set-bonuses.ts) is the only normalization — the
  transformer passes `stat` through verbatim. Emit `damage_resistance_(cold)` /
  `maximum_hitpoints` / `mez_resistance_(all)`, NOT `cold_resistance` / `maxhp` / per-type
  mez resistance. The early binary output used the latter and the planner dropped every
  resistance/maxHP/mez-res bonus (≈196 entries on Rebirth-only sets). Guarded by
  `io-sets-bonus-keys.test.ts`.
- **Paired stats: emit ONE member, the planner re-pairs the other.** PAIRED_STATS auto-
  applies a bonus to both members of S/L, F/C, E/N, P/T resistance (and S/L, F/C, E/N
  defense, and recharge-debuff↔slow). Emitting both halves double-counts. The extractor
  keeps the alpha-first member (cold/energy/lethal/psionic), matching the hand convention.
- **A piece's effective aspect count is recoverable from its enhancement scale** —
  authoritative, where the aspect-list length and name-segment count under-count. The
  binary stores the already-diluted magnitude: `scale = getMultiAspectModifier(count) ×
  rarity(1.25 for purple/Superior)`. So Luck of the Gambler's "Defense/+Recharge" reads
  Defense at 0.625 (the 2-aspect modifier) — its +Recharge global DOES dilute, scale
  proves it; ATO "#6" Recharge/Chance pieces read 0.4375 (4 aspects). Invert the modifier
  to set `totalAspects`. (Heal/Absorb caveat: the scale-derived count is the *true* aspect
  count — the binary already treats Heal and Absorb as ONE slot, because they're the same
  enhancement category. The planner lists Absorb separately only so it surfaces as its own
  enhanced stat, NOT as a dilution signal; that's why healing pieces' list length exceeds
  the scale-derived count. So the list-length excess is cosmetic, not authoritative —
  `getEffectiveAspectCount` collapses the Heal+Absorb pair back to one slot at runtime, and
  the extractor emits `totalAspects` only when derived > list length. An earlier fix
  mis-read the Absorb split as real dilution and over-valued every healing piece; see
  `src/data/io-sets-heal-absorb.test.ts`.)
- **Enhancement aspects are `aspect=Strength` with POSITIVE non-zero scale.** Negative-
  scale Strength templates are proc debuffs/conversions (Winter's Bite -Recharge/-Slow,
  Sudden Acceleration / Imperial Might #6's -Knockback KB→knockdown) — §3 sign rule. The
  old extraction counted them as enhancement aspects (spurious Slow/Knockback). Proc
  pieces are detected by chance<1 / ppm>0 groups (§3), cross-server.
- **Always-on global pieces must be flagged `proc: true` or their global silently
  vanishes.** A hybrid global (enhances one aspect AND grants a passive bonus — LotG
  "Defense/+Recharge", Gift of the Ancients / Thrust / Synapse's Shock run-speed) only
  reaches the character through `collectAlwaysOnProcs`, which hard-gates on the slot's
  `isProc` (= the piece's `proc` flag). The extractor is inconsistent about tagging these
  X/+Y pieces — Thrust #4 came out `proc: true`, **Synapse's Shock #6 came out `proc: false`
  with its name stripped to bare "EndMod"** (fixed 2026-06 → `proc:true`, name "EndMod/+Run
  Speed", `totalAspects:2`; guard `src/data/synapses-shock-proc.test.ts`). Audit: of every
  `type:"Global"` PROC_DATABASE entry, cross-check that its set has at least one `proc:true`
  piece — Synapse's Shock was the only mis-flagged one whose effect is actually modeled.
- **Known UNMODELED set globals (calc no-ops, not flag bugs).** Some specials have no
  numeric effect wired up, so flipping `proc` does nothing:
  - **ATO crit bonuses** — Scrapper's Strike "+Crit for ALL powers" and Critical Strikes
    "chance for +Crit" both resolve to `category:"Special"` with **no value** in
    `proc-globals.generated.ts`; `applyAlwaysOnProcBonuses` skips any effect with
    `value === undefined`, and `applySingleProcEffect` has no `Special`/`Crit` case. So
    neither ATO's crit reaches the calc today (Scrapper's Strike is additionally `proc:false`,
    but fixing that alone wouldn't help). Modeling ATO crit-chance is a feature, not a data fix.
  - **Hypersonic "Fly/+Fly Magnitude"** and **Experienced Marksman "Range"** — zero
    PROC_DATABASE entries, and `FlyMagnitude` isn't even a category `applySingleProcEffect`
    handles (supported: Recovery, Regeneration, Endurance, Heal, MaxHP, Defense, Resistance,
    ToHit, Recharge, RunSpeed, MezResist, SlowResistance, RechargeResistance,
    KnockbackProtection, Stealth). Their specials are entirely unmodeled.

## 12. Deriving structured non-power data from the binary (archetypes, classes, …)

The campaign now binary-sources data beyond powers (IO sets §11; archetype HP
curves / caps / resistance cap from `classes.bin`). The reusable method + the
gotchas that bit us:

- **Anchor on a known-value field, then read siblings at fixed byte-deltas —
  don't fully decode the struct.** A record is often a long run of similar
  structures (e.g. the CharacterAttributes per-level float arrays). Find ONE
  field by its *value signature* (hit_points: a small level-1 rising to a large
  level-50) and read the rest at fixed deltas from it, **verified across every
  record**. Cheaper and more robust than mapping the whole (large, version-
  specific) layout — matches how `_classes.py` already scans for `named_tables`.
- **Use per-record VARIATION as the fingerprint to locate a field.** Exploit how
  a value differs across records: `resistanceCap` (0.75 most ATs, 0.90 Tank/
  Brute) is *distinctive*, so its delta is unambiguous; a flat value (defenseCap
  0.45 for everyone) matches many positions — disambiguate via distinctive
  siblings, or accept it's a constant. **A field that doesn't vary per record may
  not be in this bin at all** (see below).
- **Count-prefix vs value offset (off-by-array-length trap).** A count-prefixed
  array is `[u4 count][N floats]`; its *last* value sits at
  `prefix + 4 + (N-1)*4`. Measure deltas **prefix-to-prefix**, not value-to-value
  — conflating them yields an off-by-`(N-1)*4` bug (this bit the Rebirth hp-cap:
  measured from the L1 value to the cap's L50 value, off by 49 floats).
- **Byte-deltas are format-specific — parameterize them.** The same struct in HC
  Parse7 (105-entry level tables) and Rebirth Parse6 (50-entry) has *different*
  deltas. Drive the extractor off a per-format layout table
  (`_ATTRIB_LAYOUT["parse7"|"parse6"]`), never hardcoded numbers — §7's
  key-not-structure rule, applied to offsets.
- **Verify against the hand-port AND an independent reference; a mismatch is a
  finding, not a failure.** The prior hand-port is the oracle for "what was true
  when written," the binary for "what's true now." Diffing the two catches *both*
  extraction bugs and real game drift — when they disagree, determine which (the
  stale HC Brute HP, 1499/1601 → 1606.35, was a real HC buff the hand-port
  missed; it validated the leg). Then confirm against CoD2 / in-game.
- **Confirm which artifact a field lives in before assuming.** Not all of a
  domain's data is in the obvious bin: the archetype *scalars* (damageModifier,
  buffDebuffModifier, baseThreat, the AT-specific damageCap boosts) are NOT in
  `classes.bin` — they come from the AT damage tables / inherent powers. A
  fingerprint search that finds *nothing* is the proof they live elsewhere; don't
  force a fragile delta onto data that isn't there.
- **Guard derived data with a runtime==export test.** Mirror
  `archetype-stats.test.ts` / `io-sets-*.test.ts`: assert the runtime value equals
  the committed binary export it derives from, so a hand-edit or stale generated
  file can't silently diverge it from the game. Note the regen-diff blind spot
  (§9) — layered outputs aren't all covered, so the focused test is the backstop.

## 13. Overrides rot against a fixed source — audit them, don't trust them

The override layer (`datasets/<server>/overrides/`, merged by `withOverrides`) carries
hand corrections that survive regen. But an override written to compensate for a *stale
source* silently **inverts** once the source is fixed: it now freezes the old value on
top of correct `generated` data — the exact opposite of its purpose. Most of this
project's overrides were created against the 2019 CoD2 dump; after the switch to the live
`.pigg` binary they became stale-value-freezers, and a 2026-06 audit retired ~2,000 lines
of them (DIVERGENT 140 → 9, the 9 being genuine enrichments). The durable method:

- **Test `generated == oracle`, not "is the override stale."** Removing a divergent
  override falls back to `generated`, so the question that matters is whether *generated*
  is correct — compare it to the `.powers` oracle (§5) or a fresh live-binary parse, not
  to the override. When they match, the override is a stale pin and is safe to drop
  regardless of what value it carried.
- **Scalar agreement is a cheap extraction-correctness proxy.** If a power's
  accuracy/range/recharge/arc/… all match the oracle, the pipeline works for that power,
  so its damage/effects are almost certainly faithful too — you needn't hand-verify every
  field (0 mismatches across ~110 powers verified this way). Where the `.powers` snapshot
  is missing a category (it lacks Peacebringer + some EAT epics), a *fresh* Bin Crawler
  parse of the live `.pigg` is the substitute oracle — diff it against committed
  `exported_powers` to confirm currency (§6) before trusting it.
- **Mind unit/representation differences.** The same value stored in different units
  across layers looks like a conflict when it isn't: `.powers` stores cone `Arc` in
  **degrees** (180), the binary/`generated` in **radians** (π), and `arcToDegrees`
  converts back — with a heuristic `≤2π → radians` guard that would misread a genuinely
  small (<6.28°) degree value. Likewise the converter may *re-key* an effect (mez kept as
  per-group `durations` vs per-mez): different shape, same data. Normalize before
  declaring a divergence.
- **Keep genuine parser-gap enrichments.** A few overrides supply data the parser doesn't
  extract *yet* (e.g. `summon.copyBoosts`, consumed by pet-damage). Discriminate by which
  side matches the oracle: generated-matches-oracle ⇒ stale pin (drop); override-matches-
  oracle-while-generated-is-missing/wrong ⇒ real correction (keep, and log the parser gap
  in HOMECOMING_PARSER so it can be sourced from the binary later, §0).

**Corollary — silent fallbacks hide wrong values, not just missing ones.** When a value
isn't found the calc usually substitutes a flat default rather than erroring, and that
default can be wrong in *both* directions. Damage buffs whose `Melee_Buff_Dmg` table was
missing from the `extract-at-tables` allowlist fell back to a flat `0.10` — over-valuing
low-damage ATs (Tanker Build Up showed +80% vs the real +70%) and under-valuing high ones
(Blaster +80% vs +100%). A recurring *"table not found → fallback"* warning is usually an
**allowlist/extraction gap on a real table** (§1's captured-but-unused class), not a
missing game table — chase it to the source. Route such warnings through the deduped
`warnFallback` helper so a real gap surfaces once instead of flooding (and so it stays
visible rather than getting silenced).

**The migration isn't done until the prose is right too.** This audit retired ~2,000 lines
of stale pins but the *comments* explaining them — 361 override headers (*"Keep them — the
current CoD2-raw extraction does not [have these]"*) and `src/data/README.md` (*"Do not drop
an override that disagrees with generated"*) — were left in place, now saying the exact
inverse of the truth. Correct data + lying comments is the §2 failure mode wearing a
victory lap. When you change what the data *means* (source swapped, pins retired, a field's
authority moved), grep for every comment/README/header that describes the old meaning and
fix it in the **same** change — the headers and docs are part of the data, not separate from it.

*When you learn a new gotcha or principle, add it here — not just to a commit message —
so every session (local and remote) benefits. The principles span all game-data
domains, not just powers — keep examples concrete but state them generally.*
