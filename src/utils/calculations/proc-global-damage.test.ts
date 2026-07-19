import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';

/**
 * Liberty's Belt: Resistance/Global Damage Bonus (Rebirth) — a standalone
 * always-on global +7.5% Damage that behaves like a set bonus and is Rule-of-5
 * capped, exactly like Luck of the Gambler's +Recharge global. Never functional
 * in Mids; the value is hand-curated in proc-residual-effects.ts.
 *
 * This is the damage twin of proc-global-recharge.test.ts. It pins:
 *   (1) the global reaches globalBonuses.damage,
 *   (2) it appears in the damage BREAKDOWN as a `type: 'proc'` source (the data
 *       the Set Bonus Totals popup folds in), and
 *   (3) Rule of 5 caps it at 5 applied instances (6th flagged `capped`).
 *
 * The Rebirth IO-set piece is named "Resistance/Global Damage Bonus" (see
 * extract-rebirth-io-sets-v2.py REBIRTH_PIECE_PATCHES), exercising findProcData's
 * set-name fallback → the single "Liberty's Belt" PROC_DATABASE entry.
 */

// A Liberty's Belt +Damage global, slotted as Rebirth names it. Global procs
// collect regardless of the host power's type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function libertysBeltSlot(): any {
  return {
    type: 'io-set', isProc: true, name: 'Resistance/Global Damage Bonus',
    setName: "Liberty's Belt", setId: 'libertys_belt', pieceNum: 6,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWithLibertysBelt(count: number): any {
  const b = createEmptyBuild();
  b.serverId = 'rebirth';
  b.level = 50;
  b.archetype = { id: 'mastermind', name: 'Mastermind', stats: null, inherent: null } as any;
  b.pools = [{ id: 'concealment', name: 'Concealment', powers: Array.from({ length: count }, (_, i) => ({
    internalName: `Stealth_${i}`, name: `Stealth Power ${i}`, powerType: 'Toggle', isActive: true,
    slots: [libertysBeltSlot()],
  })) }] as any;
  return b;
}

describe("Liberty's Belt +Damage global (rebirth)", () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  it('3x Liberty\'s Belt +Damage add +22.5% to the damage total', () => {
    const t = calculateCharacterTotals(buildWithLibertysBelt(3), false, undefined, {});
    expect(t.globalBonuses.damage).toBeCloseTo(22.5, 3);
  });

  it('the damage breakdown lists each Liberty\'s Belt global as a proc source', () => {
    const t = calculateCharacterTotals(buildWithLibertysBelt(3), false, undefined, {});
    const sources = t.breakdown.get('damage')?.sources ?? [];
    const lb = sources.filter((s) => s.type === 'proc' && /Liberty's Belt/.test(s.name));
    expect(lb.length).toBe(3);
    for (const s of lb) expect(s.value).toBeCloseTo(7.5, 3);
  });

  it('Rule of 5 caps the damage global at 5 applied instances (6x → +37.5%)', () => {
    const t = calculateCharacterTotals(buildWithLibertysBelt(6), false, undefined, {});
    expect(t.globalBonuses.damage).toBeCloseTo(37.5, 3);
    const sources = t.breakdown.get('damage')?.sources ?? [];
    const capped = sources.filter((s) => s.type === 'proc' && s.capped);
    expect(capped.length).toBe(1);
  });

  it('no Liberty\'s Belt slotted → no proc damage source', () => {
    const t = calculateCharacterTotals(buildWithLibertysBelt(0), false, undefined, {});
    const sources = t.breakdown.get('damage')?.sources ?? [];
    expect(sources.some((s) => s.type === 'proc')).toBe(false);
  });
});
