// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { useBuildStore } from '@/stores/buildStore';
import { getSlotGrants } from '@/data';
import { powerKey } from '@/utils/power-key';
import { generateForumExport } from './forum-export';
import { generatePrintHTML } from './export-print';
import {
  computeAllSlotLevels,
  findNextAvailableGrantLevel,
  backfillSlotOrderLevels,
  ensureSlotOrderPopulated,
  scrubFabricatedSlotLevels,
  reconcileStoredSlotLevels,
  countPlacedBudgetSlots,
  canRelocateSlot,
} from './slot-levels';

/**
 * Slot grant allocation (SLOT-1).
 *
 * A placed slot must sit on a grant the schedule actually issues, at or above
 * its power's pick level. That makes the allocation a matching, and these tests
 * pin the two properties a walk down `slotOrder` could not give: it finds an
 * assignment whenever one exists, and where none exists it says so instead of
 * naming a level the game never grants.
 *
 * Homecoming's schedule is the fixture — it grants nothing at 38, and 38 is a
 * power-pick level, so a slot "granted at 38" is self-evidently impossible.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pow = (internalName: string, level: number, slotCount: number, maxSlots = 6): any => ({
  internalName,
  name: internalName,
  level,
  maxSlots,
  slots: Array(slotCount).fill(null),
  allowedEnhancements: ['Recharge', 'Accuracy'],
  allowedSetCategories: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const entry = (powerName: string, slotIndex: number, level?: number): any => ({
  powerName,
  slotIndex,
  category: 'primary',
  ...(level !== undefined ? { level } : {}),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function install(level: number, powers: any[], slotOrder: any[]): any {
  const b = createEmptyBuild() as any;
  b.level = level;
  b.primary.powers = powers;
  b.slotOrder = slotOrder;
  useBuildStore.setState({ build: b });
  return b;
}

const KEY = (n: string) => powerKey('primary', n);
const levelsFor = (name: string) =>
  computeAllSlotLevels(useBuildStore.getState().build).get(KEY(name))!;

/** Every level the schedule actually issues a slot at. */
const isGrantable = (level: number | null): boolean =>
  level !== null && (getSlotGrants()[level] ?? 0) > 0;

/**
 * No level is claimed by more slots than the schedule issues at it. This is the
 * invariant the whole allocation exists to hold — two slots sharing one grant
 * is the same defect as a slot on no grant at all, just harder to see.
 */
function noGrantOverclaimed(names: string[]): void {
  const used = new Map<number, number>();
  for (const name of names) {
    // Index 0 is the free base slot and draws on no grant.
    for (const level of levelsFor(name).slice(1)) {
      expect(isGrantable(level)).toBe(true);
      used.set(level!, (used.get(level!) ?? 0) + 1);
    }
  }
  for (const [level, count] of used) {
    expect(count).toBeLessThanOrEqual(getSlotGrants()[level]);
  }
}

