import { describe, it, expect, beforeAll } from 'vitest';
import { createArchetypeInherentPower } from '@/data';
import { loadDataset } from '@/data/dataset';
import { isPermaEligible } from '@/utils/calculations/perma';
import { getDominationInfo } from '@/utils/calculations/inherents';
import { ARCHETYPES as HC_ARCHETYPES } from './datasets/homecoming/archetypes';
import { ARCHETYPES as REBIRTH_ARCHETYPES } from './datasets/rebirth/archetypes';
import { ARCHETYPES as TSPY_ARCHETYPES } from './datasets/thunderspy/archetypes';

/**
 * Regression: the Dominator inherent "Domination" is a CLICK power with a
 * recharge/duration cycle (subject to global recharge), NOT an auto power.
 *
 * The bug: createArchetypeInherentPower() hard-coded powerType:'Auto' for every
 * archetype inherent, so Domination was flattened to Auto and isPermaEligible()
 * short-circuited to false — the perma-tracker never rendered. Fixed by adding
 * an optional `powerType` to InherentPower, defaulting to 'Auto' but set to
 * 'Click' on Domination, plus an enduranceGain self-state so hasSelfStateToKeepUp
 * recognises it as a self-buff worth tracking.
 */
describe('Domination inherent perma classification', () => {
  const DATASETS = [
    ['homecoming', HC_ARCHETYPES],
    ['rebirth', REBIRTH_ARCHETYPES],
    ['thunderspy', TSPY_ARCHETYPES],
  ] as const;

  for (const [name, archetypes] of DATASETS) {
    describe(name, () => {
      const dominator = archetypes.dominator!;

      it('Dominator metadata marks Domination as a Click power', () => {
        expect(dominator.inherent.name).toBe('Domination');
        expect(dominator.inherent.powerType).toBe('Click');
      });

      it('builds a Click power (not Auto) via createArchetypeInherentPower', () => {
        const power = createArchetypeInherentPower('Dominator', dominator.inherent);
        expect(power.powerType).toBe('Click');
        // Stays in the archetype category so its effects never leak into
        // always-on dashboard totals.
        expect(power.category).toBe('archetype');
      });

      it('is perma-eligible (recharge 200s / duration 90s, self-buff present)', () => {
        const power = createArchetypeInherentPower('Dominator', dominator.inherent);
        expect(isPermaEligible(power)).toBe(true);
      });
    });
  }

  describe('getDominationInfo derives duration/recharge from data', () => {
    beforeAll(async () => {
      await loadDataset('homecoming');
    });

    it('sources activeDuration (90s) and rechargeTime (200s) from the inherent metadata', () => {
      const info = getDominationInfo();
      // Data-backed: must equal what the loaded dataset ships, not a private hardcode.
      expect(info.activeDuration).toBe(HC_ARCHETYPES.dominator!.inherent.effects!.buffDuration);
      expect(info.rechargeTime).toBe(HC_ARCHETYPES.dominator!.inherent.effects!.recharge);
      expect(info.activeDuration).toBe(90);
      expect(info.rechargeTime).toBe(200);
    });

    it('mez magnitude/duration multipliers are engine constants (not in bin data)', () => {
      const info = getDominationInfo();
      expect(info.magnitudeMultiplier).toBe(2.0);
      expect(info.durationMultiplier).toBe(1.5);
    });
  });

  it('passive archetype inherents still default to Auto and are not perma-eligible', () => {
    // Fury has no explicit powerType, so it must fall back to Auto.
    const fury = HC_ARCHETYPES.brute!.inherent;
    expect(fury.name).toBe('Fury');
    expect(fury.powerType).toBeUndefined();

    const power = createArchetypeInherentPower('Brute', fury);
    expect(power.powerType).toBe('Auto');
    expect(isPermaEligible(power)).toBe(false);
  });
});
