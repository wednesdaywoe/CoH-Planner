# How CoH Models a Power — the data model behind the whole planner

> The structural explainer. This is the *why* that most of
> [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md)'s traps are instances of. If the
> parser, a converter, or the calc is producing a wrong number and the individual gotchas
> feel like a disconnected pile, read this first — nearly all of them are the same mistake
> in different clothes.
>
> Audience: anyone (including the maintainer, who learned CoH internals incrementally and
> is not a career programmer) who needs a durable mental model of the data, not a tour of
> the code. Concrete game examples throughout; the code is secondary and named only so you
> can go look.

---

## 1. The one sentence

**A City of Heroes power is a flat list of atomic effects. Everything else is a view of
that list.**

Not a bag of stats. Not "+15% defense and −20% to-hit and a hold." Under the hood a power
is an ordered array of small, self-describing records — the game engine calls them
**AttribMods** — and each record says, on its own, *exactly one thing the power does to
exactly one recipient under exactly one set of conditions.*

Super Speed is not "run buff + jump buff + a cap raise." It is a list:

```
[ run   +1.0   ×Melee_SpeedRunning   to Self,  suppressed in combat,  group "TravelBuff" ]
[ run   +1.938 ×Melee_Ones (Maximum) to Self,  a travel-CAP raise,     ignores Strength   ]
[ jump  +0.1   ×Melee_Leap           to Self,  suppressed in combat,   group "TravelBuff" ]
[ jump  +0.075 ×Melee_SpeedJumping   to Self,  suppressed in combat,   group "TravelBuff" ]
… (PvE and PvP copies of each, plus mode/threat bookkeeping rows)
```

Each row is complete in itself. The "+1.0 run" and the "+1.938 run cap" are *different
effects that happen to touch the same stat* — one raises how fast you go, the other raises
how fast you're *allowed* to go — and the only thing that tells them apart is the fields on
the row (`aspect: Current` vs `aspect: Maximum`, different tables). Lose those fields and
the two become the same row, and the planner shows garbage. That collapse — two genuinely
different effects flattened into one because the thing distinguishing them was thrown
away — is the single most common bug class in this project. The whole point of the model is
to never throw those fields away.

## 2. Where the model comes from (and why we trust it)

Three independent sources agree on the flat-list shape, which is why we build on it:

- **The binary.** `powers.bin` stores each power's effects as a run of AttribMod structs.
  The parser (`tools/bin-crawler/`) reads them into `exported_powers/**/<power>.json` as a
  `effects[]` array of template records — one-to-one with the AttribMods.
- **MidsReborn**, the long-standing community build planner, models *everything* — powers,
  incarnates, set bonuses — as flat atomic effect arrays through one pipeline. A 2026-07
  architecture review confirmed our design converges on theirs.
- **Our own atomic core.** `src/data/core/atomic-effect.ts` defines `AtomicEffect`, a closed
  record that carries every discriminator (below). The converter turns each exported
  template into one or more `AtomicEffect`s (`templatesToAtoms`), one per (template × affected
  attribute). Nothing downstream sees a raw template — the `AtomicEffect` list is the
  working model.

So "a power is a flat list of atoms" is not our invention or a convenience; it is how the
game stores it, how the reference planner models it, and how our pipeline now carries it.

## 3. The discriminators — what makes two effects *different*

This is the heart of the model, and the section to actually memorize. Two AttribMods are
"the same effect" only if they agree on **all** of these axes. Key on the wrong subset and
you merge things the game keeps apart (or split things it keeps together). Every trap in
GAME-DATA-PRINCIPLES §3 is "you keyed on the wrong axis here."

| Axis | What it distinguishes | A pair it separates |
|---|---|---|
| **effectType** | which system: Damage, Defense, Resistance, ToHit, Regeneration, Movement, Mez, … | a +Def buff vs a −Res debuff |
| **subType** | the *variant within* a type: damage type (Smashing/Fire/…), mez kind (Held/Stunned), defense position (Melee/Ranged/AoE), movement axis (Run/Fly/Jump) | Fire Shield's Fire-resist vs its Cold-resist |
| **sign of scale** | buff vs debuff/penalty — scale is stored **signed** | a +ToHit buff vs a −ToHit debuff on the same table |
| **aspect** | which *face* of the attribute: Current (the live value), Maximum (the cap), Resistance (resistance-to-that-effect), Strength (enhance-ability), Absolute | Super Speed's run *speed* (Current) vs run *cap* (Maximum); a +Res buff vs a −Res *debuff-resistance* |
| **toWho** | recipient: Self, the Target, All-affected, Pets | a self-buff vs the same magnitude landing on a foe |
| **pvMode** | PvE-only, PvP-only, or Any | the PvE and PvP copies of Fly's speed buff (different scales, one applies per context) |
| **resistible** | whether the target's resistance reduces it (`IgnoreResistance` flag) | a resistible −Regen vs an unresistable twin of it |
| **ignoreStrength** | whether the caster's enhancements/buffs boost it (`IgnoreStrength` flag) | High Pain Tolerance's enhanceable +MaxHP half vs its IgnoreStrength half (both apply, only one scales with +Healing) |
| **stacking / stackKey** | how re-application combines: Stack, Replace, Refresh, RefreshToCount…; and `stackKey`, the mutual-suppression *group* (`TravelBuff`) where only the strongest member applies | Combat Jumping vs Super Jump both in the "TravelBuff" group — they suppress each other, they don't add |
| **modifierTable** | the AT scaling table the scale multiplies through — the value is meaningless without it | Swift's `0.1` is +35% on `Melee_SpeedRunning`, not +10% |

