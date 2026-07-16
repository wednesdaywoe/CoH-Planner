# Plan B — Retire the `PowerEffects` bag: consumers read the atom list

> Status: **in progress** on branch `converter-atom-array` (as of 2026-07-16).
> Phase 0 ✅ · Phase 1 ✅ · Phase 2 Slice 0 ✅ · **Slice 1 (ToHit) ✅ · Slice 2
> (Damage) ✅ · Slice 3 (Resistance) ✅ · Slice 4 (Defense) ✅ · Slice 5 (Max-HP) ✅ ·
> Slice 6 (Regen/Recovery) ✅ · Slice 7 (Movement) ✅ — the ToHit, +Damage, +Resistance,
> +Defense, +MaxHP, +Regen/+Recovery and movement appliers now read atoms, not the bag**
> · Phase 3 not started.
> **Slice 7 SHIPPED (2026-07-16): the movement buff map (`effects.movement`) migrated.
> The slice that found the atom list collapsing on its OWN axis** — `MOVEMENT_AXIS`
> mapped both the kFly flight-mode GRANT and the FlyingSpeed BUFF to subType `Fly`, and
> reading the grant as a speed buff double-counts Fly by +200%. Three schema fixes, each
> removing fabricated or missing information rather than working around it: the `FlyMode`
> subType split, `stackKey` on the wire (the `TravelBuff` mutual-suppression group), and
> — the root one — **`aspect` no longer defaults `''` → `Cur`**, which had been inventing
> "Current" for a template that stated none. Gated by `scripts/planb-shadow-movement.cjs`
> at **281/281, 0 diverge**, mutation-tested on **12 axes, all killed**. Bag byte-identical
> (every one of ~58k changed generated lines is an atom tuple), regen idempotent, 1139
> tests green. **Follow-up FIXED same day (2026-07-16): the Thunderspy movement blackout**
> (every tspy travel power gave +0 movement) — resolved converter-side after the re-export
> investigation found the tspy binary incomplete; tspy gate coverage 0 → 59 slots, 1149
> tests. See §The Thunderspy movement blackout.
> **Slice 6 SHIPPED (2026-07-15): all four resource slots (`regenBuff`/
> `regenBuffUnenhanced`, `recoveryBuff`/`recoveryBuffUnenhanced`) migrated, retiring the
> LAST two of the five `*Unenhanced` twin slots (only ToHit's and movement's remain).
> Two additive converter changes — a `notOnCaster` target-trap stamp and the
> Consume/Devour Psyche redirect perTarget stamp-gap fix. Gated by
> `scripts/planb-shadow-resources.cjs` at **778/778 checked, 0 diverge, 34 punts** (the
> one remaining punt class is the un-derivable Expression + tick-chance-0 guard); gate
> mutation-tested on 9 axes, all killed.**
>
> **Five bugs found and fixed the same day, each surfaced by the work rather than
> reported:** (a) **Icy Bastion / Hibernate** dropped its lingering +4 regen (+6 → **+10**)
> — the regen routing read `StackByAttribAndKey`, which means *refresh don't stack*, as a
> skip; recovery never had the skip and was right, and that asymmetry was the tell. The
> Slice 6 burst/tail punt died with it. (b) **The pool/epic atom gap** — ~1,358 powers
> (Health, Stamina, Tough, Weave, the whole epic tier) had NO atoms, and all seven shadows
> swept only `generated/powersets` so no gate could see it. (c) **Epic Soul Drain** shipped
> with no per-foe scaling at all (+1.0/+4.0 instead of +2.6/+10.4 at 8 foes) — the
> epic-pool converter never ran the stacking detector. (d) **Six epic snipes had NO DAMAGE
> AT ALL** (Psionic Lance, LRM Rocket, Frozen Spear, Mace Beam, Zapp, Moonbeam) — the pool
> converters never followed redirects; fixed by sharing `collectBaseTemplates`. (e) **The
> atom emit was gated on the BAG's template set** in all three converters, so an all-gated
> power got no atoms (16 Mastermind upgrade powers, Heat Loss, Victory Rush). All seven
> gates now green on **10,321** powers (was 8,913). 1131 tests green.** Slice 5 migrates the +MaxHP twin
> (`effects.maxHPBuff` + `effects.maxHPBuffUnenhanced`) — the FIRST of the
> `*Unenhanced` twin family to literally fold into one `ignoreStrength` filter; it is a
> pure runtime swap (NO converter change, generated tree byte-identical, like Slice 3)
> gated by `scripts/planb-shadow-maxhp.cjs` at **194/194, 0 diverge**. Regen/recovery —
> the OTHER two twins — are DEFERRED to their own slice: their bag values depend on
> four behaviors not on the wire atom (foldResourceSlot same-table SUM, a regen-only
> `StackByAttribAndKey` skip, an Expression+tick-chance-0 drop, and a description-text
> target-trap filter) plus redirect/Execute_Power perTarget-stamp gaps, and a couple
> (burst/tail resource summing) look like latent bag bugs (see §Slice 5). Slice 1
> shipped in
> two parts: (a) the Inner Light burst/tail fix (durationVariants on `tohitBuff`),
> and (b) the applier migration itself — `character-totals.ts` sources +ToHit from
> `toHitBuffValue(power)` (atoms), including a converter-STAMPED `perTarget` so the
> per-foe sliders (Soul Drain 1 vs 8 targets) keep working. Behavior-preserving by
> construction: the atom value is verified bag-equal corpus-wide
> (`scripts/planb-shadow-pertarget.cjs`) and the applier falls back to the bag for
> any atom-less power. Slice 2 does the same for `damageBuff` (see §Slice 2), and
> additionally root-fixes a per-foe over-count that had inflated Rebirth's
> +Damage/+Def/+Regen ~8× — the shadow gates both slots at **1252/1252 agree, 0
> diverge**. Slice 3 migrates the per-damage-type +Res buff (`effects.resistance`)
> and the self-directed −Res penalty (Offensive Adaptation), reusing Slice 2's
> perTarget stamp for Bio Armor's per-foe Evolving Armor;
> `scripts/planb-shadow-resistance.cjs` gates it at **3204/3204 buff + 72/72 self,
> 0 diverge**. Slice 3 touches NO converter code, so it changes no generated data —
> a pure runtime-applier swap (see §Slice 3). Slice 4 migrates the two +Defense
> appliers (`effects.defenseBuff` and the combat-suppressed
> `effects.defenseBuffSuppressible`); it is the FIRST slice that needed a converter
> change — a stamped `AtomicEffect.suppressible` — because the suppressible/always-on
> split lived only in a `suppress_events` template tail (Hide's attack-click
> suppression) that never reached the wire atom. `scripts/planb-shadow-defense.cjs`
> gates it at **3416/3416 buff + 335/335 suppressible, 0 diverge**; the generated diff
> is atoms-only (988 tuples gain `suppressible:true`), the bag is byte-identical (see
> §Slice 4)
>
> Companion to the shipped interim guard (DSH6c discriminator gate, 2026-07-14).
> See [[converter-bag-vs-array-rootcause]], [[dsh6-collapse-detector]],
> `docs/converter-unification-direction.md`.

## The pool/epic atom gap — closed 2026-07-15 (read this before trusting a slice note)

Every slice note below said its applier "reads atoms". Until 2026-07-15 that was true
only for `generated/powersets`. **Pool and epic-pool powers had no atoms at all** —
~1,358 across the three datasets: Health, Stamina, Tough, Weave, Maneuvers, Assault,
Focused Accuracy, Physical Perfection, and the entire epic/patron tier. They are built
by two converters separate from `convert-powerset.cjs` (`convert-pool-powers.cjs`,
`convert-epic-pools.cjs`), and neither called `encodeAtomsForEmit`. Every atom-native
applier silently fell back to the bag for all of them.

**Two bugs stacked so each hid the other.** The fallback made the missing atoms
behavior-preserving, hence invisible; and all seven `planb-shadow-*` gates swept only
`generated/powersets`, so every "corpus-wide, 0 divergences" claim was structurally
silent about ~15% of the corpus. Mutation-testing the gates could not have found this —
every mutant still passes on a corpus that excludes the affected powers. This is the
Phase-0 lesson again in a new costume: a DoD that asks "is it harmless?" instead of "is
it sufficient?" cannot see absence.

Closed by: both converters now emit atoms; the base-set hard invariant moved INTO
`encodeAtomsForEmit` (it is a property of the encoding, and duplicated per call site it
is one a new emitter can forget — which is precisely what happened); and ONE shared
sweep, `scripts/planb-shadow-sweep.cjs`, walking `generated/` whole, used by all seven
shadows. Coverage: bag 8,913 → **10,271** powers (**10,321** after the atom-emit guard
fix below); pertarget 1,252 → 1,343 slots; resistance 3,204 → 3,665; defense 3,416 →
3,887; maxhp 194 → 220; resources 641 → 778. Verified the widened gates genuinely cover
the new tree rather than merely counting it (mutating the fold branch turns Physical
Perfection red).

**The widened corpus immediately found real user-facing bugs** — see §Epic Soul Drain and
§The six dead snipes below. That is the argument for widening: the gap was not academic.

## Epic Soul Drain shipped with no per-foe scaling — fixed 2026-07-15

Found the moment the shadows widened past `generated/powersets`. `convert-epic-pools.cjs`
never ran `detectStackingEffects`, so the **entire epic/patron tier shipped its AoE
self-buffs flat**:

| | epic pool (before) | Dark Melee primary | at 8 foes |
|---|---|---|---|
| Soul Drain +ToHit | `{scale: 1}` | `{1.2, perTarget: 0.2}` | +1.0 vs **+2.6** |
| Soul Drain +Damage | `{scale: 4}` | `{4.8, perTarget: 0.8}` | +4.0 vs **+10.4** |

The same power, wrong numbers, for every Blaster/Controller/Corruptor taking Soul Drain
(or Spirit Drain) through an epic pool. Fixed by running the detector before the atom
emit — order matters: `computeAoePerTargetPatches` stamps `_perTargetIncrement` on the
templates and `encodeAtomsForEmit` copies it onto the atom, so reversing the two silently
drops the stamp. Epic Soul Drain now equals its powerset twin exactly.

Every other epic bag change was cross-validated against its powerset twin — the shapes
MATCH (Build Up, Power Boost, Hoarfrost, Dark Consumption), and where values differ
(Consume 20 vs 15) the raw binary genuinely differs, verified in `exported_powers`.

**The detector is deliberately NOT run for pool powers.** Tried for pipeline symmetry, it
REGRESSED Cross Punch: its +5% ToHit / +5% Recharge are **Fighting Synergy** — granted
per FIGHTING POOL POWER OWNED (Boxing/Kick), applied once per cast — but the power is a
5-target Cone, so the AoE heuristic read its Self-targeted `Stack` template as a per-foe
increment. It minted a bogus `perTarget: 0.05` *and* a `tohitBuff` slot duplicating the
existing IgnoreStrength `tohitBuffUnenhanced` half, which the calc would have counted
twice. No pool power is known to be genuinely per-foe, so running a heuristic whose only
live effect is a false positive is worse than not running it. Pinned by
`pool-atoms.verify.test.ts`.

## The six dead snipes + the bag-gated atom emit — fixed 2026-07-15 (`f667b75d8b`)

Two more of the same family, both closed. Neither was a Plan B blocker; both were real.

**Six epic snipes had no damage in the planner at all.** `convert-pool-powers.cjs` and
`convert-epic-pools.cjs` collected `collectTemplatesDeep(rawJson.effects)` behind an
`if (rawJson.effects?.length)` guard and never followed redirects, so a redirect-only
power produced an empty bag: Psionic Lance, LRM Rocket, Frozen Spear, Mace Beam, Zapp,
Moonbeam, plus Aid Other / Teleport / Teleport Target (9 HC, 1 tspy, 0 Rebirth).

The tell that this is **converter divergence, not a data quirk**: Blaster Dark Blast's
Moonbeam is the *same* redirect-only shape (`Pets.Blaster_Dark_Snipe.Moonbeam_Quick` /
`_Normal`) and has always resolved fine — purely because `convert-powerset.cjs` converts
it. Same data shape, two converters, one answer each.

