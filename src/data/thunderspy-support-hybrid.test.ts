import { describe, it, expect } from 'vitest';
import { GENERATED_HYBRID_EFFECTS as TSPY_HYBRID } from '@/data/datasets/thunderspy/generated/incarnate-effects';
import { GENERATED_HYBRID_EFFECTS as HC_HYBRID } from '@/data/datasets/homecoming/generated/incarnate-effects';

/**
 * Thunderspy Support Hybrid — generic-attrib map (DSH8).
 *
 * Thunderspy's incarnate parser collapses each multi-attrib buff to a single
 * generic front-category token (`Damage`/`Ones`/`Defense`/`Accuracy`/`Stunned`)
 * and DROPS the AttribMod aspect, where HC (Parse7) and Rebirth (Parse6) both
 * preserve the real per-attrib rows with aspect. That left every tspy hybrid
 * rendering EMPTY (frontLoaded: {}). convert-incarnate-effects.cjs now maps the
 * three unambiguous tokens (Damage→damage, Accuracy→accuracy, Defense→defenseAll)
 * when aspect==='', verified against the parallel HC/Rebirth parse + the in-game
 * help ("+Damage, +Accuracy, +Defense(All), +Special").
 *
 * The excluded `Ones`/`Stunned` tokens are the help's "+Special" (heal- and
 * mez-strength) that HC and Rebirth both drop (team buff-strength, no self stat).
 *
 * These tests pin the fix so a re-gen can't silently drop the Support tree back
 * to empty, and pin the cross-server value agreement (tspy did not rebalance).
 */

// Support Hybrid tiers, by generated slug → expected player-facing scale.
// tspy's `player eq` leaguemate branch scale == HC's leaguemate scale exactly.
const SUPPORT_TIERS: Record<string, number> = {
  support_genome: 0.02, // Support Genome (base)
  support_genome_2: 0.02, // Support Core Genome
  support_genome_3: 0.02, // Support Radial Genome
  support_genome_4: 0.04, // Support Total Core Graft
  support_genome_5: 0.03, // Support Partial Core Graft
  support_genome_6: 0.08, // Support Partial Radial Graft
  support_genome_7: 0.06, // Support Total Radial Graft
  support_genome_8: 0.06, // Support Core Embodiment
  support_genome_9: 0.08, // Support Radial Embodiment
};

// The Radial/Graft tiers that grant +Accuracy (present on both HC and tspy).
const HAS_ACCURACY = new Set([
  'support_genome_3', 'support_genome_4', 'support_genome_6',
  'support_genome_7', 'support_genome_8', 'support_genome_9',
]);

describe('Thunderspy Support Hybrid generic-attrib map', () => {
  it('every Support tier now renders a non-empty frontLoaded buff', () => {
    for (const id of Object.keys(SUPPORT_TIERS)) {
      const e = TSPY_HYBRID[id];
      expect(e, id).toBeTruthy();
      expect(Object.keys(e.frontLoaded).length, `${id} frontLoaded empty`).toBeGreaterThan(0);
    }
  });

  it('maps Damage→damage and Defense→defenseAll at the correct scale on every tier', () => {
    for (const [id, scale] of Object.entries(SUPPORT_TIERS)) {
      const fl = TSPY_HYBRID[id].frontLoaded as Record<string, number>;
      expect(fl.damage, `${id} damage`).toBeCloseTo(scale, 6);
      expect(fl.defenseAll, `${id} defenseAll`).toBeCloseTo(scale, 6);
    }
  });

  it('emits accuracy on exactly the tiers that grant it (matching HC)', () => {
    for (const id of Object.keys(SUPPORT_TIERS)) {
      const fl = TSPY_HYBRID[id].frontLoaded as Record<string, number>;
      if (HAS_ACCURACY.has(id)) {
        expect(fl.accuracy, `${id} should have accuracy`).toBeCloseTo(SUPPORT_TIERS[id], 6);
      } else {
        expect(fl.accuracy, `${id} should NOT have accuracy`).toBeUndefined();
      }
    }
  });

  it('drops the "+Special" tokens — no heal/mez-strength keys leak into the buff', () => {
    for (const id of Object.keys(SUPPORT_TIERS)) {
      const fl = TSPY_HYBRID[id].frontLoaded as Record<string, number>;
      // Ones (heal + non-stun mez strength) and Stunned map to nothing.
      for (const k of Object.keys(fl)) {
        expect(['damage', 'accuracy', 'defenseAll'], `${id} unexpected key ${k}`).toContain(k);
      }
    }
  });

  it('agrees with HC on damage/accuracy scale + accuracy presence (no tspy rebalance)', () => {
    for (const id of Object.keys(SUPPORT_TIERS)) {
      const tspy = TSPY_HYBRID[id].frontLoaded as Record<string, number>;
      const hc = HC_HYBRID[id].frontLoaded as Record<string, number>;
      expect(tspy.damage, `${id} damage vs HC`).toBeCloseTo(hc.damage, 6);
      expect('accuracy' in tspy, `${id} accuracy presence vs HC`).toBe('accuracy' in hc);
      if ('accuracy' in hc) {
        expect(tspy.accuracy, `${id} accuracy vs HC`).toBeCloseTo(hc.accuracy, 6);
      }
    }
  });
});
