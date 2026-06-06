# Pseudo-pet power resolution (`summon.powers` redirect chains)

_Findings + scoping doc, 2026-06-06. Driven by the Storm Cell / Category Five
report; turns out to be a systemic gap affecting ~32 powers. **Path C (full
model) is the correct fix** — captured here so it can be picked up deliberately
without derailing the archetype-defs leg (`feat/archetype-defs-binary-sourcing`)._

**Before touching the converter/parser, read
[GAME-DATA-PRINCIPLES.md](GAME-DATA-PRINCIPLES.md).** The running parser/converter
issue log is [BIN-PARSER-LOG.md](BIN-PARSER-LOG.md).

---

## The problem

A large class of location/patch/storm powers deliver **all** of their damage and
debuffs through a pseudo-pet that runs a *list of redirect powers*, and the
planner surfaces none of it. Example shape (generated):

```ts
// storm-blast/storm-cell.ts
effects: {
  summon: {
    isPseudoPet: false,
    entity: "PL_StaticObject",          // generic location marker — NOT a pet
    displayName: "Storm Cell",
    powers: [                           // <-- the real content lives here
      "Pets.ResistAll_NoFly.ResistAll",
      "Redirects.Storm_Blast.StormCell_Tempest",
      "Redirects.Storm_Blast.StormCell_SelfDestruct",
      "Redirects.Storm_Blast.Lightning_Proc",
    ],
    duration: 60,
  }
}
```

The planner shows nothing because:
1. `PL_StaticObject` (and `PL_FightPreferMelee`, `Pet_NoCollision`, …) are **not
   in `PET_ENTITIES`**, so `pseudoPetDamage` / `synthesizePseudoPetEffects` (the
   Glue Arrow unify infra) find no entity and bail.
2. The `summon.powers` list is **never resolved** — the redirect powers it names
   aren't converted into the planner (the `Redirects` category is exported to
   `exported_powers/redirects/` but `convert-powerset.cjs` doesn't generate it,
   since redirects aren't player-selectable).

This is distinct from the **Tactical Arrow Glue Arrow** fix (committed earlier):
that one's `entity` was a P-hash that resolved to a single `PET_ENTITIES` pet
(`Pets_StickyArrow_Blaster`) with plain abilities. These powers instead route
through a redirect-power *graph*.

## Scope (homecoming, generated layer)

**101 generated power files; ~32 distinct powers.** By summon-entity marker:

| entity marker | files | in PET_ENTITIES? | notes |
|---|---|---|---|
| `PL_StaticObject` | 65 | no | location markers — fully unresolved |
| `Class_Minion_Pets` | 7 | (class, not a specific pet) | |
| `Pet_NoCollision` | 5 | no | |
| `Sleet` / `Meteor` / `Vines` / `Mine` | 11 | Meteor/Vines **no** | named after the power |
| `Liquefy` / `Burn` / `Bonfire` | 9 | **yes** | damage partially works via `pseudoPetDamage`; redirect-power effects still missing |
| `PL_FightPreferMelee` / `PL_Untargetable_FightPreferRanged` | 4 | no | mobile pseudo-pets |

Distinct powers affected: **Bonfire, Burn, Carrion Creepers, Category Five,
Damping Bubble (Force Bubble), Disruption Arrow, EMP Arrow, Faraday Cage,
Freezing Rain, Geode, Glittering Column, Glue Arrow (Trick Arrow), Gravity
Distortion Field, Ice Storm, Lifegiving Spores, Lightning Rod, Liquefy, Meteor,
Poison Gas Arrow, Rain of Fire, Sleep Grenade, Sleet, Smoke Canister, Static
Field, Storm Cell, Tar Patch, Tear Gas, Tesla Coil, Tide Pool, Trip Mine, Vines,
Voltaic Sentinel.**

> Note the partial-coverage trap: powers whose entity *is* in `PET_ENTITIES`
> (Bonfire, Burn, Rain of Fire, Liquefy) show their pet's **damage** via the
> existing unify, but the **redirect-power effects** (extra debuffs, procs,
> chained sub-powers) are still dropped. So "it shows a damage number" ≠ "it's
> complete."

## Why this is hard (the complications beyond Glue Arrow)

The redirect powers (`exported_powers/redirects/storm_blast/*.json`, etc.) carry
the real effects, but in a graph, not a flat list:

- **`Execute_Power`** — a template that runs *another* power. e.g. Storm Cell's
  `Lightning_Proc` → `Execute_Power` → `StormCell_LightningAura2` (which carries
  the Energy damage + EndDrain + Stun + KB). The damage is one hop removed.
- **`Create_Entity`** — a template that spawns a *nested* pseudo-pet. e.g.
  `StormCell_SelfDestruct` / `nukenado_selfdestruct` create the lightning-aura
  entity. Another hop.
- **`Set_Mode` / storm-strength states** — the same debuff exists at two
  magnitudes depending on whether the storm is "powered up": Storm Cell's
  `StormCell_Tempest` (-Rech 0.07, -Spd 0.14, -ToHit 0.7) vs `StormCell_WindSpeed`
  (-Rech 0.14, -Spd 0.28, -ToHit 1.4 — ~2×). A correct model must represent these
  as conditional/mode variants (like the Bio-Armor adaptation handling), not sum
  them.
