import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getEpicPoolsForArchetype } from '@/data/epic-pools';

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
