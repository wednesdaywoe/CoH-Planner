import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { importExternalBuild } from '@/utils/external-import';
import { importMidsBuild } from '@/utils/mids-import';
import type { SelectedPower } from '@/types';

/**
 * Regression coverage for Kheldian (Peacebringer) form imports.
 *
 *  - Nova/Dwarf form sub-powers must import as auto-granted sub-powers nested
 *    under their parent form (isAutoGranted + grantedByPower), NOT as standalone
 *    picks that consume the power budget.
 *  - Kheldian travel inherents (Energy Flight, Combat Flight) and the archetype
 *    inherent (Cosmic Balance) must appear in the inherents list, not as picks.
 */

const NOVA_SUBS = ['Bright_Nova_Bolt', 'Bright_Nova_Blast', 'Bright_Nova_Scatter', 'Bright_Nova_Detonation'];
const DWARF_SUBS = ['White_Dwarf_Strike', 'White_Dwarf_Smite', 'White_Dwarf_Flare', 'White_Dwarf_Sublimation', 'White_Dwarf_Step', 'White_Dwarf_Antagonize'];

const find = (powers: SelectedPower[], name: string) =>
  powers.find((p) => p.internalName.toLowerCase() === name.toLowerCase());

beforeAll(async () => {
  await loadDataset('homecoming');
});

describe('Peacebringer buildsave (external JSON) import', () => {
  // Minimal but faithful slice of the buildsave format: forms + sub-powers +
  // travel inherents + an auto-granted Quantum Boost + a late pick that should
  // still survive once the budget is no longer eaten by sub-powers.
  const json = JSON.stringify({
    ok: true,
    build: {
      character: { name: 'PB', archetype: 'class_peacebringer', origin: 'mutation', level: 50 },
      powers: [
        p('peacebringer_offensive', 'luminous_blast', 'glinting_eye', 1),
        p('peacebringer_offensive', 'luminous_blast', 'bright_nova', 4),
        ...NOVA_SUBS.map((n) => p('peacebringer_offensive', 'luminous_blast', n.toLowerCase(), 4)),
        p('peacebringer_offensive', 'luminous_blast', 'dawn_strike', 26),
        p('peacebringer_defensive', 'luminous_aura', 'incandescence', 1),
        p('peacebringer_defensive', 'luminous_aura', 'quantum_boost', 0),
        p('peacebringer_defensive', 'luminous_aura', 'energy_flight', 1),
        p('peacebringer_defensive', 'luminous_aura', 'combat_flight', 10),
        p('peacebringer_defensive', 'luminous_aura', 'white_dwarf', 20),
        ...DWARF_SUBS.map((n) => p('peacebringer_defensive', 'luminous_aura', n.toLowerCase(), 20)),
        p('peacebringer_defensive', 'luminous_aura', 'light_form', 32),
        p('inherent', 'inherent', 'cosmic_balance', 1),
      ],
    },
  });

  let result: ReturnType<typeof importExternalBuild>;
  beforeAll(() => {
    result = importExternalBuild(json);
  });

  it('imports successfully', () => {
    expect(result.success).toBe(true);
    expect(result.build).not.toBeNull();
  });

  it('attaches Nova sub-powers as auto-granted under Bright Nova (not picks)', () => {
    const primary = result.build!.primary.powers;
    expect(find(primary, 'Bright_Nova')?.isAutoGranted).toBeFalsy(); // the form is a real pick
    for (const sub of NOVA_SUBS) {
      const sp = find(primary, sub);
      expect(sp, `${sub} present`).toBeDefined();
      expect(sp!.isAutoGranted, `${sub} auto-granted`).toBe(true);
      expect(sp!.grantedByPower).toBe('Bright_Nova');
    }
  });

  it('attaches Dwarf sub-powers as auto-granted under White Dwarf (not picks)', () => {
    const secondary = result.build!.secondary.powers;
    for (const sub of DWARF_SUBS) {
      const sp = find(secondary, sub);
      expect(sp, `${sub} present`).toBeDefined();
      expect(sp!.isAutoGranted).toBe(true);
      expect(sp!.grantedByPower).toBe('White_Dwarf');
    }
  });

  it('routes Energy/Combat Flight to inherents, not secondary picks', () => {
    const secondary = result.build!.secondary.powers;
    expect(find(secondary, 'Energy_Flight')).toBeUndefined();
    expect(find(secondary, 'Combat_Flight')).toBeUndefined();
    const inhNames = result.build!.inherents.map((i) => i.name.toLowerCase());
    expect(inhNames).toContain('energy flight');
    expect(inhNames).toContain('combat flight');
    expect(inhNames).toContain('cosmic balance');
  });

  it('skips auto-granted Quantum Boost (available:-1)', () => {
    const secondary = result.build!.secondary.powers;
    expect(find(secondary, 'Quantum_Boost')).toBeUndefined();
  });

  it('counts only real picks toward the power budget', () => {
    // Real picks: Glinting Eye, Bright Nova, Dawn Strike (primary) +
    //             Incandescence, White Dwarf, Light Form (secondary) = 6
    const realPicks = [
      ...result.build!.primary.powers,
      ...result.build!.secondary.powers,
    ].filter((p) => !p.isAutoGranted);
    expect(realPicks).toHaveLength(6);
  });
});

