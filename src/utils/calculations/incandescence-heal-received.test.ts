import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getDestinyEffects } from '@/data';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { createEmptyBuild } from '@/types/build';
import type { SelectedIncarnatePower } from '@/types/incarnate';

/**
 * Regression guard for the Incandescence Destiny "+Healing Received" mis-mapping.
 *
 * Incandescence's buff is a template with attribs:[Heal_Dmg], aspect:Resistance,
 * negative scale — i.e. Res(Heal) < 0, meaning "you receive MORE healing". The
 * Destiny converter used to classify it with a bare `attrib.endsWith('_Dmg')`
 * test, which is true for the (non-damage) `Heal_Dmg` attribute, so it was
 * flattened into `resistanceAll`. Downstream that ×100'd into all 8 damage
 * resistances as a NEGATIVE value — every Incandescence tier applied a −30% to
 * −80% damage-resistance SELF-DEBUFF ("-res(all)"), the exact symptom reported.
 *
 * Same class as the Bo Ryaku KB/KU-protection flattening: a semantically
 * distinct attribute swept into the wrong bucket by an over-broad structural
 * test. The fix special-cases Heal_Dmg → a dedicated `healReceived` field
 * (stored positive: 0.5 = +50% healing received) before the `_Dmg` test.
 */

// In-game "+Healing Received" per tier (Res(Heal) magnitude, stored positive).
const EXPECTED_HEAL_RECEIVED: Record<string, number> = {
  incandescence_invocation: 0.3,
  incandescence_radial_invocation: 0.4,
  incandescence_core_invocation: 0.5,
  incandescence_partial_core_invocation: 0.5,
  incandescence_partial_radial_invocation: 0.5,
  incandescence_total_radial_invocation: 0.5,
  incandescence_radial_epiphany: 0.6,
  incandescence_total_core_invocation: 0.7,
  incandescence_core_epiphany: 0.8,
};

function incandescenceSlot(powerId: string): SelectedIncarnatePower {
  return {
    slotId: 'destiny',
    powerId,
    powerName: powerId,
    displayName: 'Incandescence Core Invocation',
    icon: '',
    tier: 'rare',
    treeId: 'incandescence',
    treeName: 'Incandescence',
  };
}

function scrapperBuild(destiny: SelectedIncarnatePower | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = 50;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
  if (destiny) b.incarnates.destiny = destiny;
  return b;
}

const RES_KEYS = [
  'resSmashing', 'resLethal', 'resFire', 'resCold',
  'resEnergy', 'resNegative', 'resPsionic', 'resToxic',
] as const;

describe('Incandescence Destiny — Healing Received (not −Resistance)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('maps every Incandescence tier to positive healReceived, never resistanceAll', () => {
    for (const [powerId, expected] of Object.entries(EXPECTED_HEAL_RECEIVED)) {
      const fx = getDestinyEffects(powerId);
      expect(fx, `missing destiny effects for ${powerId}`).toBeDefined();
      // The +Healing Received value is present, positive, and correct.
      expect(fx!.healReceived).toBeCloseTo(expected, 6);
      // And the pre-fix damage-resistance mis-mapping is gone.
      expect(fx!.resistanceAll).toBeUndefined();
    }
  });

  it('does NOT subtract from any damage resistance total (the "-res(all)" bug)', () => {
    const base = calculateCharacterTotals(scrapperBuild(null), false, undefined, {
      combatMode: false,
    });
    const withIncand = calculateCharacterTotals(
      scrapperBuild(incandescenceSlot('incandescence_core_invocation')),
      false,
      undefined,
      { combatMode: false },
    );

    // Incandescence contributes ZERO to damage resistance — identical to a build
    // with no Destiny slot. (Pre-fix, each of these was base − 50.)
    for (const key of RES_KEYS) {
      expect(withIncand.globalBonuses[key]).toBeCloseTo(base.globalBonuses[key], 5);
    }
  });

  it('adds +Healing Received to totals as its own monitorable stat', () => {
    const withIncand = calculateCharacterTotals(
      scrapperBuild(incandescenceSlot('incandescence_core_invocation')),
      false,
      undefined,
      { combatMode: false },
    );

    // Core Invocation = +50% healing received (0.5 × 100).
    expect(withIncand.globalBonuses.healReceived).toBeCloseTo(50, 5);

    // And it shows up in the breakdown attributed to the Destiny power.
    const hr = withIncand.breakdown?.get('healReceived');
    if (hr) {
      expect(hr.sources.some((s) => s.type === 'incarnate')).toBe(true);
    }
  });
});
