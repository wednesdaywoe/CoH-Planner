import { describe, it, expect } from 'vitest';
import { normalizeStatName } from './set-bonuses';
import { convertGlobalBonusesToAspects } from '@/components/info/powerDisplayUtils';
import type { GlobalBonuses } from './character-totals';

/**
 * IO set "+X% <Mez> Duration" bonuses (e.g. the two Controller ATOs each add
 * +8% Immobilize Duration) were silently dropped: the *_duration stats weren't
 * in STAT_NAME_MAP, so `normalizeStatName` returned undefined and
 * `collectAllSetBonuses` skipped them. They now normalize, flow into
 * GlobalBonuses, and map onto the matching power effect key so the mez-duration
 * rows in Power Info pick them up. (Entangling Arrow's immobilize effect is
 * keyed "immobilize"; the terror_duration bonus maps to the "fear" key.)
 */
describe('Mez/control duration set bonuses', () => {
  it('normalizes the six control-duration set-bonus stats', () => {
    expect(normalizeStatName('immobilize_duration')).toBe('immobilizeDuration');
    expect(normalizeStatName('hold_duration')).toBe('holdDuration');
    expect(normalizeStatName('stun_duration')).toBe('stunDuration');
    expect(normalizeStatName('sleep_duration')).toBe('sleepDuration');
    expect(normalizeStatName('confuse_duration')).toBe('confuseDuration');
    expect(normalizeStatName('terror_duration')).toBe('terrorDuration');
  });

  it('maps duration globals onto power effect keys as fractions (terror → fear)', () => {
    const aspects = convertGlobalBonusesToAspects({
      immobilizeDuration: 16, // two ATOs at +8%
      holdDuration: 8,
      terrorDuration: 4,
    } as Partial<GlobalBonuses> as GlobalBonuses);

    expect(aspects.immobilize).toBeCloseTo(0.16, 6);
    expect(aspects.hold).toBeCloseTo(0.08, 6);
    expect(aspects.fear).toBeCloseTo(0.04, 6);
  });
});
