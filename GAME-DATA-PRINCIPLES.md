# Game-Data Handling Principles

Durable guidance for working with City of Heroes power data in this project —
the principles and the specific gotchas that keep biting us. Read this before
touching the bin parser, the converters, or the calc when game data looks wrong.

This is the **principles reference**. The chronological issue log lives in
[BIN PARSER GAPS.md](BIN%20PARSER%20GAPS.md); project setup is in CLAUDE.md.

---

## 1. The core rule: capture everything mechanical; don't assume our *use* of it is complete either

> The data was rarely the problem. Our assumptions about what the planner needs were.

The recurring failure mode that has bitten us many times: decide a field is
"not relevant for a build planner," drop it (or never use it), then discover months
later it mattered. Examples: offensive knockback, foe -KB protection, brute modifiers,
Kinetic Melee, Kheldian effects, `IgnoreStrength`.

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
  is KB *protection* applied to the foe (immobilize -KB) — a different thing. Sign and
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

## 5. The `.powers` raw defs are the oracle

`raw defs/` holds the HC dev's authoritative `.powers` source (4,943 powers, same
category structure; public game data). It is the ground truth for "what should be there."
`tools/extraction-audit/` (`parse_powers.py` + `audit.py`) diffs `.powers` vs
`exported_powers` to find gaps **proactively** instead of one-at-a-time. The attrib side
needs a `.powers`↔export name-map before its numbers are trustworthy (`kDefense` =
`Base_Defense`, `kSpeedFlying` = `FlyingSpeed`, etc.).

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
entry in [BIN PARSER GAPS.md](BIN%20PARSER%20GAPS.md).

## 8. Determinism (committed `generated/` must be reproducible)

`generated/` is committed and CI re-derives it (regen-diff guard). So converters must be
deterministic across platforms:
- **Sort `readdir` results** — NTFS is alphabetical, ext4 is hash-order; unsorted
  aggregate output (e.g. `incarnate-effects.ts`) diverges on Linux CI.
- **No timestamps** or other run-varying content in codegen headers.
- Stale duplicate source files (e.g. `enervating__field.json` double-underscore) cause
  non-determinism and phantom duplicate powers — clean them up.

## 9. Guard rails already in place

- **regen-diff CI** (`.github/workflows/regen-diff.yml`): rebuilds `generated/` from
  committed `exported_powers/` and asserts byte-equality. Scoped to `generated/`; the
  layered `at-tables`/`pet-entities`/`kheldian`/`index` files are not covered.
- **converter-invariants test** (`src/data/converter-invariants.test.ts`): structural
  scan (export-name === internalName, no bare `specialBuff`, no `0xFFFFFFFF` sentinels,
  no new PvP-mez).
- **`npm run regen`** rebuilds everything; `npm run regen:generated` rebuilds only
  `generated/` (what the guard checks).

  ## 9. Foe-facing effects are important, don't dismiss as lower value or less important than stat-enhancing effects
  - **In CoH, debuffs are first-class power effects, and play a role in determining how players build their characters. Many attacks have debuff effects and users expect to see those effects displayed, even if its purely informational and doesn't materially affect the stats of their character. Dark Melee applies small amounts of -toHit to enemies, but they stack up. A player building for defense will likely want to account for that in calculating how much defense they need. If a small debuff componenent is missing from an attack, don't defer as a low-priorty.

---

*When you learn a new gotcha or principle, add it here — not just to a commit message —
so every session (local and remote) benefits.*
