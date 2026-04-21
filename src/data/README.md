# `src/data/` — power data layering

Power data lives in three sibling trees under this directory:

```
src/data/
├── generated/powersets/<at>/<slot>/<set>/<power>.ts
│       Auto-extracted from CoD2 raw data. NEVER hand-edit.
│       Regenerated freely by `scripts/convert-powerset.cjs`.
│
├── overrides/powersets/<at>/<slot>/<set>/<power>.ts
│       Hand-written deltas. Survives regeneration.
│       Empty `{}` for most powers; populated only when the generated
│       output needs correction or planner-only fields added.
│
└── powersets/<at>/<slot>/<set>/<power>.ts
        Composed export — imports both layers and merges via
        `withOverrides()`. This is what the planner code imports.
        Index files (`index.ts`) likewise import from here.
```

## Why three files

The convert script regenerates from raw CoD2 data. Hand-edits to those
files (display-name corrections, AT-specific level adjustments, planner-
only stacking metadata, etc.) used to be silently overwritten by the
next regeneration. Splitting into generated + overrides + composed lets
each layer evolve independently:

- Re-run `convert-powerset.cjs` whenever raw data changes — overrides
  survive untouched.
- Hand-edit overrides whenever the generated extraction is wrong or
  missing a planner-side field — the next regen leaves them alone.
- Composed files are stable once written; they only need editing if the
  power's identifier (export name) changes.

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
import { Foo as base } from '@/data/generated/powersets/<at>/<slot>/<set>/<power>';
import { overrides } from '@/data/overrides/powersets/<at>/<slot>/<set>/<power>';

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
the fresh extraction into `src/data/generated/powersets/<at>/<slot>/<set>/`
and writes the powerset `index.ts` into `src/data/powersets/<at>/<slot>/<set>/`.

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