Fixed by extracting that converter's inline branch into a shared `collectBaseTemplates`
rather than copying it. This matters: following a redirect correctly is **not**
`JSON.parse(target).effects`. The chain carries PvE/PvP `enttype` twins, gated variants,
`*_InherentDamage` twins and chance-0 Fiery Embrace bonuses that `collectTemplatesDeep`
+ `extractDamage` already fold. A hand-rolled follower in a second converter is exactly
how this bug class reproduces.

| Snipe | Now | Powerset twin (oracle) |
|---|---|---|
| Psionic Lance | Psionic 3.56 `Melee_Damage` | Psychic Blast: Psionic 4.5 `Ranged_Damage` |
| Frozen Spear | Cold 3.56 `Melee_Damage` | *(none)* |
| Mace Beam | Energy 3.56 `Melee_Damage` | *(none comparable)* |
| Zapp | Energy 3.56 `Melee_Damage` | Electrical Blast: Energy 4.5 `Ranged_Damage` |
| Moonbeam | Negative 4.5 `Melee_Damage` | Dark Blast: Negative 4.5 `Ranged_Damage` |
| LRM Rocket | Smashing 1.0 + Lethal 1.49 | *(none)* |
| Aid Other | Heal 1.96 `Ranged_Heal` | Empathy Heal Other: **identical** |

Types match the twins exactly; melee-AT epics scale off `Melee_Damage` at 3.56 where
blasters use `Ranged_Damage` at 4.5 — a genuine per-AT binary difference, same category
as "epic Consume is really scale 20 vs the powerset's 15".

**The atom emit was gated on the BAG's view** — `if (allTemplates.length > 0)`, in all
three converters. A power whose every effect group is gated has ZERO base templates but a
full gated set, so it got no atoms at all: the 16 Mastermind upgrade powers (Equip Robot,
Train Beasts, Enchant Undead, Kuji-In Zen…), Heat Loss, Clear Skies, Noxious Gas, Fallout,
Victory Rush. **"A power gets atoms only if the bag found something" is backwards** — the
atom list exists precisely to carry what the bag cannot. Guarding on `atomTemplates`
instead adds 50 powers (10,271 → **10,321**); every new atom is `gated`, so `baseAtoms`
stays empty and no applier changes behavior. The generated diff is atoms-only (the only
other churn is `"maxSlots": 6` gaining a trailing comma), and the encoder's base-set
invariant enforces it. Note the pool converter's looser old guard (`rawJson.effects.length`)
is why Victory Rush *accidentally* had atoms — "fixing" pools to match powersets would
have propagated the powerset bug.

### FOUND, NOT FIXED: epic-tier Fiery Embrace contamination — and why sharing that filter is a trap

Sharing `_filterFieryEmbraceBonus` with the pool converters looked like free correctness
and was **reverted** after nearly shipping a regression. Three findings, in order:

1. `FIRE_THEMED_POWERSET_RE` used `\b(fire|fiery|…)`. **Underscore is a word character**,
   so `\bfire` does not match `Epic.Corruptor_Fire_Mastery` — no boundary between `_` and
   `F`. It only ever worked because powerset names put a `.` before the theme word
   (`Blaster_Support.Fire_Manipulation`). Applied to epic pools, every `*_Fire_Mastery`
   pool read as non-fire-themed and lost its genuine Fire damage.
2. Fixing the regex (`(?<![a-z0-9])`, now shipped — proven a no-op on the current corpus)
   was **not sufficient**: `Pyre_Mastery` and `Heat_Mastery` are fire pools matching *no*
   theme word. Rebirth's Pyre Mastery Fire Ball came out as `Smashing 0.2` with **no Fire
   at all**. Caught only by reading the diff power-by-power — every gate stayed green.
3. The redirect fix never needed the filter: `collectTemplatesDeep` already drops the
   chance-0 FE templates, so all six snipes resolve clean (verified: zero `Fire_Dmg`
   templates survive).

**The contamination is real and still open.** HC's `Epic.Body_Mastery.Laser_Beam_Eyes`,
`Epic.Darkness_Mastery.Dark_Blast`, `Epic.Weapon_Mastery.Shuriken` and ~17 others carry
Fire damage they should not; Rebirth's epic tier has ~46 such entries. Fixing it needs a
per-power twin oracle and its own gate. **Do not "just add the filter."**

**Lesson — a shared helper carries its origin's assumptions, and they are invisible at
the new call site.** `\bfire` encodes "set names have a dot in them" nowhere in its name,
signature or docstring. This is the sharp edge on the unification thesis in
`docs/converter-unification-direction.md`: divergence hides bugs and unification is still
right, but it is not free, and each sharing move needs its diff read by hand rather than
a green gate. Speculative sharing turned a 9-power fix into a 66-power damage change.

## Resolved: Icy Bastion's lingering regen was dropped (in-game verified 2026-07-15)

The regen routing skipped any `StackByAttribAndKey` template outright. **That flag means
"key this buff by (attrib, stack_key) so re-application REFRESHES rather than stacks"** —
refresh semantics, not an instruction to ignore the template. Reading it as a skip
silently deleted Icy Bastion's lingering +4 regen.

Icy Bastion (Tanker/Brute ship it as `hibernate.json` — the usual
[[hc-slot-reuse-rename-gotcha]]) is a **temp toggle**, `activate_period` 0.5:

| | toggle-gated (0.75s, re-applied each tick) | lingering (30s, via OnTick Execute_Power → `Icy_Bastion_NoCast`) | correct | bag before |
|---|---|---|---|---|
| Regeneration | 6 | 4 | **+10** | +6 ❌ |
| Recovery | 2 | 2 | **+4** | +4 ✅ |

The flag is exactly what lets ~60 re-executions refresh one 30s buff instead of stacking
to +24,000%. Both halves are active for the 30s the power is doing its job. The tell was
that regen and recovery — the *same* two-template shape — disagreed; recovery never had
the skip and was right all along. Confirmed in-game by the maintainer and by the power's
own `display_help`: *"While the power is active you heal damage and recover endurance at
an incredible rate... Should you deactivate the power earlier, some of the resistance to
damage and other effects will remain until the full 30 seconds window is over."*

The skip is now narrowed to `Stack`/`Continuous` — the per-target increments
`computeAoePerTargetPatches` actually folds in (Reactive Regeneration), which is what its
comment always claimed. Supremacy also carries flagged regen (0.02, `Suppress`) but is
out of scope: never converted to a player power, and henchman-facing anyway (gated `group
target> MastermindPets eq` — the damage-sharing plumbing, which is not expressible without
modelling minion stats).

Bag change: 5 files, one power. `regenBuff` 6 → 10, and its recorded duration 0.75s → 30s
(the planner had the buff lasting under a second). **With the bag consistent, Slice 6's
burst/tail punt became unnecessary and was deleted** — the family now reconstructs through
`foldResourceSum` like any other, since burst and tail OVERLAP rather than replace (the
same additive shape as Inner Light's ToHit and EMP Arrow's −500% regen at 15s *and* 45s).
The shadow went 641/641 with 58 punts → 667/667 with 32. **A punt that exists to dodge an
inconsistency is a bug report, not a design.**

## Resolved: Inner Light STACKS (in-game verified 2026-07-15) — converter fix landed

**Peacebringer Inner Light** (internally `Build_Up`, source
`peacebringer_offensive/luminous_blast/build_up.json`) has four templates — a
short burst and a long tail, all `stack=Stack`, `target=Self`, all `Immediate`
with `delay=0`:

| attrib | burst | tail | bag kept (before) |
|---|---|---|---|
| ToHit (Current, `Melee_Buff_ToHit`) | **2.0 @ 10s** | 0.77 @ 30s | 0.77 |
| 8× `*_Dmg` (Strength, `Melee_Buff_Dmg`) | **8.0 @ 10s** | 3.2 @ 30s | 3.2 |

Both slots were last-write-wins assignments and the 30s template is emitted last,
so both silently dropped the burst — the planner showed Inner Light's tail as if
it were the whole power.

**Answer (STACK):** the user verified in-game — casting Inner Light applies TWO
simultaneous self-buffs ("Inner Light" the 30s lingering + "Boost Up" the short
burst); both are active together and both contribute to stats, the burst just
expires first. Both apply from cast (source data confirms `Immediate`/`delay=0`
on the tail, so it overlaps the burst). ⇒ peak +2.77 ToHit / +11.2 dmg for the
first 10s, then +0.77 / +3.2 for the remaining 20s. **Not** a replace (peak is
2.77, not 2.0); and **not** a naive sum (0.77 is the sustained value, 2.77 only
holds for 10s). This is the same additive-overlap shape the converter already
ships for EMP Arrow's −500% regen at 15s *and* 45s.

**Converter fix (LANDED, ToHit only).** New `accumulateBuffSlot` helper in
`convert-powerset.cjs` gives the `tohitBuff` projection the duration-aware
accumulate the resource-slot fold (`foldResourceSlot`) already had for debuffs:
a same-table, different-duration second instance becomes a `durationVariants`
entry (longest-lived = primary) instead of clobbering the slot. Inner Light's
`tohitBuff` is now `{scale: 0.77, table, durationVariants: [{duration: 10,
scale: 2}]}`; the InfoPanel (`tohitBuff` is `format: 'percent'`) renders both
the +ToHit(30s) tail and the +ToHit(10s) burst rows. Verified: a full
three-dataset regen changes **exactly the four** Inner Light / Inner Umbra
powers and nothing else (every per-foe ToHit power — Sunless Mire, Soul Drain —
byte-unchanged, because their longest instance is emitted last and still wins
the recorded duration the perTarget reshape reads); `planb-shadow-tohit.cjs`
now **603/603 agree, 0 divergences** (its bag side counts `durationVariants`);
DSH6 gate PASS, `planb-shadow-bag.cjs` 0 divergences, regen idempotent.

**Damage (`damageBuff`) deferred to the damage slice.** The same burst+tail gap
exists on `damageBuff` (Inner Light, Moment of Glory's 1/1/0.5 @ 5/10/15s decay,
Fiery Embrace), but `damageBuff` *also* carries flat + per-foe pairs (Against
All Odds: 1.0 flat @1.25s + 0.55/foe @1s) that the perTarget post-pass
(`computeAoePerTargetPatches`) reshapes into `{scale, perTarget}`. Routing those
different durations through `accumulateBuffSlot` mints a spurious variant and
leaks a `durations` change past the reshape (observed: AAO buffDuration 1→1.25).
So the damage variants wait for a slice that first excludes per-foe groups.

## Why this must get done (and why "no observable bug" is a broken gate)

The effect-collapse bug family has been "closed" several times. It keeps
reopening because the deferral test was **"does a user observe a bug?"** That
test is invalid for this project:

- The CoH community is small; the Sidekick user base is a fraction of it; the
  fraction who report numeric mismatches is a handful of people.
- There are **5,277 player powers** × dozens of attributes each. No one — not
  even the maintainer — can hand-verify them all.
- Therefore **silent-and-wrong is the default state of an un-guarded collapse**,
  not the exception. "CI is green and nobody complained" measures reporting
  volume, not correctness.

Every recent instance proves it: the +MaxHP twin was half-wrong across ~40 armor
powers for months; Offensive Adaptation's −7.5% Res never applied; Rage's −20%
defense crash was mislabeled as a foe debuff — and that last one **no user
reported**; the DSH6c gate found it mechanically on its first run. The interim
guard converts *known* discriminator classes from "ships silently" to "fails
CI." Plan B removes the class of defect entirely, so new discriminators can't
silently collapse in the first place.

**2026-07-15 raised the bar on the argument.** The deferral test isn't just
"does a user observe a bug?" — it's **"could this gate observe a bug?"**, and
that question has to be asked of the gate's *sweep*, not its checks:

- `docs/converter-unification-direction.md` deferred converter unification as
  cleanliness-only, citing DSH6a's green detector as proof no collapse remained.
  `dsh6-collapse-detector.cjs` hardcodes `GEN_ROOT` to
  `homecoming/generated/powersets` — HC only, powersets only, no `--dataset`
  flag — while running in `regen` and reading as corpus-wide. Sitting in that
  blind spot: the entire epic tier's AoE self-buffs shipped flat, and six epic
  snipes shipped with no damage at all.
