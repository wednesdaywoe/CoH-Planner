import { beforeAll, describe, expect, it } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ioSlot(name: string, setName: string, isProc = true): any {
  return {
    type: 'io-set',
    isProc,
    name,
    setName,
    setId: setName.toLowerCase().replace(/\s+/g, '_'),
    pieceNum: 6,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWithSlots(slots: any[]): any {
  const b = createEmptyBuild();
  b.serverId = 'rebirth';
  b.level = 50;
  b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null } as any;
  b.pools = [{
    id: 'fitness',
    name: 'Fitness',
    powers: [{
      internalName: 'Health',
      name: 'Health',
      powerType: 'Auto',
      isActive: true,
      slots,
    }],
  }] as any;
  return b;
}

describe('Proc runtime allowlist coverage', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('applies defense-all globals to all defense buckets and breakdown', () => {
    const t = calculateCharacterTotals(
      buildWithSlots([ioSlot('+Def(All)', "Gladiator's Armor")]),
      false,
      undefined,
      {}
    );

    expect(t.globalBonuses.defPsionic).toBeCloseTo(3.0, 3);
    expect(t.globalBonuses.defSmashing).toBeCloseTo(3.0, 3);
    const sources = t.breakdown.get('defPsionic')?.sources ?? [];
    expect(sources.some((s) => s.type === 'proc' && /Gladiator's Armor/.test(s.name))).toBe(true);
  });

  it('applies always-on absorb globals to absorb totals and breakdown', () => {
    const t = calculateCharacterTotals(
      buildWithSlots([ioSlot('Chance for +Absorb', 'Preventive Medicine')]),
      false,
      undefined,
      {}
    );

    expect(t.globalBonuses.absorb).toBeCloseTo(20, 3);
    const sources = t.breakdown.get('absorb')?.sources ?? [];
    expect(sources.some((s) => s.type === 'proc' && /Preventive Medicine/.test(s.name))).toBe(true);
  });

  it('accepts legacy extracted proc slots with isProc=false when name still matches', () => {
    const t = calculateCharacterTotals(
      buildWithSlots([ioSlot('Recharge/Resistance Bonus', "Kheldian's Grace", false)]),
      false,
      undefined,
      {}
    );

    expect(t.globalBonuses.resSmashing).toBeGreaterThan(0);
    expect(t.globalBonuses.maxHP).toBeGreaterThan(0);
  });
});
