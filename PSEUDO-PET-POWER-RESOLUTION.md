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

## Verified end-to-end trace + refinements (2026-06-06, PC)

Traced both reference powers through the committed `exported_powers/` and the
existing converter machinery. Findings that change the implementation:

**1. The current converter silently drops a whole pseudo-pet (collapse bug).**
The parent `category_five.json` carries **two** `EntCreate` AttribMods, both with
`entity_def: PL_StaticObject` but *different* redirect lists:
- "Category Five" → `[ResistAll, Category_Five]` (the Cold+Smashing storm + slows)
- "Category Five **Eye**" → `[ResistAll, Nukenado_Skin, Nukenado_Pulse,
  **Category_Five_Lightning**, Nukenado_SelfDestruct]` (the lightning, KB, fear, immob)

The EntCreate handler ([convert-powerset.cjs:2150-2152](scripts/convert-powerset.cjs#L2150))
treats a repeated `entity_def` as "another copy of the same pet" → bumps
`entityCount` to 2 and keeps only the *first* redirect list. So the second
pseudo-pet (the lightning Eye) is thrown away — that's why Category Five's
lightning is unreachable. **Fix: distinguish EntCreates by `entity_def` + a
signature of the redirect list.** Identical lists (Fire Imps ×3) still collapse to
a count; distinct lists (generic `PL_StaticObject` shells) split into separate
pseudo-pets. So Cat Five resolves to *two* synthesized entities, not one.

**2. `collectTemplatesDeep` already does most of the graph work — reuse it.**
It follows `Execute_Power` (`params.power_names`) with a cycle guard + `MAX_DEPTH`,
excludes `PVP_ONLY`, keeps `chance:0` groups that still carry a payload (this is
how Storm Cell's `Lightning_Proc` → `IncreaseStormStrength` (chance 0) →
`Execute_Power` → `StormCell_LightningAura2` stays followed), and — crucially —
its `_isConditionalGate` skip **already dedups the AT-conditional damage copies**:
the `Class_Corruptor` inherent-damage and `Class_Sentinel` crit duplicates of each
Energy/Cold/Smashing hit are gated (`arch source> Class_Corruptor eq`, etc.) and
dropped, leaving only the one base hit. A naïve sum would have doubled/tripled
every damage number; the existing collector prevents it for free.

**3. What `collectTemplatesDeep` does NOT do (the deltas to add):**
- It doesn't follow `Create_Entity`. In *these* two powers that's harmless — the
  only `Create_Entity` templates (`StormCell_SelfDestruct`, `Nukenado_SelfDestruct`,
  `Nukenado_Skin`) have **no resolvable target** (no `params.entity_def`/`power_names`
  in the export — they're death-explosion hooks), so they're genuine dead ends.
  The Cat-Five lightning is reached via the *second EntCreate's redirect list*
  (finding #1), not via `Create_Entity`. Cycle-guarded `Create_Entity` following can
  be added later for powers that need it.
- It flattens away `chance`/`activate_period`, so DoT-over-window and proc gating
  (Lightning_Proc storm-strength, `Category_Five_Lightning` 0.25/0.67s) need the
  period/chance preserved on the synthesized ability.

**4. Storm Cell's debuffs are all `IgnoreStrength` (not enhanceable).** Every
Tempest debuff (-Rech ×0.07, -Spd ×0.14, -ToHit ×0.7) carries `IgnoreStrength`,
so they must surface as **informational/unenhanced** debuffs — the existing
`synthesizePseudoPetEffects` (which assumes CopyBoosts-enhanceable) and
`convert-pet-entities` (which *drops* IgnoreStrength) both mishandle them. Branch
the synthesis on the flag per-template: enhanceable → Power Effects (scaled);
IgnoreStrength → display-only (mirror the `…Unenhanced` pattern, GAME-DATA §4).
Glue Arrow's slow was *not* IgnoreStrength, which is why the prior fix was clean.

**5. `WindSpeed` (empowered Tempest, ~2×) is reached from the *attack* powers
(`Direct_Strike_*`), not the summon graph** — it's the storm-strength mode variant.
Out of scope for the summon-side prototype; model as a conditional mode later.

### Resolved leaves the prototype should surface (level-agnostic scales)

- **Storm Cell** (PL_StaticObject, 60s): *Tempest* (period 0.2s, r35) — -Rech
  (Melee_Slow 0.07), -Run/Fly/Jump (Melee_Slow 0.14), -ToHit (Ranged_Debuff_ToHit
  0.7), all IgnoreStrength; *Lightning* via Lightning_Proc→LightningAura2 (storm-
  strength gated) — Energy (Ranged_Damage 0.5), -End (Ranged_EndDrain 0.025), Stun
  (Ranged_Stun ×4 mag3, chance-gated), KB.
- **Category Five** = two pseudo-pets (20s): *Storm* — Cold DoT (Melee_Damage
  0.008, 0.33s), Smashing (Ranged_Damage 0.08), -Run/Jump (Melee_Slow 0.7), -Fly
  (0.84), -Rech (0.42), all IgnoreStrength; *Eye* — Energy lightning (Ranged_Damage
  0.5 @ 0.25 chance/0.67s) + -End + Stun + KB, plus Nukenado KB (Ranged_Knockback
  1.1) + Fear (mag 50) + Immob (mag 100).

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

**Prototype IN PROGRESS (2026-06-06, PC)** — Storm Cell + Category Five, inline
architecture (resolved abilities attached to `summon`, no PET_ENTITIES injection).

Done + verified:
- **Resolver** (`resolveSummonRedirects` + `classifyPseudoPetEffect` in
  `convert-powerset.cjs`) — reuses `collectTemplatesDeep` (Execute_Power follow,
  AT-conditional dedup, PvP exclusion, cycle guard) + `extractDamage`. Fixes the
  double-count (storm powered-up copy) and PvE/PvP mez traps.
- **Collapse fix** (`attachResolvedPseudoPets`) — distinguishes EntCreates by
  entity_def + redirect-list signature; Category Five now keeps BOTH pseudo-pets
  (20s storm + 17s "Eye"). Scoped to four location-shell entity_defs
  (`PSEUDOPET_SHELL_ENTITIES`) so it never overlaps a real pet → double-count-safe.
- **Runtime damage** (`calculateResolvedPseudoPetDamage`, pet-damage.ts) — scales
  off the **summoner's AT table** (verified: lvl-1 Blaster lightning = 5.12 =
  0.5 × Ranged_Damage(blaster,1); minion_pets would be wrong). Wired into the
  InfoPanel Damage block via the existing fires-per-spawn path. Tick counts match
  in-game exactly (61/20s storm, 26/17s eye).
- **Enhanceable-effect merge** — `synthesizePseudoPetEffects` extended for
  `resolvedEntities` (IgnoreStrength split honored).
- **Test** `pseudopet-redirect.test.ts` (8 cases) asserts the in-game-verified
  numbers; `tsc` clean; existing pseudopet tests still green. Only `blaster
  storm_blast` regenerated so far.

Verified against in-game (user screenshots, lvl-1 Blaster): every resolved scale
matches, and the enhanceable/IgnoreStrength split matches the tooltip's "Ignores
buffs and enhancements" notes exactly.

Display (DONE, user chose "Both"):
- Enhanceable debuffs → Power Effects (scaled). IgnoreStrength debuffs + mez +
  conditional damage → the informational "⚡ Creates" block (default-expanded,
  flagged "(unenh.)"), reusing `SingleEntityDisplay` with a `hideDamage` mode.

Damage presentation (DONE — refined over two in-app reviews):
- **Chance is first-class (`_redirectDamageChance`).** It computes the max
  cumulative chance to any damage template (following Execute_Power). Three cases,
  matching the planner's existing proc convention (procs count at EXPECTED value =
  chance × per-hit) and the in-game tooltip:
  - `chance >= 1` → guaranteed DoT (enhanceable headline). [Cat Five Cold/Smashing]
  - `0 < chance < 1` → **proc, counted at expected value** (`damageChance` ×
    per-hit). [Cat Five lightning, 0.25] — *not* excluded (the first attempt to
    exclude it was wrong; a chance-per-period proc is calculable).
  - `chance === 0` → **mode-gated** (storm-strength "while High Winds active"): no
    computable rate ⇒ `conditionalDamage`, surfaced informationally, not summed.
    [Storm Cell lightning] So Storm Cell shows no bogus guaranteed headline.
- **Cap bar retooled, not hidden.** The default reference `(base/scale) × cap` is
  per-activation, so a multi-tick lifetime total pins to max regardless of
  slotting. `pseudoPetDamage` now passes `scale: 1` ⇒ reference becomes
  `base × cap`, so the bar shows **enhancement headroom** (base at 1/cap, growing
  with enhancements/buffs). Only the DamageBar consumes `scale`, so this is safe.
- **Per-effect chance surfaced (DONE).** `collectTemplatesWithChance` replaces
  the flat collector inside `resolveSummonRedirects` and returns
  `{ template, chance, gated }` per leaf (following Execute_Power), so both damage
  AND effects carry their cumulative proc chance. A `chance:0` group is treated as
  a mode GATE (sets `gated`, keeps the cumulative chance) not literal 0%, so a
  within-mode proc survives. Storm Cell's Stun now reads **33%** (from the lightning
  pet `StormCell_LightningAura2`, via `Lightning_Proc`), KB 17%, Cat Five's lightning
  stun 8% (0.25×0.33), etc. `_redirectDamageChance` was retired (subsumed).
- **Creates block → 2-column layout (DONE).** The effects list was one tall column
  with a wide label↔value gap; now `grid grid-cols-2` with compact label↔value
  pairs, halving its height.
- **Known smaller gaps:** effects from a mode-gated ability (Storm Cell lightning's
  EndDrain) aren't yet flagged "while powered up" (only the damage is); the `gated`
  flag is computed but not surfaced on effects. Conditional damage value shows the
  per-tick number without a "while powered up" note.

Generalization (DONE — full regen, both datasets):
- **Homecoming: 60 generated files / 25 distinct powers** now carry
  `resolvedEntities` (Storm Cell, Category Five, Tar Patch, Faraday Cage, Carrion
  Creepers, Disruption/EMP/Poison Gas/Sleep-Grenade Arrows, Static Field, Tesla
  Coil, Tide Pool, Lifegiving Spores, Glittering Column, Gravity Distortion Field,
  Damping Bubble, Tear Gas, …). Diff is purely `resolvedEntities` additions (no
  drift). Scoped to the 4 location-shell entity_defs → never overlaps a real pet
  (only Spirit Tree summons both, and they're distinct entities — not a
  double-count). Powers that resolve to a real pet via P-hash→priority_list
  (Rain of Fire→Pets_RainofFire, Glue Arrow→Pets_StickyArrow, Trip Mine→Pets_Mine,
  Freezing Rain/Ice Storm/Tornado) keep the existing pet-damage path, untouched.
- **Resistance/defense-by-type debuffs captured** — `classifyPseudoPetEffect` now
  detects the all-8-types `aspect=Resistance` / `*_Debuff_Def` template (Tar Patch
  −res, Disruption Arrow −res). §3-correct: it rejects ally resistance BUFFs
  (Faraday Cage — positive/self) so they're not mislabeled debuffs.
- **Cross-server (§7): both formats work, by different mechanisms.** HC Parse7 puts
  the content in REDIRECTS off a generic shell (`entity_def=PL_StaticObject`, real
  pet a P-hash) → my resolver handles it. Rebirth Parse6 INVERTS it
  (`entity_def=Pets_IceStorm` the real pet, `priority_list=PL_StaticObject` the
  shell, no redirects) → the existing pet-entity path already surfaces it. Rebirth
  regen = 0 changes, which is correct (it doesn't use the shell+redirect pattern;
  Storm Blast isn't even on Rebirth). Verified Tar Patch/Bonfire/Caltrops/etc. all
  carry `entity_def=Pets_*` on Rebirth.

Follow-up #2 (DONE — branch `feat/pseudopet-named-shells`):
- **Named-entity shells resolved.** Added `Meteor`, `Vines`, `Mine`,
  `Class_Minion_Pets` to `PSEUDOPET_SHELL_ENTITIES` (verified no `Pets_*` overlap →
  double-count-safe). Resolves Meteor, Plant-Control Vines, Sleep Grenade, Smoke
  Canister/Grenade, Geode (~13 files). Arsenal Trip Mine correctly does NOT resolve
  (its `TripMine_Resistance` is all `target:Self` pet-survivability; the explosion
  is a direct attack on the parent).
- **Nested `Create_Entity` hop followed.** `collectTemplatesWithChance` now follows
  `Create_Entity` `params.redirects` as well as `Execute_Power` `params.power_names`
  (cycle-guarded, depth-bounded) — Meteor delivers damage one hop deep (creates a
  "Meteor" entity that runs `MeteorHit` → Fire+Smashing). Storm Cell/Cat Five
  unaffected (their `Create_Entity` self-destructs have no redirects).
- **Un-prefixed `priority_list` fallback.** `getPetEntity(name)` falls back to
  `Pets_<name>` — fixes Sleet/Liquefy/Ice_Blast, whose P-hash EntCreate resolves
  (via `priority_list`) to a bare `"Sleet"`/`"Liquefy"` whose real key is
  `Pets_Sleet`/`Pets_Liquefy` (complete entities). Existing pet-damage path, no
  redirect resolution → no double-count. Wired through calculatePetDamage,
  shouldApplyEnhancements, synthesizePseudoPetEffects, and the InfoPanel lookups.
- Tests: +Meteor (Create_Entity hop) +Sleet (`Pets_` fallback) → 15 redirect
  cases; full suite 202 green; tsc clean.

Remaining (smaller, not blocking):
- **PET_ENTITIES-overlap redirect effects** (Bonfire/Burn/Liquefy): the pet entity
  now gives damage via the existing path (Liquefy via the `Pets_` fallback), but any
  EXTRA redirect-power effects beyond the pet's own abilities are still dropped —
  needs a merge that doesn't double-count the pet damage.
- Mode variants ("High Winds"/"Strong Lightning"); effects from a mode-gated
  ability not yet flagged "while powered up"; conditional-damage "while powered up"
  label; **PowerInfoTooltip parity** (hover tooltip still uses the old path only).

Original framing (kept): Medium-large effort. High player-visible value (Bonfire,
Burn, Freezing Rain, the storm/rain/patch family, Trick Arrow, Force Bubble, …).
The redirect data is already in committed `exported_powers/`, so it's a
converter+runtime change — no bins needed unless a re-export is wanted.