- All seven Plan B shadows had the identical hole until it was found.
- **Six epic snipes had NO DAMAGE and no user reported it.** Not because nobody
  plays them — because "this power shows 0 damage" reads as *the planner not
  modelling something*, not as a bug worth reporting. The reporting channel is
  biased against exactly the defects that matter most.

So: **"no observable bug (detector green)" is a statement about the observer.**
A green gate is evidence about coverage until you have asked what it cannot see.
Three costumes so far — an incomplete census, a narrow sweep, a mutation harness
that scored a crash as a pass. Expect a fourth.

## Where we are (the door is ~80% shut)

The `converter-rewrite` (merged to `main`) already fixed the **input** side:

```
templatesToAtoms()  →  [immutable atom list]  →  projectAtomsToEffects()  →  PowerEffects
     ✅ clean, one atom per atomic game effect        ⚠️ the bag is minted here
                              │
                              └─ Phase 0/1: also emitted as `Power.atoms`, read
                                 at runtime via atom-query.ts. Nothing consumes
                                 it yet — the calc still reads only the bag.
```

`AtomicEffect` (`src/data/core/atomic-effect.ts`) is a closed record with every
discriminator intact: `effectType`, `subType`, `sign`, `aspect`, `toWho`,
`ignoreStrength`, `resistible`, `stack`, `modifierTable`, `pvMode`, scale,
duration, `_tmplIdx`. **Nothing downstream sees raw templates anymore.**

The bag survives **only as the output type**, `PowerEffects` (88 keys). Collapse
now happens exclusively at *projection time*, when two distinct atoms route to
the same named slot. The mitigation each time is to mint a discriminator:

- **Parallel slots:** `maxHPBuffUnenhanced`, `recoveryBuffUnenhanced`,
  `regenBuffUnenhanced`, `tohitBuffUnenhanced` — **four hand-rolled slots for the one
  `IgnoreStrength` axis, all now folded back to an `enhanceableVsNot` split at the
  atom-native applier (Slices 1/5/6).** (`runSpeedUnenhanced` LOOKS like a fifth but
  isn't a converter slot at all — it is a hand-authored Sprint literal in `levels.ts`
  with no atom behind it; see the Slice-7 correction below.)
- **Per-value flags bolted onto `ScaledEffect`:** `toWho`, `unresistable`,
  `durationVariants`, `perTarget`, `stackKey`, `suppressible` — each now carried as a
  first-class atom field or converter stamp, so the projection can re-materialize the
  bag flag without the runtime re-deriving it.

This is the tax. The discriminator is a property of the *atom*; the bag forces
us to re-materialize it as a sibling slot or a flag, once per effect type,
forever — and to notice we need to, one bug at a time.

## The goal

Make the effect-application consumers read the **atom list** (or a thin,
lossless grouping of it), so no discriminator can be lost by projection. The bag
becomes a **UI-only convenience projection** (or is deleted). The invariant we
want: *the calc never asks "what's in slot X"; it asks "give me the atoms of
effectType X" and handles their discriminators explicitly.*

## Blast radius (measured 2026-07-14, before Phase 0)

Asymmetric — concentrated in one file.

| Layer | Reads | Shape | Cost |
|---|---|---|---|
| **Calc** `character-totals.ts` | ~195 (`~45` distinct slots after removing 66 stacking-meta reads) | procedural `if (effects.<slot>)` chains across ~12 appliers (active-power, proc, PPM, incarnate, fitness, movement, stealth) | **the mass** — near-total rewrite of the effect-application core |
| `calculations/damage.ts` | 14 | named slots (`damage`/`dot`/`maxTargets`) | small |
| **UI display** (`InfoPanel`, `powerDisplayUtils`, `MechanicAdjusters`, `SharedPowerComponents`, set-bonus/dashboard) | ~80 total | **already ~80% generic**: `Object.entries(effects)` through `EFFECT_REGISTRY` (`src/data/core/effect-registry.ts`, ~76 entries) | cheap — survives on a projection shim |

~~`AtomicEffect` is currently converter/test-only; **no runtime path imports it.**
That's the seam to open.~~ **Opened (Phase 0/1).** `AtomicEffect` now ships on
every generated `Power` as `atoms` and is read at runtime through
`src/data/core/atom-query.ts`. The table above still describes the work
remaining, though: no calc applier reads atoms yet, so every one of those ~195
`effects.<slot>` reads is still live.

## Phased plan (incremental, each phase independently shippable & gated)

Guiding principle: **never a big-bang cutover.** Keep `projectAtomsToEffects`
producing the identical bag throughout, add the atom list *alongside*, migrate
consumers one applier at a time behind a shadow-comparison, delete the bag last.

### Phase 0 — Expose atoms at runtime (no behavior change) ✅ DONE (2026-07-14)
- Emit the atom list on the generated `Power` (e.g. `power.atoms: AtomicEffect[]`),
  produced by the same `templatesToAtoms` the projection already runs. Gate on
  size/byte budget — this roughly doubles per-power effect data; measure, and if
  needed emit a compacted encoding decoded at load.
- Add `AtomicEffect` to the runtime type barrel; keep it unused by calc/UI.
- **DoD:** builds, no diff in computed totals, generated tree grows by a bounded,
  reviewed amount.

  **Shipped:** measured the encoding cost on the HC corpus (full objects 619
  B/atom → 13.8 MB/dataset; positional tuple 124 B/atom → 2.75 MB) and chose a
  **positional-tuple wire form** decoded at load. Codec + single source-of-truth
  field order (`ATOM_TUPLE_FIELDS`, `encodeAtom`, `decodeAtoms`, `EncodedAtom`)
  live in `src/data/core/atomic-effect.ts`; `Power.atoms?: EncodedAtom[]` added
  and the atom types re-exported from the `@/types` barrel. The converter emits
  `power.atoms` from the same `templatesToAtoms(allTemplates)` that feeds the bag
  (`encodeAtomsForEmit` + a custom `serializePower` that renders one tuple per
  line so the compact form survives the pretty-printer). Verified: additive-only
  diff (every `effects`/`damage`/`stats` bag byte-identical modulo an append
  comma), lossless round-trip across all 22,293 HC atoms, generated tree +~5–6 MB
  total (HC 15→17 MB), `tsc` clean, 1051 tests green, DSH6 gate PASS, and the
  runtime seam confirmed (committed tuple → `decodeAtoms` → `AtomicEffect` with
  signed scale / aspect / `ignoreStrength` / `toWho` intact). Calc/UI still read
  only the bag.

  **Superseded in part by Phase 1:** this phase's DoD ("no diff in computed
  totals, generated tree grows by a bounded amount") was satisfiable by an atom
  list that was silently INCOMPLETE, and was — it covered only the base bag.
  Nothing here could catch that, because the DoD never asked whether the atoms
  were *sufficient*, only whether they were cheap and harmless. Phase 1's shadow
  compare asked, and the answer was no; see the Phase 1 note.

### Phase 1 — Atom-native calc primitives + shadow compare ✅ DONE (2026-07-14)
- Build read helpers the calc will use: `atomsOf(power, effectType)`,
  `byType(atoms)`, `selfDirected(atoms)`, `enhanceableVsNot(atoms)`,
  `resistibleTwin(atoms)`, `durationBuckets(atoms)`. These encapsulate exactly
  the discriminators the bag flattened.
- Stand up a **shadow harness**: for every power, compute each character-total
  twice — once from the bag (current), once from atoms (new) — and assert
  equality across the whole HC/Rebirth/Thunderspy corpus. This is the Phase-0b
  proof pattern the converter rewrite already used successfully (`DSH6_SHADOW`).