describe('slot grant allocation — Homecoming', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  it('grants nothing at level 38 — the fixture the bug reported itself through', () => {
    expect(getSlotGrants()[38] ?? 0).toBe(0);
  });

  /**
   * The reported sequence. At level 39 the only grants at or above 38 are the
   * three at 39, and an early power holds all three. Freeing a level-3 grant
   * does not help a power taken at 38 directly — but it does free a berth for
   * one of the early power's slots, which releases a 39.
   */
  it('re-houses a stored level so a freed low grant serves a late power', () => {
    install(
      39,
      [pow('Early', 1, 5), pow('Late', 38, 1)],
      [entry('Early', 1, 39), entry('Early', 2, 39), entry('Early', 3, 39), entry('Early', 4, 3)]
    );

    expect(useBuildStore.getState().removeSlot('Early', 4, 'primary')).toBe(true);
    expect(findNextAvailableGrantLevel(useBuildStore.getState().build, 38)).toBe(39);
    expect(useBuildStore.getState().addSlot('Late', 'primary')).toBe(true);

    const late = levelsFor('Late');
    expect(late[1]).toBe(39);
    expect(isGrantable(late[1])).toBe(true);

    // The displaced Early slot took the freed low grant rather than vanishing,
    // and nothing ended up sharing a grant.
    expect(levelsFor('Early')).toContain(3);
    noGrantOverclaimed(['Early', 'Late']);
  });

  /**
   * The leveling history is the point of storing a level at all. With slack in
   * the pool the solver must leave every stored level exactly where it is —
   * lowest-feasible would drag both of these down to 3.
   */
  it('leaves stored levels alone when nothing forces a move', () => {
    install(50, [pow('Alpha', 1, 3)], [entry('Alpha', 1, 25), entry('Alpha', 2, 43)]);
    expect(levelsFor('Alpha')).toEqual([1, 25, 43]);
  });

  /**
   * Placing slots one at a time must walk the schedule FORWARD. The probe used
   * to displace an incumbent whenever an augmenting path existed, so each new
   * slot landed on the lowest grant in the build and shoved the slot already
   * there upward — the leveling column read newest-first (SLOT-2). Powers taken
   * at level 1 make the whole pool reachable, which is why the reversal showed
   * on the first three picks and stopped at a power taken later.
   */
  it('walks the schedule forward as slots are placed one at a time', () => {
    install(50, [pow('Alpha', 1, 1)], []);

    const placed: (number | null)[] = [];
    for (let i = 0; i < 5; i++) {
      expect(useBuildStore.getState().addSlot('Alpha', 'primary')).toBe(true);
      placed.push(levelsFor('Alpha')[i + 1]);
    }

    // Homecoming grants two slots each at 3, 5 and 7.
    expect(placed).toEqual([3, 3, 5, 5, 7]);
    // The stored levels are what the next session reloads; they must agree.
    expect(
      useBuildStore.getState().build.slotOrder.map((e) => e.level)
    ).toEqual([3, 3, 5, 5, 7]);
    noGrantOverclaimed(['Alpha']);
  });

  /**
   * The same reversal across powers. Beta is taken at 2, so both level-3 grants
   * are legally within its reach — which is exactly when the displacing probe
   * took one and pushed an Alpha slot up to 5. A slot already placed is not a
   * grant a later placement may draw on.
   */
  it('does not move a placed slot when a later power takes one', () => {
    install(50, [pow('Alpha', 1, 3), pow('Beta', 2, 1)], [entry('Alpha', 1, 3), entry('Alpha', 2, 3)]);

    expect(levelsFor('Alpha')).toEqual([1, 3, 3]);
    expect(useBuildStore.getState().addSlot('Beta', 'primary')).toBe(true);

    expect(levelsFor('Alpha')).toEqual([1, 3, 3]);
    expect(levelsFor('Beta')[1]).toBe(5);
    noGrantOverclaimed(['Alpha', 'Beta']);
  });

  /**
   * A build leveled through SLOT-2 saved a run of entries all claiming the
   * lowest grant. It is not garbage: the placement ORDER survives (`addSlot`
   * appends), so the solver rebuilds a legal forward assignment from it, and the
   * build occupies exactly the grants a clean replay of the same clicks would
   * have occupied.
   *
   * What it does NOT rebuild is which power holds which grant. Unseeded demands
   * are ordered by pick level, not by when they were clicked, so where powers of
   * different pick levels interleaved chronologically the grants can land on
   * different powers than they did in the session. Both assignments are legal
   * and consume the same grants; only the attribution differs, and no stored
   * data survives that could tell them apart.
   */
  it('rebuilds a legal assignment from a build poisoned by SLOT-2', () => {
    const order = ['Alpha', 'Alpha', 'Alpha', 'Beta', 'Beta', 'Alpha'];
    install(50, [pow('Alpha', 1, 1), pow('Beta', 2, 1)], []);
    for (const name of order) {
      expect(useBuildStore.getState().addSlot(name, 'primary')).toBe(true);
    }
    const replayed = [...levelsFor('Alpha').slice(1), ...levelsFor('Beta').slice(1)].sort();

    // The same build as SLOT-2 would have saved it: every entry stamped 3.
    install(
      50,
      [pow('Alpha', 1, 5), pow('Beta', 2, 3)],
      [
        entry('Alpha', 1, 3), entry('Alpha', 2, 3), entry('Alpha', 3, 3),
        entry('Beta', 1, 3), entry('Beta', 2, 3), entry('Alpha', 4, 3),
      ]
    );
    const recovered = [...levelsFor('Alpha').slice(1), ...levelsFor('Beta').slice(1)].sort();

    expect(recovered).toEqual(replayed);
    noGrantOverclaimed(['Alpha', 'Beta']);
  });

  it('repairs the poisoned save without moving anything, so removals stop cascading', () => {
    const poisoned = () =>
      install(
        50,
        [pow('Alpha', 1, 5), pow('Beta', 2, 3)],
        [
          entry('Alpha', 1, 3), entry('Alpha', 2, 3), entry('Alpha', 3, 3),
          entry('Beta', 1, 3), entry('Beta', 2, 3), entry('Alpha', 4, 3),
        ]
      );

    poisoned();
    const before = [levelsFor('Alpha'), levelsFor('Beta')];

    const build = poisoned();
    expect(reconcileStoredSlotLevels(build)).toBe(true);
    useBuildStore.setState({ build });
    // The repair writes down what was already on screen — it must not move a slot.
    expect([levelsFor('Alpha'), levelsFor('Beta')]).toEqual(before);
    // And every stored level is now one the solver honors.
    expect(reconcileStoredSlotLevels(build)).toBe(false);

    const betaBefore = levelsFor('Beta');
    expect(useBuildStore.getState().removeSlot('Alpha', 1, 'primary')).toBe(true);
    expect(levelsFor('Beta')).toEqual(betaBefore);
    noGrantOverclaimed(['Alpha', 'Beta']);
  });

  it('never places two slots on one grant', () => {
    install(
      39,
      [pow('Early', 1, 5), pow('Late', 38, 2)],
      [entry('Early', 1, 39), entry('Early', 2, 39), entry('Early', 3, 39), entry('Late', 1, 39)]
    );
    // Four demands against three level-39 grants: one of Early's must have moved
    // down to a lower grant rather than doubling up on a 39.
    noGrantOverclaimed(['Early', 'Late']);
    const all = [...levelsFor('Early').slice(1), ...levelsFor('Late').slice(1)];
    expect(all.filter((l) => l === 39)).toHaveLength(3);
  });

  /**
   * Over-subscription is a real state: more slots want a grant at or above some
   * level than the schedule issues from that level on. It must be reportable,
   * and it must not be papered over with the pick level.
   */
  it('reports an unservable placement instead of naming an ungrantable level', () => {
    install(
      39,
      [pow('Late', 38, 1), pow('Later', 38, 1)],
      // Both 39-grants... there are three, so fill them from powers taken at 38.
      []
    );
    // Consume all three level-39 grants on powers taken at 38.
    const b = useBuildStore.getState().build as any;
    b.primary.powers = [pow('A', 38, 4), pow('B', 38, 1)];
    b.slotOrder = [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39)];
    useBuildStore.setState({ build: b });

    expect(findNextAvailableGrantLevel(useBuildStore.getState().build, 38)).toBeNull();
    expect(useBuildStore.getState().canAddSlot('B', 'primary')).toBe(false);
    expect(useBuildStore.getState().addSlot('B', 'primary')).toBe(false);
    // Refused, so nothing was written — no level-38 entry, no orphan slot.
    expect(useBuildStore.getState().build.primary.powers[1].slots.length).toBe(1);
    expect(useBuildStore.getState().build.slotOrder).toHaveLength(3);
  });

  it('surfaces an unservable slot as null, never as the pick level', () => {
    // Hand-built over-subscription: four slots on powers taken at 38, three grants.
    install(
      39,
      [pow('A', 38, 5)],
      [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39), entry('A', 4)]
    );
    const levels = levelsFor('A');
    expect(levels.filter((l) => l === 39)).toHaveLength(3);
    expect(levels[4]).toBeNull();
    // Index 0 is the free base slot and legitimately reads as the pick level.
    // No LATER slot may: 38 grants nothing, so it would be pure fabrication.
    expect(levels.slice(1)).not.toContain(38);
  });

  it('refuses a relocation the schedule cannot serve, and allows one it can', () => {
    install(
      39,
      [pow('Early', 1, 5), pow('Late', 38, 1)],
      [entry('Early', 1, 39), entry('Early', 2, 39), entry('Early', 3, 39), entry('Early', 4, 3)]
    );
    // Early's low slot can move to Late: re-housing frees a 39.
    expect(
      canRelocateSlot(
        useBuildStore.getState().build,
        { powerName: 'Early', slotIndex: 4, category: 'primary' },
        { powerName: 'Late', category: 'primary' }
      )
    ).toBe(true);
    const moved = useBuildStore.getState().moveSlot(
      { powerName: 'Early', slotIndex: 4, category: 'primary' },
      { powerName: 'Late', category: 'primary' }
    );
    expect(moved.ok).toBe(true);
    expect(levelsFor('Late')[1]).toBe(39);
    expect(isGrantable(levelsFor('Late')[1])).toBe(true);
  });

  it('refuses a relocation onto a power no grant can reach', () => {
    // Every 39-grant is held by a power taken at 38; a slot freed at level 3
    // buys nothing, because nothing can be re-housed onto it.
    install(
      39,
      [pow('A', 38, 4), pow('Early', 1, 2), pow('B', 38, 1)],
      [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39), entry('Early', 1, 3)]
    );
    expect(
      canRelocateSlot(
        useBuildStore.getState().build,
        { powerName: 'Early', slotIndex: 1, category: 'primary' },
        { powerName: 'B', category: 'primary' }
      )
    ).toBe(false);
  });
});

