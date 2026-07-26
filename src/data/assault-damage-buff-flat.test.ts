import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getTableValue } from '@/data/at-tables';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { EFFECT_REGISTRY } from '@/data/core/effect-registry';
import { calcThreeTier } from '@/components/info/powerDisplayUtils';
import { createEmptyBuild } from '@/types/build';

/**
 * @Redlynne report: Leadership > Assault's +Damage BUFF was shown (and totalled)
 * scaled by the character's Damage enhancements and global +Damage bonus
 * (11.25% → 14.96% → 24.05%). In CoH a +Damage buff is a fixed buff to the
 * target's Damage strength — Damage enhancements and global +Damage raise the
 * OUTPUT of attack powers, not the magnitude of a buff, and no "Damage Buff"
 * enhancement exists. Assault's +Damage must be flat (11.25% on Rebirth MM).
 */

describe('Assault +Damage buff is flat (not enhanced by damage strength)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  // ---- Display path: the registry no longer tags +Damage as enhanceable ----
  it('damageBuff carries no enhancementAspect; legit buffs keep theirs', () => {
    expect(EFFECT_REGISTRY.damageBuff.enhancementAspect).toBeUndefined();
    // Contrast: defense/tohit/heal buffs ARE legitimately enhanceable.
    expect(EFFECT_REGISTRY.defenseBuff.enhancementAspect).toBe('defense');
    expect(EFFECT_REGISTRY.tohitBuff.enhancementAspect).toBe('tohit');
  });

  it('with no enhancementAspect the three-tier display stays flat even under big bonuses', () => {
    const aspect = EFFECT_REGISTRY.damageBuff.enhancementAspect;
    // calcThreeTier is only reached with an aspect; absent one the display
    // layer returns base across all tiers. Guard the contract directly:
    expect(aspect).toBeUndefined();
    // And prove that the formula itself WOULD have inflated it (so the absent
    // aspect is what protects us): a damage aspect adds enh + global.
    const wouldInflate = calcThreeTier('damage', 11.25, { damage: 0.33 }, { damage: 0.81 });
    expect(wouldInflate.final).toBeGreaterThan(11.25);
  });

  // ---- Aggregate path: Assault's contribution to global +Damage is flat -----
  it('an active Assault adds its flat table value to global damage', () => {
    const flat = 1.5 * (getTableValue('mastermind', 'ranged_buff_dmg', 50) as number) * 100;
    expect(flat).toBeGreaterThan(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = createEmptyBuild();
    b.serverId = 'rebirth';
    b.level = 50;
    b.archetype = { id: 'mastermind', name: 'Mastermind', stats: null, inherent: null };
    b.pools = [{ id: 'leadership', name: 'Leadership', powers: [
      { internalName: 'Assault', name: 'Assault', powerSet: 'leadership', level: 1, powerType: 'Toggle', isActive: true, slots: [] },
    ] }];

    const t = calculateCharacterTotals(b, false, undefined, { combatMode: false });
    // Global damage equals Assault's flat buff — no enhancement/global inflation.
    expect(t.globalBonuses.damage).toBeCloseTo(flat, 4);
  });
});