describe('Peacebringer Mids (.mbd) import', () => {
  // Faithful slice of a real Mids 3.8 Peacebringer export: form TOGGLES live in
  // the form's powerset, but the form SUB-powers and the Kheldian inherents are
  // all emitted under `Inherent.Inherent.*`.
  const mbd = JSON.stringify({
    BuiltWith: { App: 'Mids Reborn', Version: '3.8.1.0', Database: 'Homecoming' },
    Level: '49',
    Class: 'Class_Peacebringer',
    Origin: 'Mutation',
    Name: 'Test PB',
    PowerSets: ['Peacebringer_Offensive.Luminous_Blast', 'Peacebringer_Defensive.Luminous_Aura'],
    PowerEntries: [
      mp('Peacebringer_Offensive.Luminous_Blast.Glinting_Eye', 1, true),
      mp('Peacebringer_Offensive.Luminous_Blast.Bright_Nova', 4, false),
      mp('Peacebringer_Defensive.Luminous_Aura.Incandescence', 1, true),
      mp('Peacebringer_Defensive.Luminous_Aura.White_Dwarf', 20, false),
      ...NOVA_SUBS.map((n) => mp(`Inherent.Inherent.${n}`, 4, true)),
      ...DWARF_SUBS.map((n) => mp(`Inherent.Inherent.${n}`, 20, true)),
      mp('Inherent.Inherent.Cosmic_Balance', 1, false),
      mp('Inherent.Inherent.Energy_Flight', 1, true),
      mp('Inherent.Inherent.Combat_Flight', 10, false),
    ],
  });

  let result: ReturnType<typeof importMidsBuild>;
  beforeAll(() => {
    result = importMidsBuild(mbd);
  });

  it('imports Nova/Dwarf sub-powers nested under their forms', () => {
    expect(result.success).toBe(true);
    const primary = result.build!.primary.powers;
    const secondary = result.build!.secondary.powers;

    expect(find(primary, 'Bright_Nova')).toBeDefined();
    for (const sub of NOVA_SUBS) {
      const sp = find(primary, sub);
      expect(sp, `${sub} present`).toBeDefined();
      expect(sp!.isAutoGranted).toBe(true);
      expect(sp!.grantedByPower).toBe('Bright_Nova');
    }
    expect(find(secondary, 'White_Dwarf')).toBeDefined();
    for (const sub of DWARF_SUBS) {
      const sp = find(secondary, sub);
      expect(sp, `${sub} present`).toBeDefined();
      expect(sp!.isAutoGranted).toBe(true);
      expect(sp!.grantedByPower).toBe('White_Dwarf');
    }
  });

  it('does not let form sub-powers consume the power budget', () => {
    const realPicks = [
      ...result.build!.primary.powers,
      ...result.build!.secondary.powers,
    ].filter((p) => !p.isAutoGranted);
    // Glinting Eye, Bright Nova (primary) + Incandescence, White Dwarf (secondary)
    expect(realPicks).toHaveLength(4);
  });

  it('populates HEAT inherents (Cosmic Balance, Energy/Combat Flight)', () => {
    const inhNames = result.build!.inherents.map((i) => i.name.toLowerCase());
    expect(inhNames).toContain('cosmic balance');
    expect(inhNames).toContain('energy flight');
    expect(inhNames).toContain('combat flight');
  });
});

/** Build one Mids PowerEntry. */
function mp(PowerName: string, Level: number, StatInclude: boolean) {
  return { PowerName, Level, StatInclude, SlotEntries: [] };
}

/** Build one external-format power entry. */
function p(categoryName: string, powerSetName: string, powerName: string, level: number) {
  return {
    categoryName,
    powerSetName,
    powerName,
    powerLevelBought: level,
    powerNumBoostsBought: 0,
    boosts: [],
  };
}
