import { beforeAll, describe, expect, it } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { ioSetSlot } from '@/test/build-fixtures';

// The picker's own factory, so the slot carries everything the engine's CharacterState
// requires and the piece name is the real proc lookup key ("Chance", not a paraphrase).
function ioSlot(setId: string, pieceName: string) {
  return ioSetSlot(setId, pieceName);
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
      powerSet: 'fitness',
      level: 1,
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
      buildWithSlots([ioSlot('gladiators_armor', 'Chance')]),
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
      buildWithSlots([ioSlot('preventive_medicine', 'Chance')]),
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
      buildWithSlots([ioSlot('kheldians_grace', 'Recharge/Resistance Bonus')]),
      false,
      undefined,
      {}
    );

    expect(t.globalBonuses.resSmashing).toBeGreaterThan(0);
    expect(t.globalBonuses.maxHP).toBeGreaterThan(0);
  });
});
