import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { getTableValue } from '@/data/at-tables';
import { createEmptyBuild } from '@/types/build';

/**
 * Regression guard for the Bo Ryaku (Ninjitsu) KB-protection doubling.
 *
 * The generated power carries BOTH effects.knockback{scale:20} and
 * effects.knockup{scale:20} on Melee_Res_Boolean because the bin stores a single
 * template with attribs:[Knockup, Knockback]. In CoH these are the SAME physical
 * KB-protection stat and are always equal. The mezProtTypes loop in
 * character-totals used to map knockback->protKnockback AND knockup->protKnockback
 * and `+=` both, summing them and displaying ~2x the true value (bug: Bo Ryaku
 * ~14 instead of ~7, Unyielding ~20 instead of ~10). The fix folds the pair into
 * a single per-power contribution (max), while still stacking across powers.
 */

const boRyaku = () => ({
  name: 'Bo Ryaku',
  internalName: 'Bo_Ryaku',
  powerType: 'Auto',
  targetType: 'Self',
  effectArea: 'SingleTarget',
  isActive: true,
  slots: [],
  effects: {
    knockup: { scale: 20, table: 'Melee_Res_Boolean' },
    knockback: { scale: 20, table: 'Melee_Res_Boolean' },
  },
});

// A second Self KB-protection power (Melee_Ones / isKbSelfProt path, à la
// Unyielding/Acrobatics) used to prove different powers still STACK after the fix.
const secondKbPower = () => ({
  name: 'Second KB Power',
  internalName: 'Second_KB_Power',
  powerType: 'Toggle',
  targetType: 'Self',
  effectArea: 'SingleTarget',
  isActive: true,
  slots: [],
  effects: {
    knockup: { scale: 10, table: 'Melee_Ones' },
    knockback: { scale: 10, table: 'Melee_Ones' },
  },
});

function scrapperBuildWith(powers: unknown[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = 50;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
  b.secondary = { powers };
  return b;
}

describe('Bo Ryaku KB-protection doubling', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('counts a power\'s Knockback+Knockup protection ONCE (not summed)', () => {
    const tableVal = getTableValue('scrapper', 'melee_res_boolean', 50)!;
    const perField = 20 * tableVal;

    const t = calculateCharacterTotals(scrapperBuildWith([boRyaku()]), false, undefined, {
      combatMode: false,
    });

    // Correct: a single field's magnitude, NOT knockback + knockup summed.
    expect(t.globalBonuses.protKnockback).toBeCloseTo(perField, 5);

    // And the breakdown/tooltip must not list the same power twice for KB prot.
    const kbBreakdown = t.breakdown?.get('protKnockback');
    if (kbBreakdown) {
      const boRyakuSources = kbBreakdown.sources.filter((s) => s.name === 'Bo Ryaku');
      expect(boRyakuSources.length).toBe(1);
    }
  });

  it('still STACKS knockback protection across different powers', () => {
    const resBoolVal = getTableValue('scrapper', 'melee_res_boolean', 50)!;
    const onesVal = getTableValue('scrapper', 'melee_ones', 50)!;
    const boRyakuMag = 20 * resBoolVal; // one field
    const secondMag = 10 * onesVal; // one field

    const t = calculateCharacterTotals(
      scrapperBuildWith([boRyaku(), secondKbPower()]),
      false,
      undefined,
      { combatMode: false }
    );

    // Two distinct powers → their (de-duped) KB protections add together.
    expect(t.globalBonuses.protKnockback).toBeCloseTo(boRyakuMag + secondMag, 5);
  });
});
