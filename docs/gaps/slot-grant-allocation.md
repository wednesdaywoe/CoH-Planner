---
project: coh-sidekick-beta
kind: gap
title: Slot grant allocation
relates:
  - ../ISSUE-REGISTER.md
---

# Slot grant allocation

Every enhancement slot a user places has to sit on a grant the game actually issued, at or above
the level its power was taken. The schedule is small and lumpy — Homecoming issues 67 grants at 28
specific levels, three at a time from 31 on, and **none at all at 38, 41, 44, 47 or 49**, which are
power-pick levels. So "this slot was added at 38" is not a borderline claim. It is a claim the
schedule refutes on sight.

That structure makes the allocation a **matching**: grants and slots pair off, each grant used
once, and a slot may only take a grant at or above its power's pick level. Beta's allocator was
written as a walk instead — down `build.slotOrder`, first come first served — and a walk cannot see
a trade that a matching finds trivially. Everything below follows from that one shape mismatch.

## SLOT-1 — a freed low grant strands, and the slot it could not serve is stamped with an ungrantable level

**Found:** 2026-08-24, from a user report: two slots vanished from low levels and reappeared on a
level-38 power claiming they had been added at level 38.

**What's wrong.** Four defects compounding, all downstream of the walk.

*The allocator could not trade.* `findNextAvailableGrantLevel` replayed `slotOrder` in array order,
let every entry carrying a stored level claim that exact grant first, then handed a new placement
the lowest grant still free at or above its pick level. Deleting a slot placed at level 21 returns
*grant 21* to the pool — worthless to a power taken at 38. If the 39-and-up band was already spoken
for by stored levels, the probe reported the build full. It routinely was: early powers get slotted
late, so the high grants sit on early powers as a matter of ordinary leveling. A valid assignment
existed the whole time — re-house one of those early-power slots onto the freed 21 and its 39 comes
free — and the walk had no way to reach it.

*The failure was papered over rather than reported.* `addSlot` wrote the entry with no `level` at
all, and `computeSlotLevelsLeveling` then fell back to `levels[slotIndex] = pickLevel`. That is the
reported "38". The pick level is the worst available fallback: on a power taken at 38 it names a
level that grants nothing, and on a power taken at 3 it is indistinguishable from a real
assignment. Respec mode carried the same fallback (`grantPool[grantIndex] ?? pickLevel`).

*The fabrication was then made permanent.* `backfillSlotOrderLevels` runs on every rehydrate and
on every import, and wrote the displayed value in as a **stored** level. A stored `38` matches no
grant, so it could never be honored again and dropped to greedy on every subsequent recompute.

*Nothing outside the app could catch it.* Both exporters looked `computeAllSlotLevels` up by
DISPLAY name where the map has always been keyed `category:internalName`. The lookup missed on
every power, and both fell back to `power.level` — so the forum post and the print sheet showed
every slot at its power's pick level regardless of the truth, which is exactly the artifact a user
would check the planner against.

**Reproduced** at build level 39, where the only grants at or above 38 are the three at 39:

```
Early (taken @1) holds all three 39s;  Late (taken @38) holds only its free base slot
removeSlot(Early, idx 4)                 frees grant 3
findNextAvailableGrantLevel(pick 38)  →  null      (39s taken; grant 3 unusable at 38)
addSlot(Late)                         →  true      budget had room; entry written with no level
Late slot levels                      →  [38, 38]  fabricated
placed budget slots 4, slots on a real grant 3     one grant stranded
after rehydrate: {"powerName":"Late","slotIndex":1,"level":38}   frozen in
```

**Blast radius.** Every build that ever removed a slot and placed it on a later power — the
ordinary respec gesture. Both entry points reached it (`addSlot` and the drag-to-another-power
`moveSlot`). Two further paths fabricated without any user gesture at all: Kheldian form
sub-powers were held out of the demand list while their slots were still billed to the budget, so
the probe and the display disagreed about how much of the pool was spent; and a partially
populated `slotOrder` (every Mids import) collapsed untouched slots to their pick level.

**Severity.** High. It silently corrupts the one thing a build plan is *for* — a level-by-level
slotting order the user follows in game. It survives save/load, and the exports could not reveal
it.

**Fixed** 2026-08-24. One solver, `assignGrants`, now serves respec mode, leveling mode, the
placement probe and the relocation check, so the probe cannot disagree with the display — it *is*
the display. Stored levels seed an initial matching (an untouched build keeps every slot exactly
where the user put it), and Kuhn's augmenting paths extend that seed to maximum cardinality,
displacing a stored level only where leaving it would cost some other slot its grant entirely.
Where the schedule genuinely cannot serve a slot — 25 slots on powers taken at 38 or later against
24 grants from 39 on is a real state — the answer is `null`, typed through `SlotLevel = number |
null` so the compiler found every consumer. `addSlot` and `canAddSlot` refuse such a placement the
way they already refuse an over-budget one; `canRelocateSlot` refuses the equivalent drag; the
badge and the info panel render a red marker; both exporters print `?`. `backfillSlotOrderLevels`
and `ensureSlotOrderPopulated` will not freeze a `null`, and a new `scrubFabricatedSlotLevels`
migration clears levels the schedule does not issue out of already-poisoned saves, on rehydrate and
on both import paths.

**Guard:** `src/utils/slot-allocation.test.ts`, 16 tests. Mutation-tested at 15 of 15 — every
guard was individually reverted and confirmed to turn the suite red, including the four that
initially did not (a build with slack must preserve its stored levels; a stale `slotOrder` entry
must not consume a grant, checked at a build level where the pool is two grants wide so the
consumption is observable; `ensureSlotOrderPopulated` must refuse a slot that has no entry *and*
no grant; the print exporter must mark `?` rather than reprint the pick level).

