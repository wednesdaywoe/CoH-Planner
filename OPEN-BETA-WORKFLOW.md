# Refreshing a dataset from a game-install ring

Homecoming ships data through several asset rings — live, open beta, closed beta
— each a set of `.pigg` archives in its own install folder. This is how we
rebuild the `homecoming` dataset from one of them: to preview a patch while it's
in beta, or to ship it once it goes live.

## The registry is the single source of paths

Every install path lives in
[`tools/bin-crawler/bin_crawler/assets_sources.json`](tools/bin-crawler/bin_crawler/assets_sources.json)
and nowhere else. It names, per dataset, each ring's path and — critically —
which single ring is **exportable**.

Two things it protects against, both of which have nearly shipped bad data:

- **Homecoming's `closedbeta` folder is not the closed beta.** The closed beta is
  the folder named `experimental`. `closedbeta` is registered as a *rejected
  path*; exporting from it stops the run.
- **The repo keeps no `.pigg` snapshots.** A snapshot goes stale in place and
  shares its shard basename with the tree it was copied from, so it can't be told
  apart by name. Exports read the live installs directly.

Paths are workstation-specific. If an install lives somewhere else on your
machine, fix it in the registry — not in a script, not on a command line.

## One command

```bash
# 1. Sync the target ring in the game launcher first (the ONLY manual step — it
#    pulls the current .pigg files for that ring).
# 2. Then:
node scripts/refresh-from-channel.cjs              # the exportable ring (homecoming:live)
node scripts/refresh-from-channel.cjs open_beta    # read-only: export + diff, no apply
node scripts/refresh-from-channel.cjs --dataset rebirth
```

What it does, in order:

1. **Resolve** the ring against the registry. An unknown ring, or one whose path
   is missing on this machine, stops here with the valid names listed.
2. **Export** the ring's piggs → JSON scratch
   (`tools/bin-crawler/exported_powers/<dataset>-<ring>/`, gitignored) via all
   four exporters (`export_powers`, `export_classes` → `tables/`,
   `export_entities` → `entities/`, `export_salvage` → `salvage.json`). The
   scratch mirrors the committed layout.
3. **Diff** the scratch against the committed export and print a
   changed/added/removed summary — the de-risk view of what the refresh will
   change.
4. **Apply** into the committed export: each top-level entry is
   wholesale-replaced, so removed powers (e.g. a deleted Phoenix Rising) drop out
   cleanly. Datasets nested inside the root (`rebirth/`, `thunderspy/` under
   Homecoming's flat `exported_powers/`) are untouched. **`tables/` refreshes
   only the player AT class files**; NPC/critter tables (`boss_*`, `henchman_*`,
   …) ship there but nothing downstream reads them, so they stay committed rather
   than adding NPC drift to every diff.
5. **Regenerate**: `node scripts/regen-all.cjs --dataset <id>`.
6. **Typecheck** (`tsc --noEmit`) and print `git status` for the export +
   `src/data/datasets/<dataset>/`.

Options: `--dataset <id>`, `--no-apply`, `--no-regen`, `--skip-tsc`. Set
`PYTHON=…` to override the interpreter (defaults to `py -3` on Windows,
`python3` elsewhere).

## Only the exportable ring becomes committed data

Steps 4–6 run **only** for the dataset's `exportable_ring`. Ask for any other
ring and the script runs export + diff and stops — flags can't override it.

The beta rings exist to be *read*: to see what a patch is about to do. They must
never be baked into the tree users get, because users on live would then see
unreleased, still-moving numbers that don't match their own builds. The registry
declares the rule, `resolve_export_source` enforces it inside the exporters, and
the script refuses one layer up so you find out before spending an export.

To follow a patch through beta, run `open_beta` diff-only as often as you like —
each pass is cheap and surfaces data issues early. When HC promotes the patch to
live, sync the `live` ring and do a normal apply.

## De-risk discipline

Before reading a patch diff, confirm the parser is stable: re-export **current
live** and diff against the committed export — expect an empty power diff
(`refresh-from-channel.cjs live --no-apply`). A non-empty diff there is
parser/live drift, not the patch; isolate it first.

**Incidental drift.** A refresh can pull unrelated, non-player-consumed drift
into the raw JSON. NPC tables are already skipped; critter power categories like
`cabal/` aren't filtered by the script, but `convert-all-powersets` ignores them
downstream. The `src/data/datasets/<dataset>/` diff is authoritative — if a raw
export change doesn't move the dataset, it's noise; `git checkout` it before
committing.

## Beta data can diverge from its own patch notes

HC's beta builds carry real bugs, and the planner faithfully reflects whatever
the source says. Cross-check the data against the notes before committing.

The case that motivated this workflow: in the I28P3 open beta, Sentinel and
Stalker Fiery Aura Burn were left pointing at the old `Redirects.Fiery_Aura.Burn`
(0.08/tick) while Brute/Scrapper/Tanker got the new `FieryBurn` (0.14 + a
persistent 0.063 Fiery Embrace bonus) — verified in-game on Brainstorm, so a real
per-AT divergence rather than a parse artifact. It was pinned with assertions in
`src/utils/calculations/pseudopet-redirect.test.ts` that were written to fail if
HC ever repointed the two stragglers. HC did exactly that before the patch went
live, the assertions fired, and the test now pins all five Fiery Aura Burns on
the FE-active variant. That is the loop working as intended: pin the anomaly,
let the test tell you when it resolves.
