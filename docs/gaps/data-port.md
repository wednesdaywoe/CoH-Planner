---
project: coh-sidekick-beta
kind: gap
title: Data ported from canonical
relates:
  - ../ISSUE-REGISTER.md
---

# Data ported from canonical

Beta and canonical each vendor the three `src/data/datasets/<fork>/io-sets-raw.ts` registries,
and the two trees drifted wholesale — canonical's BOOST-5. The census there adjudicated the drift
cluster by cluster and the port landed here on 2026-08-20; the two entries below are what the
port changed on beta's side and what it left behind.

## PORT-1 — the 6th-piece globals shipped as pseudo bonus tiers

**Found:** 2026-08-20, censusing beta's `bonuses[]` rows against canonical's regenerated
registries before the port deleted them.

**What was wrong.** Twelve rows per fork on Rebirth and Thunderspy, fourteen on Homecoming,
encoded a set's unique/global piece as an extra bonus tier — Karma's knockback protection as a
3-piece bonus, Steadfast Protection's +Def(All) as a 2-piece one, Gladiator's Armor's and Shield
Wall's as 6-piece ones, and so on. They sat alongside the real tiers, sharing a `pieces` index
with them.

The game grants none of these by piece count. Each is a `min_boosts: 1` bonus whose `requires`
clause names one specific piece — `Crafted_Karma_C PowerBoostsSlotted> 1 >= …` — so the global is
live the moment that piece is slotted and never otherwise. Encoding it as a tier is wrong in both
directions: a build with the Karma unique alone was denied a protection the game grants, and a
build with the full set was credited it twice, once from the pseudo-row and once from the proc
pass that also models it.

**What the port did.** Deleted them, by regenerating the registries from canonical's extractor,
which reads the export and skips `requires`-gated tiers. Coverage was censused first: every
affected set has a `PROC_DATABASE` entry carrying the global with the right magnitude, including
the two that looked thin — Impervious Skin's mez-resistance half and Rectified Reticle's
perception both live in `proc-globals.generated.ts` alongside their timed halves. The only row
with no proc entry behind it is Homecoming's Experienced Marksman 6-piece, which carried no
effects at all.

## PORT-2 — `proc-globals.generated.ts` lagged canonical on the Perception category

**Found:** 2026-08-20, during the PORT-1 coverage census. **Closed:** 2026-08-20.

**What was wrong.** Beta's copy of the generated global-effects table categorised two perception
globals as `Special` where canonical categorises them as `Perception`:

```
"Rectified Reticle: +Perception": [{ category: "Special", value: 20.0 }],
"Warp: Range/+Perception":       [{ category: "Special", value: 20.0 }],
```

**Blast radius was display-only.** Beta's totals come from the vendored engine, which reads the
contract bundle canonical builds, so the perception globals did reach the numbers. What saw the
stale category was the JS layer that merges `PROC_GLOBAL_EFFECTS` into `PROC_DATABASE`, meaning
the proc labels and the legacy totals oracle.

**The stated blocker wasn't real.** This entry parked the fix on a full port of
`scripts/extract-proc-data.py`, on the grounds that beta's copy carried `parse_hand_ppm` and
`parse_hand_globals` helpers canonical's did not. Both copies have both helpers. They sit at
different offsets in the file, so the diff rendered the move as a delete and an add, and the entry
read that as divergence. Diffing function inventories rather than reading the hunks would have
caught it.

The two scripts differed in four places, all of them canonical being ahead: the `Perception` arm
in three spots, `HC_ASSETS` defaulting through `assets_sources` instead of a dead absolute path,
the `superiorhaunting` set alias, and the activate-period emitter PPM-1 added. `bin_crawler` is
byte-identical between the trees and beta already had `assets_sources.canonical_path` and
`activate_period` on `PowerRecord`, so canonical's copy dropped in whole.

**What the port did.** Copied the script verbatim, added `Perception` to beta's `ProcCategory`
union and to the label and colour switches in `proc-data.ts` (both are exhaustive with no default
arm, so the union addition wouldn't compile without them), and regenerated. All six generated
`proc-*` files are now byte-identical to canonical's, as is the script.

**Regenerating exposed a live defect first.** Beta's first regen came back with two rows nobody
predicted, and running the same script in canonical reproduced both exactly, so they were the
script's current behaviour rather than anything about beta.

One was staleness. `proc-activate-period.generated.ts` was missing Synapse's Agility's endurance
drain resistance entry, because BOOST-4 added that row to `proc-data.ts` after the last regen and
canonical never re-ran the extractor.

The other was a regression. Soulbound Allegiance's Chance for Build Up lost its `target: "pets"`
stamp, which is what keeps a pet-carried proc out of the player's dashboard totals. The stamp is
gated on `PET_CARRIED_CATEGORIES`, a set of `Category` values, and Soulbound Allegiance is a purple
set, so its `Category` is blank. That's BOOST-3's finding exactly, on a site BOOST-3 named and
didn't move. Fixed the way BOOST-3 fixed its own: key on `GroupName`, resolved through the message
store, which every record states. The three resolved headings cover all twelve sets the old
`Category` set matched plus Soulbound, so it's a strict superset and the regen went clean. Filed as
PROCPET-1 in canonical.

**Verified.** Beta's regen now moves exactly the two Perception rows and adds the activate-period
file. `tsc` reports nothing proc-related, and the proc test files pass. Canonical's own tree carries
the `GroupName` fix and the one-line activate-period refresh.
