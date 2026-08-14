# Handoff — TEAMBUFF-1 beta port (Grant Cover) + a stale engine it uncovered

**Branch:** `teambuff1-beta-port` · **Written:** 2026-08-12

## Read this first

Two separate things are in this branch:

1. **The Grant Cover fix.** Done, verified, mutation-tested. Ready.
2. **An engine refresh that had to ride along.** Six 1.0 commits' worth. It turns
   13 per-power projection tests red. **Not triaged. Do not deploy this branch as-is.**

The second one is the open work. Everything below explains it.

---

## 1. What the Grant Cover fix is

A player reported Shield Defense's Grant Cover giving the caster a defense bonus.
It should buff teammates only — the power's own help text says so:

> "The defense bonus from this power is only applied to nearby team mates, but not yourself."

The export said so too, on the wire, all along. Grant Cover's nine `Defense` rows carry
the RPN clause `entref target> entref source> eq !` ("target ≠ source") and are aimed at
`Target`. The applier read the scale and ignored both fields.

### Why it survived every gate

A hand-written `defenseBuffExcludesSelf: true` flag in the **overrides layer** — 4 files
on Homecoming, 3 on Rebirth, **none on Thunderspy**. A per-power hand-list is invisible
to a corpus sweep: the fork it forgets just looks like a power with nothing to say.
Seven override files against ten exported Grant Covers.

Worse in this repo specifically: the live app runs the **Rust engine via wasm**, and the
engine never implemented the skip at all. That flag only ever fed the frozen test-only
oracle. **So the live beta was wrong on all three forks, not just Thunderspy.**

### The fix

`excludesCaster` in [`src/data/core/atom-query.ts`](src/data/core/atom-query.ts) reads
**two** fields together. Both matter:

- Phalanx Fighting (same powerset) carries the **identical** clause on rows aimed at
  `Self` — it counts nearby allies to size a buff it hands to the caster.
- A filter reading only the clause deletes Phalanx's per-ally increment.
- A filter reading only the recipient keeps Grant Cover.

`defenseBuffIsTeamOnly` covers the `?? effects.defenseBuff` seam: atom-half silence is
ambiguous between "no atoms" (wants the bag) and "all team-only" (must not have it).
The bag keeps its `defenseBuff` slot on purpose — the power card still shows allies what
they receive.

**Do NOT move this filter into the shared `atomsOfType`.** A blanket skip deletes real
foe damage — Thunderspy Burn and siblings carry the same clause routing foe-ward.

### Changed here

- `src/data/core/atom-query.ts` — `requiresExcludesSelf`, `excludesCaster`,
  `defenseBuffIsTeamOnly`; filter added to `defenseBuffByType`.
- `src/utils/calculations/legacy-totals.oracle.ts` — the seam now reads the data instead
  of the flag. This file is marked *frozen*, and I changed it anyway: deleting the
  override flag would otherwise have made it newly wrong on Homecoming and Rebirth. Its
  rule moved from a hand-list to the export, which is strictly more independent.
- `src/types/power.ts`, `src/utils/calculations/character-totals.ts` — the
  `defenseBuffExcludesSelf` field is gone.
- 7 override files deleted; 7 composed files rewritten to the converter's base-only
  template (byte-identical to the same files in coh-sidekick-1.0).
- `scripts/planb-shadow-defense.cjs` — teaches the shadow that a team-only power is a
  deliberate abstention, counted separately.
- `src/data/core/caster-excluded-defense.verify.test.ts` — new gate.
- `src/data/changelog-manual.ts` — player-facing entry, id `grant-cover-team-only`.
  **Written, not published.** `npm run changelog:push` is yours to run.

### Evidence it works

- New gate: 8/8 green, and **mutation-tested both directions**:
  - drop `!excludesCaster(a)` from the filter → the 3 Grant Cover tests go red, Phalanx stays green
  - drop the `toWho` half of `excludesCaster` → Phalanx alone goes red
  - The Phalanx assertion is pinned to **both** numbers (`scale 0.5`, `perTarget 0.3`),
    not to "returns something" — the weaker form passed the clause-only mutant, because
    the clause rides only on the 0.3 per-ally increment.
- `node scripts/planb-shadow-defense.cjs` → **0 divergences**, 90 team-only abstentions
  (10 Grant Covers × 9 types — matches the census exactly).
- `npm run lint` (tsc --noEmit) → clean.
- `src/engine/serverParity.test.ts` → green. Dashboard totals agree engine↔oracle.

The mirror of this fix in coh-sidekick-1.0 is commit `de9e15268a`, with its own Rust gate
at `crates/coh_math/tests/caster_excluded_defense.rs`. Register entry: TEAMBUFF-1 in
`docs/DATA-GAP-REGISTER.md` there.

---

## 2. The open problem — the engine refresh

The live number comes from the wasm, so fixing it live required `npm run build:engine`.
That builds from coh-sidekick-1.0 **HEAD**, and this repo's engine turned out to be
**six commits stale** — its wasm predated `415a75a2ef`, `a37477fe9c` (BONUS-REQ-1),
`b1778bfcb5` (BOOST-2), `a9199863d3` (SETCAT-1), `065f07cd22` (beta port) and
`de9e15268a` (Grant Cover).

You cannot ship Grant Cover without shipping those five others.

### The damage

`src/engine/powerProjectionParity.test.ts` → **13 tests red** (homecoming 3, rebirth 1,
thunderspy 8). Plus `src/data/set-bonus-groups.test.ts` → 1 red (see §3).

**This is proven NOT to come from the Grant Cover port.** I stashed the entire port,
rebuilt the identical engine on a clean tree, and got the **same 13 failures**. None of
the divergences involve defense.

