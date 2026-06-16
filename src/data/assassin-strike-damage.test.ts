import { describe, it, expect } from 'vitest';
import { AssassinsStrike } from './datasets/homecoming/generated/powersets/stalker/primary/energy-melee/assassins-strike';
import { AssassinsBlades } from './datasets/homecoming/generated/powersets/stalker/primary/dual-blades/assassins-blades';

/**
 * Assassin's Strike delivers all its damage through a `kMeter`-gated redirect
 * (Hidden vs not), which the generic converter skips — so every Stalker AS used
 * to read 0 damage. extractAssassinStrikeDamage pulls the not-hidden Melee_Damage
 * base; the Hidden guaranteed-crit is layered on at calc time by the
 * assassination AT mechanic (and the InherentDamage entry is calc-filtered, like
 * every other Stalker/Scrapper attack). These lock the fix against a regen
 * silently reverting AS to zero damage.
 */
describe("Assassin's Strike base damage (kMeter-branched redirect)", () => {
  const melee = (p: typeof AssassinsStrike) =>
    (Array.isArray(p.damage) ? p.damage : []).filter((d) => d.table === 'Melee_Damage');

  it('Energy Melee AS captures the not-hidden Energy+Smashing base (was 0)', () => {
    const m = melee(AssassinsStrike);
    expect(m.length).toBeGreaterThan(0);
    expect(m.find((d) => d.type === 'Energy')?.scale).toBeCloseTo(1.76, 3);
    expect(m.find((d) => d.type === 'Smashing')?.scale).toBeCloseTo(1.0, 3);
  });

  it('AS damage extraction generalizes across Stalker sets', () => {
    expect(melee(AssassinsBlades).length).toBeGreaterThan(0);
  });
});