describe('stored levels are never fabricated', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  it('populate refuses to invent an entry for an unservable slot', () => {
    // Index 4 has no entry at all, so `ensureSlotOrderPopulated` is the only
    // thing that could write one — and the schedule cannot place it.
    const b = install(
      39,
      [pow('A', 38, 5)],
      [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39)]
    );
    ensureSlotOrderPopulated(b);
    expect(b.slotOrder.find((e: any) => e.slotIndex === 4)).toBeUndefined();
    expect(b.slotOrder.every((e: any) => isGrantable(e.level))).toBe(true);
  });

  it('backfill and populate both refuse to freeze an unservable slot', () => {
    const b = install(
      39,
      [pow('A', 38, 5)],
      [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39), entry('A', 4)]
    );
    backfillSlotOrderLevels(b);
    ensureSlotOrderPopulated(b);
    const orphan = b.slotOrder.find((e: any) => e.slotIndex === 4);
    expect(orphan.level).toBeUndefined();
    expect(b.slotOrder.every((e: any) => e.level === undefined || isGrantable(e.level))).toBe(true);
  });

  it('scrubs a level frozen in by the old pick-level fallback', () => {
    const b = install(50, [pow('A', 38, 3)], [entry('A', 1, 38), entry('A', 2, 39)]);
    expect(scrubFabricatedSlotLevels(b)).toBe(true);
    expect(b.slotOrder[0].level).toBeUndefined(); // 38 grants nothing
    expect(b.slotOrder[1].level).toBe(39); // a real grant is left alone
    // And the scrubbed slot now resolves to a grant the schedule issues.
    expect(isGrantable(levelsFor('A')[1])).toBe(true);
  });
});