### Triage so far — two apparent classes

I had just started grouping when this was handed off. Regenerate the raw list with:

```
npx vitest run --testTimeout=120000 --hookTimeout=120000 \
  src/engine/powerProjectionParity.test.ts src/engine/serverParity.test.ts
```

**Class A — pool/epic powers look mismatched, not merely rescaled.** This is the lead I'd
chase first.

- One of the failing test names is literally *"pool and epic powers project through their
  legacy shape"*.
- `sorcery` and `experimentation`: engine reports `totalRecharge = 0` and
  `permaPercent = 0` where the beta reports real values. Zero is not a wrong number, it
  is *nothing resolved*.
- `blaster/Stun`: engine `recharge 90 / accuracy 60 / mag 2` vs beta `recharge 12 /
  accuracy 75 / mag 3`. Those are not the same power's numbers. This reads as the two
  sides projecting **different powers under one key**.
- BOOST-2 and SETCAT-1 were both pool/epic work (the 1.0 commit message mentions 432
  pool/epic files), so the contract's pool/epic partition moving is plausible.
- Prior art worth rereading: the pool/epic partition ships **pre-transform** in the
  bundle, and there is a known history of positional write-back scrambling pool
  partitions.

**Class B — heal/absorb magnitudes.** Ratios are *not* constant, so this is not one
scalar bug:

| Power | engine | beta | ratio |
|---|---|---|---|
| `Radiation_Siphon` healing | 180.71 | 60.24 | 3.00 |
| `Temporal_Healing` absorb | 18.07 | 36.14 | 0.50 |
| `Life_Support_System` healing | 1325.23 | 240.95 | 5.50 |
| `Rejuvenate` healing | 374.81 | 230.24 | 1.63 |
| `Chrono_Shift` healing | 320.41 | 131.93 | 2.43 |
| `Chrono_Shift` healing | 480.62 | 329.84 | 1.46 |
| `Unrelenting` (presence) healing | 0.62 | 0.02 | 31.0 |

Note `Temporal_Healing` is the only one where the engine is *lower*, and it is exactly
half. Several of these are Time Manipulation powers, which may or may not be a cluster.

**Which side is right is not yet established.** Remember the oracle
(`legacy-totals.oracle.ts`) is deliberately frozen and *expected* to part ways with the
engine — its own header says do not "fix" it to agree. So some of these 13 may be
legitimate partings the gate should record rather than bugs. Class A does not smell like
one of those; Class B might be.

### Cast-time oddities also present

`Penetrating_Ray` engine 4.4 vs beta 1.67, `Psionic_Lance` engine 4 vs beta 1. These are
snipes — the fast/slow snipe form split is a known area. Possibly its own class.

---

## 3. Also riding along — `repel_resistance`

1.0's MEZRES-3 work gave repel resistance its **own** `mez_resist_repel` field (the
corpus proved it diverges from knockback rather than sharing its slot; the 1.0 gate is
`repel_resistance_is_not_knockbacks_pair_and_needs_its_own_field` in
`crates/coh_math/tests/route_sweep.rs`).

The refresh regenerated `src/data/generated/set-bonus-stat-vocab.generated.ts` with
`"repel_resistance": "mezResistRepel"`. This repo has **no such stat** — not in
`GlobalBonuses`, not grouped, not labelled. So
`src/data/set-bonus-groups.test.ts > every normalized set-bonus stat has a group + label`
fails.

Fixing it means porting the beta half of MEZRES-3: add `mezResistRepel` to
`GlobalBonuses`, to `STAT_GROUPS`, and to the short-label map. Small and self-contained,
but it is a new dashboard stat, so it is a product call as much as a code one.

Do **not** "fix" it by reverting the generated vocab file — that file is single-sourced
with the engine (`coh_math` `include_str!`s the same contract JSON) precisely so the two
cannot drift.

---

## 4. Pre-existing red, ignore these

Both of these fail on a clean `main` with no changes at all:

- `src/data/bin-crawler-vendored.test.ts` — `tools/bin-crawler` in coh-sidekick-1.0 has
  moved ahead of the vendored copy here. Fix with `./scripts/sync-bin-crawler.sh` when
  you want it; unrelated to any of the above.
- 2 of the 13 projection failures (`homecoming: +Strength self-buffs reach the granted
  magnitudes`, `rebirth: the shown power drives the projection under every combat state`)
  were already failing before the refresh. The refresh appears to have *fixed* those two
  and introduced others — do not assume the 13 are all new.

---

## 5. Suggested order of work

1. Chase Class A (pool/epic). The `totalRecharge = 0` and the `blaster/Stun` mismatch are
   the two sharpest handles. If the pool/epic partition is misaligned between the
   contract bundle and this repo's TS data, it likely explains several tests at once.
2. Then Class B, one ratio at a time, against the exported data — not against either
   calculator. For each, decide *engine corrected* vs *engine regressed* and say which.
3. Then the snipe cast times.
4. Then port the `mezResistRepel` half of MEZRES-3 (§3).
5. Only then deploy, and run `npm run changelog:push` for the Grant Cover entry.

If you want Grant Cover live sooner than that triage finishes, the alternative is to
build the wasm from 1.0's pre-refresh state plus a cherry-pick of `de9e15268a`. That
isolates the fix exactly, but produces an engine matching no 1.0 commit and will make the
engine-fingerprint check read as "behind" until it is rebuilt properly. I did not do this.

---

## 6. State of both repos

- **coh-sidekick-1.0** — clean, and fully pushed. `de9e15268a` is the Grant Cover fix.
  Nothing pending there.
- **this repo** — everything above is on `teambuff1-beta-port`. `main` is untouched.