Two rules follow directly, and they are the two that keep biting:

1. **Discriminate by aspect/sign/target, not by attrib NAME.** A `_Dmg` attrib on an
   `aspect=Resistance` template is a −Resistance debuff, not a damage buff (Venom Grenade).
   A `Base_Defense` attrib on `aspect=Resistance` is *defense-debuff-resistance*, not
   defense. The attrib name tells you the *stat*; the discriminators tell you *what is being
   done to it*.
2. **An absent axis is not a defaulted axis.** If the source doesn't state an aspect, the
   effect's aspect is *unstated* — not "Current." Decoding absence to a plausible default
   fabricates a discriminator and collapses a real distinction: Thunderspy omits `aspect`
   on 98% of templates, and defaulting them to Current made a blank-aspect movement row
   indistinguishable from a genuine Homecoming `Current` one, minting a phantom +5% buff.
   Decode absence *as* absence (`Unspecified`). (GAME-DATA-PRINCIPLES §3.)

## 4. The bag, and why it collapses

The planner's calc and UI historically read a power as a **`PowerEffects` bag** — an object
with ~90 named slots (`defenseBuff`, `tohitBuff`, `recoveryBuff`, `movement`, …). That shape
is convenient for display ("show me this power's defense") but it is a **lossy projection**
of the atom list, produced late by `projectAtomsToEffects`:

```
templatesToAtoms()  →  [ immutable atom list ]  →  projectAtomsToEffects()  →  PowerEffects bag
   one atom per atomic game effect                    ⚠️  the collapse happens HERE
```

The collapse mechanism is simple and mechanical: **a named slot holds one value, so when
two different atoms route to the same slot, one silently overwrites the other.** The slot
has nowhere to record that a distinction existed. Concretely, this is where months-long
silent bugs came from:

- **Hover's fly grant vs its fly speed.** Both are "fly" effects; the bag's single fly-speed
  concept can't hold "you can fly (mode)" *and* "you fly this fast (speed)" separately, so
  reading the mode grant as a speed buff double-counted Fly by +200%.
- **The `*Unenhanced` twins.** +MaxHP has an enhanceable half and an IgnoreStrength half that
  both apply and sum. One slot can't hold both, so the bag grew a *parallel slot*
  (`maxHPBuff` + `maxHPBuffUnenhanced`) — a hand-rolled duplicate for a single discriminator
  (`ignoreStrength`), repeated for regen, recovery, to-hit, run-speed. Five slots for one
  axis, because the bag can't carry the axis itself.
- **Bio Armor's stance adaptations.** Each adaptation is a gated variant of the same slots;
  flattening them into the base bag leaked every stance's defense into the always-on total.

Every fix took the same shape: **re-materialize the lost discriminator** as a sibling slot
(`…Unenhanced`) or a per-value flag (`toWho`, `unresistable`, `perTarget`, `suppressible`,
`durationVariants`). That is the *tax* of the bag: the discriminator is a property of the
atom, and the bag forces you to reinvent it, one effect type at a time, forever — and you
only discover you need to when a bug surfaces. The durable fix (the "Plan B" migration) is
to make the calc read the **atom list** directly, where the discriminator was never lost, so
the bag becomes a display-only view (or goes away). See
[CONVERTER-ATOM-ARRAY-PLAN.md](CONVERTER-ATOM-ARRAY-PLAN.md).

**The practical takeaway even if you never touch the migration:** when a total is wrong,
ask *"which two different atoms are fighting over one bag slot?"* before anything else. That
question has found more bugs here than any other.

## 5. On the wire vs stamped by the converter

Not every discriminator survives to runtime on the atom, and knowing which is which is
essential to reasoning about any new effect.

- **On the wire** (present in the exported data, decoded straight onto the atom):
  `aspect`, `sign`, `toWho`, `pvMode`, `resistible`, `ignoreStrength`, `stacking`,
  `stackKey`, `modifierTable`, `scale`, `duration`. If you need one of these, read it.
