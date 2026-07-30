/**
 * Reward sets (Overwhelming Force, Cupid's Crush) are attuned-only in-game but their
 * data carries a 10–50 level range instead of the usual `maxLevel <= 1` attuned
 * marker. isInherentlyAttuned must still treat them as attuned so the picker doesn't
 * offer a (non-existent) craft-level slider — while NOT catching genuinely craftable
 * sets, especially Thunderspy's Subaluwa, which is a UD_ universal-damage set that
 * IS crafted-only (verified in the in-game AH).
 *
 * Winter's Gift was wrongly on that list until 2026-07-30 (reported: "set as
 * Attuned … despite its Winter theme, behaves as a normal IO"). It is the level
 * 10-50 `rare` / `Universal Travel` set, not a Winter *event* set; only its icon
 * art (`SEO_Winters_Gift.png`) is wintry. It is now asserted craftable below.
 */
import { describe, it, expect } from 'vitest';
import { isInherentlyAttuned } from './enhancement-registry';
import { IO_SETS_RAW as HC } from './datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as REBIRTH } from './datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TSPY } from './datasets/thunderspy/io-sets-raw';

describe('isInherentlyAttuned — attuned-only reward sets', () => {
  it('forces attuned for the 10–50 reward sets despite maxLevel > 1', () => {
    for (const id of ['overwhelming_force', 'cupids_crush']) {
      const set = HC[id];
      expect(set, `${id} should be an HC set`).toBeDefined();
      expect(set.maxLevel, `${id} data still carries the range`).toBeGreaterThan(1);
      expect(isInherentlyAttuned(set), `${id} should be treated attuned`).toBe(true);
    }
  });

  it("Winter's Gift is a craftable travel set, NOT a Winter event set", () => {
    // Its structural twin, Blessing of the Zephyr, was never on the list; the two
    // must agree, in every dataset. If Winter's Gift is ever force-attuned again,
    // the picker's level slider dies, +5 boosters are silently discarded, and
    // popmenu export emits a nonexistent `Attuned_Winters_Gift_A` UID.
    for (const [dataset, sets] of [
      ['homecoming', HC],
      ['rebirth', REBIRTH],
      ['thunderspy', TSPY],
    ] as const) {
      const wg = sets['winters_gift'];
      expect(wg, `winters_gift missing from ${dataset}`).toBeDefined();
      expect(wg.category, `${dataset} winters_gift category`).not.toBe('event');
      expect(wg.maxLevel).toBeGreaterThan(1);
      expect(
        isInherentlyAttuned(wg),
        `${dataset}: Winter's Gift must stay craftable`,
      ).toBe(false);
      expect(isInherentlyAttuned(sets['blessing_of_the_zephyr'])).toBe(false);
    }
  });

  it('genuine Winter-event sets remain attuned via maxLevel<=1', () => {
    for (const id of ['blistering_cold', 'frozen_blast', 'avalanche', 'entomb', 'winters_bite']) {
      const set = HC[id];
      expect(set, `${id} should be an HC set`).toBeDefined();
      expect(set.category, `${id} should be an event set`).toBe('event');
      expect(isInherentlyAttuned(set), `${id} should be attuned`).toBe(true);
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