- **DoT over the summon window** — damage ticks across the 60s lifetime; needs the
  same fires-per-spawn accounting `pseudoPetDamage` already does for pet abilities.
- **Proc / chance gating** (`chance`, `ppm`, `tags: ["IncreaseStormStrength"]`).

A naïve "sum every template in every redirect" would double-count storm states,
miss the `Execute_Power`/`Create_Entity` hops, and produce **wrong numbers** —
worse than showing nothing (per GAME-DATA-PRINCIPLES §1). Hence path C.

## Worked example — the data that *should* surface

**Storm Cell** (`summon.powers`):
- `StormCell_Tempest`: -Recharge (Melee_Slow ×0.07), -Run/Fly/Jump (×0.14),
  -ToHit (Ranged_Debuff_ToHit ×0.7). [the shortHelp's "-Recharge, -SPD"]
- `StormCell_WindSpeed`: empowered variant, ~2× the above.
- `Lightning_Proc` → Exec → `StormCell_LightningAura2`: Energy_Dmg (Ranged_Damage
  ×0.5), End drain (-0.025), Stun (mag 3), Knockback.
- `StormCell_SelfDestruct`: `Create_Entity` (the lightning aura).

**Category Five** (`summon.powers` → `Category_Five`):
- Cold_Dmg (Melee_Damage ×0.008) + Smashing_Dmg (Ranged_Damage ×0.08) + slows
  (-Spd/-Rech) + `Set_Mode`.
- `category_five_lightning`: Energy_Dmg (Ranged_Damage ×0.5), EndDrain, KB,
  Stun (Ranged_Stun ×4 mag 3).

## Proposed approach (path C)

Reuse the Glue Arrow unify infrastructure (`pseudoPetDamage`,
`synthesizePseudoPetEffects`) by giving these location pseudo-pets a resolved,
`PET_ENTITIES`-shaped ability list — built at **convert time** so the runtime
display path is unchanged.

1. **Make redirect powers resolvable.** Either generate a `Redirects` lookup
   (name → effect groups) from `exported_powers/redirects/`, or resolve them
   inline during `convert-powerset.cjs`. Keep them out of the player-selectable
   powerset tree.
2. **Resolve `summon.powers`** → the redirect/pet power defs. Skip self-buffs
   like `Pets.ResistAll_NoFly.ResistAll` (pet survivability, not player-facing).
3. **Walk the graph:** follow `Execute_Power` and `Create_Entity` to their target
   powers/entities (bounded depth + cycle guard). Collect the leaf damage/debuff
   templates.
4. **Model storm-strength `Set_Mode` variants** as conditional modes (mirror the
   adaptation-mode handling — see GAME-DATA-PRINCIPLES §3 on `group`/`mode`), so
   the UI can show base vs empowered without summing them.
5. **Synthesize a pseudo-pet entity** (abilities = the collected leaves, with
   tables/scales/chance/period) and attach it so `pseudoPetDamage` (DoT over
   duration) and `synthesizePseudoPetEffects` (enhanceable debuffs into Power
   Effects) light up — exactly as they now do for Glue Arrow's slow.
6. **Cross-server:** design key-based, not Tag/structure-based (Parse6 vs Parse7,
   GAME-DATA-PRINCIPLES §7). Verify on both HC and Rebirth.

## Verification

- Trace one power end-to-end (`.powers` → redirects → resolved abilities →
  display) before generalizing (§2/§5). Storm Cell + Category Five are the
  reference cases; also re-check a PET_ENTITIES-backed one (Rain of Fire) to be
  sure the new path doesn't double-count its existing damage.
- Cross-check damage/debuff totals against CoD2 and in-game (the user can verify
  on the tester server).
- Add a focused test asserting a couple of these powers expose damage + the
  expected debuffs (mirror `pseudopet-effects.test.ts`), so a regen can't silently
  drop them again.

## Relevant files

- Parent powers: `src/data/datasets/<id>/generated/powersets/**` (the 101 files;
  `summon.powers`).
- Redirect source: `exported_powers/redirects/**` (e.g. `redirects/storm_blast/`).
- Converter: `scripts/convert-powerset.cjs` (EntCreate/summon handling — where the
  Tactical-Arrow P-hash resolution already lives).
- Runtime unify (reuse): `src/utils/calculations/pet-damage.ts`
  (`calculatePetDamage`, `synthesizePseudoPetEffects`),
  `src/components/info/InfoPanel.tsx` + `PowerInfoTooltip.tsx` (Damage / Power
  Effects / Summons blocks), `src/data/pet-entities.ts`.
- Prior art: the Tactical-Arrow Glue Arrow fix (P-hash → `priority_list`) +
  the enhanceable-debuff unify (BIN-PARSER-LOG "Pseudo-pet summon entities"
  resolved entry).

## Status / priority

Not started — **deliberately deferred** so it doesn't derail the archetype-defs
leg. Medium-large effort (graph resolution + mode modeling + cross-server). High
player-visible value (affects many staple powers: Bonfire, Burn, Freezing Rain,
the storm/rain/patch family, Trick Arrow, Force Bubble, …). Pick up on the PC
(needs the bins only if re-export is required; the redirect data is already in
committed `exported_powers/`, so much of this is a converter-only change).
