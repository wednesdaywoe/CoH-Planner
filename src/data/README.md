# `src/data/` — power data layering

Power data lives in three sibling trees, per server, under
`src/data/datasets/<server>/` (`homecoming`, `rebirth`):

```
src/data/
├── datasets/<server>/
│   ├── generated/                All auto-extracted data. NEVER hand-edit.
│   │   ├── powersets/<at>/<slot>/<set>/<power>.ts   (per-power)
│   │   ├── epic-pools.ts                            (aggregate)
│   │   ├── power-pools.ts                           (aggregate)
│   │   └── incarnate-effects.ts                     (aggregate, heterogeneous)
│   │
│   ├── overrides/                Hand-written deltas. Survives regeneration.
│   │   ├── powersets/<at>/<slot>/<set>/<power>.ts   (per-power Partial<Power>)
│   │   ├── epic-pools.ts                            (Record<fullName, Partial<Power>>)
│   │   └── power-pools.ts                           (Record<fullName, Partial<Power>>)
│   │   (No overrides file for incarnate — its exports are heterogeneous
│   │    so per-power overrides don't apply.)
│   │
│   └── powersets/<at>/<slot>/<set>/<power>.ts       Composed per-power export
│
├── _layer.ts                    withOverrides() + applyAggregateOverrides()
└── *.ts                         Thin facades forwarding to the active dataset
```

Planner code imports from the composed layer (`powersets/.../<power>.ts`,
`epic-pools-raw.ts`, `power-pools-raw.ts`, `incarnate-effects.ts`). Aggregate
composed files wrap the generated data with `applyAggregateOverrides(base,
overrides)`, which walks the tree and applies any per-power override keyed
by `fullName`.

## Why three files

The convert script regenerates `generated/` from `exported_powers/` on
every run, so any hand-edit there would be overwritten. Splitting into
generated + overrides + composed lets each layer evolve independently:

- Re-run the converters (`npm run regen`) whenever the source changes —
  overrides survive untouched.
- Hand-edit an override only when the generated extraction is genuinely
  wrong/missing a planner-side field — the next regen leaves it alone.
- Composed files are thin `withOverrides(generated, overrides)` wrappers;
  they only need editing if the power's export name changes.

## ⚠️ `generated/` is authoritative — overrides should be rare and shrinking

> **This section was inverted before 2026-06.** It used to say the source
> was a stale 2019 CoD2 archive and that "the overrides layer is where the
> current HC values live — do not drop an override that disagrees with
> generated." **That guidance is now wrong and has been removed.**

The convert source is now `exported_powers/`, produced by **Bin Crawler from
the live HC `.pigg` binary** (refreshed every patch). So `generated/` reflects
**current** game data — it is the authoritative layer, not a stale snapshot.

Consequently the old override rationale **inverted**: an override that pins a
numeric value (`stats.recharge`, a damage `scale`, an effect `table`) now
almost always *freezes an old CoD2 value on top of correct generated data* —
the opposite of preserving the current value. A 2026-06 audit verified every
numeric-pinning override against the `.powers` oracle / a fresh live-binary
parse and **retired ~2,000 lines of stale pins** (DIVERGENT 140 → 9).

So, the corrected rules:

- **A numeric override that disagrees with `generated` is suspect, not
  sacred.** The right test is `generated == oracle` (the `.powers` raw def or
  a fresh Bin Crawler parse of the live `.pigg`), *not* "is the override
  stale" — removing it falls back to `generated`, so what matters is whether
  generated is correct. When generated matches the oracle, drop the pin.
- **Keep only genuine enrichments** the parser doesn't emit yet (planner-only
  fields like `maxStacks`/`stacksLinear`; data gaps like `summon.copyBoosts`).
  When you find such a gap, log it in [HOMECOMING_PARSER.md](../../streams/HOMECOMING_PARSER.md)
  and prefer fixing the parser/converter over keeping the override.
- See **[GAME-DATA-PRINCIPLES.md §13](../../GAME-DATA-PRINCIPLES.md)** for the
  full audit method and the traps (unit/representation differences, silent
  fallbacks that mask wrong values, etc.).

## Override file shape

```ts
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  // Top-level fields replace.
  available: 9,
  name: 'Evolving Armor',

  // Nested object fields (effects, stats) deep-merge:
  // override augments base instead of replacing it.
  effects: {
    maxStacks: 3,
    stacksLinear: ['absorb', 'debuffResistance'],
  },
};
```

`withOverrides()` does a shallow top-level merge plus a single level of
deep merge for `effects` and `stats` (the only nested object fields the
planner reads). Arrays are not deep-merged — supply them in full from
the override side when you need to change one.

## Composed file shape

Always three imports + one `withOverrides()` call:

```ts
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { Foo as base } from '@/data/datasets/<dataset>/generated/powersets/<at>/<slot>/<set>/<power>';
import { overrides } from '@/data/datasets/<dataset>/overrides/powersets/<at>/<slot>/<set>/<power>';

export const Foo: Power = withOverrides(base, overrides);
```

Export name on the composed file matches the export name from the generated
file (the convert script picks the export name from the power's display
name, kebabified — e.g. `Psychokinetic Barrier` → `PsychokineticBarrier`).

## Empty overrides

For powers that don't need any deltas, the override file is still present
to keep imports stable:

```ts
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
```

## When to add an override

- The convert script gets a field wrong (display name, level, set categories)
- A planner-only field needs to be added (`maxStacks`, `stacksLinear`,
  `perTarget` flags, custom display strings)
- A specific AT or archetype needs different values than the raw data has
- A bug in the convert script is being worked around — leave a comment
  pointing to the relevant issue/PR so the override can be removed once
  the converter is fixed

## Converter behavior

`node scripts/convert-powerset.cjs <category> <powerset>` always writes
the fresh extraction into `src/data/datasets/<server>/generated/powersets/<at>/<slot>/<set>/`
and writes the composed powerset under `src/data/datasets/<server>/powersets/<at>/<slot>/<set>/`.

For each individual power, the converter scaffolds the composed + override
files ONLY WHEN NEITHER EXISTS — this avoids dropping a dangling override
file next to a pre-layering single-file composed that would never import
it. The two layers are scaffolded atomically or not at all.

Consequence: for powersets that still hold the pre-layering single-file
shape, the converter regenerates their `generated/` file but does not
touch their composed file. Planner behavior is unchanged until the
composed file is explicitly migrated.

## Migrating an existing single-file power to the layered shape

1. **Diff the existing composed file vs what convert just wrote to
   `generated/`.** Any difference is either a fix the converter caught or
   a manual tweak that needs to survive as an override.
2. **Write the deltas to `src/data/overrides/powersets/<…>/<power>.ts`**
   (create it if it doesn't exist; shape is `export const overrides:
   Partial<Power> = { … };`).
3. **Replace the composed file** with the 3-import + `withOverrides()`
   shape (see any recently-migrated composed file for the template).
4. **Run `npx tsc --noEmit`** to confirm nothing broke.

Three prototype migrations to copy from:
- `brute/primary/stone-melee/fault.ts` — empty overrides (auto-gen is
  exactly what we want)
- `brute/secondary/psionic-armor/fortify-mind.ts` — overrides add
  `maxStacks` + `stacksLinear` for the planner's stacking slider
- `tanker/primary/psionic-armor/fortify-mind.ts` — same pattern as Brute
