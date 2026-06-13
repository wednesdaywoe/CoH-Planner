import { describe, it, expect } from 'vitest';
import { applyQuickSnipe } from './quick-snipe';
import type { Power } from '@/types';

// Minimal snipe-power fixture: slow base damage + a quickSnipe (fast) form.
function snipePower(): Power {
  return {
    internalName: 'Test_Snipe',
    name: 'Test Snipe',
    stats: { castTime: 4.0 },
    damage: [{ type: 'Energy', scale: 1.0, table: 'Ranged_Damage' }],
    quickSnipe: {
      stats: { castTime: 1.33 },
      damage: [{ type: 'Energy', scale: 2.76, table: 'Ranged_Damage' }],
    },
  } as unknown as Power;
}

describe('applyQuickSnipe', () => {
  it('returns the power unchanged when combat mode is off', () => {
    const p = snipePower();
    expect(applyQuickSnipe(p, false)).toBe(p);
  });

  it('swaps to quick-cast damage and stats when combat mode is on', () => {
    const out = applyQuickSnipe(snipePower(), true);
    expect(out.damage).toEqual([{ type: 'Energy', scale: 2.76, table: 'Ranged_Damage' }]);
    expect(out.stats?.castTime).toBe(1.33);
  });

  it('leaves non-snipe powers untouched even in combat mode', () => {
    const p = { internalName: 'Brawl', name: 'Brawl', damage: [{ type: 'Smashing', scale: 1 }] } as unknown as Power;
    expect(applyQuickSnipe(p, true)).toBe(p);
  });

  it('mirrors quick-cast stats into effects for epic-pool powers', () => {
    const epic = {
      internalName: 'Epic_Snipe',
      name: 'Epic Snipe',
      effects: { castTime: 4.0, damage: [{ type: 'Energy', scale: 1.0 }] },
      quickSnipe: {
        stats: { castTime: 1.33, range: 150, accuracy: 1.2 },
        damage: [{ type: 'Energy', scale: 2.76 }],
      },
    } as unknown as Power;
    const out = applyQuickSnipe(epic, true);
    expect(out.effects?.castTime).toBe(1.33);
    expect(out.effects?.range).toBe(150);
    expect(out.effects?.accuracy).toBe(1.2);
  });
});