describe('the placement probe and the display agree', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  /**
   * The probe used to walk `slotOrder` on its own terms — counting entries the
   * display skipped (stale indices, auto-granted sub-powers) — so it reported
   * the pool as fuller than the display believed it was.
   */
  it('ignores slotOrder entries that address no live slot', () => {
    // At level 3 the whole pool is the two grants at level 3, so an entry that
    // wrongly consumes one is the difference between "3" and "nothing left".
    const withStale = install(
      3,
      [pow('A', 1, 2)],
      [entry('A', 1, 3), entry('A', 7, 3), entry('Ghost', 1, 3)]
    );
    expect(findNextAvailableGrantLevel(withStale, 1)).toBe(3);

    const clean = install(3, [pow('A', 1, 2)], [entry('A', 1, 3)]);
    expect(findNextAvailableGrantLevel(clean, 1)).toBe(3);

    // And one more placement genuinely does exhaust it, either way.
    const full = install(3, [pow('A', 1, 3)], [entry('A', 1, 3), entry('A', 2, 3)]);
    expect(findNextAvailableGrantLevel(full, 1)).toBeNull();
  });

  it('counts an auto-granted sub-power’s slots in both', () => {
    const b = createEmptyBuild() as any;
    b.level = 50;
    b.primary.powers = [
      pow('Form', 20, 1),
      { ...pow('Form_Blast', 20, 3), isAutoGranted: true, grantedByPower: 'Form' },
    ];
    b.slotOrder = [];
    useBuildStore.setState({ build: b });

    // The sub-power's two extra slots are billed to the budget…
    expect(countPlacedBudgetSlots(b)).toBe(2);
    // …so they must hold real grants, not their parent's pick level.
    const levels = computeAllSlotLevels(b).get(KEY('Form_Blast'))!;
    expect(levels[0]).toBe(20);
    expect(levels.slice(1).every(isGrantable)).toBe(true);
    expect(levels.slice(1)).not.toContain(20);
  });
});

