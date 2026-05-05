# Rebirth Arachnos Soldier — Missing Secondary Powersets

**Reported:** 2026-05-05
**App version:** 0.1.6.5-beta
**Dataset:** rebirth
**Severity:** High — Arachnos Soldier (Crab/Bane) builds cannot be created on Rebirth

## Symptom

When starting an Arachnos Soldier build on the Rebirth dataset and selecting the Crab Spider (or Bane Spider) branch:

- The Secondary powerset dropdown has no selectable options.
- The primary power list appears to populate the secondary slot (Bane/Crab primary powers show where secondary picks should be).
- No valid build can be assembled.

The reporter's hypothesis was an "off by one" pointer / typo. The real cause is a data-extraction gap with a downstream config workaround that masks the missing data.

## Root Cause

Three Arachnos Soldier secondary powersets were never extracted into the Rebirth dataset:

| Powerset ID                                  | Role                       | Exists in HC | Exists in Rebirth |
|----------------------------------------------|----------------------------|:------------:|:-----------------:|
| `arachnos-soldier/training-and-gadgets`      | Base AT secondary          | Yes          | **No**            |
| `arachnos-soldier/bane-spider-training`      | Bane Spider branch secondary | Yes        | **No**            |
| `arachnos-soldier/crab-spider-training`      | Crab Spider branch secondary | Yes        | **No**            |

Compare:

- [src/data/datasets/homecoming/powersets/arachnos-soldier/epic/](src/data/datasets/homecoming/powersets/arachnos-soldier/epic/) — six subdirectories (3 primaries + 3 secondaries)
- [src/data/datasets/rebirth/powersets/arachnos-soldier/epic/](src/data/datasets/rebirth/powersets/arachnos-soldier/epic/) — only three subdirectories (3 primaries; secondaries missing entirely)

The corresponding imports are absent from the auto-generated [src/data/datasets/rebirth/powersets/index.ts:13-17](src/data/datasets/rebirth/powersets/index.ts#L13-L17) (only 3 Arachnos Soldier entries vs. 6 in Homecoming).

## Downstream Symptom in Archetype Config

Because the secondaries weren't extracted, [src/data/datasets/rebirth/archetypes.ts:927-941](src/data/datasets/rebirth/archetypes.ts#L927-L941) was filled in with placeholder values that reuse the primary powerset ID for the secondary slot:

```ts
// Rebirth (current — broken)
primarySets: ['arachnos-soldier/arachnos-soldier'],
secondarySets: [],                                            // empty
branches: {
  'bane-spider': {
    primarySet:   'arachnos-soldier/bane-spider-soldier',
    secondarySet: 'arachnos-soldier/bane-spider-soldier',     // ← duplicates primary
  },
  'crab-spider': {
    primarySet:   'arachnos-soldier/crab-spider-soldier',
    secondarySet: 'arachnos-soldier/crab-spider-soldier',     // ← duplicates primary
  },
},
```

For reference, the correct Homecoming structure at [src/data/datasets/homecoming/archetypes.ts:1005-1020](src/data/datasets/homecoming/archetypes.ts#L1005-L1020):

```ts
// Homecoming (correct)
primarySets:   ['arachnos-soldier/arachnos-soldier'],
secondarySets: ['arachnos-soldier/training-and-gadgets'],
branches: {
  'bane-spider': {
    primarySet:   'arachnos-soldier/bane-spider-soldier',
    secondarySet: 'arachnos-soldier/bane-spider-training',
  },
  'crab-spider': {
    primarySet:   'arachnos-soldier/crab-spider-soldier',
    secondarySet: 'arachnos-soldier/crab-spider-training',
  },
},
```

When the UI selects the Crab branch, both slots resolve to `crab-spider-soldier`, which is why the primary power list appears in the secondary slot.

## Likely Pipeline Cause

Arachnos Soldier secondaries (`Training_and_Gadgets`, `Bane_Spider_Training`, `Crab_Spider_Training`) probably use Rebirth's redirect/branching mechanism — the same one that recently required `da9390309 Rebuilt HEAT archetypes for Rebirth redirect system` for Peacebringer/Warshade. The Arachnos Widow secondaries do exist on disk for Rebirth, but their data should be spot-checked — they may be Homecoming leftovers rather than truly extracted Rebirth content.

## Recommended Course of Action

Per CLAUDE.md ("Prefer fixing root problems properly over quick fixes"), do not patch around this in `archetypes.ts`. The fix should restore the missing data:

### 1. Investigate the extraction pipeline
- Run the Rebirth extraction with verbose logging on `arachnos-soldier` and confirm which powersets are emitted.
- Determine why `training-and-gadgets`, `bane-spider-training`, `crab-spider-training` are skipped while their `*-soldier` counterparts succeed.
- Likely candidates: redirect handling (similar to the recent HEAT fix), missing entries in a category allow-list, or a name-mapping table that lacks the `-training` variants.

### 2. Re-extract the missing powersets
- Generate the three missing powerset directories under [src/data/datasets/rebirth/powersets/arachnos-soldier/epic/](src/data/datasets/rebirth/powersets/arachnos-soldier/epic/).
- Each should contain the canonical powers (Wolf Spider Armor, Combat Training Defensive/Offensive, Tactical Training Maneuvers/Assault/Leadership, Mental Training, Call Reinforcements — plus branch-specific variants).
- Regenerate the powerset registry: `node scripts/generate-powerset-index.cjs`.

### 3. Correct the archetype config
- Update [src/data/datasets/rebirth/archetypes.ts:927-941](src/data/datasets/rebirth/archetypes.ts#L927-L941) to match the Homecoming structure shown above (`training-and-gadgets` for `secondarySets`, `-training` suffixes for branch `secondarySet`).

### 4. Audit related ATs
- **Arachnos Widow** secondaries on Rebirth — confirm the `widow-teamwork`, `fortunata-teamwork`, and `teamwork` files contain real Rebirth data, not Homecoming leftovers.
- **HEAT (Peacebringer/Warshade)** — already rebuilt per `da9390309`; verify it survived this audit.
- Add a sanity check (test or build-time validator) that flags any `branches[*].secondarySet` whose ID equals its `primarySet` — that pattern is always a bug and would have caught this.

### 5. Stopgap (only if a Rebirth re-extraction is days away)
- Mark Arachnos Soldier as unavailable on the Rebirth dataset in the AT picker, with a "data extraction in progress" tooltip — better than letting users build a broken character.
