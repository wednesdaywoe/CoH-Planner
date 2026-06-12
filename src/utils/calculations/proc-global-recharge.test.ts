import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';

/**
 * Regression for the @Redlynne report: Luck of the Gambler's global +7.5%
 * Recharge ("proc") must (1) contribute to the recharge TOTAL and (2) appear in
 * the recharge BREAKDOWN as a `type: 'proc'` source — the data the Set Bonus
 * Totals popup now folds in.
 *
 * The bug was display-only: the proc reached `globalBonuses.recharge` and the
 * dashboard breakdown all along (so recharge TIMES were always correct), but the
 * Set Bonus Totals popup read only the set-bonus Rule-of-5 map and so never
 * enumerated it. These tests pin the breakdown contract the popup depends on.
 *
 * Reproduced on Rebirth (the reported dataset): the Rebirth IO-set piece is
 * named "Defense/+Recharge" (not "Buff Recharge"), exercising findProcData's
 * set-name fallback → the single "Luck of the Gambler" PROC_DATABASE entry.
 */

// A LotG +Recharge global, slotted as Rebirth names it. Global procs collect
// regardless of the host power's type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lotgSlot(): any {
  return {
    type: 'io-set', isProc: true, name: 'Defense/+Recharge',
    setName: 'Luck of the Gambler', setId: 'luck_of_the_gambler', pieceNum: 6,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWithLotG(count: number): any {
  const b = createEmptyBuild();
  b.serverId = 'rebirth';
  b.level = 50;
  b.archetype = { id: 'mastermind', name: 'Mastermind', stats: null, inherent: null } as any;
  b.pools = [{ id: 'concealment', name: 'Concealment', powers: Array.from({ length: count }, (_, i) => ({
    internalName: `Stealth_${i}`, name: `Stealth Power ${i}`, powerType: 'Toggle', isActive: true,
    slots: [lotgSlot()],
  })) }] as any;
  return b;
}

describe('LotG +Recharge global (rebirth)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('3x LotG +Recharge add +22.5% to the recharge total', () => {
    const t = calculateCharacterTotals(buildWithLotG(3), false, undefined, {});
    expect(t.globalBonuses.recharge).toBeCloseTo(22.5, 3);
  });

  it('the recharge breakdown lists each LotG proc as a proc source', () => {
    const t = calculateCharacterTotals(buildWithLotG(3), false, undefined, {});
    const sources = t.breakdown.get('recharge')?.sources ?? [];
    const lotg = sources.filter((s) => s.type === 'proc' && /Luck of the Gambler/.test(s.name));
    expect(lotg.length).toBe(3);
    for (const s of lotg) expect(s.value).toBeCloseTo(7.5, 3);
  });

  it('no LotG slotted → no proc recharge source', () => {
    const t = calculateCharacterTotals(buildWithLotG(0), false, undefined, {});
    const sources = t.breakdown.get('recharge')?.sources ?? [];
    expect(sources.some((s) => s.type === 'proc')).toBe(false);
  });
});