- **DoD:** shadow harness green corpus-wide; zero divergence.

  **Shipped:** helpers live in `src/data/core/atom-query.ts` (`atomsOf` —
  WeakMap-memoized decode, `atomsOfType`, `byType`, `bySubType`, `selfDirected`
  /`targetDirected`, `enhanceableVsNot`, `resistibleTwins`, `durationBuckets`),
  each documenting the one bag discriminator it replaces; unit-guarded by
  `atom-query.test.ts` (19 cases). No calc consumer yet — that is Phase 2.

  The shadow harness is `scripts/planb-shadow-bag.cjs`, wired into `npm run
  regen` (~4s) so it gates CI beside the DSH6 detector. **Scope note:** it
  asserts `bag ⊆ atoms` — every discriminator the bag carries is recoverable
  from the atom list — rather than comparing character-totals, because no
  atom-native applier exists to compare against until Phase 2. That is the
  precondition Phase 2 actually needs (an atom list missing a bag fact would
  drop it silently). The converse is deliberately NOT asserted: atoms carrying
  more than the bag is the point, and that residual is DSH6c's job. Green at
  8,913 powers / 9,533 checks / 0 divergences across all three datasets.

  **The harness immediately found a Phase-0 gap, which is why Phase 0's DoD was
  wrong.** `power.atoms` was emitted from `collectAllTemplates` — the *bag's*
  collector, which drops eight classes of gated group (PvP-only, PvP `enttype`
  twin, chance-0 procs, Containment, dead-state, `kMeter` hidden-state, `rand()`,
  mode/stance). Those drops exist solely because a single-valued slot would be
  clobbered by the gated variant — a bag-era workaround, not a claim the effects
  are unreal. Consequence: all 49 conditional/stance bags (`conditionalEffects` —
  Bio Armor's adaptations, Sky Splitter, Parasitic Aura…) had **no atoms behind
  them**, which would have silently blocked Phase 2 from migrating the resource
  appliers Bio Armor feeds. Fixed with `collectAtomTemplates` (drops nothing;
  every drop reason survives as a first-class atom field — `pvMode`,
  `requiresExpression`, `specialCase`, `baseProbability`), unioned with
  `allTemplates` so redirect-/`activation_effects`-sourced powers (Dull Pain,
  Fault, Remote Bomb) keep theirs. Atoms 22,293 → 34,733 (+56%); generated tree
  HC 17→19 MB, Rebirth 14→16 MB, tspy 13 MB. Known residual: gated groups nested
  inside a redirect chain or under `activation_effects` are still uncollected.
  `collectAllTemplates` is untouched, so the bag is unchanged — verified by
  stripping the `atoms` block from all 6,215 changed files and confirming every
  one is byte-identical (regen also idempotent, so the CI byte gate holds).

  **The harness was mutation-tested, not just observed green** (the
  [[dsh6c-discriminator-gate]] lesson: verify the diff, not the gate). Breaking
  each helper in turn must turn it red: `ignoreStrength` → 153 UNENHANCED,
  `toWho` → 98 SELF, duration key → 10 DURATIONS. A fourth mutant (corrupting
  `twinKey`) initially **survived** — the UNRESISTABLE check only asked whether
  *some* twin carried the bag's magnitude, so it was blind to mis-pairing. Closed
  with a TWIN-INTEGRITY invariant asserting each returned pair differs in nothing
  but `resistible` (now kills that mutant: 40 / 32). Two harness self-bugs were
  found the same way: it walked only `power.effects` (missing every conditional/
  special discriminator — ~half the corpus), and it silently swallowed
  `require` failures (an unloadable power read as a pass, not a gap).

### Phase 2 — Migrate appliers one at a time (behind the shadow)

**Slice 0 — the base/gated split (DONE 2026-07-15).** A prerequisite Phase 1
surfaced: after Phase 1 made `power.atoms` the COMPLETE effect list, an applier
can no longer just sum `atomsOf(power)` — that list deliberately includes
mode/stance, PvP, hidden-state and chance-0 proc atoms which do not apply by
default. Summing them would over-count every stance-gated armor (the
[[adaptation-stance-leak-fix]] bug, reintroduced by the front door).

The filter cannot be re-derived at runtime from the gate expression alone:
base-ness also depends on collection PROVENANCE (a template reached via a
redirect chain or `activation_effects` passes Self-only / IgnoreStrength-dupe
filters that no expression records). So the converter — the only scope holding
`allTemplates` — stamps the verdict: `AtomicEffect.gated` (last in the tuple, so
the ~64% base case trims to zero bytes). Runtime reads it via `baseAtoms(power)`
/ `gatedAtoms(power)` / `baseAtomsOfType(power, type)`.
**Phase 2 appliers read `baseAtoms`, never `atomsOf`.**

Guarded two ways, because neither alone suffices:
- The shadow harness's UNENHANCED check is now **path-aware** — `power.effects`
  must be backed by a BASE atom, `conditionalEffects[].effects` by a GATED one.
  This is what proves the stamping is right way round.
- A **hard converter assert** at the emit site: unstamped atoms must number
  exactly `templatesToAtoms(allTemplates)`. This covers what the harness
  structurally cannot — the harness checks `bag ⊆ atoms` by existence, which is
  insensitive to OVER-inclusion (mutation-verified: marking every atom base
  still passes every existence check, so only this assert catches it). The
  assert itself is mutation-verified to fire on both over- and under-stamping.

Corpus: 53,767 base / 29,386 gated atoms across the three datasets; shadow green
(8,913 powers, 0 divergences), regen idempotent, diff still `atoms`-only (29,386
insertions = 29,386 deletions = exactly the gated atoms gaining their flag).

**Slice 1+ — the appliers.**
Order by isolation, simplest first. For each applier (resistance, defense,
movement, resources incl. the `*Unenhanced` twins, mez, combat mods, procs,
incarnate, self-penalties):
1. Rewrite it to read atoms via the Phase-1 helpers.
2. Keep the shadow compare asserting bag==atoms for that total.
3. Ship when its slice is divergence-free; move to the next.
- The `*Unenhanced` five-slot family collapses back into a single
  `enhanceableVsNot(atoms)` split at this step — the tax is repaid.
- **DoD:** every character-total sourced from atoms; shadow still green.

  **Slice 1 — ToHit: divergence resolved, converter fix landed, applier migration
  reshaped (2026-07-15).** `scripts/planb-shadow-tohit.cjs` (committed, non-gating
  — a triage report, per §Risks) compares, per power, the bag (`tohitBuff` +
  `tohitBuffUnenhanced`, now counting `durationVariants`) against the BASE atoms
  of `effectType:'ToHit'` minus what the bag routes elsewhere (aspect `Res` →
  `debuffResistance`, `Str` → `specialBuff`, negative/debuff-table →
  `tohitDebuff`), split by `ignoreStrength`. It first found **603 powers carry
  +ToHit, 599 agree, 4 diverge** — all Inner Light / Inner Umbra. After the
  in-game STACK confirmation and the `accumulateBuffSlot` converter fix (see the
  Resolved section up top): **603/603 agree**.

  **The applier now reads atoms — via a converter-stamped `perTarget` (2026-07-15).**
  The blocker was that a truly atom-native total can't come from `durationBuckets`
  alone: Sunless Mire / Soul Drain / Invincibility are per-foe, and their
  `{scale, perTarget}` is derived by `computeAoePerTargetPatches` from AoE geometry
  (`max_targets_hit`, `targets_affected`), redirect `number_allowed`, Defiance
  tags, and the raw `Continuous` stack flavor — **none of which survives to the
  runtime.** Decisive proof: Invincibility's per-foe increment is `Continuous`, but
  `mapStacking` has no `Continuous` case so the atom encodes `stacking:'No'` — a
  runtime re-derivation off `stacking` would silently score its perTarget as 0.

  So, exactly like `gated` (Slice 0), **the converter stamps the verdict.** New
  `AtomicEffect.perTarget` (last in the tuple → trailing-trims to zero bytes on the
  non-increment majority) carries each increment atom's contribution;
  `computeAoePerTargetPatches` stamps `template._perTargetIncrement`, and
  `encodeAtomsForEmit` copies it onto the atom. The runtime recovers the bag value
  with `perTargetValueOf` (`perTarget = Σ atom.perTarget`, `scale = Σ |atom.scale|`)
  behind `toHitBuffValue(power)`, which `character-totals.ts` now reads in place of
  `effects.tohitBuff` (`?? effects.tohitBuff` for atom-less powers). The stamp is
  additive-only: a full regen leaves the **bag byte-identical** (only increment atom
  tuples grow). Gated corpus-wide by `scripts/planb-shadow-pertarget.cjs` (603
  ToHit / 21 per-target / 0 diverge, wired into `npm run regen`) and pinned in CI by
  `tohit-atom-native.verify.test.ts` (Soul Drain scales to 8 foes, Invincibility's
  stamp survives, Inner Light reads its 0.77 tail). The general axis (damage,
  regen/recovery, defense, endurance — 513 perTarget slots total) reuses the same
  stamp; its redirect (Fulcrum Shift) and self-counted (Phalanx `firstTargetExcluded`)
  residuals live in those slices, not ToHit.

  **What comparing correctly turned out to mean.** The first cut compared the
  MULTISET of (|scale|, table, enhanceable) and falsely flagged Soul Drain and
  Sunless Mire. Their two templates are a flat + per-foe pair the converter
  legitimately RESHAPES into one slot (Soul Drain: 1.0 flat + 0.2 per foe →
  `{scale: 1.2, perTarget: 0.2}`). The bag transforms as well as drops, so
  "different shape" ≠ "lost data". The shape that survives the reshaping is
  **summed scale per (table, enhanceable) at ONE target** — a resolved number
  would have been wrong too, since the AT table applies identically on both
  sides and only adds archetype noise to a routing question.

  **Known interim compromise:** self-STACK meta (`stacksLinear` / `maxStacks` /
  `stackCaps`, the repeated-cast axis — Siphon Speed) is keyed by SLOT NAME, so
  the applier still passes the bag for it — `adjustForStacking(atomValue, …,
  'tohitBuff', effects.maxStacks, …)`. Re-keying that onto atoms is deferred; it
  is not the same axis as the discriminators Plan B targets. NB the per-FOE axis
  (`perTarget`) is now fully atom-native (stamped, above) — do not conflate the
  two; `adjustForStacking` routes to `adjustForPerTarget` when the (atom-derived)
  value carries `perTarget`, and only falls through to slot-keyed self-stacking
  otherwise. (`AtomicEffect.stacking`/`stackCap` are per-template bin fields, NOT
  the converter's `detectStackingEffects` output — do not conflate those either.)

  **Slice 2 — Damage: applier migrated + a per-foe over-count root-fixed
  (2026-07-15).** `character-totals.ts` now sources +Damage from
  `damageBuffValue(power) ?? effects.damageBuff`. Harder than ToHit because a
  +Damage buff is not scalar — it explodes into one atom per damage type (8–13
  siblings, identical scale), so `damageBuffValue` (`atom-query.ts`) collapses that
  dimension and reconstructs perTarget over four atom-derivable axes:
  - **damage-type collapse** — dedup by `(|scale|, table)` (a by-type buff is one
    increment; summing raw 8–13×-inflated it);
  - **dominant table** — keep the table carrying the most |scale|, dropping an
    off-table rider (a blaster's `Melee_Ones` Defiance increment);
  - **per-target N=1 via `toWho`** — `perTarget = Σ distinct increment`; the N=1
    scale adds base (Replace) plus only increments landing on the CASTER (Self/All).
    That one test separates AAO (Self increment → N=1 = base+increment = 1.55) from
    **Fulcrum Shift** (Target increment → N=1 = base 4, +2/foe), no extra flag;
  - **non-uniform primary** — Embrace of Fire (+10 Fire/30s vs +8 all/10s) reports
    +8, the value covering the most damage types (what one global slot represents).
  `perTargetFromGroup` is shared with `toHitBuffValue` so the two can't drift.

  **Fulcrum Shift** needed a stamp like ToHit's, but its increment rides a
  redirect chain (`KineticTransferBuff` +2/foe) whose templates aren't the base
  power's atoms — so `detectStackingEffects` returns the increment `(scale,table)`
  signatures and the caller stamps the matching `allTemplates` atoms.

  **The root-fix (the reason this slice changed data).** `computeAoePerTargetPatches`
  summed *raw* per-foe templates, so datasets that encode a by-type buff as N
  single-attrib templates (Rebirth) — or a burst/tail as two duration blocks —
  read the per-foe increment N× too high (Rebirth Sunless Mire's +1.25/foe → +20;
  Invincibility's +Def, Rise to the Challenge's +Regen likewise). Fixed by summing
  DISTINCT `(scale, table)` + the same dominant-table filter, so the bag matches
  HC (which uses multi-attrib templates and was already correct) AND the atom
  reconstruction. HC bags are unchanged (dedup is a no-op on multi-attrib data);
  the corrected values were **cross-validated to equal HC's** for every changed
  Rebirth power. The one HC change — **Thunderous Blast** `enduranceGain` per-foe
  13.86 → 6.93 (two byte-identical redirect-sourced self-restore templates that
  were being double-counted) — was **confirmed in-game (2026-07-15): the self
  restore is 6.93**, so the dedup is a genuine fix here too.

  Gated corpus-wide by `scripts/planb-shadow-pertarget.cjs` (now tohit + damage,
  **1252/1252 agree, 0 diverge**) and pinned by `tohit-atom-native.verify.test.ts`
  (Soul Drain scales to 8 foes; AAO 1.55/0.55; Fulcrum 4/2; Inner Light 3.2 tail;
  Embrace of Fire +8 not +10).

  **The Inner Light damage-burst display (durationVariants) shipped too.** A
  post-pass in `projectAtomsToEffects` (mirroring the `tohitBuff` half) adds a
  `durationVariants` row for a UNIFORM burst/tail — a non-primary `(scale,duration)`
  group covering the SAME damage-type count as the primary — while leaving the
  primary (== `damageBuffValue`) untouched, so it is display-only with no total
  change and the shadow stays green. It admits Inner Light / Inner Umbra (both
  durations carry all 8 types) and Moment of Glory's 1/1/0.5 @ 5/10/15s decay, but
  skips a non-uniform buff (Embrace of Fire's Fire-only +10 is 1 type ≠ 8) and a
  per-foe damageBuff (the reshape rebuilds that slot as `{scale, perTarget}`,
  dropping the variant). Regen changes exactly those burst/tail powers, nothing else.

  **Slice 3 — Resistance: two appliers migrated, NO data change (2026-07-15).**
  `character-totals.ts` now sources the per-damage-type +Res buff from
  `resistanceBuffValue(power) ?? effects.resistance` and the self-directed −Res
  penalty from `resistanceSelfDebuffValue(power) ?? effects.resistanceDebuff`
  (`atom-query.ts`). Unlike Slices 1–2 this touches ONLY the runtime — the converter
  is untouched, the perTarget stamp it needs already exists from Slice 2's general
  axis, so a full regen leaves the generated tree **byte-identical** (git diff on
  `generated/` empty). Gated by `scripts/planb-shadow-resistance.cjs`
  (**3204/3204 buff type-slots + 72/72 self, 0 diverge**, wired into `npm run
  regen`) and pinned by `resistance-atom-native.verify.test.ts` (Fire Shield S/L/F=3
  Cold=1; Evolving Armor +0.55 +0.05/foe on S/L/Tox; Offensive Adaptation −0.075 ×8).

  **What comparing correctly turned out to mean (the Slice-1/2 lesson again).**
  Resistance is NOT scalar and NOT collapsed like damage — each damage type is its
  own `res<Type>` global, so the value is a per-type MAP, not one headline. The first
  cut compared every atom subType against the bag and flagged ~519 powers, all from
  atom-bridge/bag routing DISAGREEMENTS on non-standard subTypes that never reach a
  resistance total:
  - `All` (from a `base_defense`@Res template) — the atom bridge labels it
    `Resistance`/`All`, but the bag routes `base_defense`@resistance to
    `debuffResistance.defense` (defense-debuff resistance);
  - exotic `Radiation`/`Electrical`/`Sonic`/`Quantum` — the atom bridge covers these
    Kheldian/signature types, the bag's `DAMAGE_TYPES` does not, so it drops them
    (and there is no `resRadiation` global regardless);
  - `Heal` (`heal_dmg`@Res) — atom bridge → `HealResistance`; bag keys
    `resistance.heal`, but `resHeal` is not a global either.
  The resolution is the same shape as "sum at one target" from ToHit: compare only
  what survives to a total. The helpers restrict to the **eight standard damage-type
  globals** (`RESIST_STD_SUBTYPES`: Smashing…Psionic); every excluded subType adds
  zero on BOTH sides, so dropping it is behavior-preserving and makes the shadow a
  clean per-type equality. Two more bag facts had to be mirrored exactly: scale-0
  "expression" entries are BUFFS (the bag's `isDebuff` is `scale<0 || debuffTable`,
  so scale-0 on a non-debuff table is kept, not dropped — Agile's `Melee_Ones` 0s);
  and Bio Armor's Evolving Armor is a per-foe self-buff whose increment reconstructs
  via the shared `perTargetValueOf` (+0.55 base + 0.05/foe → `{scale:0.55,
  perTarget:0.05}`), NOT a plain `|scale|`.

  **The gate was mutation-tested, not just observed green** (the [[dsh6c-discriminator-gate]]
  discipline). Perturbing the buff scale → 0/3204 buff agree; the self scale →
  0/72 self agree; stripping `perTarget` from the buff atoms turns EXACTLY the 72
  Evolving Armor slots red (3204→3132) — so all three axes (buff value, self value,
  per-foe increment) are actually verified, not vacuously passing.

  **Known interim compromise (same as Slices 1–2):** the self-STACK meta stays a
  bag read, keyed by SLOT NAME (`adjustForStacking(value, …, 'resistance',
  effects.maxStacks, …)`). The per-FOE axis IS atom-native (the Slice-2 stamp,
  reused here). The `unresistable` twin flag on a resistance value is UI-only — the
  calc ignores it for resistance — so it is left on the bag projection.

  **Slice 4 — Defense: two appliers migrated + a converter-stamped `suppressible`
  (the first slice that needed a converter change) (2026-07-15).**
  `character-totals.ts` now sources the always-on +Defense buff from
  `defenseBuffValue(power) ?? effects.defenseBuff` (the pet-aura/override
  `effects.defense` still takes precedence, and the override-only
  `defenseBuffExcludesSelf` skip is unchanged) and the combat-suppressed half from
  `defenseBuffSuppressibleValue(power) ?? effects.defenseBuffSuppressible` (applied
  only out of combat). Both restrict to the **eleven standard defense globals**
  (`DEFENSE_STD_SUBTYPES`: Melee/Ranged/AoE + Smashing…Psionic) — same doctrine as
  Slice 3's eight resistance types (`All` from `base_defense` is a scalar
  `defenseBuff` ScaledEffect with no `defAll` global, so it adds zero on both sides).

  **Why this one needed a converter change.** The bag splits +Defense across two
  slots — `defenseBuff` (always on) and `defenseBuffSuppressible` (dropped in combat)
  — by `isCombatSuppressed = _suppressedByEvents || _combatGated`. But `_combatGated`
  (an `OutOfCombat` `requires`) was the only half on the wire atom (as
  `specialCase`); `_suppressedByEvents` (Hide's `Suppress ActivateAttackClick` tail)
  never reached it, so Hide's always-on +0.25 and its suppressed +0.5 defense were
  **byte-identical on the wire** (same PvE/Self/table, differing only in scale) — the
  split was unrecoverable. Fix, exactly like Slice-1's `perTarget`: the converter
  STAMPS the verdict. New `AtomicEffect.suppressible` (last in the tuple → trailing-
  trims to zero bytes on the ~non-suppressed majority) is set in `encodeAtomsForEmit`
  from `_suppressedByEvents || _combatGated`; `defenseBuffByType` partitions on it.
  The stamp is additive-only: a full regen leaves the **bag byte-identical** — the
  only generated change is **988 atom tuples gaining `suppressible:true`** across 127
  files (verified: every removed generated line is a tuple, every added tuple ends
  `,true]`). This also makes the movement `suppressible` bag-flag (travel-power speed)
  atom-recoverable for that later slice — the same discriminator, one stamp.

  **Three reconstruction axes resistance didn't exercise** (in `defensePerTypeValue`):
  - **last-write-wins** — the bag assigns `effects.defenseBuff[type] = makeEffect()`
    directly, so when a power stacks two same-type base buffs at one duration (Rebirth
    Hide: +0.25 then +0.5) the LAST survives, not the longest-lived. `perTargetValueOf`
    (longest-lived, shared with ToHit/Damage) picked 0.25 on the tie; defense takes the
    last atom in routing order = 0.5. (Behaviourally identical to resistance's
    last-write-wins; only observable here because defense has the colliding pairs.)
  - **gated firstTargetExcluded increments** — Phalanx Fighting's +0.3/ally rides a
    `target≠self` gate, so its increment atom is `gated` (dropped from the base set)
    yet `computeAoePerTargetPatches` folds its `perTarget` into the base slot (scale
    stays 0.5). The `perTarget` stamp is present ONLY on increments the converter
    folds, so gathering every `perTarget`-stamped atom — base OR gated — recovers it and
    no mode/PvP variant. N=1 then adds only the NON-gated self/all increments
    (Invincibility +0.1/foe → 0.6, AAO), never the gated one (Phalanx stays 0.5) — so
    `gated` on the increment is the runtime-visible "excluded at one target" signal.
  - **scale-0 is behaviourally absent** — a reconstruction of exactly 0 with no
    per-target growth contributes 0 to any total, and the bag is inconsistent about it
    (Thunderspy Fortify Pack's pet-granted defense yields an EMPTY `effects` bag;
    Rebirth Fortify Pack / Thunderspy Superior Invisibility keep a `{scale:0}` entry).
    The helper drops it and the shadow normalizes it to absent on both sides — the
    resistance "compare what survives to a total" doctrine. A genuine 0-vs-nonzero
    mismatch still surfaces as present-vs-absent.

  Gated corpus-wide by `scripts/planb-shadow-defense.cjs` (**3416/3416 buff type-slots
  incl. 190 per-target + 335/335 suppressible, 0 diverge**, wired into `npm run
  regen`) and pinned by `defense-atom-native.verify.test.ts` (Hide's 0.25/0.5+AoE-5
  split; Invincibility +0.6 +0.1/foe scaling to 8; Phalanx +0.5 +0.3/ally with N=1
  NOT inflated to 0.8). **The gate was mutation-tested:** ignoring `suppressible` →
  3480 red; last-write-wins→first → 190 red; dropping gated increments → 18 red;
  adding the gated increment to N=1 → 18 red — all four axes actually verified.

  **Known interim compromise (same as Slices 1–3):** the self-STACK meta stays a
  bag read, keyed by SLOT NAME (`adjustForStacking(value, …, 'defenseBuff', …)`).
  Defense has no active-power self-penalty applier (the Rage −20% def crash routes to
  `defenseDebuff` but nothing consumes it for the caster's totals today), so — unlike
  resistance — this slice migrated only the two buff appliers.

  **Slice 5 — Max-HP: the +MaxHP twin migrated, NO data change (2026-07-15).**
  `character-totals.ts` now sources +MaxHP from `maxHPBuffValue(power) ?? effects.maxHPBuff`
  and its IgnoreStrength half from `maxHPBuffValue(power, {ignoreStrength:true}) ??
  effects.maxHPBuffUnenhanced` (`atom-query.ts`). This is the FIRST of the `*Unenhanced`
  twin family to literally collapse into a single `ignoreStrength` filter — the tax the
  parallel slots paid (ToHit's Slice-1 twin used the same shape but the payoff is
  clearest here: `maxHPBuff` vs `maxHPBuffUnenhanced` exist ONLY so the +Healing
  strength multiplier hits the enhanceable half, and the atom already carries
  `ignoreStrength` per template). Reconstruction is the simplest yet: the base MaxHP
  atoms with aspect `Max` (a non-Max HitPoints atom is a HEAL → `effects.healing`), not
  a debuff, split on `ignoreStrength`, rebuilt via the shared `perTargetValueOf` — no
  MaxHP power in the corpus carries a per-target increment, so it resolves to the bag's
  folded `scale` (the applier reads `.scale` directly, ×10, no table resolution). Like
  Slice 3 it touches ONLY the runtime — the converter is untouched, so a full regen
  leaves the generated tree **byte-identical** (git diff on `generated/` empty). Gated
  by `scripts/planb-shadow-maxhp.cjs` (**194/194 slots, 0 diverge**, wired into `npm run
  regen`) and pinned by `maxhp-atom-native.verify.test.ts` (High Pain Tolerance twin
  1+1 → +20%; Black Dwarf IgnoreStrength-only 7.5; Dull Pain twin 2+2 sourced through a
  redirect / `activation_effects` whose base `effects` is empty — proves the atoms come
  from `allTemplates`, not just `powerJson.effects`). **The gate was mutation-tested:**
  doubling the value → 194 red; flipping the `ignoreStrength` split → 128 red (Black
  Dwarf, One with the Shield, True Grit — the single-half and differing-scale twins);
  dropping the `ignoreStrength` filter (merging the halves) → 64 red — all three axes
  actually verified.

  **Why regen/recovery — the OTHER two twins — are NOT migrated here.** A first cut that
  reused `perTargetValueOf` for all three scalar resources diverged on **93 powers, all
  regen/recovery (maxHP = 0)**. Categorized against the real converter
  (`scripts/planb-shadow-*` + the exported input in `exported_powers/`), the regen/recovery
  bag value depends on four behaviors that are NOT on the wire atom, so the naive
  helper ships a WRONG non-`undefined` value (no bag fallback):
  - **`foldResourceSlot` same-table SUM** (~17): the bag RAW-sums every same-table buff
    template (Obscure Sustenance recovery `0.6+0.38+0.1=1.08`; Icy Bastion recovery
    `2+2=4`); `perTargetValueOf` picks one bucket.
  - **regen-only `StackByAttribAndKey` skip** (~10): the regeneration routing (but NOT
    recovery) SKIPS `StackByAttribAndKey` lingering templates — Icy Bastion regen stays
    6 and drops its `4 @ 30s` lingering, while recovery sums its `2 @ 0.75s` burst +
    `2 @ 30s` lingering. The flag is a template `flags[]` entry, not on the atom.
  - **Expression+tick-chance-0 drop** (16 `recoveryBuffUnenhanced`): the RESOURCES routing
    guard drops these (Gravity Shield); all 16 are `attribType:'Expression'` (derivable),
    but the guard also keys on `_tickChance` (not on the atom).
  - **description-text target-trap filter** (~19): the converter drops
    `recoveryBuff`/`regenBuff` on MM pet-only and Thunderspy foe powers UNLESS the
    `shortHelp` text advertises "Self +Recovery" (`guardThunderspyOnesBuffs` in
    convert-powerset.cjs). Pure text + `targets_affected` heuristic — nothing on the atom.

    Plus **redirect/Execute_Power perTarget-stamp gaps** (~15): Consume/Devour Psyche
    (redirect-only, `RefreshToCount` ×10) and Reactive Regeneration (Execute_Power
    redirect) compute perTarget on a SEPARATELY-parsed redirect JSON, so the
    `_perTargetIncrement` stamp lands on redirect template objects, not the `allTemplates`
    that become the emitted atoms; the signature reconciliation at the emit site only
    covers `redirectPerTargetSigs`, not the AoE-path patches. (6 more are redirect-only
    powers with EMPTY base atoms → helper returns `undefined` → safe bag fallback.)

    Two of these look less like reconstruction gaps and more like **latent bag bugs**:
    Icy Bastion recovery summing a burst + lingering into `+4` is the Inner Light
    additive-overlap shape, and the regen-only `StackByAttribAndKey` skip drops a real
    30s lingering buff. Those are game-correctness calls. Per the maintainer's decision
    (2026-07-15): ship the clean maxHP twin now; regen/recovery is its own slice, where
    the fold-SUM / Expression / scale-0 drops reconstruct from atoms, the
    `StackByAttribAndKey`/target-trap verdicts + perTarget-stamp gaps get a converter
    fix, and the burst/tail-sum correctness questions are verified against in-game/Mids
    rather than auto-matched.

  **Known interim compromise (same as Slices 1–4):** MaxHP has no self-STACK or per-foe
  axis in the corpus, so the applier reads the atom `.scale` directly with no
  `adjustForStacking` — unchanged from before the migration.

  **Slice 6 — Regen/Recovery: SHIPPED (2026-07-15).** The other two `*Unenhanced` twins
  (`regenBuff`/`regenBuffUnenhanced`, `recoveryBuff`/`recoveryBuffUnenhanced`) — the LAST
  of that family bar ToHit's and movement's. `character-totals.ts` now sources all four
  slots from `regenBuffValue(power[, {ignoreStrength}])` / `recoveryBuffValue(...)`
  (`atom-query.ts`), each half falling back to its bag slot independently.

  **Outcome vs the design below (which the implementation confirmed unchanged):** the
  reconstruction rules 1–6 were right as written; every predicted value landed exactly
  (Consume Psyche `{0.85, pt 0.35}` / `{0.15, pt 0.05}`, Reactive Regeneration `2` with
  no phantom twin, Icy Bastion punts leaving the bag's 6/4 untouched). Gated by
  `scripts/planb-shadow-resources.cjs` (**641 checked / 641 agree / 0 diverge / 58 punts**,
  wired into `npm run regen`) and pinned by `resources-atom-native.verify.test.ts` (10
  cases). Full regen is idempotent, `tsc` clean, **1113 tests green** (NB the two
  `kheldian-travel-inherents.test.ts` failures this doc previously warned about are gone —
  that note was stale).

  > **This paragraph is the as-shipped record, not current state.** Both figures were
  > overturned the same day: the Icy Bastion punt was a converter bug, not a modelling
  > choice (§Icy Bastion), and the gate's sweep was missing ~15% of the corpus (§The
  > pool/epic atom gap). Current: **778 checked / 0 diverge / 34 punts**, 1131 tests.
  > Kept because the *reasoning* held up — refusing to auto-match an inconsistent bag is
  > what left the fix clean — and because a punt count that moved 58 → 34 without any
  > change to the helper is the evidence that punts are holding positions, not designs.

  **The generated diff is atoms-only, bag byte-identical:** 24 files, 29 tuples changed —
  19 gaining `notOnCaster:true` (the Thunderspy pet/foe target-trap) and 10 gaining a
  `perTarget` (Consume/Devour Psyche across 5 ATs). Every added and removed generated line
  is an atom tuple; no `effects` byte moved.

  **This gate is shaped differently from Slices 1–5, and deliberately so.** Because two
  shapes are unsettleable from the wire, the helper PUNTS and the applier keeps the bag —
  so the gate cannot simply assert bag == atom everywhere. It gates every value the helper
  RETURNS, **in both directions**, and reports punts without gating them. The
  atom-defined-but-bag-ABSENT direction is the one that matters most: a punt-to-bag can
  only preserve behavior, but an over-production invents a total the bag never had. That
  is exactly the Thunderspy target-trap failure mode, and M2 below proves the gate catches it.

  **The gate was mutation-tested on nine axes, all killed** (the [[mutation-test-your-gates]]
  / [[dsh6c-discriminator-gate]] discipline — a green gate proves nothing until it's shown
  it can go red). Each count matches the population the design predicted:

  | mutant | axis | result |
  |---|---|---|
  | M1a / M1b | value ×2, perTarget branch / fold branch | 91 red / 550 red — and **91 + 550 = 641**, so every checked slot flows through exactly one branch |
  | M2 | drop the `notOnCaster` filter | **19 red** = exactly the 19 stamped tspy tuples |
  | M3 | flip the `ignoreStrength` twin split | 558 red |
  | M4 | route increments by their own `ignoreStrength` (drop rule 3) | **10 red** = the 10 Consume/Devour Psyche slots |
  | M5 | drop the `!ignoreStrength` N=1 guard (rule 4) | **5 red** = Reactive Regeneration ×5 ATs |
  | M6 | fold picks-last instead of summing (rule 5) | 6 red |
  | M7 | stop punting the burst/tail | 5 red (Icy Bastion) |
  | M8 | stop punting Expression atoms | **16 red** = the 16 `recoveryBuffUnenhanced` drops |

  A tenth mutant initially read SURVIVED — but with EMPTY output: the mutation had broken
  the file syntactically, the gate crashed, and the harness scored a crash as a pass.
  Precisely the "never `catch { continue }` / print the COUNTS" trap from
  [[mutation-test-your-gates]], caught only because the count line was blank rather than
  zero. Re-run as M1a/M1b above.

  **The design spec follows, retained as the record of what was verified and why.** All
  findings were from two scratchpad diagnostics (`diag-resources.cjs`, `diag2.cjs`, not
  committed) that reconstruct the four slots from atoms and categorize every divergence
  vs the bag.

  **Scope of the divergence.** 718 regen/recovery slots across the three datasets; a
  naive `perTargetValueOf` reconstruction (the Slice-5 shape) diverges on **66**. After
  applying the two clearly-correct reconstruction fixes below (route per-foe increments
  to the enhanceable twin; drop nothing yet), the residual buckets are:

  | count | cause | disposition |
  |---|---|---|
  | ~32 | **bag-only, atom list empty** (Gamma Boost, Defibrillate, Fortify Pack, Consume rebirth, Disrupting Torrent) — redirect/gated-only powers whose increment never reaches the base atom set | SAFE — helper returns `undefined` → bag fallback. No action. |
  | ~19 | **tspy target-trap** — `guardThunderspyOnesBuffs` deletes `recoveryBuff`/`regenBuff` on MM-pet/foe powers via a shortHelp heuristic (Equip Thugs, Train Ninjas, Kuji In Zen, Disrupting Torrent…) | CONVERTER STAMP (see below). Not re-derivable: trapped atoms are `toWho:Unspecified/Target`, identical to legit HC Target-recovery buffs the bag keeps. |
  | ~16 | **Expression + tick-chance-0 drop** (Rebirth armor toggles: Gravity/Penumbral/Shadow/Twilight/Brimstone/Crystal…) — `recoveryBuffUnenhanced` `sc=1 Expression Replace dur=2 ign=true` | PUNT (helper → `undefined` → bag). `Expression⟺drop` is FALSE (Gamma Boost/Defibrillate/Fortify Pack KEEP an Expression regen/recovery — `tick_chance≠0`), and `tick_chance` is not on the wire, so the helper punts on ANY Expression resource atom. Safe either way: kept→bag has it, dropped→bag absent. |
  | ~10 | **StackByAttribAndKey burst+tail** (Icy Bastion) — the correctness fork | **ROOT-FIXED** (2026-07-15) — was a converter bug, not a fork. Punt deleted; see above. |
  | ~6 | **Consume/Devour Psyche perTarget stamp gap** — bag `regenBuff {0.85, pt:0.35}` / `recoveryBuff {0.15, pt:0.05}`, atom has no `perTarget` | CONVERTER FIX (stamp-gap, see below). Bag is correct; atom just lacks the stamp. |

  **SUPERSEDED (2026-07-15, same day): the StackByAttribAndKey family was ROOT-FIXED, not
  deferred.** The decision below — punt via bag-fallback pending in-game verification —
  was taken and then overtaken within hours: the maintainer described Icy Bastion's actual
  in-game behavior (a temp toggle; both buffs while active; detoggle early and only the
  smaller lingers), the data confirmed it exactly, and the "inconsistency" turned out to be
  a plain converter bug — the regen routing read a *refresh-semantics* flag as a skip. See
  §"Icy Bastion's lingering regen was dropped" above. Regen is now +10 (was +6), recovery
  +4 (always right), **the punt is deleted**, and the family reconstructs like any other.
  The analysis below is retained because its reasoning held up: it correctly identified the
  bag's self-inconsistency as a latent bug rather than auto-matching either number, which is
  exactly what left the fix clean when the game behavior arrived.

  **Original decision (2026-07-15, now superseded): DEFER the StackByAttribAndKey burst/tail
  family via bag-fallback.** Icy Bastion's regen and recovery are the *same* two-template
  shape (both `Replace` + `StackByAttribAndKey`, same `Melee_Ones` table, a short burst + a
  30s lingering) yet the bag treats them INCONSISTENTLY — the tell of a latent bug, not a
  settled value:

  | | burst | lingering | current bag | why |
  |---|---|---|---|---|
  | Regeneration | 6 @ 0.75s | 4 @ 30s | **+6** (drops lingering) | regen routing has a `StackByAttribAndKey` SKIP (`convert-powerset.cjs` ~4397) |
  | Recovery | 2 @ 0.75s | 2 @ 30s | **+4** (sums both) | recovery routing has NO such skip → `foldResourceSlot` sums |

  Rather than bake either value into the wire atom (a StackByAttribAndKey stamp would
  reproduce +6/+4 inconsistency and all), **the helper punts** (returns `undefined`) on
  any duration-distinct same-table non-perTarget resource group, so the applier keeps
  reading the unchanged bag for these ~10 powers — purely behavior-preserving, nothing
  questionable recorded on the atom. **This is detectable on the wire** (two same-table
  same-effectType non-perTarget atoms with different durations), so NO stamp is needed.
  The correct in-game regen/recovery (does a StackByAttribAndKey burst+lingering SUM,
  REPLACE/peak-wins, or settle to the lingering?) is a separate **in-game/Mids
  verification follow-up** — do NOT auto-match it.

  **Verified reconstruction rules for the helper** (`regenBuffValue`/`recoveryBuffValue`
  in `atom-query.ts`, one twin-aware pair like `maxHPBuffValue`):
  1. Base atoms of `effectType` Regeneration/Recovery, `aspect !== 'Res'`, non-debuff
     (`isDebuffAtom`).
  2. Split the non-perTarget base atoms by `ignoreStrength` → enhanceable
     (`regenBuff`/`recoveryBuff`) vs the `*Unenhanced` twin.
  3. **perTarget-stamped increments ALWAYS route to the enhanceable slot**, never the
     Unenhanced twin — the converter classifier returns `'regenBuff'`/`'recoveryBuff'`
     regardless of the increment's own IgnoreStrength (this simultaneously fixes Reactive
     Regeneration's `regenBuff` missing its `perTarget` AND its spurious
     `regenBuffUnenhanced`).
  4. perTarget group value = `perTargetFromGroup` shape: `perTarget = Σ distinct
     increment`, N=1 `scale` = base (Replace) + **only self-increments that are NOT
     `ignoreStrength`**. That `!ignoreStrength` condition is the atom-derivable
     discriminator separating **Consume/Devour Psyche** (non-IgnoreStrength RefreshToCount
     increment → added → N=1 `0.85`/`0.15`) from **Reactive Regeneration** (IgnoreStrength
     pseudo-pet Stack increment → not added → N=1 `2`). NB the shared `perTargetFromGroup`
     currently has no `ignoreStrength` guard on its self-increment sum — either add one
     (no-op for ToHit/damage, whose increments aren't IgnoreStrength) or give resources
     their own perTarget helper.
  5. Non-perTarget → `foldResourceSlot` SUM semantics: same-table `Σ|scale|`,
     last-table-wins reset (Obscure Sustenance `0.6+0.38+0.1=1.08`).
  6. **PUNT (return `undefined` → bag fallback) when:** (a) any Expression-typed resource
     atom is present, or (b) a duration-distinct same-table non-perTarget group exists
     (the deferred StackByAttribAndKey burst/tail). Report punt counts openly in the shadow.

  **Two converter changes — both SHIPPED as specified**, additive/atom-only (like Slices
  1 & 4), so the bag stays byte-identical and only atom tuples change:
  - **target-trap stamp — SHIPPED as `AtomicEffect.notOnCaster`** (appended last in
    `ATOM_TUPLE_FIELDS`, so it trims to zero bytes on all but the 19 atoms that carry it).
    `guardThunderspyOnesBuffs` (`convert-powerset.cjs`) runs POST-atom-emit and deletes bag
    slots; its `drop()` now also calls `stampNotOnCaster`, which patches the already-encoded
    tuples in place by schema field index. A "does-not-apply-to-caster" stamp rather than a
    deletion, as the design argued — the atom is still real (it describes what the pet/foe
    receives, and feeds pet display); only the caster's totals must skip it. The slot→atom
    map is `NOT_ON_CASTER_SLOTS`, keyed `{effectType, ignoreStrength:false}` because the
    guard drops only `regenBuff`/`recoveryBuff`, never the twins. `gated` was indeed
    off-limits (the hard base-set invariant asserts unstamped == `templatesToAtoms(allTemplates)`,
    and trapped templates ARE in allTemplates).
  - **Consume/Devour Psyche perTarget stamp-gap fix — SHIPPED.** `detectStackingEffects` now
    also returns `aoePerTargetSigs` (the `(|scale|, table)` of every template
    `computeAoePerTargetPatches` stamped), and the emit-site reconciliation replays them onto
    `allTemplates` alongside `redirectPerTargetSigs`. **One refinement the spec didn't call
    out:** the replay is conditional on `stackingSource !== powerJson`. On the normal path
    those signatures are redundant — the direct stamp already landed on the very template
    objects that become the atoms — so replaying by signature there could only mis-stamp an
    unrelated same-(scale,table) template that is not an increment at all, which would have
    silently corrupted the already-green ToHit/damage/defense gates.

  **Key data facts (verify-don't-assume, already confirmed):**
  - `toWho` distribution of non-Expression regen/recovery base buff atoms: Regen|Self 256,
    Recovery|Self 214, Recovery|Target 90, Regen|Unspecified 74, Recovery|Unspecified 64,
    Regen|Target 55, Recovery|All 1. ⇒ the bag's regen/recovery routing is
    target-AGNOSTIC (Target/Unspecified are folded into the slot), so the helper must be
    too; **cannot** punt on non-Self. Only the tspy trap drops the phantom subset.
  - `StackByAttribAndKey` is a `flags[]` entry, NOT a `stack` value, so it is NOT on the
    wire atom (`stacking = mapStacking(t.stack)`). `IgnoreStrength` IS on the wire
    (`ignoreStrength`); `Expression` IS (`attribType`); `tick_chance` is NOT.

  **Resume checklist — ALL DONE (2026-07-15).** (1) `regenBuffValue`/`recoveryBuffValue` in
  `atom-query.ts` per rules 1–6, sharing `resourceBuffValue` ✅; (2) the two converter
  changes ✅; (3) the four appliers in `character-totals.ts` migrated to
  `helper(power) ?? effects.<slot>`, `Res_Boolean` skip and `enhMultiplier`/`healOther`
  preserved ✅; (4) `scripts/planb-shadow-resources.cjs` built, wired into `regen-all.cjs`,
  mutation-tested on 9 axes ✅; (5) `resources-atom-native.verify.test.ts`, 10 cases ✅;
  (6) full regen — diff atoms-only, bag byte-identical, idempotent ✅; (7) full vitest
  1113/1113 ✅; (8) this doc ✅.

  **Follow-up left open (NOT a blocker):** the Icy Bastion `StackByAttribAndKey` burst/tail
  correctness question — does a burst + 30s lingering SUM, replace, or settle to the
  lingering? The bag currently answers BOTH ways from the same shape (regen +6, recovery
  +4), so at most one is right. Verify in-game/Mids, then either fix the bag and drop the
  punt, or stamp the verdict. ~5 powers.

  **Rule 4 footnote, resolved:** the design flagged that the shared `perTargetFromGroup` has
  no `ignoreStrength` guard on its self-increment sum, and offered two options. Taken: the
  second — resources reconstruct their per-target branch inside `resourceBuffValue` rather
  than reusing `perTargetFromGroup`, leaving the ToHit/damage helper untouched (its
  increments aren't IgnoreStrength, so sharing would have been a no-op there but would have
  coupled two helpers with genuinely different N=1 rules).

  **Slice 7 — Movement: the buff map migrated + three schema fixes (2026-07-16).**
  `character-totals.ts` now sources the movement buff map from `movementBuffValue(power)
  ?? effects.movement` (`atom-query.ts`) — the same `{ axis: {scale, table, stackKey?,
  suppressible?} }` shape the applier already iterates, so its body is unchanged. The
  hand-authored inherents in `levels.ts` (Sprint, Ninja Run, Beast Run) carry no atoms
  and reach the calc through the scalar `effects.runSpeed`/`flySpeed`/… path, NOT this
  map, so this slice does not touch them; the DoD's framing of `runSpeedUnenhanced` as
  "one of the last two `*Unenhanced` twins" was wrong — see the correction below.

  **This is the slice where the atom list was found collapsing on its OWN axis.** The
  bridge's `MOVEMENT_AXIS` mapped BOTH `flyingspeed` (the FlyingSpeed speed buff) and
  `fly` (kFly, the flight-MODE grant whose scale is a mode magnitude — "can fly": Hover
  2.0, Fly 2.0 — not a percentage) to subType `Fly`. 32 powers carry both, and Hover is
  the unrecoverable case: kFly 2.0 and FlyingSpeed 0 share subType AND the `Melee_Ones`
  table, so neither scale nor table separates them. The bag keeps `movement.fly` and
  `movement.flySpeed` apart precisely because conflating them reads the +200% mode grant
  as a speed buff (character-totals.ts has carried that warning for a while). So this is
  Plan B's own thesis pointed at itself — the fix is to MINT the discriminator on the
  atom, not re-derive it. `planb-shadow-bag.cjs` never caught it because it checks
  effectType existence, not subType.

  **Three schema fixes, each removing fabricated-or-missing information rather than
  patching around it (the CLAUDE.md root-cause discipline):**
  - **`FlyMode` subType split** — `fly` (kFly) now bridges to `Movement/FlyMode`,
    `flyingspeed` stays `Movement/Fly`. The helper's axis map covers only the four axes
    that reach a total (Run/Fly/Jump/JumpHeight); `FlyMode`, `Control` and `Friction` are
    structurally excluded, matching the applier's own `movementKeyMap`. +416 `FlyMode`
    tuples in the generated tree.
  - **`stackKey` on the wire** — the `TravelBuff`/`TravelMaxBuff`/`Stealth` mutual-
    suppression group was bag-only. Unlike Slice 4's `suppressible` (a converter VERDICT),
    `stack_key` is a genuine PARSER field, so it rides as first-class atom data
    (`AtomicEffect.stackKey`), meaningful only with `stacking: 'Suppress'`. Only 0.8% of
    templates carry one; the `0xFFFFFFFF` unresolved-registry sentinel is mapped to absent
    (`mapStackKey`) so it never reaches the wire as a groupable key — it never co-occurs
    with `Suppress`, so no live consumer was misled, but 269 atoms would have carried a
    bogus key. Appended last in `ATOM_TUPLE_FIELDS`, so every other atom stays byte-identical.
  - **`aspect` no longer defaults `'' → 'Cur'` (the root fix)** — `ingestTemplate` used
    `ASPECT_MAP[t.aspect ?? ''] ?? 'Cur'`, fabricating "Current" for a template that stated
    no aspect. That is the exact collapse Plan B exists to prevent, and it bit here: the
    bag routes a foe-targeted movement effect to `effects.movement` ONLY on a literal
    `aspect === 'current'` test, so a blank-aspect Thunderspy template is DROPPED by the
    bag but was indistinguishable on the wire from a genuine HC `Current` one. The first
    cut over-produced a phantom +5% run/jump/fly on Velocity Siphon (Thunderspy, blank
    aspect, `toWho:Unspecified`). New `Aspect` member `'Unspecified'`; the default is gone.
    Blast radius measured before the change and confirmed zero: HC and Rebirth export 0
    empty aspects between them (only Thunderspy does, on 98% of its templates), and no
    helper tests `=== 'Cur'` to mean "any" — every `=== 'Res'/'Str'/'Max'` test excludes
    a blank aspect either way. All six prior slice gates stayed green through it; the one
    other non-generated `'Cur'` consumer (`dsh8-incarnate-collapse-detector.cjs`, a
    non-gating local tool) was updated to accept `Unspecified` alongside `Cur` so it does
    not silently drop Thunderspy's mez protection. This is the reason the migration's first
    principle held: **an unstated value is not a default value.**

  **`movementBuffValue` reproduces the bag's MOVEMENT routing chain from atom fields
  that are all on the wire** — a peel sequence (aspect `Res` → debuffResistance; self +
  `Str` → specialBuff; self + `Max` + scale>0 → the travel-CAP raise `movementCapBump`,
  which is what stopped Super Speed reporting 1.938×Melee_Ones instead of its real
  1.0×Melee_SpeedRunning; slow → `slow`; else self, or the trailing `aspect === 'Cur'`
  for a foe-targeted current-movement buff like Speed Boost). Last-write-wins per axis,
  matching the bag's direct assignment (mutation M12 proved the ordering is load-bearing).
  `stackKey` and `suppressible` ride along per entry.

  A converter self-check needed a matching fix: `validate-converter-output.cjs`'s SC-5
  leak check mapped subType `Fly → ['fly','flySpeed']` — a two-key fudge that existed
  ONLY because the bridge had collapsed the two attribs. With them split it maps exactly
  one key each (`FlyMode → fly`, `Fly → flySpeed`), which is strictly MORE precise (a
  self-slow on one key is no longer satisfied by an atom on the other). SC-3/4/5 GATE PASS
  on all three datasets.

  Gated corpus-wide by `scripts/planb-shadow-movement.cjs` (**281/281 axis slots, 0
  diverge**, wired into `npm run regen`) and pinned by `movement-atom-native.verify.test.ts`
  (Super Speed's run buff not absorbing its cap raise; Fly reporting FlyingSpeed 1.1788
  not kFly 2.0; Hover's flySpeed = 0 not 2; Combat Jumping keyed-but-not-suppressed vs
  Super Jump suppressed; Swift unkeyed). **The gate checks BOTH directions per axis**
  (an over-production — an atom minting a movement entry the bag never had, the failure a
  fallback CANNOT protect against — fails as loudly as a drop) **and was mutation-tested
  on 12 axes, all killed, none crashed:**

  | mutant | axis | result |
  |---|---|---|
  | M1 | value ×2 | 281 red |
  | M2 | drop `table` | 281 red |
  | M3 | drop `stackKey` | **21 red** = the 21 keyed axis slots (cross-checked vs census) |
  | M4 | drop `suppressible` | **19 red** = the 19 suppressed axis slots (cross-checked) |
  | M5 | route `FlyMode` → flySpeed (the +200% bug) | 14 red |
  | M6 | drop the `movementCapBump` peel | 12 red |
  | M7 | drop the `slow` peel | 1804 red |
  | M8 | keep all non-self movement | 14 red |
  | M9 | drop the `Str` (specialBuff) peel | 44 red |
  | M10 | drop the `Res` (debuffResistance) peel | 339 red |
  | M11 | `atomsOfType` instead of `baseAtomsOfType` (ignore gated) | 25 red |
  | M12 | first-write-wins instead of last | 6 red |

  M5/M6 kill BELOW their census upper bounds (14 vs 29 fly clashes, 12 vs 17 capBumps)
  because a leaked atom only diverges when routing order actually clobbers — coherent, and
  the reason M12 (ordering) is its own axis rather than folded into the others. The bag is
  byte-identical: every one of ~58k changed generated lines is an atom tuple (`FlyMode` /
  `Unspecified` / `stackKey` gains), verified by filtering the diff to non-tuple lines
  (zero), and regen is idempotent.

  **Known interim compromise (same as Slices 1–6):** the self-STACK meta stays a bag read,
  keyed by SLOT NAME (`adjustForStacking(…, 'runSpeed', …)` on the scalar path). The
  `tohitDebuff`/`damageDebuff` guard that gates the WHOLE movement map (a foe-slow aura
  like Time's Juncture) also stays a bag read on purpose: it is a power-level heuristic
  about sibling slots, not a property of a movement atom, so it is not this slice's to move.

  ### The Thunderspy movement blackout — FIXED (2026-07-16, converter-side)

  > **Resolved the same day it was documented as deferred.** The "parser + re-export"
  > decision below was reversed by the data (verify-don't-assume, §6 of GAME-DATA-PRINCIPLES):
  > investigating the re-export revealed the **current tspy `bin.pigg` is incomplete** — it
  > parses Super Speed down to a single `["Ones"] 35.0` template, with the real movement
  > templates GONE from the binary but PRESENT in the committed export. A re-export would have
  > *regressed* the whole tspy dataset. So the movement data was already in
  > `exported_powers/thunderspy` all along; the fix is purely converter-side and needs no
  > re-export. See §"The fix that shipped" at the end of this section.

  Surfaced the moment the Slice 7 gate printed per-dataset coverage: **Thunderspy scores
  0 movement axis slots**, while HC has 160 and Rebirth 121. Thunderspy SHIPS Super Speed,
  Fly, Super Jump, Hover and Combat Jumping — so this is not "no travel powers", it is
  **every Thunderspy travel power giving +0 movement in the planner today**, in the bag and
  the atoms alike (which is why the shadow agrees vacuously and stayed silent about it —
  the coverage line is what makes it visible, per the plan's "a gate's SWEEP is part of its
  claim").

  Root cause, verified in `exported_powers/thunderspy` (the data is PRESENT and correct —
  `SpeedRunning`, `Melee_SpeedRunning`, scale 1.25, so this is a conversion gap not missing
  data):
  1. **Attrib spelling.** Thunderspy names the attrib `SpeedRunning` / `SpeedJumping` /
     `SpeedFlying` (280 / 137 / 107 templates) where HC/Rebirth name it `RunningSpeed` /
     `JumpingSpeed` / `FlyingSpeed`. Neither the bag's `MOVEMENT_TYPES` (`convert-powerset.cjs`)
     nor the bridge's `MOVEMENT_AXIS` maps the `Speed*` spelling, so every such template
     falls through to no slot at all. This is [[thunderspy-attrib-index-array]] /
     [[tspy-player-vocab-gap]] in a new costume — the tspy exporter's vocabulary diverges.
  2. **Empty aspect.** Even aliased, Thunderspy exports `aspect: ''` on 29,981 of 30,519
     templates (only a prior parser fix's synthesized `Resistance`/`Strength` are populated),
     so the Current-vs-Maximum split that separates a speed BUFF from a travel-CAP raise
     (`movementCapBump`) is not recoverable. A converter-only alias would mis-route tspy
     travel caps.

  There is also a SECOND, dropped-field half (below), and originally the plan was to fix both
  at the parser with a re-export. **That plan was reversed by what the re-export investigation
  found** (see the callout above): the tspy binary on disk is incomplete, so re-exporting
  regresses. The committed export already carries the movement data, so the fix moved
  converter-side.

  **The dropped target.** Beyond spelling, tspy drops the per-template `target` (the
  [[tspy-player-vocab-gap]] schema gap), so a movement template arrives `target: ''`. The bag
  routes movement to the self `movement` slot only on `target === 'Self'`, and the atom
  bridge's `toWho` reads the same field — so even with the spelling mapped, an empty target
  means +0. The power-level `targets_affected: ['Self']` is the authoritative recipient
  (GAME-DATA-PRINCIPLES §7), so the target is resolved from it.

  ### The fix that shipped (2026-07-16, converter-side, no re-export)

  Three edits, all on the committed data:
  1. **Spelling map** — `speedrunning`/`speedjumping`/`speedflying` (+ the odd
     `runspeed`/`flyspeed`) added to `MOVEMENT_TYPES` (`convert-powerset.cjs`) and
     `MOVEMENT_AXIS` (`atomic-effect.ts`). Same axes, same `Melee_Speed*` tables as HC.
  2. **Target resolution** — new `resolveThunderspyMovementTargets(powerJson)` sets a
     movement template's empty target to `Self` when `targets_affected === ['Self']`, BEFORE
     any collector reads it, so both the bag and the atom path route it as self. Narrow by
     design: only movement attribs, only pure-`['Self']` powers (the 219 self travel/sprint
     powers) — the foe (`['Foe']`) and mixed cases keep the status quo, since a per-template
     self/foe split can't be read from the power-level list. HC/Rebirth carry real targets,
     so the empty-target guard makes it a no-op there (no dataset flag needed).
  3. **Applied in all three converters** — the [[three-power-converters]] drift: the travel
     powers live in the POOL converter, so `resolveThunderspyMovementTargets` is exported
     from `convert-powerset.cjs` and called by `convert-pool-powers.cjs` and
     `convert-epic-pools.cjs` too (this is why the powerset-only first cut left Super
     Speed/Fly/Super Jump at +0 while 44 powerset-movement slots resolved).

  **Result:** the Slice 7 gate's tspy coverage went **0 → 59 axis slots, 0 divergences**;
  Super Speed (run 1.25), Fly (fly 1.25), Super Jump (jump 1.25), Sprint and Swift all
  resolve. Diff is tspy-only (HC/Rebirth generated byte-identical, 116 tspy files), regen
  idempotent, 1149 tests. Pinned by three tspy cases in `movement-atom-native.verify.test.ts`.

  **TWO gaps remain open (both real, both deferred):**
  - **Combat Jumping / Hover jumpHeight** — their jump/fly is encoded `Ones`-front (CJ's
    jumpHeight is a `["Ones"] 2.0 Melee_Ones` template, matching HC CJ's jumpHeight) with the
    real attrib in the post-`requires` index array. That is a DIFFERENT, deeper front-vs-index
    layer than the `SpeedRunning` spelling — recovering it needs the index array, i.e. a
    parser change, which is blocked by the incomplete binary. CJ's defense already works; only
    its jumpHeight is missing. Both sides (bag + atom) miss it equally, so the gate stays green.
  - **The incomplete tspy `bin.pigg`** — the current on-disk tspy binary is a stale/partial
    download (Super Speed → single `Ones` 35 template). The committed export predates it and
    is BETTER. tspy cannot be safely re-exported until a complete binary is obtained and
    verified (parses Super Speed's movement). This is the [[tspy-player-vocab-gap]] "confirm
    download complete before parsing" gotcha; it blocks any tspy parser fix, including the
    CJ/Hover jumpHeight one above.

  ### Correction: `runSpeedUnenhanced` is NOT a converter twin (2026-07-16)

  The DoD listed "the last two `*Unenhanced` twins — ToHit's and movement's" as remaining
  work, implying Slice 7 would retire `runSpeedUnenhanced` the way Slice 5 retired
  `maxHPBuffUnenhanced`. It cannot, because it is not the same kind of slot. The entire
  top-level movement family (`runSpeed`/`flySpeed`/`jumpHeight`/`jumpSpeed`/
  `runSpeedUnenhanced`) is produced ONLY by hand-authored inherents in
  `src/data/datasets/homecoming/levels.ts` (Sprint, Ninja Run, Beast Run) — the CONVERTER
  emits zero of them, and those inherents carry no atoms. `runSpeedUnenhanced` is Sprint's
  second flat `Melee_Ones` template hand-modelled as a literal, not an `IgnoreStrength`
  projection the converter mints. So the only genuine remaining `*Unenhanced` twin is
  ToHit's (Slice 1 migrated its atom-backed half; the movement one has no atom to migrate).
  The `*Unenhanced` twin family is effectively fully repaid by the converter side.

### Phase 3 — Bag becomes UI-only; then delete

**Prerequisite CLEARED 2026-07-15:** Phase 3 was silently blocked on the pool/epic atom
gap — the bag cannot be deleted while ~15% of powers have no atom representation. Pool
and epic-pool powers now emit atoms and every gate sweeps them (see §The pool/epic atom
gap). The two follow-on gaps that were open when that section was written are now also
closed (see §The six dead snipes): redirect-only powers resolve their chain in all three
converters, and the atom emit no longer depends on the bag's collector finding something.
**No known atom-less player power remains.** Corpus 10,321.

Known open items that are NOT Phase 3 blockers (no bag facts to lose, but real):
- **Epic-tier Fiery Embrace contamination** (~20 HC, ~46 Rebirth powers carry Fire they
  should not) — needs a per-power twin oracle, not the existing heuristic. See §FOUND,
  NOT FIXED above.
- **`internalName` collisions** — a bug *class*, not a Plan B concern, but it will bite
  any atom-keyed lookup that assumes global uniqueness. CoH identity is powerset+name.
- **Self-STACK meta** (`stacksLinear`/`maxStacks`/`stackCaps`) is still bag-keyed by SLOT
  NAME across every slice — the repeated-cast axis. NOT the same axis as the per-FOE
  `perTarget` (which is atom-native). This is the one real carry-over into Phase 3: the
  bag cannot fully die until it moves.
- Point the calc entirely at atoms; the bag is produced solely for the
  `EFFECT_REGISTRY`-driven display layer.
- Optionally re-express the display projection as `atoms → registry rows`
  directly and delete `PowerEffects` + `projectAtomsToEffects` + the bolt-on
  slots (`unresistable`, `durationVariants`, `*Unenhanced`, per-value `toWho`)
  entirely. This is the deletion the whole exercise buys.
- **DoD:** `PowerEffects` either deleted or demoted to a generated display view
  with no calc consumer; DSH6c/DSH3 gates retired as redundant (the bag they
  guard no longer feeds the calc).

## Risks & mitigations
- **Silent numeric drift during migration** → the corpus-wide shadow compare is
  mandatory and gating at every phase; no applier ships without its slice green.
- **Data-size blowup from emitting atoms** → measure in Phase 0; compact encode
  if needed; atoms can be lazily derived at load rather than stored if size wins.
- **Scope creep / stall** → phases are independently shippable; the interim
  DSH6c/DSH3 gates keep `main` correct throughout, so B can land over many small
  PRs without a risky long-lived branch.
- **The shadow "proves equality" but the bag was wrong** → where a known bag bug
  exists (a collapse), the shadow will *diverge*; that divergence is the fix
  landing, and each is verified against Mids/in-game as usual, not auto-accepted.
- **A gate is green because it isn't looking** → the failure mode that actually
  bit, twice (§Why this must get done). A gate's SWEEP is part of its claim.
  Before citing green, state what the gate cannot see. Mutation-testing does not
  help here: every mutant passes on a corpus that excludes the powers.
- **A shared helper carries invisible assumptions** → unification is the goal, but
  each sharing move needs its diff read power-by-power. `\bfire` silently encoded
  "set names have a dot in them" and nearly stripped Fire damage from every fire
  epic pool (§FOUND, NOT FIXED). Green gates did not notice.

## Definition of done
No character-total is computed from a named `PowerEffects` slot. Adding a new
game effect discriminator requires handling it in one atom helper, not minting a
new slot — and forgetting to handle it is impossible to do *silently*, because
the atom carries it and the calc must consume it explicitly.

**Remaining to reach it** (as of 2026-07-16, Phase 2 Slices 0–7 complete):
1. **Phase 3** — point the calc entirely at atoms; demote or delete `PowerEffects`.
   Prerequisite cleared: no known atom-less player power remains (corpus 10,321).
2. **Self-STACK meta off slot names** — `stacksLinear`/`maxStacks`/`stackCaps` are
   still bag-keyed by SLOT NAME across every slice. This is the one carry-over that
   actually blocks deleting the bag, as opposed to merely bypassing it.
3. **The remaining calc appliers still on the bag** — after Slice 7, `character-totals.ts`
   still sources these named slots directly: mez/`protection`, `absorb`, `rechargeBuff`,
   `slow` (the foe/self movement debuff), `elusivity`, `debuffResistance`,
   `damageDebuff`, `stealth`, `taunt`/`placate`, `range`/`accuracy`/`perception`,
   `endurance*`, `maxEndBuff`. Each is a candidate slice on the Slice-1..7 pattern.
   (The `*Unenhanced` twin family is now effectively fully repaid — ToHit's atom-backed
   half migrated in Slice 1, and `runSpeedUnenhanced` is a hand-authored `levels.ts`
   literal with no atom, NOT a converter twin; see the Slice-7 correction.)
4. **The other two converters** — `convert-incarnate-effects.cjs` and
   `convert-pet-entities.cjs` still emit no atoms (pet-entities has no gate at
   all). Not Plan B scope, but the DoD's "impossible to do silently" claim is
   false for any power they build. See `docs/converter-unification-direction.md`.
5. **The Thunderspy movement blackout — FIXED converter-side (2026-07-16).** The speed-based
   travel powers (Super Speed, Fly, Super Jump, Sprint, Swift) now resolve; tspy gate coverage
   0 → 59 slots. Two follow-ups remain OPEN, both blocked on a complete tspy binary: Combat
   Jumping / Hover jumpHeight (an `Ones`-front index-array recovery, parser-side) and the
   incomplete on-disk tspy `bin.pigg` itself. See §The Thunderspy movement blackout.
