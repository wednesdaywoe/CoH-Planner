# Handoff — Thunderspy archetype inherents (Stalker Hide + Placate)

**Branch:** `fix/thunderspy-archetype-inherents` · **Commit:** `e277a5655a` · **Date:** 2026-08-07

Bug report: *"Thunderspy — Stalkers get Hide and Placate as an inherent power. Hide can be
slotted, placate cannot."* On the live site neither power appeared anywhere — not in the
powersets, not in the inherents.

---

## What was wrong

Thunderspy moved both powers **out of the Stalker powersets** into `Inherent.Inherent`,
auto-issued and gated `$archetype @Class_Stalker ==`, then **reused the vacated powerset
name slots** for other powers:

| slot | actually holds |
|---|---|
| `Stalker_Defense.Ninjitsu.Hide` | Quick Recovery |
| `Stalker_Melee.Ninja_Sword.Placate` | The Lotus Drops |

Nothing in the planner read archetype-gated auto-issue inherents. `convert-powerset.cjs`
only walks the powerset categories, and `ARCHETYPE_INHERENT_POWERS` in
`datasets/homecoming/levels.ts` is hand-written and covers the two Kheldians only. So both
powers were reachable from **no screen at all**.

Homecoming and Rebirth grant both from powersets and were never affected.

---

## The fix

New converter `scripts/convert-archetype-inherents.cjs` **derives** the missing powers
rather than naming them — a fork that moves another power the same way is picked up with
no edit. A member of `<dataset>/inherent/inherent/` is kept when all five hold:

1. `auto_issue` — the server hands it over; the player never picks it.
2. `requires` gates on **player** archetype classes only, per that dataset's own class
   catalogue (`derivePlayerArchetypes`). Keeps out NPC classes and dead legacy variants
   (`Class_BlasterOLD`'s four Defiance copies).
3. `boosts_allowed` non-empty. Drops the meter/dampen/mode bookkeeping —
   `Domination_Meter`, `Rage_Dampen`, `Primal_Energy_Meter`,
   `Vigilance_PerTeamEndAdjustment` — which share their archetype inherent's display name
   and carry no boosts.
4. No powerset in this dataset already **displays** that name.
   **This is the load-bearing clause.** Display name, *not* internal name: Thunderspy's
   powerset layer does carry `internalName: "Hide"`, pointing at Quick Recovery, so an
   internal-name check reproduces the very collision this exists to see past.
5. Not already handed out by `GRANTED_POWER_GROUPS`. The Kheldian form attacks
   (`Bright_Nova_Blast`, `Black_Dwarf_Strike`, …) live in `Inherent.Inherent` too and
   reach the build through their form toggle; without this they'd all be doubled.

Wired through a new `inherentRules.archetypeInherents` hook on the `Dataset` contract,
merged in `src/data/levels.ts` (shared hand-written list wins on an `internalName` clash).

### What it restores — Thunderspy only

| archetype | restored |
|---|---|
| **Stalker** | **Hide, Placate** |
| Peacebringer | Group Energy Flight, Quantum Acceleration |
| Warshade | Shadow Slip, Starless Step |

Ten powers match the rule; four of them (Energy/Combat Flight, Shadow Step/Recall) were
already in the shared list and are deduped out. **Homecoming and Rebirth derive zero** —
rule 4 rejects them — which is what makes the emit safe to merge unconditionally.

### Levels and slots come from the export

`available_level` is read straight through. Homecoming's export says `9` for Combat Flight
and Shadow Recall and `0` for Energy Flight and Shadow Step — exactly what the
hand-written Kheldian list encodes, so it is the authority, not a guess. Thunderspy's says
`0` for all ten.

Slot ceilings read an explicit `max_boosts: 0` as the zero it is, so **Hide gets 6 slots
and Placate gets 0** — matching the bug report.

---

## Files

| file | change |
|---|---|
| `scripts/convert-archetype-inherents.cjs` | new — the converter (selection rule in its header) |
| `scripts/regen-all.cjs` | runs it, after `convert-all-powersets` (rule 4 needs a fresh powerset layer) |
| `src/data/dataset.ts` | `InherentRules.archetypeInherents` |
| `src/data/levels.ts` | shadows `getArchetypeInherentPowers`; `getInherentPowerDef` falls through to dataset additions so saved builds re-hydrate |
| `src/data/datasets/*/index.ts` | wire the generated map |
| `src/data/datasets/*/generated/archetype-inherents.ts` | new — generated (HC/Rebirth are empty) |
| `src/data/datasets/thunderspy/stalker-inherents.test.ts` | new — 10 tests |
| `.gitignore` | see below |

---

## Two side-findings

### 1. `.gitignore` was eating the Thunderspy dataset — **fixed here**

Line 61 was `Thunderspy/`. Unanchored, so git matches it **at any depth**, and
`core.ignorecase` is true on macOS and Windows checkouts — so it also swallowed
`src/data/datasets/thunderspy/`. Already-tracked files kept working, which is what hid it:
only **new** files under the Thunderspy dataset went silently un-added. Both files this
commit adds there were invisible to `git status`.

Now anchored to `/Thunderspy/`. **Anyone who added a Thunderspy dataset file since that
line landed should check it actually got committed.**

### 2. `max_boosts || 6` — **not fixed here, still open**

`convert-powerset.cjs:6999` computes `powerJson.max_boosts || 6`, which folds a stated `0`
into the 6-slot default because `0` is falsy. `convert-pool-powers.cjs` and
`convert-epic-pools.cjs` already read it correctly
(`max_boosts !== undefined && !== null ? max_boosts : 6`); the three converters disagree.

The new converter reads it correctly for the powers it owns. `convert-powerset.cjs` was
left alone deliberately: **554 Thunderspy powers** state a `0` alongside a non-empty
`boosts_allowed` and currently show as 6-slot. Correcting it there is its own change with
its own verification, not a side effect of this one.

---

## Verification

- New test file: **10/10 pass**.
- Full suite: **no regressions.** 14 failing files and 7 failing tests before *and* after;
  passing count 1674 → 1694. Every failure in both runs is a pre-existing `loadDataset`
  timeout (confirmed one fails 3/3 on a clean tree).
- `npx tsc --noEmit` clean.
- Converter output **byte-identical** on re-run (satisfies CI's regen-diff guard).
- `npm run build` succeeds — needs `NODE_OPTIONS=--max-old-space-size=10240` locally,
  which CI already sets.

---

## Still open

1. **Mastermind `Hold_Ground`** is still missing on Thunderspy. The rule correctly skips
   it — a Toggle with an empty `boosts_allowed`, so it fails clause 3. Likely a real but
   unslottable power. Needs a call on whether unslottable toggles should qualify.
2. **The rebuild** (`coh-sidekick-1.0-1`) has the same gap, and it drops more: 62 of 97
   Thunderspy auto-issue inherent members, 46 of them archetype-gated.
   `scripts/convert-inherents.cjs`'s grant closure keeps a member only if its `requires`
   names a power token, and `$archetype @Class_Stalker ==` names none. The fix there is a
   third closure rule — *auto-issued + gate names a player archetype in the dataset's own
   catalogue* — using the existing `derivePlayerArchetypes`. Not yet written.
3. **`GENERATED_ARCHETYPE_INHERENTS` is only consulted for archetype inherents.** If a
   fork ever moves a *pool* or *epic* power the same way, this converter won't see it.
