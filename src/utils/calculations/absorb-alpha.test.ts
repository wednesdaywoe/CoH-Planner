import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';
import { getAlphaEffects } from '@/data';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import type { SelectedIncarnatePower } from '@/types/incarnate';

/**
 * The Absorb Alpha reaches absorb (reported 2026-07-27).
 *
 * Cardiac Radial Paragon, Resilient Radial Paragon and Resilient Total Radial
 * Revamp each grant +33% Absorb. Two independent faults hid the whole boost:
 *
 *   1. the converter read the granting silent file's NAME (`intangible_*`, an
 *      HC slot reuse whose content is Absorb) instead of its attribs, emitting
 *      an `intangible` aspect nothing downstream knew; and
 *   2. the `absorb` aspect was gated on an "Absorb" enhancement category that
 *      does not exist — Absorb is the second attrib of the HEALING boost — so
 *      even once named correctly it reached no power.
 *
 * This grades the whole chain through the engine: data → aspect map → allowed-
 * enhancement gate → the absorb magnitude's multiplier.
 */
describe('Absorb Alpha (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  function alphaSlot(powerId: string): SelectedIncarnatePower {
    return {
      slotId: 'alpha', powerId, powerName: powerId, displayName: powerId,
      icon: '', tier: 'veryrare', treeId: 'cardiac', treeName: 'Cardiac',
    };
  }

  /** A Scrapper running Bio Armor's Ablative Carapace — a Healing-slottable absorb shield. */
  function ablativeBuild(alpha: string | null) {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (b as any).secondary = {
      id: 'scrapper/bio-armor', name: 'Bio Armor',
      powers: [{
        internalName: 'Ablative_Carapace', name: 'Ablative Carapace',
        powerSet: 'scrapper/bio-armor', level: 1, isActive: true, slots: [],
      }],
    };
    if (alpha) b.incarnates.alpha = alphaSlot(alpha);
    return b;
  }

  const absorbOf = (alpha: string | null) =>
    calculateCharacterTotals(ablativeBuild(alpha), false, createDefaultIncarnateActiveState(), {})
      .globalBonuses.absorb;

  it.each(['cardiac_radial_paragon', 'resilient_radial_paragon', 'resilient_total_radial_revamp'])(
    '%s exposes its +33%% Absorb in the alpha data',
    (powerId) => {
      const fx = getAlphaEffects(powerId);
      expect(fx, `${powerId} missing from the alpha table`).toBeTruthy();
      expect(fx!.absorb).toBeCloseTo(0.33, 4);
      // The stale key the converter used to emit is gone.
      expect((fx as Record<string, number>).intangible).toBeUndefined();
    },
  );

  it('grows an absorb shield by the full 33% (the whole boost bypasses nothing it should not)', () => {
    const base = absorbOf(null);
    expect(base).toBeGreaterThan(0);
    // 33% total, of which 22% skips ED; 11% is ED-subject and survives ED whole
    // on an unslotted power (well under the Schedule A knee) → ×1.33 exactly.
    expect(absorbOf('cardiac_radial_paragon')).toBeCloseTo(base * 1.33, 1);
    expect(absorbOf('resilient_radial_paragon')).toBeCloseTo(base * 1.33, 1);
  });

  it('an Alpha WITHOUT an Absorb boost leaves the shield alone', () => {
    // Cardiac Core Paragon is the same tree/tier with EndRdx + Range + Res only.
    expect(getAlphaEffects('cardiac_core_paragon')?.absorb).toBeUndefined();
    expect(absorbOf('cardiac_core_paragon')).toBeCloseTo(absorbOf(null), 4);
  });
});