- **Converter-stamped verdicts** (a fact the runtime *cannot re-derive*, because it depends
  on information only the converter's whole-power scope holds — so the converter computes it
  and writes it onto the atom):
  - **`gated`** — is this atom part of the power's unconditional base, or does it apply only
    under a mode/stance/PvP/hidden-state gate? Depends on *collection provenance* (a template
    reached via a redirect chain or `activation_effects` passed filters no gate expression
    records), not just the gate string.
  - **`perTarget`** — the per-foe increment of an AoE self-buff (Soul Drain's +ToHit grows
    with foes hit). Derived from AoE geometry (`max_targets_hit`, radius), redirect
    `number_allowed`, and the raw stack flavor — none of which reaches the runtime.
  - **`suppressible`** — does this buff switch off in combat? Half of it lives in a
    `suppress_events` template tail (Hide's attack-click suppression) that never reaches the
    wire, so the converter folds it into one flag.
  - **`notOnCaster`** — a Thunderspy pet/foe effect the caster's totals must skip, identified
    by a text/`targets_affected` heuristic the runtime doesn't have.

The rule of thumb: **if a fact requires looking at the whole power, the redirect chain, or
the raw text to know, it must be stamped by the converter — the runtime sees only the atom.**
This is why "just re-derive it in the calc" is usually wrong for these four.

## 6. Why there are five converters (and why they drift)

The same flat-list model is built five times, by five scripts, because the planner's data was
originally organized around *player-visible categories* (powersets, pools, epic pools,
incarnates, pets) before it was understood that under the hood they are all the same AttribMod
structure:

`convert-powerset.cjs` · `convert-pool-powers.cjs` · `convert-epic-pools.cjs` ·
`convert-incarnate-effects.cjs` · `convert-pet-entities.cjs`

They run *shortened, independent* pipelines and drift apart: for a long time only the powerset
converter emitted atoms, ran the AoE stacking detector, and followed redirects — so epic Soul
Drain shipped flat and six epic snipes shipped with no damage, purely because they go through
a different, thinner converter. Two consequences you must carry:

1. **A claim about "the corpus" is probably about `convert-powerset` only.** Written censuses
   in this repo have repeatedly said "three converters" or "all powers" while silently meaning
   HC powersets. Check which converter and which datasets a statement actually covers.
2. **The parallel converter is a free oracle** (GAME-DATA-PRINCIPLES §5): the *same power*
   often exists on two paths (Blaster Moonbeam via `convert-powerset`, epic Moonbeam via
   `convert-pool-powers`), so the correct one grades the other. Divergence between them hides
   bugs until you diff them — and then it's the cheapest bug-finder available.

The direction of travel is to unify all five onto the shared `AtomicEffect` core so the model
is built *once*; see [converter-unification-direction.md](docs/converter-unification-direction.md).

## 7. Reasoning about a new effect — the checklist

When you add or debug an effect, walk the model instead of pattern-matching a slot:

1. **Find the atoms**, not the slot. Look at the power's `effects[]` in `exported_powers`
   (or `power.atoms` in `generated/`), and read each row's discriminators.
2. **For each atom, answer the axes in §3**: what effectType/subType, what sign, what aspect
   (Current? Maximum? Resistance?), to whom, PvE/PvP, resistible?, ignoresStrength?, what
   table. *Do not* infer any of these from the attrib name.
3. **Ask what would collapse it** (§4): is there a sibling atom that routes to the same bag
   slot and would overwrite it? Two same-type atoms differing only in `aspect`, `ignoreStrength`,
   `toWho`, or duration are the classic colliding pair.
4. **Decide wire vs stamped** (§5): if the fact you need (base-vs-gated, per-foe, combat-
   suppressed, not-on-caster) can't be read off a single atom, the converter must stamp it.
5. **Verify against an oracle** (§5, §6): the `.powers` source for structure, the parallel
   converter's twin for a same-shape power, in-game/Mids for a number. A self-consistent
   pipeline proves nothing — check something outside it.
6. **Gate it, and distrust the gate** (GAME-DATA-PRINCIPLES §14): a shadow comparison that
   sweeps the *whole* corpus (all five converters, all three datasets, both directions), then
   mutation-test the gate so you know it can go red. A green gate is a statement about the
   observer until you've said what it can't see.

---

*This document is the durable structural model; the dated blow-by-blow of the migration that
produced it lives in [CONVERTER-ATOM-ARRAY-PLAN.md](CONVERTER-ATOM-ARRAY-PLAN.md), and the
operational traps/methods live in [GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md). When
the model itself changes (a new discriminator, a converter unified away), update this file —
it is the one place the model is stated as a model rather than as history.*
