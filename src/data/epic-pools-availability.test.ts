import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getEpicPoolsForArchetype, isEpicPowerAvailable } from '@/data/epic-pools';

/**
 * Which Ancillary/Patron pools an archetype may take.
 *
 * `getEpicPoolsForArchetype` selects pools tagged with the AT, then fills gaps
 * from a hero/villain counterpart (Masterminds borrow Defender ancillaries,
 * Blasters borrow Mastermind patrons, etc.). The fill used pool-name dedup
 * only, which leaked every non-colliding counterpart pool onto the borrower —
 * e.g. a Rebirth Mastermind was offered all six Defender masteries (Dark,
 * Electricity, Frost, Inferno, Power, Psychic Mastery), none of which a
 * Mastermind can take in-game.
 *
 * The fix consults the pool's authoritative `@Class` gate (baked into each
 * power's `requires`). Defender's shared copies gate
 * `@Class_Defender == @Class_Corruptor ==` — so a Corruptor still inherits
 * them, but a Mastermind (not in the gate) does not. Patron borrowing is
 * intentionally name-only and unaffected.
 */
function poolNames(archetype: string): Set<string> {
  return new Set(getEpicPoolsForArchetype(archetype).map((p) => p.displayName || p.name));
}

describe('Mastermind ancillary/patron availability (rebirth)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  // Source of truth: the Rebirth Mastermind archetype offers exactly these
  // eight — four native ancillaries plus four patron pools.
  it('offers exactly the eight Mastermind masteries', () => {
    const names = poolNames('mastermind');
    expect([...names].sort()).toEqual([
      'Charge Mastery',
      'Chill Mastery',
      'Field Mastery',
      'Heat Mastery',
      'Leviathan Mastery',
      'Mace Mastery',
      'Mu Mastery',
      'Soul Mastery',
    ]);
  });

  it('does NOT leak Defender-gated masteries onto Mastermind', () => {
    const names = poolNames('mastermind');
    for (const forbidden of [
      'Dark Mastery', 'Electricity Mastery', 'Frost Mastery',
      'Inferno Mastery', 'Power Mastery', 'Psychic Mastery',
    ]) {
      expect(names.has(forbidden)).toBe(false);
    }
  });

  it('still inherits the shared Defender/Corruptor masteries for Corruptor', () => {
    // The same pools blocked for Mastermind ARE admitted for Corruptor, whose
    // class is named in the gate — so the fix is a gate filter, not a blanket
    // "no fallback for villains" rule.
    const names = poolNames('corruptor');
    for (const expected of ['Dark Mastery', 'Electricity Mastery', 'Power Mastery', 'Psychic Mastery']) {
      expect(names.has(expected)).toBe(true);
    }
  });
});

/**
 * @Quazzar Rebirth Tanker report: the Martial Prowess (Martial_Mastery_Tanker)
 * pool listed "Art of War" as the first pick instead of Throwing Dagger /
 * Battle Hardened. Rebirth leaves `available_level = 0` on Art of War and gates
 * it purely via its `requires` clause ("own Throwing Dagger or Battle Hardened")
 * + description ("You must be level 41 ..."). A raw 0 made the converter's
 * level-sort float it to the front as the level-35 tier-1 pick. The converter
 * now treats the 0 sentinel (with a requires clause naming sibling pool powers)
 * as the prerequisite tier, mirroring the Brute pool's layout exactly.
 */
describe('Rebirth Tanker Martial Prowess prerequisite ordering', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  const pool = () =>
    getEpicPoolsForArchetype('tanker').find((p) => p.id === 'martial_mastery_tanker')!;

  it('lists Throwing Dagger and Battle Hardened as the first two picks, not Art of War', () => {
    const names = pool().powers.map((p) => p.name);
    expect(names.slice(0, 2)).toEqual(['Throwing Dagger', 'Battle Hardened']);
    expect(names[0]).not.toBe('Art of War');
    // Art of War is the level-41 self-buff tier, sitting where the Brute pool
    // puts Reckless Abandon (rank 4, ahead of the rank-5 capstone Valiance).
    const aow = pool().powers.find((p) => p.name === 'Art of War')!;
    expect(aow.rank).toBe(4);
    expect(aow.available).toBe(40);
  });

  it('gates Art of War at level 41 with one prior pool pick, not level 35 with none', () => {
    const aow = pool().powers.find((p) => p.name === 'Art of War')!;
    expect(isEpicPowerAvailable(aow, 35, [])).toBe(false);
    expect(isEpicPowerAvailable(aow, 41, [])).toBe(false);
    expect(isEpicPowerAvailable(aow, 41, ['Throwing Dagger'])).toBe(true);
  });
});

describe('Mastermind ancillary availability (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('does not leak the Defender-only Psionic Mastery onto Mastermind', () => {
    // HC masks most of the leak via name dedup (MM has same-named natives), but
    // Psionic Mastery had no MM-native collision and slipped through.
    const names = poolNames('mastermind');
    expect(names.has('Psionic Mastery')).toBe(false);
  });
});
