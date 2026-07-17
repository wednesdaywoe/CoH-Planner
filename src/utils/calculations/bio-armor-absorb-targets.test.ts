import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';
import { getBaselineHealth } from './stats';
import type { Power } from '@/types';

/**
 * Bio Armor absorb + targets-hit regression suite (2026-07-17 bug reports).
 *
 *   #1a Ablative Carapace absorb was 100% of MaxHP — a stale hand-written
 *       override pinned `absorb:{scale:1}` (Melee_Ones ⇒ scale is a MaxHP
 *       fraction) over the correct 30%. Override retired; generated recovers
 *       `maxHPFraction:0.3` from the live bin's Expression (incl. Sentinel's
 *       `@StdResult` form). Correct across every AT.
 *   #1b Parasitic Aura absorb was 110% of MaxHP/foe — the converter summed the
 *       Current/Magnitude grant (0.1) and its Maximum/Expression cap-twin's 1.0
 *       PLACEHOLDER scale. Deduped to the real 0.1 MaxHP/foe fraction.
 *   #4  A per-target power's untouched slider shows "Off" (0) but the calc used
 *       its N=1 value. `undefined` now reads as 0, matching the display.
 *   #5  Parasitic absorb ignored the targets-hit slider entirely (never ran
 *       through adjustForStacking); it now scales 0 → 10%/foe up to 100% @ 10.
 *   #2  Offensive Adaptation's -7.5% self -Res applied flat; CoH reduces it by
 *       the caster's own same-type resistance (effective = 7.5 × (1 − R)).
 */

const PARASITIC_ATS: ReadonlyArray<readonly [string, string]> = [
  ['scrapper/bio-armor', 'Scrapper'],
  ['brute/bio-armor', 'Brute'],
  ['tanker/bio-armor', 'Tanker'],
  ['stalker/bio-armor', 'Stalker'],
];

const ABLATIVE_ATS = [...PARASITIC_ATS, ['sentinel/bio-armor', 'Sentinel'] as const];

function power(setId: string, internalName: string): Power | undefined {
  return getPowerset(setId)?.powers.find((p) => p.internalName === internalName);
}

describe('Bio Armor absorb + targets-hit fixes (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // --- #1a Ablative Carapace ---------------------------------------------
  describe('Ablative Carapace absorb = 30% of MaxHP (not 100%)', () => {
    it.each(ABLATIVE_ATS)('%s recovers maxHPFraction 0.3, no stale scale:1', (setId) => {
      const ab = power(setId, 'Ablative_Carapace')?.effects?.absorb as
        | { scale?: number; maxHPFraction?: number; appliesStrength?: boolean }
        | undefined;
      expect(ab).toBeDefined();
      expect(ab!.maxHPFraction).toBeCloseTo(0.3, 5);
      expect(ab!.appliesStrength).toBe(true);
      // The stale override pinned a bare scale:1 (= 100% MaxHP). Gone now.
      expect(ab!.scale).toBeUndefined();
    });
  });

  // --- #1b Parasitic Aura absorb value -----------------------------------
  describe('Parasitic Aura absorb = 10% of MaxHP per foe (not 110%)', () => {
    it.each(PARASITIC_ATS)('%s base absorb is scale 0.1 / perTarget 0.1', (setId) => {
      const ab = power(setId, 'Parasitic_Aura')?.effects?.absorb as
        | { scale?: number; perTarget?: number; table?: string }
        | undefined;
      expect(ab).toBeDefined();
      expect(ab!.scale).toBeCloseTo(0.1, 5);
      expect(ab!.perTarget).toBeCloseTo(0.1, 5);
      // Never the summed cap-twin placeholder (1.1).
      expect(ab!.scale).toBeLessThan(1);
    });
  });

  // --- #4 + #5 Parasitic absorb per-target scaling -----------------------
  describe('Parasitic Aura absorb scales with the targets-hit slider', () => {
    function absorbAt(targetsHit?: number): number {
      const b = createEmptyBuild();
      b.level = 50;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null } as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.secondary = {
        id: 'scrapper/bio-armor',
        name: 'Bio Armor',
        powers: [{ internalName: 'Parasitic_Aura', name: 'Parasitic Aura', isActive: true, slots: [] }],
      } as any;
      const targetsHitValues: Record<string, number> = targetsHit === undefined ? {} : { Parasitic_Aura: targetsHit };
      return calculateCharacterTotals(b, false, undefined, { targetsHitValues }).globalBonuses.absorb;
    }

    it('#4 an untouched slider ("Off") contributes 0 absorb, not the 1-target value', () => {
      expect(absorbAt(undefined)).toBe(0);
      expect(absorbAt(0)).toBe(0);
    });

    it('#5 grows per foe hit: 1 foe = 10% MaxHP, 10 foes = 100% MaxHP', () => {
      const baseHP = getBaselineHealth('scrapper', 50).baseHealth;
      expect(absorbAt(1)).toBeCloseTo(0.1 * baseHP, 0);
      expect(absorbAt(10)).toBeCloseTo(1.0 * baseHP, 0);
      // Strictly monotonic in targets hit.
      expect(absorbAt(10)).toBeGreaterThan(absorbAt(5));
      expect(absorbAt(5)).toBeGreaterThan(absorbAt(1));
    });
  });

  // --- #2 Offensive Adaptation self -Res mitigation ----------------------
  describe('Offensive Adaptation -7.5% self -Res is resisted by same-type resistance', () => {
    function resWith(activeSubPower?: string) {
      const b = createEmptyBuild();
      b.level = 50;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null } as any;
      const powers = [
        // Hardened Carapace grants +25% Smashing/Toxic resistance (0% Fire).
        { internalName: 'Hardened_Carapace', name: 'Hardened Carapace', isActive: true, slots: [] },
        { internalName: 'Adaptation', name: 'Evolving Armor', isActive: false, slots: [], activeSubPower },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.primary = { id: 'tanker/bio-armor', name: 'Bio Armor', powers } as any;
      return calculateCharacterTotals(b, false, undefined, {}).globalBonuses;
    }

    it('a resisted type loses less than the flat 7.5 (25% → 19.375%, not 17.5%)', () => {
      const off = resWith(undefined);
      const on = resWith('Offensive_Adaptation');
      // Baseline 25% Smashing from Hardened Carapace.
      expect(off.resSmashing).toBeCloseTo(25, 3);
      // effective = 7.5 × (1 − 0.25) = 5.625 → 25 − 5.625 = 19.375 (NOT 17.5).
      expect(on.resSmashing).toBeCloseTo(19.375, 2);
      const drop = off.resSmashing - on.resSmashing;
      expect(drop).toBeCloseTo(5.625, 2);
      expect(drop).toBeLessThan(7.5); // mitigated, not flat
    });

    it('an unresisted type takes the full 7.5 (Fire 0% → -7.5%)', () => {
      const on = resWith('Offensive_Adaptation');
      // No Fire resistance ⇒ no mitigation ⇒ full nominal penalty.
      expect(on.resFire).toBeCloseTo(-7.5, 2);
    });
  });
});
