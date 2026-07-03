/**
 * Reward sets (Overwhelming Force, Cupid's Crush, Winter's Gift) are attuned-only
 * in-game but their data carries a 10–50 level range instead of the usual
 * `maxLevel <= 1` attuned marker. isInherentlyAttuned must still treat them as
 * attuned so the picker doesn't offer a (non-existent) craft-level slider — while
 * NOT catching genuinely craftable sets, especially Thunderspy's Subaluwa, which
 * is a UD_ universal-damage set that IS crafted-only (verified in the in-game AH).
 */
import { describe, it, expect } from 'vitest';
import { isInherentlyAttuned } from './enhancement-registry';
import { IO_SETS_RAW as HC } from './datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as TSPY } from './datasets/thunderspy/io-sets-raw';

describe('isInherentlyAttuned — attuned-only reward sets', () => {
  it('forces attuned for the 10–50 reward sets despite maxLevel > 1', () => {
    for (const id of ['overwhelming_force', 'cupids_crush', 'winters_gift']) {
      const set = HC[id];
      expect(set, `${id} should be an HC set`).toBeDefined();
      expect(set.maxLevel, `${id} data still carries the range`).toBeGreaterThan(1);
      expect(isInherentlyAttuned(set), `${id} should be treated attuned`).toBe(true);
    }
  });

  it('keeps genuinely craftable sets craftable', () => {
    // Normal invention set with a real craft-level range.
    expect(isInherentlyAttuned(HC['kinetic_combat'])).toBe(false);
  });

  it('ATOs / most event sets stay attuned via the maxLevel<=1 path', () => {
    expect(HC['blistering_cold'].maxLevel).toBeLessThanOrEqual(1);
    expect(isInherentlyAttuned(HC['blistering_cold'])).toBe(true);
  });

  it('Thunderspy: Overwhelming Force attuned-only, Subaluwa stays craftable', () => {
    expect(isInherentlyAttuned(TSPY['overwhelming_force'])).toBe(true);
    // Subaluwa: UD_ universal-damage set, but crafted-only in-game — must NOT be
    // swept up by the reward-set rule.
    expect(TSPY['kb'].name).toBe('Subaluwa');
    expect(TSPY['kb'].maxLevel).toBeGreaterThan(1);
    expect(isInherentlyAttuned(TSPY['kb'])).toBe(false);
  });
});
