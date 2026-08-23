import { describe, it, expect } from 'vitest';
import { computeAllStats } from '@/utils/detailed-totals';
import type { CalculatedStats } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

// The Detailed Totals sheet and the exported build poster share this producer, and both were
// left behind when the dashboard tile learned that a ceiling has a kind. Two things had to
// travel here: the kind, so no surface can render a threshold in place of a total; and the
// ceiling's SOURCE, because this module read the archetype's `defenseCap` — the even-level
// row, a flat 45 — while the tile beside it read `getDefenseSoftcap`, which is 50 at +6 and
// 59 in incarnate content. The two agreed only as long as nobody touched Target Level.
//
// The softcap below is deliberately 50 rather than 45: a regression back to the archetype
// value would still look right at even level, and this is the case that shows it.
const SOFTCAP = 50;

const zeros = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, 0]));

/** A build with 77.5% melee defense — far past any softcap, which is the whole point: the
 *  surplus is real defense, and the number the sheet prints must be the build's own. */
const stats = {
  damageBuff: 0, accuracyBuff: 0, toHitBuff: 0, rechargeBuff: 0, enduranceReduction: 0,
  maxEndurance: 100, recoveryBuff: 0,
  defense: {
    ...zeros(['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic', 'ranged', 'aoe']),
    melee: 77.5,
  },
  resistance: { ...zeros(['lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic']), smashing: 75 },
  maxHP: 0, hpBuff: 0, regenBuff: 0, runSpeed: 0, jumpHeight: 0, jumpSpeed: 0, flySpeed: 0,
  mezResistance: zeros(['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback']),
  mezProtection: zeros(['hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback']),
  debuffResistance: zeros(['slow', 'defense', 'recharge', 'endurance', 'recovery', 'tohit', 'regeneration', 'perception']),
  globalRecharge: 0, globalAccuracy: 0, globalDamage: 0,
} as unknown as CalculatedStats;

function rows() {
  const sections = computeAllStats(
    stats,
    {} as GlobalBonuses,
    new Map(),
    1000,
    2000,
    undefined,
    true,
    SOFTCAP,
  );
  return new Map(sections.flatMap((s) => s.stats).map((r) => [r.id, r]));
}

describe('the detailed sheet carries the ceiling it was given, with its kind', () => {
  it('defense rows take the caller\'s softcap, not the archetype\'s even-level 45', () => {
    const melee = rows().get('defense_melee');
    expect(melee?.cap).toEqual({ value: SOFTCAP, kind: 'soft' });
  });

  it('a defense total past the softcap survives into the row', () => {
    // The bug this whole line of work exists for: the tile printed the ceiling instead.
    expect(rows().get('defense_melee')?.value).toBe(77.5);
  });

  it('resistance keeps a hard ceiling, from the archetype', () => {
    const res = rows().get('res_smashing');
    expect(res?.cap?.kind).toBe('hard');
    // No archetype was passed, so the fallback 75% stands — and it is NOT the softcap.
    expect(res?.cap?.value).toBe(75);
  });

  it('every defense row on the sheet is soft and no other family claims a ceiling', () => {
    for (const row of rows().values()) {
      if (!row.cap) continue;
      const expected = row.id.startsWith('res_') ? 'hard' : 'soft';
      expect(row.cap.kind, row.id).toBe(expected);
      if (row.cap.kind === 'soft') expect(row.id.startsWith('def'), row.id).toBe(true);
    }
  });
});
