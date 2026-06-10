import { describe, it, expect } from 'vitest';
import { resolveAtMechanic, atMechanicMultiplier, type AtMechanicContext } from './power-at-mechanics';

const base: AtMechanicContext = {
  archetypeId: undefined,
  containmentActive: false,
  scourgeActive: false,
  criticalHitsActive: false,
  stalkerCritActive: false,
  sentinelCritActive: false,
  effectiveHidden: false,
  stalkerTeamSize: 0,
};

describe('resolveAtMechanic', () => {
  it('applies Scrapper crit to a primary/secondary attack, not pool/epic', () => {
    const ctx = { ...base, archetypeId: 'scrapper', criticalHitsActive: true };
    const m = resolveAtMechanic('scrapper/dark-melee', ctx);
    expect(m?.kind).toBe('crit');
    expect(m!.multiplier).toBeCloseTo(1.1, 3); // +10% avg vs higher
    expect(resolveAtMechanic('pool/fighting', ctx)).toBeNull(); // pool attacks don't crit
    expect(resolveAtMechanic('epic/blaze-mastery', ctx)).toBeNull();
  });

  it('returns null when the toggle is off', () => {
    expect(resolveAtMechanic('scrapper/dark-melee', { ...base, archetypeId: 'scrapper' })).toBeNull();
  });

  it('Controller Containment doubles damage', () => {
    const m = resolveAtMechanic('controller/fire-control', { ...base, archetypeId: 'controller', containmentActive: true });
    expect(m?.kind).toBe('containment');
    expect(m!.multiplier).toBe(2.0);
  });

  it('Corruptor Scourge adds the average bonus', () => {
    const m = resolveAtMechanic('corruptor/fire-blast', { ...base, archetypeId: 'corruptor', scourgeActive: true });
    expect(m?.kind).toBe('scourge');
    expect(m!.multiplier).toBeCloseTo(1.3, 3); // +30% avg
  });

  it('does not apply another archetype’s mechanic', () => {
    expect(
      resolveAtMechanic('blaster/fire-blast', { ...base, archetypeId: 'blaster', criticalHitsActive: true }),
    ).toBeNull();
  });

  it('atMechanicMultiplier is 1.0 when nothing applies', () => {
    expect(atMechanicMultiplier('scrapper/dark-melee', base)).toBe(1);
  });
});
