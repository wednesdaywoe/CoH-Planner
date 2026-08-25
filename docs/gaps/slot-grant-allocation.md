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