**What the guard cannot see.** It grades the allocator against the schedule, not against the game.
If `leveling-schedule.ts` itself is wrong for a fork, every test here stays green — the schedule is
the oracle, and the tests use Homecoming's. The Thunderspy 71-slot and Rebirth auto-granted-slot
paths are exercised only through the shared code, not with their own fixtures.

---

## SLOT-2 — the placement probe displaced an incumbent when a free grant was available, so the leveling column read newest-first

**Found:** 2026-08-26, from a user report: placing slots one at a time on the first three powers
labelled each new slot level 3 and pushed the slots already placed up to 5, 7 and beyond. The
fourth power labelled correctly.

**What's wrong.** One line of the SLOT-1 solver. `augment` scans grants lowest-first and takes the
first one it can reach, and a grant an incumbent owns is reachable whenever that incumbent can be
re-housed:

```
if (owner === -1 || augment(owner, seen)) { claim(demand, grant); return true }
```

Displacement is the point of the matching — it is how a power taken at 38 reaches a grant nothing
else can spare. But nothing made it a *last resort*. `probeGrantLevel` appends the speculative slot
as the final demand and runs the solver, so the new slot walked to grant 0, found it owned by the
slot placed a moment earlier, re-housed that one onto the next grant, and kept level 3 for itself.
The report's shape falls straight out: every power taken at level 1 or 2 makes the whole pool
legally reachable, so the reversal held for the first three picks and stopped at the power taken at
6, whose pick level put the level-3 and level-5 grants out of reach.

The stored levels went with it — `addSlot` writes the probe's answer — so a build leveled slot by
slot accumulated `slotOrder` entries all claiming level 3. On reload only as many as the schedule
issues at 3 could be honored, and the rest fell to greedy assignment, which is a second, quieter
scramble of the same history.

**Reproduced** at build level 50, five slots placed one at a time on a power taken at level 1:

```
placement 1   stored 3        displayed [1, 3]
placement 2   stored 3        displayed [1, 3, 3]
placement 3   stored 3        displayed [1, 3, 5, 3]      <- newest slot took the 3
placement 4   stored 3        displayed [1, 5, 5, 3, 3]
placement 5   stored 3        displayed [1, 5, 7, 3, 3, ...]
after fix     stored 3 3 5 5 7            [1, 3, 3, 5, 5, 7]
```

**Blast radius.** Every slot placed on a power whose pick level leaves a lower grant reachable —
which is most of a build's slots, since the early powers are the ones that get slotted heavily.
SLOT-1's own guards stayed green throughout: they grade whether an assignment exists and whether
every slot sits on a real grant, and a scrambled assignment satisfies both. Nothing in the suite
asked whether placing a slot moved a slot already placed.

**Severity.** High, and the same severity in the same place as SLOT-1: the level-by-level slotting
order is what a build plan is *for*, and this rewrote it on every placement.

**Fixed** 2026-08-26. `augment` now scans free grants before owned ones. A free grant costs nobody
anything; displacing an owner to hand its grant to a demand that had a free one available rewrites
a level the user placed by hand. Maximality is untouched — a free grant is an augmenting path of
length one, and the second pass still explores every owned grant when none is free, which is what
keeps SLOT-1's re-housing case working.

**Guard:** two tests in `src/utils/slot-allocation.test.ts` — sequential placements walk the
schedule forward (3, 3, 5, 5, 7) in both the displayed and the stored levels, and a placement on a
later-taken power leaves an earlier power's slots where they are. Both mutation-tested: disabling
the free-grant pass turns both red. The second needed tightening to get there — with the later
power taken at 6 the low grants were out of its reach anyway and the test passed against the
defect, so it now takes that power at 2.

**What the guard cannot see.** Same blind spot as SLOT-1 — the schedule is the oracle, and these
tests use Homecoming's. It also grades a placement against the assignment, not against Mids: if
both agree the third slot on a level-1 power belongs at 5, no test here would notice them agreeing
wrongly.

**Recovery.** Saves made between 2026-08-24 and this fix are not lost. `addSlot` appends, so
`slotOrder`'s array order *is* the placement order, and the fixed solver rebuilds a legal forward
assignment from it that occupies exactly the grants a clean replay of the same clicks would have
occupied. On the reported build it reproduces the clean replay slot for slot.

What it cannot rebuild in general is which power holds which grant. Unseeded demands are ordered by
pick level, not by when they were clicked, so where powers of different pick levels interleaved
chronologically the grants can land differently than they did in the session. Both assignments are
legal and consume the same grants; nothing stored survives that could tell them apart.

Display alone was not enough, though. A stored level no grant can honor is, on every recompute,
indistinguishable from an entry that never had one — so a poisoned build cascaded its peers on a
removal instead of holding their place, which is the whole reason a level is stored.
`reconcileStoredSlotLevels` writes the solved assignment back over any stored level the solver
could not honor, on rehydrate and on both import paths. A level the solver CAN honor always
survives, because honoring it is what makes stored and computed agree — so the migration only ever
touches an entry whose level was already dead. `scrubFabricatedSlotLevels` could not do this job:
these are levels the schedule genuinely issues, just more often than it issues them.

**Guard (recovery):** two more tests in the same file — a poisoned save rebuilds an assignment
consuming the same grants as a clean replay, and the repair moves no slot, is idempotent, and stops
a removal cascading onto peers. Mutation-tested: disabling the write turns the second red.

An earlier draft of this entry called the saves permanently mangled. That was written from reading
the code; the replay comparison above is what corrected it.