describe('exports print the assigned level, not the pick level', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  }, 120000);

  /**
   * `computeAllSlotLevels` keys on `category:internalName`. Both exporters used
   * to look the map up by DISPLAY name, which missed on every power, so every
   * printed slot silently fell back to its power's pick level — the corruption
   * this bug produced was invisible in the one place a user could have compared
   * it against the game (SLOT-1).
   */
  it('forum export names the grant level a slot sits at', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enh: any = { type: 'io-generic', id: 'io-rech', name: 'Recharge IO', icon: '', stat: 'Recharge', value: 0 };
    const power = pow('Alpha', 1, 2);
    power.name = 'Alpha Strike'; // display name differs from internalName
    power.slots = [enh, enh];
    const b = install(50, [power], [entry('Alpha', 1, 25)]);
    b.archetype = { name: 'Blaster' };
    b.primary.name = 'Fire Blast';

    const post = generateForumExport(b, 'plain');
    expect(post).toContain('A: Recharge IO');
    expect(post).toContain('25: Recharge IO');
    expect(post).not.toContain('1: Recharge IO'); // the pick-level fallback
  });

  it('print export names the grant level a slot sits at', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enh: any = { type: 'io-generic', id: 'io-rech', name: 'Recharge IO', icon: '', stat: 'Recharge', value: 0 };
    const power = pow('Alpha', 1, 2);
    power.name = 'Alpha Strike';
    power.powerType = 'Click';
    power.slots = [enh, enh];
    const b = install(50, [power], [entry('Alpha', 1, 25)]);
    b.archetype = { name: 'Blaster' };

    const html = generatePrintHTML(b);
    expect(html).toContain('(25)');
  });

  it('print export marks an unservable slot rather than naming a level', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enh: any = { type: 'io-generic', id: 'io-rech', name: 'Recharge IO', icon: '', stat: 'Recharge', value: 0 };
    // Four slots on a power taken at 38, against the three grants at 39.
    const power = pow('A', 38, 5);
    power.powerType = 'Click';
    power.slots = [enh, enh, enh, enh, enh];
    const b = install(39, [power], [entry('A', 1, 39), entry('A', 2, 39), entry('A', 3, 39)]);
    b.archetype = { name: 'Blaster' };

    const html = generatePrintHTML(b);
    expect(html).toContain('(?)');
    // Exactly one (38): the free base slot, which IS granted with the pick. A
    // second one would be the unservable slot borrowing the pick level again.
    expect(html.match(/\(38\)/g)).toHaveLength(1);
    expect(html.match(/\(39\)/g)).toHaveLength(3);
  });
});
